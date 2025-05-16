import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BuildLayOut.css';
import VideoGallery from './components/VideoGallery';
import VideoPlayer from './components/VideoPlayer';
import { useNavigate } from 'react-router-dom';

export default function BuildLayOut() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [activeContent, setActiveContent] = useState('Fall Videos');
  const [videos, setVideos] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fallRecordingDates, setFallRecordingDates] = useState(new Set());

  const navigate = useNavigate();

  // Fetch videos and alerts on mount
  useEffect(() => {
    const savedVideoUrl = localStorage.getItem('selectedVideoUrl');
    if (savedVideoUrl) setSelectedVideoUrl(savedVideoUrl);

    fetch('https://api.falldetection.me/api/recordings')
      .then(res => res.json())
      .then(setVideos)
      .catch(err => console.error('Failed to load videos:', err));

    fetch('https://api.falldetection.me/api/alerts')
      .then(res => res.json())
      .then(setAlerts)
      .catch(err => console.error('Failed to load alerts:', err));
  }, []);

  // Filter fall videos for calendar marking
  const fallDetectedVideos = videos.filter(file => file.includes('fall'));
  useEffect(() => {
    const datesWithFalls = fallDetectedVideos
      .map(file => {
        const match = file.match(/(\d{8})_\d{6}/);
        if (!match) return null;
        const [_, yyyymmdd] = match;
        return new Date(
          parseInt(yyyymmdd.slice(0, 4)),
          parseInt(yyyymmdd.slice(4, 6)) - 1,
          parseInt(yyyymmdd.slice(6, 8))
        ).toDateString();
      })
      .filter(Boolean);
    setFallRecordingDates(new Set(datesWithFalls));
  }, [fallDetectedVideos]);

  // Video and alert filtering
  const formatDate = date => !date ? '' : date.toISOString().split('T')[0].replace(/-/g, '');
  const filteredVideos = selectedDate
    ? videos.filter(file => file.includes(formatDate(selectedDate)))
    : videos;
  const filteredFallVideos = selectedDate
    ? fallDetectedVideos.filter(file => file.includes(formatDate(selectedDate)))
    : fallDetectedVideos;

  const filteredAlerts = selectedDate
    ? alerts.filter(alert => new Date(alert.timestamp).toDateString() === selectedDate.toDateString())
    : alerts;

  // Group videos by date for gallery
  const groupByDate = videoList => {
    const groups = {};
    videoList.forEach(file => {
      const match = file.match(/(\d{8})_\d{6}/);
      if (!match) return;
      const rawDate = match[1];
      const readableDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      if (!groups[readableDate]) groups[readableDate] = [];
      groups[readableDate].push(file);
    });
    return groups;
  };

  const groupedVideos = groupByDate(filteredVideos);

  // Calendar tile highlight for fall days
  const tileClassName = ({ date, view }) =>
    view === 'month' && fallRecordingDates.has(date.toDateString())
      ? 'has-fall-recording'
      : null;

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    localStorage.setItem('selectedVideoUrl', videoUrl);
  };

  return (
    <div className="layout-container">
      <div className="left-side">
        <button onClick={() => navigate('/livestream')} className="goback-button">
          <span className="arrow arrow-left"></span>&nbsp;
        </button>
        <h1>Fall Recordings</h1>

        <div className="left-side-buttons">
          <button
            className={activeContent === 'Fall Videos' ? 'active' : ''}
            onClick={() => setActiveContent('Fall Videos')}
          >
            Fall Videos
          </button>
          <button
            className={activeContent === 'Alert History' ? 'active' : ''}
            onClick={() => setActiveContent('Alert History')}
          >
            Alert History
          </button>
        </div>

        {selectedVideoUrl && <VideoPlayer videoUrl={selectedVideoUrl} />}
      </div>

      <main className="right-side">
        {activeContent === 'Fall Videos' && (
          <div className="video-gallery two-column">
            <div className="video-player-half">
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
            </div>

            <div className="video-list-half">
              {Object.entries(groupedVideos).map(([date, files]) => (
                <div key={date}>
                  <h3>{date}</h3>
                  <div className="video-thumbnails">
                    {files.map((file, idx) => (
                      <div key={idx} className="video-thumbnail" onClick={() => setSelectedVideo(file)}>
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

        {activeContent === 'Alert History' && (
          <div className="alert-history-layout">
            {/* Center Column - Alert List */}
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
                    const fileName = alert.videoFile || '';
                    return (
                      <div
                        key={idx}
                        className="alert-item"
                        onClick={() => fileName && setSelectedVideo(fileName)}
                      >
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

              {selectedVideo && (
                <div className="video-modal">
                  <button className="close-button" onClick={() => setSelectedVideo(null)}>✕</button>
                  <video controls className="modal-video">
                    <source src={`https://api.falldetection.me/recordings/${selectedVideo}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Right Column - Calendar */}
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
