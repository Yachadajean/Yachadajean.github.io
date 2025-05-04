import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import LiveStream from './pages/LiveStream';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('http://134.208.3.240:5000/status')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setStatus(data.status);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setStatus('Failed to connect');
      });

    // ✅ Firebase Notification Setup
    const requestPermissionAndToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const token = await getToken(messaging, {
            vapidKey: 'BKDr9lAqH-s2eMkTkUJMis7LLxZWqHkXNveZrPM3wg6N400X9Pt4iCw2Bx1lWTcSPN4a7O8MASH8P0FQ2H4CNjk'
          });

          if (!token) {
            console.warn("FCM Token is null, possible error with Firebase setup");
          } else {
            console.log("FCM Token:", token);
            // Optional: send token to backend here
            fetch('http://YOUR_BACKEND_URL/save-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });
          }
        } else {
          console.warn("Notification permission denied.");
        }
      } catch (err) {
        console.error("Error getting FCM token", err);
      }
    };

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      toast(`${payload.notification.title}: ${payload.notification.body}`);
    });

    requestPermissionAndToken();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LiveStream />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stream/:ipAddress" element={<LiveStream />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
