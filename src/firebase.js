// firebase.js
import { initializeApp } from "firebase/app";
// Import the necessary Firebase modules
import firebase from "firebase/compat/app";
import "firebase/compat/messaging"; // Import Firebase messaging from compat

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyCyUEX671GAcylOb8lSWq-qNPoa3Cw54",
  authDomain: "falldetection-14e19.firebaseapp.com",
  projectId: "falldetection-14e19",
  storageBucket: "falldetection-14e19.appspot.com", // ✅ Fixed this
  messagingSenderId: "856042374033",
  appId: "1:856042374033:web:cf78762860ad6fddd15030",
  measurementId: "G-MEXKMNMWTX"
};

// Initialize Firebase app with the config
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase messaging
const messaging = firebase.messaging();

// Export messaging to use in other parts of your app
export { messaging };

