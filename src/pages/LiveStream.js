import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { FaCalendarAlt, FaUser, FaFolderOpen  } from 'react-icons/fa';

const LiveStream = () => {
  const { ipAddress: paramIpAddress } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const navigate = useNavigate();

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

  const styles = {
    frameWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',  // ensures space is kept
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
      padding: '50px', // space between frame and video
      backgroundColor: '#b8234b',
      borderRadius: '12px',
    },
    video: {
      width: '600px',
      height: '400px',  // <-- fixed height helps layout
      objectFit: 'cover',
      borderRadius: '10px',
      backgroundColor: 'white',
      
    },
    
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
          title="Elder Info"
        >
          <FaUser size={28} color="white" />
        </button>
        <button
          onClick={() => navigate('/records')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          title="Records"
        >
          <FaFolderOpen size={28} color="white" />
        </button>


      </div>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
          {error}
        </div>
      )}

{videoUrl ? (
  <div style={styles.frameWrapper}>
  <div style={styles.videoFrame}>
    <div style={styles.innerVideoContainer}>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        poster="/placeholder.png"
        style={styles.video}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  </div>
) : (
  <p style={{ color: 'white', textAlign: 'center' }}>Loading stream...</p>
)}
    </div>
  );
};

export default LiveStream;
