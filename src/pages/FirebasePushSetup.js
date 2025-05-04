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
            vapidKey: 'YOUR_PUBLIC_VAPID_KEY', // Replace with your Firebase VAPID key
          });
          console.log('📱 Firebase device token:', token);
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
