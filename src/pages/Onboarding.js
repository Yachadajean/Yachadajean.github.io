import React, { useState } from 'react';
import LoginPage from './LoginPage';
import './Onboarding.css';

const pages = [
  {
    gif: 'animations/caring.gif',
    text: '24/7 Caring Monitoring for Your Loved Ones',
    bgColor: '#ffffff',
  },
  {
    gif: 'animations/cctv.gif',
    text: 'Smart Surveillance for Your Peace of Mind',
    bgColor: '#ffffff',
  },
  {
    gif: 'animations/protect.gif',
    text: 'Immediate Protection When It Matters Most',
    bgColor: '#ffffff',
  },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const handleNext = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      setShowLogin(true);
    }
  };

  const skip = () => setShowLogin(true);

  if (showLogin) return <LoginPage />;

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-card">
        <button className="onboarding-skip" onClick={skip}>
          Skip
        </button>
        <div>
          <img
            src={pages[page].gif}
            alt="slide gif"
            className="onboarding-image"
          />
          <h2 className="onboarding-text">{pages[page].text}</h2>
        </div>
        <button className="onboarding-button" onClick={handleNext}>
          {page === pages.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}

