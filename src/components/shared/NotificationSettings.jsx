import React, { useState, useEffect, useRef } from "react";
import { Bell, BellOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { requestPermission, setupForegroundMessageHandler } from "../../../firebase.js";
import api from "../../services/api";

/**
 * NotificationSettings Component
 * Allows users to enable/disable push notifications
 * @param {string} userType - Type of user: 'student', 'faculty', or 'hod'
 * @param {string} userId - User ID (studentid, facultyid, or hodId)
 * @param {string} currentToken - Current FCM token if any (undefined means not loaded yet, null means no token)
 * @param {boolean} isLoading - Whether Redux data is still loading
 */
const NotificationSettings = ({ userType, userId, currentToken: initialToken, isLoading = false }) => {
  // Use ref to track if we've initialized from props to avoid resetting on reload
  const hasInitializedRef = useRef(false);
  const previousTokenRef = useRef(initialToken);
  const dataLoadedRef = useRef(false);
  
  // Initialize state - be conservative: only set enabled if we have a token
  // If token is undefined (not loaded), keep current state or default to disabled
  const getInitialState = () => {
    // If we have a token, use it
    if (initialToken && initialToken.trim() !== "") {
      return {
        token: initialToken,
        enabled: true
      };
    }
    // If token is explicitly null (loaded and no token), disabled
    // If token is undefined (not loaded yet), we'll wait for it
    return {
      token: null,
      enabled: false
    };
  };
  
  const initialState = getInitialState();
  const [fcmToken, setFcmToken] = useState(initialState.token);
  const [isEnabled, setIsEnabled] = useState(initialState.enabled);
  const [loading, setLoading] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Track when data has finished loading
  useEffect(() => {
    if (!isLoading && initialToken !== undefined) {
      dataLoadedRef.current = true;
    }
  }, [isLoading, initialToken]);

  // Sync with prop changes (when Redux data loads)
  // Only update when we receive a definitive token value from Redux
  useEffect(() => {
    // On first mount, initialize the ref
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousTokenRef.current = initialToken;
      // If we have a token on initial mount, use it
      if (initialToken && initialToken.trim() !== "") {
        const hasToken = !!initialToken && initialToken.trim() !== "";
        setFcmToken(initialToken);
        setIsEnabled(hasToken);
        dataLoadedRef.current = true;
      }
      return;
    }

    // After initial mount, only update if:
    // 1. Data has loaded (isLoading is false) AND we have a definitive value (not undefined)
    // 2. OR the token value actually changed from a known state
    const tokenChanged = previousTokenRef.current !== initialToken;
    const hasDefinitiveValue = initialToken !== undefined || dataLoadedRef.current;
    
    if (tokenChanged && hasDefinitiveValue) {
      const hasToken = !!initialToken && initialToken.trim() !== "";
      const previousHasToken = !!previousTokenRef.current && previousTokenRef.current.trim() !== "";
      
      // Only update if:
      // 1. We're going from undefined/unknown to a known state (Redux loaded)
      // 2. We're going from no token to having a token (Redux loaded with token)
      // 3. We're going from having a token to no token (user disabled or token removed)
      // 4. The token value actually changed
      const shouldUpdate = 
        (previousTokenRef.current === undefined && initialToken !== undefined) || // Redux just loaded
        (hasToken !== previousHasToken) || // Enabled state changed
        (initialToken && initialToken !== previousTokenRef.current); // Token value changed
      
      if (shouldUpdate) {
        console.log("🔔 [NotificationSettings] Token prop changed:", { 
          hasToken, 
          tokenLength: initialToken?.length || 0,
          previousToken: previousTokenRef.current ? `${previousTokenRef.current.substring(0, 20)}...` : previousTokenRef.current,
          newToken: initialToken ? `${initialToken.substring(0, 20)}...` : initialToken,
          isLoading,
          dataLoaded: dataLoadedRef.current
        });
        
        setFcmToken(hasToken ? initialToken : null);
        setIsEnabled(hasToken);
        previousTokenRef.current = initialToken;
        if (!isLoading) {
          dataLoadedRef.current = true;
        }
      }
    }
  }, [initialToken, isLoading]);

  // Keep enabled state in sync with token
  useEffect(() => {
    setIsEnabled(!!fcmToken && fcmToken.trim() !== "");
  }, [fcmToken]);

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

      // Save token to backend
      setLoading(true);
      const endpoint = getUpdateEndpoint(userType);
      const response = await api.put(endpoint, { fcmToken: token });

      if (response.data) {
        setFcmToken(token);
        setIsEnabled(true);
        setMessage({
          type: "success",
          text: "Push notifications enabled successfully! You'll receive notifications from College360x.",
        });
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
      const response = await api.put(endpoint, { fcmToken: null });

      if (response.data) {
        setFcmToken(null);
        setIsEnabled(false);
        setMessage({
          type: "success",
          text: "Push notifications disabled successfully.",
        });
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

