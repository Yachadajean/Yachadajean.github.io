// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAyCyUEX671GAcylOb8lSWq-qNPoa3Cw54",
  authDomain: "falldetection-14e19.firebaseapp.com",
  projectId: "falldetection-14e19",
  storageBucket: "falldetection-14e19.firebasestorage.app",
  messagingSenderId: "856042374033",
  appId: "1:856042374033:web:cf78762860ad6fddd15030",
  measurementId: "G-MEXKMNMWTX"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging };
