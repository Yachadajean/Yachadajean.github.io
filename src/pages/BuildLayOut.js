import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BuildLayOut.css';
import { useNavigate } from 'react-router-dom';

export default function BuildLayOut() {
  const [activeTab, setActiveTab] = useState('Fall Videos');
  const [videos, setVideos] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAlertVideo, setSelectedAlertVideo] = useState(null);
  const [fallRecordingDates, setFallRecordingDates] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.falldetection.me/api/recordings')
      .then(res => res.json())
      .then(setVideos)
      .catch(console.error);

    fetch('https://api.falldetection.me/api/alerts')
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  const fallVideos = videos.filter(file => /fall_clip_\d{8}_\d{6}\.mp4/i.test(file));
  const formatDate = date => date?.toISOString().split('T')[0].replace(/-/g, '');

  const filteredFallVideos = selectedDate
    ? fallVideos.filter(file => file.includes(formatDate(selectedDate)))
    : fallVideos;

  const filteredAlerts = selectedDate
    ? alerts.filter(a => new Date(a.timestamp).toDateString() === selectedDate.toDateString())
    : alerts;

  const groupByDate = (fileList) => {
  const groups = {};
  fileList.forEach(file => {
    const match = file.match(/fall_clip_(\d{4})(\d{2})(\d{2})_\d{6}/);
    if (!match) return; // skip files that don't match pattern
    const dateStr = `${match[1]}-${match[2]}-${match[3]}`; // "YYYY-MM-DD"
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(file);
    groups[dateStr].sort((a, b) => {
    const timeA = a.match(/_(\d{6})\.mp4$/)?.[1];
    const timeB = b.match(/_(\d{6})\.mp4$/)?.[1];
    return timeB.localeCompare(timeA); // newest time first
});

  });

  // Sort keys (dates) in descending order
  const sortedGroups = Object.fromEntries(
    Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  );

  return sortedGroups;
};



  useEffect(() => {
    const dates = fallVideos.map(file => {
      const match = file.match(/(\d{4})(\d{2})(\d{2})_\d{6}/);
      if (!match) return null;
      return new Date(match[1], match[2] - 1, match[3]).toDateString();
    }).filter(Boolean);
    setFallRecordingDates(new Set(dates));
  }, [fallVideos]);

  const tileClassName = ({ date, view }) =>
    view === 'month' && fallRecordingDates.has(date.toDateString())
      ? 'has-fall-recording'
      : null;

  const handleVideoSelect = (file) => {
    setSelectedVideo(file);
  };

  return (
    <div className="layout-container">
      <div className="left-side">
        <button onClick={() => navigate('/livestream')} className="goback-button">
          &lt; Go Back
        </button>
        <h1>Fall Recordings</h1>

        <div className="left-side-buttons">
          {['Fall Videos', 'Alert History'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => {
                setActiveTab(tab);
                setSelectedVideo(null);
                setSelectedAlertVideo(null);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="right-side">
        {activeTab === 'Fall Videos' && (
          <div className="video-gallery single-column">
            {selectedVideo ? (
              <video controls className="main-video-fit">
                <source src={`https://api.falldetection.me/recordings/${selectedVideo}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="placeholder">
                <p>Select a video to view</p>
              </div>
            )}

            <div className="video-list-full">
            {filteredFallVideos.length === 0 ? (
              <p className="no-videos-found">
                No fall videos found{selectedDate ? ` for ${selectedDate.toDateString()}` : ''}.
              </p>
            ) : (
              Object.entries(groupByDate(filteredFallVideos)).map(([date, files]) => (
                <div key={date}>
                  <h3>{date}</h3>
                  <div className="video-thumbnails">
                    {files.map((file, idx) => (
                      <div key={idx} className="video-thumbnail" onClick={() => handleVideoSelect(file)}>
                        <video src={`https://api.falldetection.me/recordings/${file}`} muted />
                        <p>{file}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
        )}

        {activeTab === 'Alert History' && (
          <div className="alert-history-layout">
            <div className="alert-list-wrapper">
              <h2 className="alert-title">Alert History</h2>

              {selectedDate && (
                <button onClick={() => setSelectedDate(null)} className="reset-filter-button">
                  Show All Alerts
                </button>
              )}

              {filteredAlerts.length === 0 ? (
                <p>No alerts found for the selected date.</p>
              ) : (
                <div className="alert-list">
                  {filteredAlerts.map((alert, idx) => {
                    const fileName = alert.videoFile;
                    return (
                      <div key={idx} className="alert-item" onClick={() => fileName && setSelectedAlertVideo(fileName)}>
                        <input type="checkbox" checked={false} readOnly />
                        <div className="alert-details">
                          <span className="alert-time">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="alert-date">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                          {fileName && <span className="alert-video">(Click to play video)</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedAlertVideo && (
                <div className="video-modal">
                  <button className="close-button" onClick={() => setSelectedAlertVideo(null)}>✕</button>
                  <video controls className="modal-video">
                    <source src={`https://api.falldetection.me/recordings/${selectedAlertVideo}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            <div className="calendar-side-wrapper">
              <Calendar
                locale="en-US"
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
                tileClassName={tileClassName}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}