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
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'College360x';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/weblogo.jpg', // Use your app's logo
    badge: '/weblogo.jpg',
    image: payload.notification?.image || '/weblogo.jpg',
    data: payload.data || {},
    tag: payload.data?.type || 'notification',
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

