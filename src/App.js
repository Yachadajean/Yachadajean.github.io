// C:\Users\USER\fall-detection-ui\src\App.js
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
import Records from './pages/Records';
function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // ✅ Use relative URL for development proxy
    fetch('/status')
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
            // ✅ Send token to backend using relative URL
            await fetch('/save-token', {
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

    // ✅ Listen for incoming FCM messages
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (payload.notification) {
        toast(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });

    requestPermissionAndToken();
  }, []);

  return (
    <>
<Router basename={process.env.NODE_ENV === 'production' ? '/fall-detection-ui' : ''}>
<Routes>
          <Route path="/" element={<LiveStream />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/records" element={<Records />} />
          <Route path="/stream/:ipAddress" element={<LiveStream />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
