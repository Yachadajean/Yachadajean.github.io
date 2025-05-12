import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './CreateAccount.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const navigate = useNavigate(); // Get navigate function from hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // To store error messages
  const [isLoading, setIsLoading] = useState(false);



  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    setError(''); // Reset previous errors
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await fetch('https://api.falldetection.me/login', {  // Ensure this points to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      // Successful login
      localStorage.setItem('token', data.token);  // Save token to localStorage
      navigate('/livestream');  // Redirect after login
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  



  

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
  {/* Left Panel - Blue Background (40%) */}
  <div style={{ flex: 4, backgroundColor: '#AEC7FF', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
    <div className="text-content">
      <h1 style={{ fontSize: '3rem' }}>We watch, so you don't have to worry.</h1>
      <br />
      <h1 style={{ fontSize: '3rem' }}><span className="highlight">Smart fall detection</span></h1>
      <h2 style={{ fontSize: '2rem' }}>for safer independent living.</h2> <br /> <br /> 
    </div>

    <img 
      src="/images/nursing-home.png" 
      alt="Care monitoring animation" 
      className="hero-gif"
    />
  </div>

  {/* Right Panel - White Background (60%) */}
  <div className="right-panel">
    <form className="login-form" onSubmit={handleLogin}>
      <h3>Log in</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="input-group">
        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
      <label>Password</label>
      <div className="password-input">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={isLoading}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      </div>
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className="signup-link">
        Don't have an assistant? <a href="/signup">Sign Up Here</a>
      </p>
    </form>
  </div>
</div>

    
  );

}
