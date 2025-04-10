// service-worker.js

self.addEventListener('push', function(event) {
    let options = {
      body: event.data.text(),
      icon: '/images/alert-icon.png',
      badge: '/images/alert-icon.png'
    };
  
    event.waitUntil(
      self.registration.showNotification('Fall Detected!', options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/') // Navigate to the app's homepage or desired URL
    );
  });
  