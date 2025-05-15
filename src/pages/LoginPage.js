import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <h2 style={{ fontSize: '2rem', color: '#5B86E5' }}>for safer independent living.</h2>
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

  <div className={`error-message ${error ? '' : 'hidden'}`} aria-live="assertive">
    {error || '\u00A0'}
  </div>

  <div className="input-group">
    <label>Email</label>
    <input 
      type="email" 
      value={email}
      onChange={e => setEmail(e.target.value)}
      disabled={isLoading}
      autoComplete="email"
      required
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
        autoComplete="current-password"
        required
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

  <p className="forgot-password">
    <Link to="/forgot-password">Forgot password?</Link>
  </p>

  <button 
    type="submit" 
    className="login-button"
    disabled={isLoading}
  >
    {isLoading ? 'Logging in...' : 'Login'}
  </button>

  <p className="signup-link">
    Don't have an assistant? <Link to="/signup">Sign Up Here</Link>
  </p>
</form>

  </div>
</div>

    
  );

}
