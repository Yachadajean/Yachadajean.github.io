import React, { useState, useEffect } from 'react';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // fixed import

const timeZoneOptions = [
  { country: 'Australia', tz: 'Australia/Sydney', gmt: 10 },
  { country: 'Brazil', tz: 'America/Sao_Paulo', gmt: -3 },
  { country: 'Canada', tz: 'America/Toronto', gmt: -5 },
  { country: 'Germany', tz: 'Europe/Berlin', gmt: 1 },
  { country: 'India', tz: 'Asia/Kolkata', gmt: 5.5 },
  { country: 'Japan', tz: 'Asia/Tokyo', gmt: 9 },
  { country: 'South Africa', tz: 'Africa/Johannesburg', gmt: 2 },
  { country: 'Thailand', tz: 'Asia/Bangkok', gmt: 7 },
  { country: 'United Kingdom', tz: 'Europe/London', gmt: 0 },
  { country: 'United States', tz: 'America/New_York', gmt: -5 },
  { country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', gmt: 7 }
].sort((a, b) => a.country.localeCompare(b.country));

const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
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
  const [currentLocation, setCurrentLocation] = useState(null);

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
    if (userId && token) {
      fetch('https://api.falldetection.me/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.date_format) setDateFormat(data.date_format);

          if (data.time_zone) {
            setTimeZone(data.time_zone);
            // Find matching tz object for GMT offset
            const loc = timeZoneOptions.find(tz => tz.tz === data.time_zone);
            setCurrentLocation(loc || { tz: data.time_zone, gmt: 0 });
          } else {
            // fallback to browser timezone
            const browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const offset = -new Date().getTimezoneOffset() / 60;
            setTimeZone(browserTZ);
            setCurrentLocation({ tz: browserTZ, gmt: offset });
          }

          if (data.video_quality) setVideoQuality(data.video_quality);
          if (data.video_retention !== undefined) setVideoRetention(data.video_retention);
          if (data.alert_enabled !== undefined) setNotificationsEnabled(data.alert_enabled);
          if (data.alert_sound !== undefined) setAlertSound(data.alert_sound);
        })
        .catch(err => console.error("Failed to load settings:", err));
    }
  }, [userId, token]);

  // REMOVED the useEffect that sets timezone blindly on mount

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
        <button onClick={() => navigate('/livestream')} className="goback-button">
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
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
              {currentLocation && (
                <optgroup label="Current Location">
                  <option value={currentLocation.tz}>
                    {currentLocation.tz.replace(/_/g, ' ')} (GMT{currentLocation.gmt >= 0 ? '+' : ''}{currentLocation.gmt})
                  </option>
                </optgroup>
              )}
              <optgroup label="Other Countries">
                {timeZoneOptions
                  .filter(opt => opt.tz !== currentLocation?.tz)
                  .map(opt => (
                    <option key={opt.tz} value={opt.tz}>
                      {opt.country} (GMT{opt.gmt >= 0 ? '+' : ''}{opt.gmt})
                    </option>
                  ))}
              </optgroup>
            </select>
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
            <select value={videoRetention} onChange={(e) => setVideoRetention(Number(e.target.value))}>
              {[1, 3, 7, 14, 30, 60, 90].map(days => (
                <option key={days} value={days}>
                  {days} {days === 1 ? 'day' : 'days'}
                </option>
              ))}
            </select>
          </div>
          <div className="info-row">
            <label>Enable Notifications:</label>
            <label className="switch">
              <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="info-row">
            <label>Alert Sound:</label>
            <label className="switch">
              <input type="checkbox" checked={alertSound} onChange={(e) => setAlertSound(e.target.checked)} />
              <span className="slider round"></span>
            </label>
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
