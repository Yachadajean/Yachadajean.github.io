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
  const navigate = useNavigate();
  const [fallRecordingDates, setFallRecordingDates] = useState(new Set());

  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [uniqueYears, setUniqueYears] = useState([]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    const savedVideoUrl = localStorage.getItem('selectedVideoUrl');
    if (savedVideoUrl) setSelectedVideoUrl(savedVideoUrl);

    fetch('https://api.falldetection.me/api/recordings')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Failed to load videos:', err));

    fetch('https://api.falldetection.me/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to load alerts:', err));
  }, []);

  useEffect(() => {
    const years = [...new Set(alerts.map(alert => new Date(alert.timestamp).getFullYear()))];
    setUniqueYears(years);
  }, [alerts]);

  const fallDetectedVideos = videos.filter(video => video.includes('fall'));

  useEffect(() => {
    const datesWithFalls = fallDetectedVideos.map(file => {
      const match = file.match(/(\d{8})_\d{6}/);
      return match ? new Date(
        parseInt(match[1].slice(0, 4)),
        parseInt(match[1].slice(4, 6)) - 1,
        parseInt(match[1].slice(6, 8))
      ).toDateString() : null;
    }).filter(date => date !== null);
    setFallRecordingDates(new Set(datesWithFalls));
  }, [fallDetectedVideos]);

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    localStorage.setItem('selectedVideoUrl', videoUrl);
  };

  const handleButtonClick = (contentType) => setActiveContent(contentType);

  const formatDate = (date) => !date ? '' : date.toISOString().split('T')[0].replace(/-/g, '');

  const groupByDate = (videoList) => {
    const groups = {};
    videoList.forEach(file => {
      const match = file.match(/(\d{8})_\d{6}/);
      if (match) {
        const rawDate = match[1];
        const readableDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
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

  const filteredFallVideos = selectedDate
    ? fallDetectedVideos.filter(file => file.includes(formatDate(selectedDate)))
    : fallDetectedVideos;

  const tileClassName = ({ date, view }) => view === 'month' && fallRecordingDates.has(date.toDateString()) ? 'has-fall-recording' : null;

  const filteredAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    const yearMatch = !filterYear || alertDate.getFullYear() === parseInt(filterYear);
    const monthMatch = !filterMonth || alertDate.getMonth() + 1 === parseInt(filterMonth);
    const dayMatch = !filterDay || alertDate.getDate() === parseInt(filterDay);
    return yearMatch && monthMatch && dayMatch;
  });

  return (
    <div className="layout-container">
      <div className="left-side">
        <button onClick={() => navigate('/livestream')} className="goback-button">
          <span className="arrow arrow-left"></span>&nbsp;
        </button>
        <h1>Fall Recordings</h1>

        <div className="left-side-buttons">
          <button className={activeContent === 'Fall Videos' ? 'active' : ''} onClick={() => handleButtonClick('Fall Videos')}>Fall Videos</button>
          <button className={activeContent === 'Alert History' ? 'active' : ''} onClick={() => handleButtonClick('Alert History')}>Alert History</button>
          <button className={activeContent === 'Date Filter' ? 'active' : ''} onClick={() => handleButtonClick('Date Filter')}>Date Filter</button>
        </div>

        {selectedVideoUrl && <VideoPlayer videoUrl={selectedVideoUrl} />}
      </div>

      <main className="right-side">
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
              <div className="placeholder"><p>Select a video to view</p></div>
            )}
            <div className="video-list">
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
          <div className="alert-history-container">
            <div className="alert-history">
              <h2 className="alert-title">Alert History</h2>
              <div className="alert-filters">
                <div>
                  <label htmlFor="year-filter">Year:</label>
                  <select id="year-filter" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="">All Years</option>
                    {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="month-filter">Month:</label>
                  <select id="month-filter" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                    <option value="">All Months</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="day-filter">Day:</label>
                  <select id="day-filter" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
                    <option value="">All Days</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>

              {filteredAlerts.length === 0 ? (
                <p>No alerts found for the selected filters.</p>
              ) : (
                <div className="alert-list">
                  {filteredAlerts.map((alert, idx) => (
                    <div key={idx} className="alert-item">
                      <input type="checkbox" checked={false} readOnly />
                      <div className="alert-details">
                        <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="alert-date">{new Date(alert.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeContent === 'Date Filter' && (
          <div className="calendar-container">
            <div className="calendar-wrapper">
              {!selectedDate ? (
                <Calendar
                  locale="en-US"
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="custom-calendar"
                  tileClassName={tileClassName}
                />
              ) : (
                <div className="video-gallery">
                  {filteredFallVideos.length === 0 ? (
                    <p>No fall videos found for selected date.</p>
                  ) : (
                    <div className="video-list">
                      {Object.entries(groupByDate(filteredFallVideos)).map(([date, files]) => (
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}