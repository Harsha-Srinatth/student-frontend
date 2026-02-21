import React, { useState, useEffect, useRef, useMemo } from "react";
import { Bell, BellOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { 
  requestPermission, 
  setupForegroundMessageHandler, 
  getDeviceId, 
  getDeviceName,
  setupTokenRefreshListener 
} from "../../../firebase.js";
import api from "../../services/api";

/**
 * Returns the FCM token for THIS device only (per-device state).
 * When fcmDevices is provided, we only consider this device's entry so a new device shows "disabled".
 */
function getThisDeviceToken(fcmDevices, fallbackToken, deviceId) {
  if (!deviceId) return fallbackToken;
  if (fcmDevices && Array.isArray(fcmDevices)) {
    const dev = fcmDevices.find((d) => d.deviceId === deviceId);
    return dev?.token ?? null;
  }
  return fallbackToken;
}

/**
 * NotificationSettings Component
 * Allows users to enable/disable push notifications **on this device**.
 * @param {string} userType - Type of user: 'student', 'faculty', or 'hod'
 * @param {string} userId - User ID (studentid, facultyid, or hodId)
 * @param {string} currentToken - Legacy: first FCM token (used only when fcmDevices not provided)
 * @param {Array} fcmDevices - List of { deviceId, token, deviceName } from backend; used to show enabled only for THIS device
 * @param {boolean} isLoading - Whether Redux data is still loading
 * @param {function} onNotificationChange - Optional callback after enable/disable (e.g. refetch dashboard)
 */
const NotificationSettings = ({
  userType,
  userId,
  currentToken: initialToken,
  fcmDevices = null,
  isLoading = false,
  onNotificationChange,
}) => {
  const hasInitializedRef = useRef(false);
  const previousTokenRef = useRef(undefined);
  const dataLoadedRef = useRef(false);
  const deviceIdRef = useRef(getDeviceId());
  const tokenRefreshListenerRef = useRef(null);

  // Token for THIS device only (null on new device until user enables here)
  const thisDeviceToken = useMemo(
    () => getThisDeviceToken(fcmDevices, initialToken, getDeviceId()),
    [fcmDevices, initialToken]
  );

  const getInitialState = () => {
    // Data not loaded yet
    if (fcmDevices === undefined && initialToken === undefined) {
      return { token: null, enabled: false, waitingForData: true };
    }
    // Per-device: only enabled if THIS device has a token
    const effective = getThisDeviceToken(fcmDevices, initialToken, getDeviceId());
    if (effective && effective.trim() !== "") {
      return { token: effective, enabled: true, waitingForData: false };
    }
    if (effective === null || (fcmDevices && Array.isArray(fcmDevices))) {
      return { token: null, enabled: false, waitingForData: false };
    }
    return { token: null, enabled: false, waitingForData: true };
  };

  const initialState = getInitialState();
  const [fcmToken, setFcmToken] = useState(initialState.token);
  const [isEnabled, setIsEnabled] = useState(initialState.enabled);
  const [waitingForData, setWaitingForData] = useState(initialState.waitingForData);
  const [loading, setLoading] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Set up token refresh listener
  useEffect(() => {
    if (isEnabled && fcmToken) {
      // Set up token refresh listener
      const handleTokenRefresh = async (newToken, oldToken) => {
        console.log('🔄 [NotificationSettings] Token refreshed, updating backend...');
        try {
          const endpoint = getUpdateEndpoint(userType);
          const response = await api.put(endpoint, {
            fcmTokenData: {
              token: newToken,
              deviceId: deviceIdRef.current,
              deviceName: getDeviceName(),
              action: 'update' // Update existing device
            }
          });
          
          // Get the updated token from response
          const responseToken = response.data?.student?.fcmToken || response.data?.faculty?.fcmToken || response.data?.hod?.fcmToken || newToken;
          
          setFcmToken(responseToken);
          previousTokenRef.current = responseToken;
          console.log('✅ [NotificationSettings] Token updated in backend:', { 
            deviceId: deviceIdRef.current,
            tokenLength: responseToken.length 
          });
        } catch (error) {
          console.error('❌ [NotificationSettings] Error updating token:', error);
        }
      };

      setupTokenRefreshListener(handleTokenRefresh);
      tokenRefreshListenerRef.current = handleTokenRefresh;
    }

    return () => {
      // Cleanup if needed
      tokenRefreshListenerRef.current = null;
    };
  }, [isEnabled, fcmToken, userType, userId]);

  // Track when data has finished loading
  useEffect(() => {
    const done = fcmDevices !== undefined || initialToken !== undefined;
    if (!isLoading && done) {
      dataLoadedRef.current = true;
      setWaitingForData(false);
    }
  }, [isLoading, initialToken, fcmDevices]);

  // Sync state from props: use THIS device's token only (from fcmDevices or fallback)
  useEffect(() => {
    const effective = thisDeviceToken;
    const hasToken = !!effective && effective.trim() !== "";

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousTokenRef.current = effective;
      setFcmToken(effective ?? null);
      setIsEnabled(hasToken);
      setWaitingForData(false);
      dataLoadedRef.current = true;
      if (import.meta.env?.DEV) {
        console.log("🔔 [NotificationSettings] Initial (per-device):", {
          hasToken,
          thisDeviceRegistered: hasToken,
          deviceId: deviceIdRef.current?.substring(0, 12),
        });
      }
      return;
    }

    if (previousTokenRef.current !== effective) {
      previousTokenRef.current = effective;
      setFcmToken(effective ?? null);
      setIsEnabled(hasToken);
      setWaitingForData(false);
      dataLoadedRef.current = true;
      if (import.meta.env?.DEV) {
        console.log("🔔 [NotificationSettings] Updated (per-device):", {
          hasToken,
          deviceId: deviceIdRef.current?.substring(0, 12),
        });
      }
    }
  }, [thisDeviceToken]);

  // Keep enabled state in sync with token
  // Only update if we have a definitive token value (not waiting for data)
  useEffect(() => {
    // Don't update if we're still waiting for data from Redux
    if (waitingForData && !dataLoadedRef.current) {
      return; // Still waiting, don't change state
    }
    
    // Once data is loaded, sync enabled state with token
    const shouldBeEnabled = !!fcmToken && fcmToken.trim() !== "";
    if (isEnabled !== shouldBeEnabled) {
      console.log("🔔 [NotificationSettings] Syncing enabled state with token:", {
        fcmToken: fcmToken ? `${fcmToken.substring(0, 20)}...` : null,
        shouldBeEnabled,
        currentIsEnabled: isEnabled
      });
      setIsEnabled(shouldBeEnabled);
    }
  }, [fcmToken, waitingForData, isEnabled]);

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      // Disable notifications - remove token
      await disableNotifications();
    } else {
      // Enable notifications - request permission and get token
      await enableNotifications();
    }
  };

  const enableNotifications = async () => {
    setRequestingPermission(true);
    setMessage({ type: "", text: "" });

    try {
      // Request notification permission
      const token = await requestPermission();

      if (!token) {
        setMessage({
          type: "error",
          text: "Notification permission denied. Please enable notifications in your browser settings.",
        });
        setRequestingPermission(false);
        return;
      }

      // Set up foreground message handler for when app is open
      console.log("🔔 [NotificationSettings] Setting up foreground message handler");
      setupForegroundMessageHandler();

      // Save token to backend with device info
      setLoading(true);
      const endpoint = getUpdateEndpoint(userType);
      const deviceId = deviceIdRef.current || getDeviceId();
      const deviceName = getDeviceName();
      
      const response = await api.put(endpoint, {
        fcmTokenData: {
          token,
          deviceId,
          deviceName,
          action: 'add' // Add or update device
        }
      });

      if (response.data) {
        // Get the token from response (backend returns the updated token for the specific device)
        const responseToken = response.data?.student?.fcmToken || 
                             response.data?.faculty?.fcmToken || 
                             response.data?.hod?.fcmToken || 
                             token;
        
        setFcmToken(responseToken);
        setIsEnabled(true);
        setWaitingForData(false);
        previousTokenRef.current = responseToken;
        dataLoadedRef.current = true;
        console.log('✅ [NotificationSettings] Token saved for this device:', {
          deviceId: deviceIdRef.current?.substring(0, 12),
        });
        setMessage({
          type: "success",
          text: "Push notifications enabled successfully! You'll receive notifications from College360x.",
        });
        onNotificationChange?.();
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to enable notifications. Please try again.",
      });
    } finally {
      setLoading(false);
      setRequestingPermission(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  const disableNotifications = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const endpoint = getUpdateEndpoint(userType);
      const deviceId = deviceIdRef.current;
      
      // Remove only this device's token (not all devices)
      const response = await api.put(endpoint, {
        fcmTokenData: {
          deviceId,
          action: 'remove' // Remove this specific device
        }
      });

      if (response.data) {
        // Get the token from response (will be null if device was removed or no other devices)
        const responseToken = response.data?.student?.fcmToken || 
                             response.data?.faculty?.fcmToken || 
                             response.data?.hod?.fcmToken || 
                             null;
        
        const hasToken = responseToken !== null && responseToken.trim() !== "";
        
        setFcmToken(responseToken);
        setIsEnabled(hasToken);
        setWaitingForData(false);
        previousTokenRef.current = responseToken;
        dataLoadedRef.current = true;
        
        if (hasToken) {
          setMessage({
            type: "success",
            text: "Notifications disabled for this device. Other devices are still active.",
          });
        } else {
          setMessage({
            type: "success",
            text: "Push notifications disabled successfully.",
          });
        }
        onNotificationChange?.();
      }
    } catch (error) {
      console.error("Error disabling notifications:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to disable notifications. Please try again.",
      });
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  const getUpdateEndpoint = (type) => {
    switch (type) {
      case "student":
        return "/student/profile/update";
      case "faculty":
        return "/faculty/settings";
      case "hod":
        return "/hod/settings";
      default:
        return "/student/profile/update";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="w-8 h-8 text-green-600" />
          ) : (
            <BellOff className="w-8 h-8 text-gray-400" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-600 mt-1">
              Receive instant notifications from College360x
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleNotifications}
          disabled={loading || requestingPermission}
          className={`
            relative inline-flex h-11 w-20 items-center rounded-full transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isEnabled
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 hover:bg-gray-400"
            }
            ${loading || requestingPermission ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <span
            className={`
              inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
              ${isEnabled ? "translate-x-10" : "translate-x-1"}
            `}
          >
            {(loading || requestingPermission) && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              </div>
            )}
          </span>
        </button>
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`
            flex items-center gap-2 p-4 rounded-lg border-l-4
            ${message.type === "success"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-red-50 border-red-500 text-red-700"
            }
          `}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Status Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${isEnabled
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        {isEnabled && fcmToken && (
          <div className="mt-2">
            <p className="text-xs text-gray-600">
              Token: <span className="font-mono text-xs">{fcmToken.substring(0, 20)}...</span>
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          {isEnabled
            ? "✓ You'll receive push notifications for announcements, approvals, and important updates."
            : "Enable push notifications to stay updated with announcements, approvals, and important updates from College360x."}
        </p>
        {!isEnabled && (
          <p className="text-xs text-gray-500 mt-2">
            Note: You'll be asked to allow notifications in your browser when enabling.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;

