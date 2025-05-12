import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './GalleryLayout.css';
import 'react-calendar/dist/Calendar.css';

export default function GalleryLayout() {
  const [videos, setVideos] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showGallery, setShowGallery] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('Fall Videos'); // Track active tab

  useEffect(() => {
    // Fetching the video recordings
    fetch('https://api.falldetection.me/api/recordings')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Failed to load videos:', err));

    // Fetching the alert history
    fetch('https://api.falldetection.me/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to load alerts:', err));
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0].replace(/-/g, ''); // 'YYYYMMDD'
  };

  const groupByDate = (videoList) => {
    const groups = {};
    videoList.forEach(file => {
      const match = file.match(/(\d{8})_\d{6}/); // Extract YYYYMMDD
      if (match) {
        const rawDate = match[1];
        const readableDate = `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`;
        if (!groups[readableDate]) groups[readableDate] = [];
        groups[readableDate].push(file);
      }
    });
    return groups;
  };

  const filteredVideos = selectedDate
    ? videos.filter(file => file.includes(formatDate(selectedDate)))
    : videos;

  const groupedVideos = groupByDate(filteredVideos);

  return (
    <div className="gallery-wrapper">
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="gallery-title">Fall Event Gallery</h2>
          <div className="tab-controls">
            <div 
              className={`tab ${activeTab === 'Fall Videos' ? 'active' : ''}`}
              onClick={() => {
                setShowGallery(true);
                setActiveTab('Fall Videos');
              }}
            >
              <input 
                type="checkbox" 
                checked={activeTab === 'Fall Videos'}
                readOnly
              />
              <label>Fall Videos</label>
            </div>
            <div 
              className={`tab ${activeTab === 'Alert History' ? 'active' : ''}`}
              onClick={() => {
                setShowGallery(false);
                setActiveTab('Alert History');
              }}
            >
              <input 
                type="checkbox" 
                checked={activeTab === 'Alert History'}
                readOnly
              />
              <label>Alert History</label>
            </div>
            <div 
              className={`tab ${showCalendar ? 'active' : ''}`}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <input 
                type="checkbox" 
                checked={showCalendar}
                readOnly
              />
              <label>Date Filter</label>
            </div>
          </div>
        </div>

        {showCalendar && (
          <div className="calendar-wrapper">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="custom-calendar"
            />
          </div>
        )}

        <div className="divider"></div>

        {showGallery ? (
          // Show Fall Videos
          <div className="video-gallery">
            {selectedVideo ? (
              <div className="video-player">
                <video controls className="main-video">
                  <source src={`https://api.falldetection.me/recordings/${selectedVideo}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-info">
                  <span className="time-info">0:23 / 2:58</span>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <p>Select a video to view</p>
              </div>
            )}
          </div>
        ) : (
          // Show Alert History
          <div className="alert-history">
            {alerts.length === 0 ? (
              <p>No alerts recorded yet.</p>
            ) : (
              <div className="alert-list">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="alert-item">
                    <input type="checkbox" checked={false} readOnly />
                    <div className="alert-details">
                      <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <span className="alert-date">{new Date(alert.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}