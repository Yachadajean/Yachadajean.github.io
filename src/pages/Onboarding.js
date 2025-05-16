import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import './Onboarding.css';

const pages = [
  {
    gif: 'animations/caring.gif',
    text: '24/7 Caring Monitoring for Your Loved Ones',
    bgColor: 'linear-gradient(135deg, #AEC7FF, #5B86E5)',
  },
  {
    gif: 'animations/cctv.gif',
    text: 'Smart Surveillance for Your Peace of Mind',
    bgColor: 'linear-gradient(135deg, #FFDEE9, #B5FFFC)',
  },
  {
    gif: 'animations/protect.gif',
    text: 'Immediate Protection When It Matters Most',
    bgColor: 'linear-gradient(135deg, #FBC2EB, #A6C1EE)',
  },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("onboardingDone")) {
      setShowLogin(true);
    }
  }, []);

  const skip = () => {
    localStorage.setItem("onboardingDone", "true");
    setShowLogin(true);
  };

  const handleNext = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      localStorage.setItem("onboardingDone", "true");
      setShowLogin(true);
    }
  };

  if (showLogin) return <LoginPage />;

  return (
    <div className="onboarding-wrapper" style={{ background: pages[page].bgColor }}>
      <div className="onboarding-container" style={{ background: pages[page].bgColor }}>
        <div className="onboarding-card">
          <img
            src={pages[page].gif}
            alt={pages[page].text}
            className="onboarding-image"
          />
          <h2 className="onboarding-text">{pages[page].text}</h2>

          <div className="onboarding-button-group">
            <button className="onboarding-skip" onClick={skip}>Skip</button>
            <button className="onboarding-button" onClick={handleNext}>
              {page === pages.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>

          <div className="onboarding-dots">
            {pages.map((_, i) => (
              <span key={i} className={`dot ${i === page ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
