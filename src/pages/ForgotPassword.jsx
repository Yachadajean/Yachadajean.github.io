import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('https://api.falldetection.me/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Redirect to reset-password page with token
        navigate(`/reset-password?token=${data.token}`);
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Continue'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
