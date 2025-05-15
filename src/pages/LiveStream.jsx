import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LiveStream.css';
import SizeContainer from './SizeContainer';

const LiveStream = () => {
    const [fallDetected, setFallDetected] = useState(false);
    const [error, setError] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkFallStatus = async () => {
            try {
                const res = await fetch('https://api.falldetection.me/status');
                if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
                const data = await res.json();
                setFallDetected(data.status === "Camera online"); // Adjust logic if needed
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

    const handleVideoLoad = () => {
        setVideoLoading(false);
    };

    const goToSettings = () => {
        navigate('/settings');
    };

    return (
        <div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/buildlayout" className="gallery-button">
                    📁 View Fall Recordings
                </Link>
                <button onClick={goToSettings} className="gallery-button"> {/* Use the same class */}
                    ⚙️ Settings
                </button>
            </div>

            {error && <div className="error">{error}</div>}
            {!error && !fallDetected && <div className="status">Waiting for fall detection...</div>}
            {fallDetected && <div className="status">Fall detected! Please check the camera.</div>}

            <SizeContainer>
                <div style={{ textAlign: 'center' }}>
                    <div className="container">
                        <div className={`video-wrapper ${videoLoading ? 'loading' : ''}`}>
                            {videoLoading ? (
                                <div className="waiting-message">Waiting for video...</div>
                            ) : (
                                <img
                                    src="https://api.falldetection.me/video_feed"
                                    alt="Live Stream"
                                    className="video-frame"
                                    onLoad={handleVideoLoad}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </SizeContainer>
        </div>
    );
};

export default LiveStream;