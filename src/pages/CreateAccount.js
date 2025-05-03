import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Reuse your existing styles
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    navigate('/livestream');
  };

  return (
    <div className="home-container">
      <div className="split-screen-container">
        <div className="split-screen">
          {/* Left Panel (Reduced to 30%) */}
          <div className="left-panel create-account-left">
            <div className="image-container">
              <img 
                src="/images/greetings.png"  
                alt="Caregiving illustration" 
                className="panel-image"
              />
            </div>
          </div>
          
          {/* Right Panel (Expanded to 70%) */}
          <div className="right-panel create-account-right">
            <div className="auth-form">
              <h2>Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="auth-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="auth-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="auth-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="auth-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="auth-button">
                  Create Account
                </button>
              </form>
              <div className="login-link">
                <p>Already have an account? <span onClick={() => navigate('/')}>Log in</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}