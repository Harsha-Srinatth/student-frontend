import socketService from '../services/socketService';
import {
  setConnectionStatus,
  addNotification,
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
  updateAnnouncementsRealtime as updateFacultyAnnouncementsRealtime,
} from '../features/faculty/facultyDashSlice';
import {
  updateStatsRealtime as updateHODStatsRealtime,
} from '../features/HOD/hodDashSlice';
import {
  updateAnnouncementsRealtime as updateHODAnnouncementsRealtime,
} from '../features/HOD/hodAnnouncementsSlice';

/**
 * Redux middleware to handle Socket.IO events
 * Automatically dispatches Redux actions when socket events are received
 */
export const socketMiddleware = (store) => {
  let listenersSetup = false;

  return (next) => (action) => {
    // Set up socket listeners only once, on first action
    // SocketProvider handles the connection, we just set up the event listeners
    // Don't try to connect here - let SocketProvider handle it
    if (!listenersSetup) {
      // Only set up listeners - don't connect (SocketProvider does that)
      // Wait for socket to be connected before setting up listeners
      // This prevents duplicate connections
      if (socketService.getIsConnected()) {
        initializeSocket(store);
        listenersSetup = true;
      } else {
        // If not connected yet, wait for connection event
        // Set up a one-time listener for when socket connects
        const checkConnection = () => {
          if (socketService.getIsConnected() && !listenersSetup) {
            initializeSocket(store);
            listenersSetup = true;
            socketService.off('socket:connected', checkConnection);
          }
        };
        socketService.on('socket:connected', checkConnection);
      }
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

  // Student dashboard events - Update store directly (source of truth)
  socketService.on('dashboard:counts', (data) => {
    if (data && Object.keys(data).length > 0) {
      console.log('📊 Received dashboard:counts event:', data);
      // Update student dashboard slice directly (source of truth)
      store.dispatch(updateCountsRealtime(data));
    }
  });

  socketService.on('dashboard:approvals', (data) => {
    if (data) {
      // If only counts are provided, just update counts
      if (data.counts && !data.pendingApprovals && !data.approvedApprovals && !data.rejectedApprovals) {
        store.dispatch(updateCountsRealtime(data.counts));
      } else {
        // Full approval update - update store directly
        store.dispatch(updateApprovalsRealtime(data));
      }
    }
  });

  socketService.on('dashboard:announcements', (data) => {
    if (data) {
      // Update announcements for all roles that receive them
      store.dispatch(updateAnnouncementsRealtime(data));
      store.dispatch(updateFacultyAnnouncementsRealtime(data));
      store.dispatch(updateHODAnnouncementsRealtime(data));
    }
  });

  // Faculty dashboard events - Update store directly (source of truth)
  socketService.on('dashboard:stats', (data) => {
    if (data && Object.keys(data).length > 0) {
      console.log('📊 Received dashboard:stats event for faculty:', data);
      // Update faculty dashboard slice directly (source of truth)
      store.dispatch(updateStatsRealtime(data));
    }
  });

  socketService.on('dashboard:pendingApprovals', (data) => {
    if (data !== undefined) {
      // Update store directly
      store.dispatch(updatePendingApprovalsRealtime(data));
    }
  });

  socketService.on('dashboard:activities', (data) => {
    if (data) {
      // Update store directly
      store.dispatch(updateActivitiesRealtime(data));
    }
  });

  socketService.on('dashboard:metrics', (data) => {
    if (data) {
      // Update store directly
      store.dispatch(updateMetricsRealtime(data));
    }
  });

  // HOD dashboard events - Update store directly (source of truth)
  socketService.on('dashboard:hod:stats', (data) => {
    if (data && Object.keys(data).length > 0) {
      // Update HOD dashboard slice directly (source of truth)
      store.dispatch(updateHODStatsRealtime(data));
    }
  });

  socketService.on('dashboard:hod:announcements', (data) => {
    if (data) {
      // Update store directly
      store.dispatch(updateHODAnnouncementsRealtime(data));
    }
  });

  // Attendance events - Update store directly
  socketService.on('attendance:students', (data) => {
    if (data) {
      console.log('📊 Received attendance:students event:', data);
      // Trigger dashboard refresh to show updated attendance
      store.dispatch(updateCountsRealtime({}));
    }
  });

  // Operation-specific events - Update stores and show notifications
  socketService.on('faculty_assigned', (data) => {
    if (data) {
      console.log('📊 Received faculty_assigned event:', data);
      // Update student dashboard to reflect new faculty assignment
      store.dispatch(updateCountsRealtime({}));
    }
  });

  socketService.on('new_submission', (data) => {
    if (data) {
      console.log('📊 Received new_submission event:', data);
      // Faculty received new submission - refresh pending approvals
      store.dispatch(updatePendingApprovalsRealtime(null)); // Signal to refresh
    }
  });

  socketService.on('club_enrollment', (data) => {
    if (data) {
      console.log('📊 Received club_enrollment event:', data);
      // Update student dashboard
      store.dispatch(updateCountsRealtime({}));
    }
  });

  socketService.on('leave_request', (data) => {
    if (data) {
      console.log('📊 Received leave_request event:', data);
      // Faculty received new leave request - refresh if needed
      // Student's leave request was processed - update dashboard
      store.dispatch(updateCountsRealtime({}));
    }
  });

  socketService.on('achievement_verified', (data) => {
    if (data) {
      console.log('📊 Received achievement_verified event:', data);
      // Student's achievement was verified - update dashboard
      store.dispatch(updateApprovalsRealtime({}));
      store.dispatch(updateCountsRealtime({}));
    }
  });

  socketService.on('club_assigned', (data) => {
    if (data) {
      console.log('📊 Received club_assigned event:', data);
      // Faculty/Student assigned to club - update if needed
    }
  });

  socketService.on('club_head_assigned', (data) => {
    if (data) {
      console.log('📊 Received club_head_assigned event:', data);
      // Student assigned as club head - update dashboard
      store.dispatch(updateCountsRealtime({}));
    }
  });

  socketService.on('marks_updated', (data) => {
    if (data) {
      console.log('📊 Received marks_updated event:', data);
      // Student's marks were updated - refresh dashboard
      store.dispatch(updateCountsRealtime({}));
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

  // Generic real-time update handler - Update stores directly
  socketService.on('realtime:update', (data) => {
    const { type, payload } = data;
    
    switch (type) {
      case 'student:counts':
        store.dispatch(updateCountsRealtime(payload));
        break;
      case 'student:approvals':
        store.dispatch(updateApprovalsRealtime(payload));
        break;
      case 'faculty:stats':
        store.dispatch(updateStatsRealtime(payload));
        break;
      case 'faculty:pendingApprovals':
        store.dispatch(updatePendingApprovalsRealtime(payload));
        break;
      case 'faculty:activities':
        store.dispatch(updateActivitiesRealtime(payload));
        break;
      case 'faculty:metrics':
        store.dispatch(updateMetricsRealtime(payload));
        break;
      case 'hod:stats':
        store.dispatch(updateHODStatsRealtime(payload));
        break;
      case 'hod:announcements':
        store.dispatch(updateHODAnnouncementsRealtime(payload));
        break;
      default:
        console.log('Unhandled real-time update:', type, payload);
    }
  });
};

