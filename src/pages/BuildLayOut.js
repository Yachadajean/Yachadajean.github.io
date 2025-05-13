import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BuildLayOut.css';
import VideoGallery from './components/VideoGallery';
import VideoPlayer from './components/VideoPlayer';

export default function BuildLayOut() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [activeContent, setActiveContent] = useState('Fall Videos');

  const [videos, setVideos] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const savedVideoUrl = localStorage.getItem('selectedVideoUrl');
    if (savedVideoUrl) {
      setSelectedVideoUrl(savedVideoUrl);
    }

  // Fetch video recordings
  fetch('https://api.falldetection.me/api/recordings')
  .then(res => res.json())
  .then(data => setVideos(data))
  .catch(err => console.error('Failed to load videos:', err));

  // Fetch alert history
  fetch('https://api.falldetection.me/api/alerts')
  .then(res => res.json())
  .then(data => setAlerts(data))
  .catch(err => console.error('Failed to load alerts:', err));

  }, []);

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    localStorage.setItem('selectedVideoUrl', videoUrl);
  };

  const handleButtonClick = (contentType) => {
    setActiveContent(contentType);
  };

  // Updated

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };
  
  const groupByDate = (videoList) => {
    const groups = {};
    videoList.forEach(file => {
      const match = file.match(/(\d{8})_\d{6}/);
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
    <div className="layout-container">
      <div className="left-side">
        <h1>Videos</h1>
        <div className="left-side-buttons">
          <button
            className={activeContent === 'Fall Videos' ? 'active' : ''}
            onClick={() => handleButtonClick('Fall Videos')}
          >
            Fall Videos
          </button>
          <button
            className={activeContent === 'Alert History' ? 'active' : ''}
            onClick={() => handleButtonClick('Alert History')}
          >
            Alert History
          </button>
          <button
            className={activeContent === 'Date Filter' ? 'active' : ''}
            onClick={() => handleButtonClick('Date Filter')}
          >
            Date Filter
          </button>
        </div>

        {/* Render VideoPlayer only if a video is selected */}
        {selectedVideoUrl && <VideoPlayer videoUrl={selectedVideoUrl} />}
      </div>

      <main className="right-side">
        {/* Fall Videos */}
        {activeContent === 'Fall Videos' && (
          <div className="video-gallery">
            {selectedVideo ? (
              <div className="video-player">
                <video controls className="main-video">
                  <source src={`https://api.falldetection.me/recordings/${selectedVideo}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="placeholder">
                <p>Select a video to view</p>
              </div>
            )}
            <div className="video-list">
              {Object.entries(groupedVideos).map(([date, files]) => (
                <div key={date}>
                  <h3>{date}</h3>
                  <div className="video-thumbnails">
                    {files.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="video-thumbnail" 
                        onClick={() => setSelectedVideo(file)}
                      >
                        <video src={`https://api.falldetection.me/recordings/${file}`} muted />
                        <p>{file}</p>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert History */}
        {activeContent === 'Alert History' && (
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

        {/* Date Filter */}
        {activeContent === 'Date Filter' && (
          <div className="calendar-wrapper">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="custom-calendar"
            />
          </div>
        )}
      </main>


    </div>
  );
}
