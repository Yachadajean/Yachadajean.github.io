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
    // ✅ Check connection status
    fetch('https://api.falldetection.me/status')  // Remove the '/api' part if it's not needed
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setStatus(data.status); // Assuming the response has a 'status' field
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
            localStorage.setItem("token", token); // ✅ Save the token for later use
          
            // ✅ Send token to backend using relative URL
            await fetch('https://api.falldetection.me/save-token', {
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
          <Route path="/" element={<Home />} />
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
