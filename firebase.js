// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB94eTV2WTaXaEtomKnNgc_zT6dtzFSEVQ",
  authDomain: "college360x.firebaseapp.com",
  projectId: "college360x",
  storageBucket: "college360x.firebasestorage.app",
  messagingSenderId: "667484911862",
  appId: "1:667484911862:web:e88b446dd4db78066194d7",
  measurementId: "G-C6YCL5SYZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;

try {
  // Register service worker for background notifications
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  messaging = getMessaging(app);
} catch (err) {
  console.error("Firebase messaging initialization error:", err);
}

export const requestPermission = async () => {
  if (!messaging) {
    console.error("Messaging is not initialized");
    return null;
  }

  try {
    // Ensure service worker is registered and ready
    let registration = null;
    if ("serviceWorker" in navigator) {
      try {
        // First, try to get existing registration
        registration = await navigator.serviceWorker.getRegistration();
        
        // If no registration exists, register it
        if (!registration) {
          console.log("No existing service worker registration, registering new one...");
          registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registered:", registration.scope);
        }
        
        // Wait for service worker to be ready (this ensures it's fully activated)
        registration = await navigator.serviceWorker.ready;
        console.log("Service Worker is ready:", registration.scope);
      } catch (swError) {
        console.warn("Service Worker registration/ready error, attempting to register:", swError);
        // Try to register if registration failed
        try {
          registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          // Wait for it to be ready - registration.ready is a promise
          registration = await registration.ready;
          console.log("Service Worker registered and ready after error recovery:", registration.scope);
        } catch (registerError) {
          console.error("Failed to register service worker:", registerError);
          // Don't throw - allow the function to continue and return null if permission is denied
          registration = null;
        }
      }
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Ensure we have a registration before getting token
      if (!registration && "serviceWorker" in navigator) {
        registration = await navigator.serviceWorker.ready;
      }
      
      if (!registration) {
        console.error("Service worker registration is required but not available");
        return null;
      }
      
      const token = await getToken(messaging, {
        vapidKey: "BISjcErh1YpP-tpBpSt1iEe6boDQ19KH0zXzE2MEVluC2n-l9ixjxIpIkzQi1dwZmFkGxI-oLVGQh3Xlg3i6QUc",
        serviceWorkerRegistration: registration
      });
      
      // Set up foreground message handler
      setupForegroundMessageHandler();
      
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Handle foreground messages (when app is open and visible)
 * When the app is in the foreground, Firebase doesn't automatically show notifications
 * We need to manually display them
 */
let foregroundHandlerSetup = false;

export const setupForegroundMessageHandler = () => {
  if (!messaging) {
    console.warn("⚠️ [FOREGROUND] Messaging not initialized, cannot set up foreground handler");
    return;
  }

  if (foregroundHandlerSetup) {
    console.log("ℹ️ [FOREGROUND] Foreground handler already set up, skipping");
    return;
  }

  try {
    console.log("🔔 [FOREGROUND] Setting up foreground message handler...");
    
    onMessage(messaging, (payload) => {
      console.log("🔔 [FOREGROUND] Received foreground message:", payload);
      console.log("🔔 [FOREGROUND] Notification permission:", Notification.permission);
      
      const notificationTitle = payload.notification?.title || payload.data?.title || "College360x";
      const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";
      
      // Use full URL for icon to ensure it works
      const baseUrl = window.location.origin;
      const notificationIcon = payload.notification?.icon || `${baseUrl}/weblogo.jpg`;
      const notificationImage = payload.notification?.image || `${baseUrl}/weblogo.jpg`;
      
      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const notification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: notificationIcon,
            badge: `${baseUrl}/weblogo.jpg`,
            image: notificationImage,
            tag: payload.data?.type || "notification",
            requireInteraction: false,
            data: payload.data || {},
          });

          console.log("✅ [FOREGROUND] Browser notification displayed:", { title: notificationTitle, body: notificationBody });

          // Handle notification click
          notification.onclick = (event) => {
            event.preventDefault();
            window.focus();
            console.log("🔔 [FOREGROUND] Notification clicked, data:", payload.data);
            // You can navigate to a specific page based on payload.data
            if (payload.data?.link) {
              window.location.href = payload.data.link;
            }
            notification.close();
          };

          // Auto-close after 5 seconds
          setTimeout(() => {
            notification.close();
          }, 5000);
        } catch (notifError) {
          console.error("❌ [FOREGROUND] Error creating notification:", notifError);
        }
      } else {
        console.warn("⚠️ [FOREGROUND] Cannot show notification - permission:", Notification.permission);
        // Fallback: Show alert if notifications not available
        if (Notification.permission !== "denied") {
          alert(`${notificationTitle}\n${notificationBody}`);
        }
      }
    });
    
    foregroundHandlerSetup = true;
    console.log("✅ [FOREGROUND] Foreground message handler set up successfully");
  } catch (error) {
    console.error("❌ [FOREGROUND] Error setting up foreground message handler:", error);
  }
};

// Export messaging instance for use in other components
export { messaging };
