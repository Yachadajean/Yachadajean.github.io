import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to access route params
import Hls from 'hls.js';  // Import HLS.js for live video streaming

const LiveStream = () => {
  const { ipAddress } = useParams(); // Extract ipAddress from route params
  const [fallDetected, setFallDetected] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Fetch fall detection status
  useEffect(() => {
    const checkFallStatus = async () => {
      try {
        const res = await fetch('https://api.falldetection.me/status');
        if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
        const data = await res.json();
        console.log('Status:', data);
        setFallDetected(data.status === "Camera online");
      } catch (err) {
        console.error('Error fetching fall status:', err);
        setError('Failed to fetch fall detection status.');
      }
    };

    checkFallStatus();
    const intervalId = setInterval(checkFallStatus, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Setup video stream
  useEffect(() => {
    if (!ipAddress) {
      setError('No IP address or domain provided');
      return;
    }

    const streamUrl = 'https://api.falldetection.me/video_feed';


    console.log('Attempting to play:', streamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => setError(null));

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - trying to recover');
              hls.recoverMediaError();
              break;
            default:
              setError('Unrecoverable error');
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener('loadedmetadata', () => setError(null));
    } else {
      setError('Your browser does not support HLS streams.');
    }

    setVideoUrl(streamUrl);

    // Cleanup HLS instance on component unmount or IP address change
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };

  }, [ipAddress]);

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {!error && !fallDetected && <div className="status">Waiting for fall detection...</div>}
      {fallDetected && <div className="status">Fall detected! Please check the camera.</div>}
      <video ref={videoRef} controls style={{ width: '100%', maxHeight: '500px' }} />
    </div>
  );
};

export default LiveStream;
