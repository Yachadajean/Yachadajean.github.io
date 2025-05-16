import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveStream.css';

const LiveStream = () => {
  const [fallDetected, setFallDetected] = useState(false);
  const [error, setError] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFallStatus = async () => {
      try {
        const res = await fetch('https://api.falldetection.me/status');
        if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
        const data = await res.json();
        setFallDetected(data.status === "Fall detected");
        setError(null);
      } catch (err) {
        console.error('Error fetching fall status:', err);
        setError('Failed to fetch fall detection status.');
      }
    };

    checkFallStatus();
    const intervalId = setInterval(checkFallStatus, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="livestream-container">
      <div className="top-bar">
        <button onClick={() => navigate('/buildlayout')} className="nav-button">
          📁 Recordings
        </button>
        <button onClick={() => navigate('/settings')} className="nav-button">
          ⚙️ Settings
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {!error && (
        <div className={`alert ${fallDetected ? 'warning' : 'info'}`}>
          {fallDetected ? 'Fall detected! Check camera.' : 'Monitoring for falls...'}
        </div>
      )}

      <div
        className="video-container"
        style={{ position: 'relative' }}
        role="region"
        aria-label="Live fall detection video feed"
      >
        {imgLoading && (
          <div
            className="loading-message"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.8)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            Loading video...
          </div>
        )}

        <img
          className="video-frame"
          src="https://api.falldetection.me/video_feed"
          alt="Live fall detection stream"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgLoading(false);
            setError('Failed to load video stream.');
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default LiveStream;
