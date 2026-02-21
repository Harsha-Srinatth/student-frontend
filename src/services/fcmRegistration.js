/**
 * Register FCM token with backend when user is logged in and permission is already granted.
 * Call after login and when MainDashboard loads so the current device's token is stored
 * (fixes "new device token not stored" when user logs in on another device).
 */
import Cookies from "js-cookie";
import {
  getTokenIfPermissionGranted,
  getDeviceId,
  getDeviceName,
} from "../../firebase.js";
import api from "./api";

function getUpdateEndpoint(userRole) {
  switch (userRole) {
    case "student":
      return "/student/profile/update";
    case "faculty":
      return "/faculty/settings";
    case "hod":
      return "/hod/settings";
    default:
      return null;
  }
}

/**
 * If the user is logged in and notification permission is already granted,
 * get the current FCM token and send it to the backend (add/update this device).
 * Safe to call on every login and MainDashboard mount; no permission prompt.
 */
export async function registerFCMTokenIfGranted() {
  const token = Cookies.get("token");
  const userRole = Cookies.get("userRole");
  const userId = Cookies.get("userId");
  if (!token || !userRole || !userId) return;

  const endpoint = getUpdateEndpoint(userRole);
  if (!endpoint) return;

  if (Notification.permission !== "granted") return;

  try {
    const fcmToken = await getTokenIfPermissionGranted();
    if (!fcmToken) return;

    const deviceId = getDeviceId();
    const deviceName = getDeviceName();

    await api.put(endpoint, {
      fcmTokenData: {
        token: fcmToken,
        deviceId,
        deviceName,
      },
    });
    if (import.meta.env?.DEV) {
      console.log("🔔 [FCM] Token registered for this device", {
        userRole,
        deviceId: deviceId?.substring(0, 12),
      });
    }
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn("🔔 [FCM] registerFCMTokenIfGranted failed:", err?.message);
    }
  }
}
