import React, { useState, useEffect } from 'react';
import './VideoGallery.css';

const VideoGallery = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const placeholderVideos = [
      {
        id: '1',
        title: 'Placeholder Video 1',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/150?text=Placeholder1',
      },
      {
        id: '2',
        title: 'Placeholder Video 2',
        url: 'https://www.w3schools.com/html/movie.mp4',
        thumbnailUrl: 'https://via.placeholder.com/150?text=Placeholder2',
      },
      {
        id: '3',
        title: 'Placeholder Video 3',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/150?text=Placeholder3',
      },
    ];
    setVideos(placeholderVideos);
  }, []);

  const handleThumbnailClick = (videoUrl) => {
    onVideoSelect(videoUrl);
  };

  return (
    <div className="video-gallery-container">
      <div className="video-list">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-thumbnail"
            onClick={() => handleThumbnailClick(video.url)}
          >
            <img src={video.thumbnailUrl} alt={video.title} />
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
