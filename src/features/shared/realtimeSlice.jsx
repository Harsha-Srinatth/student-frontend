import { createSlice } from '@reduxjs/toolkit';

/**
 * Real-time Connection & Notifications Slice
 * Stores only connection status and notifications
 * Individual slices (studentDashSlice, facultyDashSlice, hodDashSlice) are the source of truth for data
 */
const realtimeSlice = createSlice({
  name: 'realtime',
  initialState: {
    // Connection status
    isConnected: false,
    connectionError: null,
    reconnectAttempts: 0,
    
    // Notifications only (shared across all portals)
    notifications: [],
  },
  reducers: {
    // Connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.connectionError = action.payload.error || null;
      if (action.payload.reconnectAttempts !== undefined) {
        state.reconnectAttempts = action.payload.reconnectAttempts;
      }
    },
    
    // Notifications
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Clear all real-time data (on logout)
    clearRealtimeData: (state) => {
      state.notifications = [];
      state.isConnected = false;
      state.connectionError = null;
      state.reconnectAttempts = 0;
    },
  },
});

export const {
  setConnectionStatus,
  addNotification,
  removeNotification,
  clearNotifications,
  clearRealtimeData,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;

