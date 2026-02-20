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
        console.log("✅ [FIREBASE] Service Worker registered successfully:", registration.scope);
        console.log("✅ [FIREBASE] Service Worker state:", registration.active?.state || "not active");
        
        // Check if service worker is active
        if (registration.active) {
          console.log("✅ [FIREBASE] Service Worker is active and ready");
        } else {
          console.warn("⚠️ [FIREBASE] Service Worker registered but not yet active");
        }
      })
      .catch((error) => {
        console.error("❌ [FIREBASE] Service Worker registration failed:", error);
        console.error("❌ [FIREBASE] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      });
  } else {
    console.warn("⚠️ [FIREBASE] Service Workers not supported in this browser");
  }

  messaging = getMessaging(app);
  console.log("✅ [FIREBASE] Messaging instance created");
} catch (err) {
  console.error("❌ [FIREBASE] Firebase messaging initialization error:", err);
  console.error("❌ [FIREBASE] Error details:", {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
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
    console.log("🔔 [FOREGROUND] Messaging instance:", messaging ? "✅ Available" : "❌ Not available");
    console.log("🔔 [FOREGROUND] Notification permission:", Notification.permission);
    
    onMessage(messaging, (payload) => {
      console.log("🔔 [FOREGROUND] ✅ Received foreground message:", payload);
      console.log("🔔 [FOREGROUND] Payload notification:", payload.notification);
      console.log("🔔 [FOREGROUND] Payload data:", payload.data);
      console.log("🔔 [FOREGROUND] Notification permission:", Notification.permission);
      
      const notificationTitle = payload.notification?.title || payload.data?.title || "College360x";
      const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";
      
      console.log("🔔 [FOREGROUND] Creating notification:", { title: notificationTitle, body: notificationBody });
      
      // Use full URL for icon to ensure it works
      const baseUrl = window.location.origin;
      const notificationIcon = payload.notification?.icon || `${baseUrl}/weblogo.jpg`;
      const notificationImage = payload.notification?.image || `${baseUrl}/weblogo.jpg`;
      
      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          console.log("🔔 [FOREGROUND] Attempting to create notification...");
          const notification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: notificationIcon,
            badge: `${baseUrl}/weblogo.jpg`,
            image: notificationImage,
            tag: payload.data?.type || payload.data?.announcementId || "notification",
            requireInteraction: false, // Set to true if you want notifications to stay until clicked
            data: payload.data || {},
            silent: false, // Make sure sound plays
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

          // Auto-close after 10 seconds (increased from 5 for better visibility)
          setTimeout(() => {
            notification.close();
          }, 10000);
        } catch (notifError) {
          console.error("❌ [FOREGROUND] Error creating notification:", notifError);
          console.error("❌ [FOREGROUND] Error details:", {
            message: notifError.message,
            stack: notifError.stack,
            name: notifError.name
          });
        }
      } else {
        console.warn("⚠️ [FOREGROUND] Cannot show notification - permission:", Notification.permission);
        console.warn("⚠️ [FOREGROUND] Notification API available:", "Notification" in window);
        // Fallback: Show alert if notifications not available
        if (Notification.permission !== "denied") {
          console.log("🔔 [FOREGROUND] Showing fallback alert");
          alert(`${notificationTitle}\n${notificationBody}`);
        } else {
          console.warn("⚠️ [FOREGROUND] Notifications denied by user");
        }
      }
    });
    
    foregroundHandlerSetup = true;
    console.log("✅ [FOREGROUND] Foreground message handler set up successfully");
  } catch (error) {
    console.error("❌ [FOREGROUND] Error setting up foreground message handler:", error);
    console.error("❌ [FOREGROUND] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
};

/**
 * Get or generate device ID (stored in localStorage)
 * @returns {string} Device ID
 */
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('fcm_deviceId');
  if (!deviceId) {
    // Generate a unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('fcm_deviceId', deviceId);
    console.log('🔔 [FCM] Generated new device ID:', deviceId);
  }
  return deviceId;
};

/**
 * Get device name from user agent
 * @returns {string} Device name
 */
export const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    if (ua.includes('Android')) {
      const match = ua.match(/Android\s+([^;)]+)/);
      return match ? `Android ${match[1]}` : 'Android Mobile';
    }
    if (ua.includes('iPhone')) {
      const match = ua.match(/iPhone OS\s+([_\d]+)/);
      return match ? `iPhone iOS ${match[1].replace(/_/g, '.')}` : 'iPhone';
    }
    return 'Mobile Device';
  }
  if (ua.includes('Windows')) return 'Windows PC';
  if (ua.includes('Mac')) return 'Mac';
  if (ua.includes('Linux')) return 'Linux PC';
  return 'Unknown Device';
};

/**
 * Set up token refresh listener
 * @param {Function} onTokenRefresh - Callback when token refreshes
 */
export const setupTokenRefreshListener = (onTokenRefresh) => {
  if (!messaging) {
    console.warn('⚠️ [FCM] Messaging not initialized, cannot set up token refresh listener');
    return;
  }

  // Firebase v9+ doesn't have onTokenRefresh, but tokens can change
  // We'll check token periodically and on visibility change
  let lastToken = null;
  
  const checkTokenRefresh = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: "BISjcErh1YpP-tpBpSt1iEe6boDQ19KH0zXzE2MEVluC2n-l9ixjxIpIkzQi1dwZmFkGxI-oLVGQh3Xlg3i6QUc"
      });
      
      if (currentToken && currentToken !== lastToken && lastToken !== null) {
        console.log('🔄 [FCM] Token refreshed:', { old: lastToken?.substring(0, 20), new: currentToken.substring(0, 20) });
        if (onTokenRefresh) {
          onTokenRefresh(currentToken, lastToken);
        }
      }
      
      lastToken = currentToken;
    } catch (error) {
      console.error('❌ [FCM] Error checking token refresh:', error);
    }
  };

  // Check on visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkTokenRefresh();
    }
  });

  // Check periodically (every 5 minutes)
  setInterval(checkTokenRefresh, 5 * 60 * 1000);

  // Initial check
  checkTokenRefresh();
};

// Export messaging instance for use in other components
export { messaging };
