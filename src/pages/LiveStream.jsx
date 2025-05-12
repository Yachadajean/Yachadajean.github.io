import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LiveStream.css';
import SizeContainer from './SizeContainer';

const LiveStream = () => {
  const [fallDetected, setFallDetected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFallStatus = async () => {
      try {
        const res = await fetch('https://api.falldetection.me/status');
        if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
        const data = await res.json();
        setFallDetected(data.status === "Camera online");
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
    <div>
      <div style={{ padding: '10px', textAlign: 'right' }}>
        <Link to="/gallerylayout" className="gallery-button">
          📁 View Fall Recordings
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {!error && !fallDetected && <div className="status">Waiting for fall detection...</div>}
      {fallDetected && <div className="status">Fall detected! Please check the camera.</div>}

      <SizeContainer>
        <div style={{ textAlign: 'center' }}>
          <div className="container">
            <img
              src="https://api.falldetection.me/video_feed"
              alt="Live Stream"
              className="video-frame"
            />
          </div>
        </div>
      </SizeContainer>
    </div>
  );
};

export default LiveStream;
