// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAyCyUEX671GAcylOb8lSWq-qNPoa3Cw54",
  authDomain: "falldetection-14e19.firebaseapp.com",
  projectId: "falldetection-14e19",
  storageBucket: "falldetection-14e19.firebasestorage.app",
  messagingSenderId: "856042374033",
  appId: "1:856042374033:web:cf78762860ad6fddd15030",
  measurementId: "G-MEXKMNMWTX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
