import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { FaCalendarAlt, FaCog } from 'react-icons/fa'; // Import icons

const LiveStream = () => {
  const { ipAddress: paramIpAddress } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const navigate = useNavigate(); // Navigation

  // Cleanup HLS instance on component unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!paramIpAddress) {
      setError('No IP address or domain provided');
      return;
    }

    // Backend URL for streaming video from the camera
    // This is the format you can test from backend:
    // http://localhost:3000/stream/134.208.3.240
    // The IP address '134.208.3.240' is used by backend to locate the camera
    // However, for video player we use HLS .m3u8 stream instead

    let streamUrl;
    try {
      const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(paramIpAddress);
      streamUrl = isIp
        ? `http://${paramIpAddress}/stream.m3u8`
        : `https://${paramIpAddress}/stream.m3u8`;

      console.log('Attempting to play:', streamUrl);

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setError(null);
        });

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
        videoRef.current.addEventListener('loadedmetadata', () => {
          setError(null);
        });
      }

      setVideoUrl(streamUrl);
    } catch (err) {
      console.error('Stream setup error:', err);
      setError('Failed to setup video stream');
    }
  }, [paramIpAddress]);

  const captureAndSendFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      console.error('Video not ready for capture');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64ImageData = canvas.toDataURL('image/jpeg');

      fetch('http://134.208.3.240:5000/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64ImageData }),
      })
        .then(res => res.json())
        .then(data => console.log('Detection result:', data))
        .catch(err => console.error('Error sending image:', err));
    } catch (err) {
      console.error('Frame capture error:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', position: 'relative' }}>
      {/* Top right icons */}
      <div style={{ position: 'absolute', top: 15, right: 20, display: 'flex', gap: 20, zIndex: 10 }}>
        <button
          onClick={() => navigate('/calendar')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          title="Calendar"
        >
          <FaCalendarAlt size={28} color="white" />
        </button>
        <button
          onClick={() => navigate('/settings')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          title="Settings"
        >
          <FaCog size={28} color="white" />
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
          {error}
        </div>
      )}

      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            style={{ width: '100%', height: '90%' }}
          >
            Your browser does not support the video tag.
          </video>
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <button
              onClick={captureAndSendFrame}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Frame to Detect
            </button>
          </div>
        </>
      ) : (
        <p style={{ color: 'white', textAlign: 'center' }}>Loading stream...</p>
      )}
    </div>
  );
};

export default LiveStream;
