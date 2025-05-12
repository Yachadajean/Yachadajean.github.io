import React, { useState, useEffect } from 'react';
import './BuildLayOut.css';
import VideoGallery from './components/VideoGallery';
import VideoPlayer from './components/VideoPlayer';

export default function BuildLayOut() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [activeContent, setActiveContent] = useState('Fall Videos');

  useEffect(() => {
    const savedVideoUrl = localStorage.getItem('selectedVideoUrl');
    if (savedVideoUrl) {
      setSelectedVideoUrl(savedVideoUrl);
    }
  }, []);

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    localStorage.setItem('selectedVideoUrl', videoUrl);
  };

  const handleButtonClick = (contentType) => {
    setActiveContent(contentType);
  };

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
  {/* Conditionally render VideoGallery only for Fall Videos */}
  {activeContent === 'Fall Videos' && (
    <VideoGallery onVideoSelect={handleVideoSelect} />
  )}

  {activeContent === 'Alert History' && <div>Alert History Content</div>}
  {activeContent === 'Date Filter' && <div>Date Filter Content</div>}
</main>

    </div>
  );
}
