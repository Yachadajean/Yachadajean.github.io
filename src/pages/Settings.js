import React, { useState, useEffect } from 'react';
import './Settings.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

function Settings() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [activeSection, setActiveSection] = useState('userInfo');
    const [startDate, setStartDate] = useState(null);
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [conditions, setConditions] = useState('');
    const [mobilityAids, setMobilityAids] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medications, setMedications] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [relation, setRelation] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [careNotes, setCareNotes] = useState('');

    // New state for video quality
    const [videoQuality, setVideoQuality] = useState('medium'); // Default to 'medium'
    // New state for notifications
    const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Default to enabled
    const [alertSound, setAlertSound] = useState(true);
    const [notificationTypes, setNotificationTypes] = useState({
        fallDetected: true,
        cameraOffline: true,
    });

    // New state for application settings
    const [theme, setTheme] = useState('system'); // Default to system
    const [fontSize, setFontSize] = useState('medium'); // Default to medium
    const [autoStart, setAutoStart] = useState(false);
    const [keepScreenOn, setKeepScreenOn] = useState(true);

    // New state for Date and Time
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
    const [timeZone, setTimeZone] = useState('GMT');


    // New state for User Profile
    const [userEmail, setUserEmail] = useState('');  // Assume you have this from JWT or elsewhere
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null); // State to hold the token

    const healthConditionOptions = ['', 'None', 'Diabetes', 'Asthma', 'Heart Disease'];
    const mobilityAidOptions = ['', 'None', 'Cane', 'Walker', 'Wheelchair'];
    const allergyOptions = ['', 'None', 'Peanuts', 'Shellfish', 'Pollen'];
    const medicationOptions = ['', 'None', 'Insulin', 'Albuterol', 'Aspirin'];
    const relationOptions = ['', 'Parent', 'Spouse', 'Sibling', 'Friend'];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);

    const getDaysInMonth = (year, monthIndex) => {
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    useEffect(() => {
        if (dob) {
            setStartDate(new Date(dob));
        }
    }, [dob]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken); // Set the token in state
            try {
                // Decode the token to extract the user_id (you can use a library like `jwt-decode` for this)
                const decoded = jwtDecode(storedToken);  // Make sure to import jwt-decode
                setUserId(decoded.user_id);
            } catch (error) {
                console.error("Error decoding token:", error);
                // Handle the error appropriately, e.g., clear the invalid token
                localStorage.removeItem('token');
                setToken(null);
                setUserId(null);
            }
        }
    }, []);

    useEffect(() => {
        if (userId && token) { // Only fetch if both userId and token are available
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
                        setNotificationsEnabled(data.alert_enabled);
                        setAlertSound(data.alert_sound);
                        setVideoQuality(data.video_quality);
                        //setVideoRetention(data.video_retention);  // Removed videoRetention
                        setUserEmail(data.email); // set user email
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user settings:", error);
                });
        }
    }, [userId, token]);

    const handleDateChange = (date) => {
        setStartDate(date);
        setDob(date ? date.toISOString().split('T')[0] : '');
    };

    const handleGoBack = () => {
      navigate('./pages/LiveStream');
    };

    const handleSaveSettings = () => {
        const updatedSettings = {
            dob,
            fullName,
            gender,
            conditions,
            mobilityAids,
            medications,
            emergencyName,
            relation,
            emergencyPhone,
            careNotes,
            videoQuality, // Include videoQuality in saved settings
            notificationsEnabled, // Include notifications settings
            notificationTypes,
            dateFormat,
            timeZone,
            alertSound,
            //videoRetention, // Removed videoRetention
            userEmail,
            newPassword
            // ... other settings data
        };
        console.log("Saving settings:", updatedSettings);
        // In a real application, you would send this data to your backend API
        if (token) { // Only send if token is available
            fetch('https://api.falldetection./api/settings', {  // Corrected endpoint
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
        } else {
            console.warn("Token is not available.  Settings not saved.");
        }
    };



    const currentYear = new Date().getFullYear();
    const endOfCurrentYear = new Date(currentYear, 11, 31);

    const handleLogout = () => {
        // Perform any necessary logout actions (e.g., clearing local storage, session)
        console.log("Logging out");
        // Navigate to the login page
        navigate('/login'); // Assuming your LoginPage is at the '/login' route
    };


    return (
        <div className="layout-container">
            <button className="goback-button" onClick={handleGoBack}>
                <span className="arrow arrow-left"></span>
            </button>
            <aside className="left-side-settings">
            <div
    className={`sidebar-icon-item ${activeSection === 'userInfo' ? 'active' : ''}`}
    onClick={() => setActiveSection('userInfo')}
>
    <FontAwesomeIcon icon={faUser} /> {/* This is an SVG element */}
    <span>User Info</span>
</div>
<div
    className={`sidebar-icon-item ${activeSection === 'settings' ? 'active' : ''}`}
    onClick={() => setActiveSection('settings')}
>
    <FontAwesomeIcon icon={faCog} /> {/* This is also an SVG element */}
    <span>Settings</span>
</div>
<div className="sidebar-icon-item" onClick={handleLogout}>
    <FontAwesomeIcon icon={faSignOutAlt} /> {/* And this one too */}
    <span>Log Out</span>
</div>
            </aside>
            <main className="right-side-settings">
                <h2>
                    {activeSection === 'userInfo' ? 'User Information' : 'Settings'}
                </h2>

                {activeSection === 'userInfo' && (
                    <div className="user-info-details">
                        <div className="info-row">
                            <label>Email:</label>
                            <span>{email} (Read-only)</span>
                        </div>
                        <div className="info-row">
                            <label>Full Name:</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="info-row">
                            <label>Date of Birth:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="YYYY/MM/DD"
                                className="date-picker-input"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                maxDate={endOfCurrentYear}
                            />
                        </div>
                        <div className="info-row">
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Health Conditions:</label>
                            <select value={conditions} onChange={(e) => setConditions(e.target.value)}>
                                {healthConditionOptions.map((option) => (
                                    <option key={option} value={option}>{option || 'Select'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Mobility Aids:</label>
                            <select value={mobilityAids} onChange={(e) => setMobilityAids(e.target.value)}>
                                {mobilityAidOptions.map((option) => (
                                    <option key={option} value={option}>{option || 'Select'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Medications:</label>
                            <select value={medications} onChange={(e) => setMedications(e.target.value)}>
                            {medicationOptions.map((option) => (
                                    <option key={option} value={option}>{option || 'Select'}</option>
                                ))}
                            </select>
                        </div>

                        <h4>Emergency Contact Info</h4>
                        <div className="info-row">
                            <label>Emergency Contact Name:</label>
                            <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                        </div>
                        <div className="info-row">
                            <label>Relation:</label>
                            <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                                {relationOptions.map((option) => (
                                    <option key={option} value={option}>{option || 'Select'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Phone Number:</label>
                            <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                        </div>
                        <div className="info-row">
                            <label>Care Notes:</label>
                            <textarea value={careNotes} onChange={(e) => setCareNotes(e.target.value)} />
                        </div>
                        <button className="save-button" onClick={handleSaveSettings}>Save</button>
                    </div>
                )}

                {activeSection === 'settings' && (
                    <div className="app-settings">
                        <h2>Notification Settings</h2>
                        <div className="info-row">
                            <label>Enable Notifications:</label>
                            <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                        </div>
                        <div className="info-row">
                            <label>Alert Sound:</label>
                            <input type="checkbox" checked={alertSound} onChange={() => setAlertSound(!alertSound)} />
                        </div>
                        <div className="info-row">
                            <label>Fall Detected Alerts:</label>
                            <input type="checkbox" checked={notificationTypes.fallDetected} onChange={() => setNotificationTypes(prev => ({ ...prev, fallDetected: !prev.fallDetected }))} />
                        </div>
                        <div className="info-row">
                            <label>Camera Offline Alerts:</label>
                            <input type="checkbox" checked={notificationTypes.cameraOffline} onChange={() => setNotificationTypes(prev => ({ ...prev, cameraOffline: !prev.cameraOffline }))} />
                        </div>

                        <h2>Date & Time Settings</h2>
                        <div className="info-row">
                            <label>Date Format:</label>
                            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Time Zone:</label>
                            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                                <option value="GMT">GMT</option>
                                <option value="UTC">UTC</option>
                                <option value="Asia/Taipei">Asia/Taipei</option>
                                <option value="Asia/Bangkok">Asia/Bangkok</option>
                            </select>
                        </div>
  

                        <h2>Account</h2>
        <div className="info-row">
            <label>Email:</label>
            <span>{userEmail || 'N/A'}</span>
        </div>
        {/* Add the Current Password field here */}
        <div className="info-row">
            <label>Current Password:</label>
            <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
                  </div>
                  <div className="info-row">
                      <label>New Password:</label>
                      <input
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                      />
                  </div>

                  <button className="save-button" onClick={handleSaveSettings}>Save Settings</button>
              </div>
                )}
            </main>
        </div>
    );
}

export default Settings;
