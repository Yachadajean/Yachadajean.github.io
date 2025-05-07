import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { FaCalendarAlt, FaUser, FaFolderOpen } from 'react-icons/fa';

const LiveStream = () => {
  const { ipAddress: paramIpAddress } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [fallDetected, setFallDetected] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const navigate = useNavigate();

  // Determine the base URL for the API (uses proxy in development)
  const apiUrl = window.location.hostname === 'localhost' 
    ? '/detect'  // Use proxy when in development
    : 'http://134.208.3.240:5000/detect'; // Full URL for production (update to HTTPS if needed)

  // Fetch fall detection status
  useEffect(() => {
    const checkFallStatus = async () => {
      try {
        const res = await fetch('http://134.208.3.240:5000/status');
        if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
        const data = await res.json();
        console.log('Status:', data);
        setFallDetected(data.status === "Camera online");
      } catch (err) {
        console.error('Error fetching fall status:', err);
      }
    };

    checkFallStatus(); // Initial check
    const intervalId = setInterval(checkFallStatus, 3000); // Repeat every 3s

    return () => clearInterval(intervalId);
  }, []);

  // Setup video stream
  useEffect(() => {
    if (!paramIpAddress) {
      setError('No IP address or domain provided');
      return;
    }

    try {
      const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(paramIpAddress);
      const streamUrl = isIp
        ? `http://${paramIpAddress}/stream.m3u8`
        : `https://${paramIpAddress}/stream.m3u8`;

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
      }

      setVideoUrl(streamUrl);
    } catch (err) {
      console.error('Stream setup error:', err);
      setError('Failed to setup video stream');
    }
  }, [paramIpAddress]);

  // Periodic frame capture and send
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    const intervalId = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg");

      fetch(apiUrl, {  // Use dynamic URL based on environment
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          token: token
        }),
      })
        .then(res => res.json())
        .then(data => console.log("Detection:", data))
        .catch(err => console.error("Image send error:", err));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const styles = {
    frameWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0de3e',
    },
    videoFrame: {
      width: '700px',
      backgroundColor: '#c67ecf',
      padding: '20px',
      border: '10px solid rgba(228, 82, 216, 0.86)',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(37, 232, 190, 0.95)',
    },
    innerVideoContainer: {
      padding: '50px',
      backgroundColor: '#b8234b',
      borderRadius: '12px',
    },
    video: {
      width: '600px',
      height: '400px',
      objectFit: 'cover',
      borderRadius: '10px',
      backgroundColor: 'white',
    },
  };

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', position: 'relative' }}>
      {/* Top right icons */}
      <div style={{ position: 'absolute', top: 15, right: 20, display: 'flex', gap: 20, zIndex: 10 }}>
        <button onClick={() => navigate('/calendar')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Calendar">
          <FaCalendarAlt size={28} color="white" />
        </button>
        <button onClick={() => navigate('/settings')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Settings">
          <FaUser size={28} color="white" />
        </button>
        <button onClick={() => navigate('/records')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Records">
          <FaFolderOpen size={28} color="white" />
        </button>
      </div>

      <div style={styles.frameWrapper}>
        <div style={styles.videoFrame}>
          <div style={styles.innerVideoContainer}>
            {error ? (
              <h2 style={{ color: 'white' }}>{error}</h2>
            ) : (
              <video ref={videoRef} style={styles.video} controls />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
