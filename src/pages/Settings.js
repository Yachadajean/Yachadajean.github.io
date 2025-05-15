import React, { useState, useEffect } from 'react';
import './Settings.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
    const [saving, setSaving] = useState(false);

    const [videoQuality, setVideoQuality] = useState('medium');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [alertSound, setAlertSound] = useState(true);
    const [notificationTypes, setNotificationTypes] = useState({
        fallDetected: true,
        cameraOffline: true,
    });

    const [theme, setTheme] = useState('system');
    const [fontSize, setFontSize] = useState('medium');
    const [autoStart, setAutoStart] = useState(false);
    const [keepScreenOn, setKeepScreenOn] = useState(true);

    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
    const [timeZone, setTimeZone] = useState('GMT');

    const [userEmail, setUserEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const healthConditionOptions = ['', 'None', 'Diabetes', 'Asthma', 'Heart Disease'];
    const mobilityAidOptions = ['', 'None', 'Cane', 'Walker', 'Wheelchair'];
    const allergyOptions = ['', 'None', 'Peanuts', 'Shellfish', 'Pollen'];
    const medicationOptions = ['', 'None', 'Insulin', 'Albuterol', 'Aspirin'];
    const relationOptions = ['', 'Parent', 'Spouse', 'Sibling', 'Friend'];

    const currentYear = new Date().getFullYear();
    const endOfCurrentYear = new Date(currentYear, 11, 31);

    useEffect(() => {
        if (dob) {
            setStartDate(new Date(dob));
        }
    }, [dob]);

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
                setToken(null);
                setUserId(null);
            }
        }
    }, []);

    useEffect(() => {
        if (userId && token) {
            fetch(`https://your-backend-api.com/api/settings?user_id=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.user_id) {
                        setDateFormat(data.date_format);
                        setTimeZone(data.time_zone);
                        setNotificationsEnabled(data.alert_enabled);
                        setAlertSound(data.alert_sound);
                        setVideoQuality(data.video_quality);
                        setUserEmail(data.email);
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
        navigate('/livestream');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
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
            videoQuality,
            notificationsEnabled,
            notificationTypes,
            dateFormat,
            timeZone,
            alertSound,
            userEmail,
            newPassword
        };

        if (token) {
            setSaving(true);
            fetch('https://api.falldetection.com/api/settings', {
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
                })
                .finally(() => {
                    setSaving(false);
                });
        } else {
            console.warn("Token is not available. Settings not saved.");
        }
    };

    return (
        <div className="layout-container">
            <button className="goback-button" onClick={handleGoBack}>
                <span className="arrow arrow-left"></span>
            </button>
            <aside className="left-side-settings">
                <div className={`sidebar-icon-item ${activeSection === 'userInfo' ? 'active' : ''}`}
                    onClick={() => setActiveSection('userInfo')}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>User Info</span>
                </div>
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
                <h2>{activeSection === 'userInfo' ? 'User Information' : 'Settings'}</h2>

                {activeSection === 'userInfo' && (
                    <div className="user-info-details">
                        <div className="info-row"><label>Email:</label><span>{userEmail}</span></div>
                        <div className="info-row"><label>Full Name:</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                        <div className="info-row"><label>Date of Birth:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy/MM/dd"
                                className="date-picker-input"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                maxDate={endOfCurrentYear}
                            />
                        </div>
                        <div className="info-row"><label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="info-row"><label>Health Conditions:</label>
                            <select value={conditions} onChange={(e) => setConditions(e.target.value)}>
                                {healthConditionOptions.map((opt) => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                            </select>
                        </div>
                        <div className="info-row"><label>Mobility Aids:</label>
                            <select value={mobilityAids} onChange={(e) => setMobilityAids(e.target.value)}>
                                {mobilityAidOptions.map((opt) => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                            </select>
                        </div>
                        <div className="info-row"><label>Medications:</label>
                            <select value={medications} onChange={(e) => setMedications(e.target.value)}>
                                {medicationOptions.map((opt) => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                            </select>
                        </div>
                        <h4>Emergency Contact Info</h4>
                        <div className="info-row"><label>Emergency Contact Name:</label><input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} /></div>
                        <div className="info-row"><label>Relation:</label>
                            <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                                {relationOptions.map((opt) => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                            </select>
                        </div>
                        <div className="info-row"><label>Phone Number:</label><input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} /></div>
                        <div className="info-row"><label>Care Notes:</label><textarea value={careNotes} onChange={(e) => setCareNotes(e.target.value)} /></div>
                    </div>
                )}

                {activeSection === 'settings' && (
                    <div className="settings-options">
                        <div className="info-row"><label>Video Quality:</label>
                            <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="info-row">
                            <label>Notifications:</label>
                            <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                        </div>
                        <div className="info-row">
                            <label>Alert Sound:</label>
                            <input type="checkbox" checked={alertSound} onChange={(e) => setAlertSound(e.target.checked)} />
                        </div>
                        <div className="info-row">
                            <label>Date Format:</label>
                            <input type="text" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} />
                        </div>
                        <div className="info-row">
                            <label>Time Zone:</label>
                            <input type="text" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} />
                        </div>
                        <div className="info-row">
                            <label>New Password:</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                    </div>
                )}

                <div className="save-button-container">
                    <button onClick={handleSaveSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Settings;
