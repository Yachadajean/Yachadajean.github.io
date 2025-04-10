// Check if Service Worker is supported in the browser
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
  
      // Request permission to show notifications
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            console.log('Notification permission granted');
            subscribeUserToPush(registration);
          } else {
            console.log('Notification permission denied');
          }
        });
      } else {
        subscribeUserToPush(registration);
      }
    }).catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
  }
  
  // Function to subscribe the user to push notifications
  function subscribeUserToPush(registration) {
    registration.pushManager.subscribe({
      userVisibleOnly: true,  // User must be able to see notifications
      applicationServerKey: urlBase64ToUint8Array('<your-public-vapid-key>')  // Replace with your VAPID public key
    })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);
      // Send the subscription object to your backend server to store it
    })
    .catch(function(error) {
      console.error('Failed to subscribe the user:', error);
    });
  }
  
  // Helper to convert VAPID key to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  