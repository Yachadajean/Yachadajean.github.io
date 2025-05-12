import React, { useState, useEffect } from 'react';
import './Settings.css';
import { jwtDecode } from 'jwt-decode';

function Settings() {
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeZone, setTimeZone] = useState('GMT');
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  const [videoQuality, setVideoQuality] = useState('medium');
  const [videoRetention, setVideoRetention] = useState('30days');
  const [userId, setUserId] = useState(null);  // userId will be decoded from the JWT
  const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage

  useEffect(() => {
    if (token) {
      // Decode the token to extract the user_id (you can use a library like `jwt-decode` for this)
      const decoded = jwtDecode(token);  // Make sure to import jwt-decode
      setUserId(decoded.user_id);
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      // Fetch the settings for the user when the page loads
      fetch(`https://your-backend-api.com/api/settings?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user_id) {
            // Set state with fetched settings
            setDateFormat(data.date_format);
            setTimeZone(data.time_zone);
            setAlertEnabled(data.alert_enabled);
            setAlertSound(data.alert_sound);
            setVideoQuality(data.video_quality);
            setVideoRetention(data.video_retention);
          }
        })
        .catch((error) => {
          console.error("Error fetching user settings:", error);
        });
    }
  }, [userId, token]);

  const handleSaveSettings = () => {
    const updatedSettings = {
      user_id: userId,
      date_format: dateFormat,
      time_zone: timeZone,
      alert_enabled: alertEnabled,
      alert_sound: alertSound,
      video_quality: videoQuality,
      video_retention: videoRetention,
    };

    fetch('https://api.falldetection./api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSettings),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert('Settings updated successfully!');
        }
      })
      .catch((error) => {
        console.error('Error updating settings:', error);
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>General Settings</h3>
        <div>
          <label>Date Format:</label>
          <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY/MM/DD">YYYY/MM/DD</option>
          </select>
        </div>

        <div>
          <label>Time Zone:</label>
          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            <option value="GMT">GMT</option>
            <option value="PST">PST</option>
            <option value="EST">EST</option>
            <option value="CET">CET</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Alert Settings</h3>
        <div>
          <label>Enable Alerts:</label>
          <input type="checkbox" checked={alertEnabled} onChange={() => setAlertEnabled(!alertEnabled)} />
        </div>
        <div>
          <label>Alert Sound:</label>
          <input type="checkbox" checked={alertSound} onChange={() => setAlertSound(!alertSound)} />
        </div>
      </div>

      <div className="settings-section">
        <h3>Video Settings</h3>
        <div>
          <label>Video Quality:</label>
          <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label>Video Retention:</label>
          <select value={videoRetention} onChange={(e) => setVideoRetention(e.target.value)}>
            <option value="30days">30 Days</option>
            <option value="90days">90 Days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Calendar Settings</h3>
        <div>
          <label>Default Calendar View:</label>
          <select>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div>
          <label>Automatic Time Zone Adjustment:</label>
          <input type="checkbox" />
        </div>
      </div>

      <div className="settings-section">
        <h3>User Profile</h3>
        <div>
          <label>Email:</label>
          <input type="email" value="user@example.com" disabled />
        </div>
        <div>
          <label>Change Password:</label>
          <input type="password" placeholder="New Password" />
        </div>
      </div>

      <div>
        <button onClick={handleSaveSettings}>Save Settings</button>
      </div>
    </div>
  );
}

export default Settings;
