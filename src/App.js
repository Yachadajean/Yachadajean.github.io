import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import LiveStream from './pages/LiveStream';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import GalleryLayout from './pages/GalleryLayout.js';
import SizeContainer from './pages/SizeContainer'; 
import Onboarding from './pages/Onboarding';  
import BuildLayOut from './pages/BuildLayOut';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Update backend URL for production or development environment
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'  // Development environment
  : 'https://api.falldetection.me';  // Use HTTPS for production

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Request permission and get token (your existing code here)
    const requestPermissionAndToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_VAPID_KEY
          });
  
          if (!token) {
            console.warn("FCM Token is null, possible error with Firebase setup");
          } else {
            console.log("FCM Token:", token);
            localStorage.setItem("token", token);
  
            await fetch(`${BACKEND_URL}/save-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            }).catch(err => {
              console.error('Error saving token to backend', err);
            });
            
          }
        } else {
          console.warn("Notification permission denied.");
        }
      } catch (err) {
        console.error("Error getting FCM token", err);
      }
    };
  
    // Set up listener for incoming messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (payload.notification) {
        toast(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });
  
    requestPermissionAndToken();
  
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  //<Route path="/" element={<Navigate to="/livestream" replace />} />
  return (
    <>
      <Router>
        <Routes>
         <Route path="/" element={<Onboarding />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/gallery" element={<GalleryLayout />} />
          <Route path="/buildlayout" element={<BuildLayOut />} />


          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/livestream" element={
            <SizeContainer>
              <LiveStream />
            </SizeContainer>
          } />
        </Routes>
      </Router>
      <ToastContainer />       
    </>                                   
  );
}      

export default App;


