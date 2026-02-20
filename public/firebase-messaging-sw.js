// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// Using compat version for service worker compatibility
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyB94eTV2WTaXaEtomKnNgc_zT6dtzFSEVQ",
  authDomain: "college360x.firebaseapp.com",
  projectId: "college360x",
  storageBucket: "college360x.firebasestorage.app",
  messagingSenderId: "667484911862",
  appId: "1:667484911862:web:e88b446dd4db78066194d7",
  measurementId: "G-C6YCL5SYZV"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] ✅ Received background message:', payload);
  console.log('[firebase-messaging-sw.js] Payload notification:', payload.notification);
  console.log('[firebase-messaging-sw.js] Payload data:', payload.data);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || payload.data?.title || 'College360x';
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have a new notification';
  
  console.log('[firebase-messaging-sw.js] Creating notification:', { title: notificationTitle, body: notificationBody });
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/college-web-logo.jpeg', // Use main app logo
    badge: '/college-web-logo.jpeg',
    image: payload.notification?.image || payload.data?.image || '/college-web-logo.jpeg',
    data: {
      ...payload.data,
      click_action: payload.data?.click_action || payload.fcmOptions?.link || '/',
    },
    tag: payload.data?.type || payload.data?.announcementId || 'notification',
    requireInteraction: false,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    silent: false, // Ensure sound plays
    renotify: true, // Replace existing notifications with same tag
  };

  // Use waitUntil to ensure the notification is shown before the service worker terminates
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('[firebase-messaging-sw.js] ✅ Notification shown successfully');
      console.log('[firebase-messaging-sw.js] Notification title:', notificationTitle);
      console.log('[firebase-messaging-sw.js] Notification body:', notificationBody);
    })
    .catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Error showing notification:', error);
      console.error('[firebase-messaging-sw.js] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      // Try to show a basic notification as fallback
      return self.registration.showNotification(notificationTitle, {
        body: notificationBody,
        icon: '/college-web-logo.jpeg',
        badge: '/college-web-logo.jpeg',
        tag: 'fallback-notification',
      }).catch((fallbackError) => {
        console.error('[firebase-messaging-sw.js] ❌ Fallback notification also failed:', fallbackError);
      });
    });
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 🔔 Notification clicked', event.notification.data);
  event.notification.close();
  
  const clickAction = event.notification.data?.click_action || 
                      event.notification.data?.link || 
                      '/';
  
  // Get the origin from any existing client or use a default
  const getOrigin = async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (clientList.length > 0) {
      const url = new URL(clientList[0].url);
      return url.origin;
    }
    // Fallback to current origin (service worker scope)
    return self.location.origin;
  };
  
  // Open or focus the app
  event.waitUntil(
    getOrigin().then((origin) => {
      const fullUrl = clickAction.startsWith('http') ? clickAction : `${origin}${clickAction}`;
      console.log('[firebase-messaging-sw.js] Opening URL:', fullUrl);
      
      return clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window open with the same origin
        for (const client of clientList) {
          if (client.url.startsWith(origin) && 'focus' in client) {
            console.log('[firebase-messaging-sw.js] Focusing existing window:', client.url);
            // Navigate to the target URL if different
            if (!client.url.includes(clickAction)) {
              return client.navigate(fullUrl).then(() => client.focus());
            }
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          console.log('[firebase-messaging-sw.js] Opening new window:', fullUrl);
          return clients.openWindow(fullUrl);
        }
      });
    }).catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Error handling notification click:', error);
    })
  );
});

