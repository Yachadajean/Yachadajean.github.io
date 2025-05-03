import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './CreateAccount.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate(); // Get navigate function from hook
  const [currentPage, setCurrentPage] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const pages = [
    {
      gif: '/animations/caring.gif',
      text: '24/7 Caring Monitoring for Your Loved Ones',
      bgColor: '#4a6fa5',
    },
    {
      gif: '/animations/cctv.gif',
      text: 'Smart Surveillance for Your Peace of Mind',
      bgColor: '#166088',
    },
    {
      gif: '/animations/protect.gif',
      text: 'Immediate Protection When It Matters Most',
      bgColor: '#4fc3a1',
    },
  ];

  const handleNext = () => {
    if (currentPage === pages.length - 1) {
      setShowLogin(true);
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both fields');
      return;
    }
    navigate('/livestream');
  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <div className="home-container">
      {!showLogin ? (
        <>
          <div className="skip" onClick={() => setShowLogin(true)}>Skip</div>
          <img src={pages[currentPage].gif} className="gif" alt="demo" />
          <h2 className="text">{pages[currentPage].text}</h2>
          <button onClick={handleNext}>
            {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </>
      ) : (
        <div className="split-screen-container">
          <div className="split-screen">
            <div className="left-panel">
              <div className="image-container">
                <img 
                  src="/images/nursing-home.png" 
                  alt="Caregiving illustration" 
                  className="panel-image"
                />
              </div>
              <div className="create-account-container">
                <p>Don't have an account? <span onClick={handleCreateAccount}>Create an account</span></p>
              </div>
            </div>
            <div className="right-panel">
              <div className="auth-form">
                <h2>Sign up</h2>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Username or Email" 
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <button className="auth-button" onClick={handleLogin}>
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}