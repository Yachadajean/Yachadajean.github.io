import React, { useEffect } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl }) => {
  useEffect(() => {
    console.log('VideoPlayer received new videoUrl:', videoUrl);
  }, [videoUrl]);

  return (
    <div className="video-player-container">
      <video controls className="main-video" width="100%" height="auto" key={videoUrl}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
