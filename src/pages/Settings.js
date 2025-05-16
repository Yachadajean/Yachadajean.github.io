import React, { useState, useEffect } from 'react';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const dateFormats = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY'
];

const videoQualities = ['low', 'medium', 'high'];

function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('settings');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeZone, setTimeZone] = useState('');
  const [videoQuality, setVideoQuality] = useState('medium');
  const [videoRetention, setVideoRetention] = useState(7);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    const browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -new Date().getTimezoneOffset() / 60;
    const gmtOffset = `GMT${offset >= 0 ? '+' : ''}${offset}`;
    setTimeZone(`${browserTZ} (${gmtOffset})`);
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetch('https://api.falldetection.me/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.date_format) setDateFormat(data.date_format);
          if (data.time_zone) setTimeZone(data.time_zone);
          if (data.video_quality) setVideoQuality(data.video_quality);
          if (data.video_retention !== undefined) setVideoRetention(data.video_retention);
          if (data.alert_enabled !== undefined) setNotificationsEnabled(data.alert_enabled);
          if (data.alert_sound !== undefined) setAlertSound(data.alert_sound);
        })
        .catch(err => console.error("Failed to load settings:", err));
    }
  }, [userId, token]);

  const handleSave = () => {
    if (!token) return;
    setSaving(true);

    const payload = {
      date_format: dateFormat,
      time_zone: timeZone,
      alert_enabled: notificationsEnabled,
      alert_sound: alertSound,
      video_quality: videoQuality,
      video_retention: videoRetention,
    };

    fetch('https://api.falldetection.me/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        alert('Settings updated successfully!');
      })
      .catch(err => {
        console.error("Error updating settings:", err);
      })
      .finally(() => setSaving(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="layout-container">
        <aside className="left-side-settings">
        <div className={`sidebar-icon-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}>
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
        </div>
        <div className="sidebar-icon-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Log Out</span>
        </div>
        </aside>

        <main className="right-side-settings">
        {/* 👇 Insert the Go Back button here */}
        <button onClick={() => navigate('/')} className="goback-button">
            <span className="arrow arrow-left"></span>&nbsp;Go Back
        </button>

        <h2>Settings</h2>

        <div className="settings-options">
            <div className="info-row">
            <label>Date Format:</label>
            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                {dateFormats.map(format => (
                <option key={format} value={format}>{format}</option>
                ))}
            </select>
            </div>
            <div className="info-row">
            <label>Time Zone:</label>
            <input type="text" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} />
            </div>
            <div className="info-row">
            <label>Video Quality:</label>
            <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)}>
                {videoQualities.map(q => (
                <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>
                ))}
            </select>
            </div>
            <div className="info-row">
            <label>Video Retention (days):</label>
            <input type="number" value={videoRetention} onChange={(e) => setVideoRetention(Number(e.target.value))} min={1} />
            </div>
            <div className="info-row">
            <label>Enable Notifications:</label>
            <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
            </div>
            <div className="info-row">
            <label>Alert Sound:</label>
            <input type="checkbox" checked={alertSound} onChange={(e) => setAlertSound(e.target.checked)} />
            </div>
        </div>

        <div className="save-button-container">
            <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
        </main>
    </div>
    );

}

export default Settings;
