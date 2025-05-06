import { useEffect } from 'react';
import { messaging } from '../firebase-config';
import { getToken } from 'firebase/messaging';

const FirebasePushSetup = () => {
  useEffect(() => {
    const getDeviceToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'BKDr9lAqH-s2eMkTkUJMis7LLxZWqHkXNveZrPM3wg6N400X9Pt4iCw2Bx1lWTcSPN4a7O8MASH8P0FQ2H4CNjk', // Replace with your Firebase VAPID key
          });
          localStorage.setItem('fcmToken', token);
          // TODO: send `token` to your backend or store locally
        } else {
          console.warn('🔕 Notification permission denied');
        }
      } catch (err) {
        console.error('❌ Error getting device token:', err);
      }
    };

    getDeviceToken();
  }, []);

  return null;
};

export default FirebasePushSetup;
