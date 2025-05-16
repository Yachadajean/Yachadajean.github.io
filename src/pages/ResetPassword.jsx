import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ResetPassword.css'; // Optional: include your styling

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('https://api.falldetection.me/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successfully! You can now log in.');
      } else {
        setMessage(data.error || '❌ Failed to reset password.');
        setIsError(true);
      }
    } catch (err) {
      setMessage('❌ Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <p className="error-message">❌ Invalid or missing token.</p>;
  }

  return (
    <div className="reset-password-page">
      <h2>🔐 Reset Your Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {message && (
        <p className={isError ? 'error-message' : 'success-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
