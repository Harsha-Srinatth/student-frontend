import socketService from '../services/socketService';
import {
  setConnectionStatus,
  updateStudentCounts,
  updateStudentApprovals,
  updateStudentAnnouncements,
  updateStudentAttendance,
  updateFacultyStats,
  updateFacultyPendingApprovals,
  updateFacultyActivities,
  updateFacultyMetrics,
  addNotification,
  updateDashboard,
} from '../features/shared/realtimeSlice';
import {
  updateCountsRealtime,
  updateApprovalsRealtime,
  updateAnnouncementsRealtime,
} from '../features/student/studentDashSlice';
import {
  updateStatsRealtime,
  updatePendingApprovalsRealtime,
  updateActivitiesRealtime,
  updateMetricsRealtime,
} from '../features/faculty/facultyDashSlice';
import {
  updateAnnouncementsRealtime as updateAdminAnnouncementsRealtime,
} from '../features/Admin/adminAnnouncementsSlice';

/**
 * Redux middleware to handle Socket.IO events
 * Automatically dispatches Redux actions when socket events are received
 */
export const socketMiddleware = (store) => {
  let socketInitialized = false;

  return (next) => (action) => {
    // Initialize socket on first action
    if (!socketInitialized) {
      initializeSocket(store);
      socketInitialized = true;
    }

    return next(action);
  };
};

/**
 * Initialize socket connection and set up event listeners
 */
const initializeSocket = (store) => {
  const socket = socketService.connect();
  
  if (!socket) {
    return;
  }

  // Connection status events
  socketService.on('socket:connected', () => {
    store.dispatch(setConnectionStatus({ isConnected: true }));
  });

  socketService.on('socket:disconnected', (reason) => {
    store.dispatch(setConnectionStatus({ isConnected: false, error: reason }));
  });

  socketService.on('socket:error', (error) => {
    store.dispatch(setConnectionStatus({ isConnected: false, error: error.message }));
  });

  socketService.on('socket:reconnected', () => {
    store.dispatch(setConnectionStatus({ isConnected: true }));
  });

  socketService.on('socket:reconnect_failed', () => {
    store.dispatch(setConnectionStatus({ isConnected: false, error: 'Reconnection failed' }));
  });

  // Student dashboard events
  socketService.on('dashboard:counts', (data) => {
    // Only update if data exists and is not empty
    if (data && Object.keys(data).length > 0) {
      console.log('📊 Received dashboard:counts event:', data);
      store.dispatch(updateStudentCounts(data));
      store.dispatch(updateCountsRealtime(data));
    } else {
      console.warn('⚠️ Received empty or invalid dashboard:counts data:', data);
    }
  });

  socketService.on('dashboard:approvals', (data) => {
    // Only update if data exists
    if (data) {
      // If only counts are provided, just update counts
      if (data.counts && !data.pendingApprovals && !data.approvedApprovals && !data.rejectedApprovals) {
        store.dispatch(updateStudentCounts(data.counts));
        store.dispatch(updateCountsRealtime(data.counts));
      } else {
        // Full approval update
        store.dispatch(updateStudentApprovals(data));
        store.dispatch(updateApprovalsRealtime(data));
      }
    }
  });

  socketService.on('dashboard:announcements', (data) => {
    // Update both realtime slice and student dashboard slice
    store.dispatch(updateStudentAnnouncements(data));
    store.dispatch(updateAnnouncementsRealtime(data));
    // Also update admin announcements
    store.dispatch(updateAdminAnnouncementsRealtime(data));
  });

  socketService.on('dashboard:update', (data) => {
    store.dispatch(updateDashboard(data));
    // Also update specific slices based on type
    if (data.type === 'student') {
      if (data.data.counts) {
        store.dispatch(updateCountsRealtime(data.data.counts));
      }
      if (data.data.pendingApprovals || data.data.rejectedApprovals || data.data.approvedApprovals) {
        store.dispatch(updateApprovalsRealtime(data.data));
      }
    }
  });

  // Faculty dashboard events
  socketService.on('dashboard:stats', (data) => {
    // Only update if data exists and is not empty
    if (data && Object.keys(data).length > 0) {
      console.log('📊 Received dashboard:stats event for faculty:', data);
      store.dispatch(updateFacultyStats(data));
      store.dispatch(updateStatsRealtime(data));
    } else {
      console.warn('⚠️ Received empty or invalid dashboard:stats data:', data);
    }
  });

  socketService.on('dashboard:pendingApprovals', (data) => {
    // Update both realtime slice and faculty dashboard slice
    store.dispatch(updateFacultyPendingApprovals(data));
    store.dispatch(updatePendingApprovalsRealtime(data));
  });

  socketService.on('dashboard:activities', (data) => {
    // Update both realtime slice and faculty dashboard slice
    store.dispatch(updateFacultyActivities(data));
    store.dispatch(updateActivitiesRealtime(data));
  });

  socketService.on('dashboard:metrics', (data) => {
    // Update both realtime slice and faculty dashboard slice
    store.dispatch(updateFacultyMetrics(data));
    store.dispatch(updateMetricsRealtime(data));
  });

  // Role-specific events
  socketService.on('dashboard:update:student', (data) => {
    store.dispatch(updateDashboard({ type: 'student', data }));
  });

  socketService.on('dashboard:update:faculty', (data) => {
    store.dispatch(updateDashboard({ type: 'faculty', data }));
  });

  // Attendance events
  socketService.on('attendance:students', (data) => {
    if (data) {
      console.log('📊 Received attendance:students event:', data);
      store.dispatch(updateStudentAttendance(data));
    }
  });

  // Notification events
  socketService.on('notification', (notification) => {
    store.dispatch(addNotification({
      ...notification,
      id: notification.id || Date.now().toString(),
      timestamp: notification.timestamp || Date.now(),
    }));
  });

  // Generic real-time update handler
  socketService.on('realtime:update', (data) => {
    const { type, payload } = data;
    
    switch (type) {
      case 'student:counts':
        store.dispatch(updateStudentCounts(payload));
        store.dispatch(updateCountsRealtime(payload));
        break;
      case 'student:approvals':
        store.dispatch(updateStudentApprovals(payload));
        store.dispatch(updateApprovalsRealtime(payload));
        break;
      case 'faculty:stats':
        store.dispatch(updateFacultyStats(payload));
        store.dispatch(updateStatsRealtime(payload));
        break;
      case 'faculty:pendingApprovals':
        store.dispatch(updateFacultyPendingApprovals(payload));
        store.dispatch(updatePendingApprovalsRealtime(payload));
        break;
      case 'faculty:activities':
        store.dispatch(updateFacultyActivities(payload));
        store.dispatch(updateActivitiesRealtime(payload));
        break;
      case 'faculty:metrics':
        store.dispatch(updateFacultyMetrics(payload));
        store.dispatch(updateMetricsRealtime(payload));
        break;
      default:
        console.log('Unhandled real-time update:', type, payload);
    }
  });
};

