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

// Update backend URL for production or development environment
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'  // Development environment
  : 'https://api.falldetection.me';  // Use HTTPS for production

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // ✅ Check connection status
    fetch(`${BACKEND_URL}/status`)  // Using HTTPS/HTTP based on the environment
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
            vapidKey: process.env.REACT_APP_VAPID_KEY  // Use environment variable for VAPID Key
          });

          if (!token) {
            console.warn("FCM Token is null, possible error with Firebase setup");
          } else {
            console.log("FCM Token:", token);
            localStorage.setItem("token", token);
          
            // ✅ Send token to backend
            await fetch(`${BACKEND_URL}/save-token`, {  // Use HTTPS for production
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
      <Router>
        <Routes>
          <Route path="/" element={<LiveStream />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
