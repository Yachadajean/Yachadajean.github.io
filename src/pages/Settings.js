import React, { useState, useEffect } from 'react';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const timeZoneOptions = [
  { country: 'Australia', tz: 'Australia/Sydney', gmt: 10 },
  { country: 'Brazil', tz: 'America/Sao_Paulo', gmt: -3 },
  { country: 'Canada', tz: 'America/Toronto', gmt: -5 },
  { country: 'Germany', tz: 'Europe/Berlin', gmt: 1 },
  { country: 'India', tz: 'Asia/Kolkata', gmt: 5.5 },
  { country: 'Japan', tz: 'Asia/Tokyo', gmt: 9 },
  { country: 'South Africa', tz: 'Africa/Johannesburg', gmt: 2 },
  { country: 'Taiwan', tz: 'Asia/Taipei', gmt: 8 },
  { country: 'Thailand', tz: 'Asia/Bangkok', gmt: 7 },
  { country: 'United Kingdom', tz: 'Europe/London', gmt: 0 },
  { country: 'United States', tz: 'America/New_York', gmt: -5 },
  { country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', gmt: 7 }
].sort((a, b) => a.country.localeCompare(b.country));

const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
const videoQualities = ['low', 'medium', 'high'];

function Settings() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeZone, setTimeZone] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const [videoQuality, setVideoQuality] = useState('medium');
  const [videoRetention, setVideoRetention] = useState(7);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSound, setAlertSound] = useState(true);

  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('settings');

  const getCurrentBrowserTZ = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const gmt = -new Date().getTimezoneOffset() / 60;
    return { tz, gmt };
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (!token || !userId) return;

    fetch('https://api.falldetection.me/api/settings', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setDateFormat(data.date_format ?? dateFormat);
        setVideoQuality(data.video_quality ?? videoQuality);
        setVideoRetention(data.video_retention ?? videoRetention);
        setNotificationsEnabled(data.alert_enabled ?? true);
        setAlertSound(data.alert_sound ?? true);

        const selectedTZ = data.time_zone ?? getCurrentBrowserTZ().tz;
        setTimeZone(selectedTZ);

        const matched = timeZoneOptions.find(t => t.tz === selectedTZ);
        setCurrentLocation(matched || { tz: selectedTZ, gmt: getCurrentBrowserTZ().gmt });
      })
      .catch(err => console.error("Failed to fetch settings:", err));
  }, [token, userId]);

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
      .then(() => alert('Settings updated successfully!'))
      .catch(err => console.error("Failed to update settings:", err))
      .finally(() => setSaving(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = () => {
    if (!newPassword) {
      setPasswordChangeStatus({ error: 'New password cannot be empty.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ error: 'New passwords do not match.' });
      return;
    }

    setChangingPassword(true);
    setPasswordChangeStatus(null);

    fetch('https://api.falldetection.me/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ new_password: newPassword }),
    })
      .then(async (res) => {
        if (res.ok) {
          setPasswordChangeStatus({ success: 'Password changed successfully!' });
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          const data = await res.json();
          setPasswordChangeStatus({ error: data.error || 'Failed to change password.' });
        }
      })
      .catch(() => setPasswordChangeStatus({ error: 'Server error, try again later.' }))
      .finally(() => setChangingPassword(false));
  };

  return (
  <div className="layout-container">
    <aside className="left-side-settings">
      <div
        className={`sidebar-icon-item ${activeSection === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveSection('settings')}
      >
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
        <span className="arrow arrow-left"></span> Go Back
      </button>

      <h2>Settings</h2>

      <div className="settings-options">
        {/* Existing settings fields */}
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
              <optgroup label="Detected Location">
                <option value={currentLocation.tz}>
                  {currentLocation.tz.replace(/_/g, ' ')} (GMT{currentLocation.gmt >= 0 ? '+' : ''}{currentLocation.gmt})
                </option>
              </optgroup>
            )}
            <optgroup label="Other Locations">
              {timeZoneOptions
                .filter(tz => tz.tz !== currentLocation?.tz)
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
          <select value={videoRetention} onChange={(e) => setVideoRetention(+e.target.value)}>
            {[1, 3, 7, 14, 30, 60, 90].map(days => (
              <option key={days} value={days}>{days} {days === 1 ? 'day' : 'days'}</option>
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

        {/* New Change Password Section */}
        <div className="change-password-section">
          <h3>Change Password</h3>

          <div className="info-row">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="info-row">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="info-row">
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="save-button-container">
            <button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
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