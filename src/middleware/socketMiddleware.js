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
import {
  addDoubtFromSocket,
  addReplyFromSocket,
  removeDoubtFromSocket,
  updateDoubtFromSocket,
} from '../features/student/doubtsSlice';

/**
 * Socket middleware — registers all event listeners ONCE at store creation.
 * SocketProvider owns the connection. This middleware owns event → Redux dispatch.
 * Listeners persist across disconnect/reconnect via socketService.listeners registry.
 */
export const socketMiddleware = (store) => {
  // Register all listeners once, immediately. They are stored in socketService.listeners
  // and auto-attached to the socket whenever it (re)connects.
  registerAllListeners(store);

  // Pass-through middleware — no per-action logic needed
  return (next) => (action) => next(action);
};

function registerAllListeners(store) {
  const d = store.dispatch;

  // ─── Connection status (local events, sole handler) ───
  socketService.on('socket:connected', () => d(setConnectionStatus({ isConnected: true })));
  socketService.on('socket:disconnected', (reason) => d(setConnectionStatus({ isConnected: false, error: reason })));
  socketService.on('socket:error', (error) => d(setConnectionStatus({ isConnected: false, error: error?.message })));
  socketService.on('socket:reconnected', () => d(setConnectionStatus({ isConnected: true })));
  socketService.on('socket:reconnect_failed', () => d(setConnectionStatus({ isConnected: false, error: 'Reconnection failed' })));

  // ─── Student dashboard ─────────────────────────────────
  socketService.on('dashboard:counts', (data) => {
    if (data && Object.keys(data).length > 0) d(updateCountsRealtime(data));
  });
  socketService.on('dashboard:approvals', (data) => {
    if (!data) return;
    if (data.counts && !data.pendingApprovals && !data.approvedApprovals && !data.rejectedApprovals) {
      d(updateCountsRealtime(data.counts));
    } else {
      d(updateApprovalsRealtime(data));
    }
  });
  socketService.on('dashboard:announcements', (data) => {
    if (!data) return;
    d(updateAnnouncementsRealtime(data));
    d(updateFacultyAnnouncementsRealtime(data));
    d(updateHODAnnouncementsRealtime(data));
  });

  // ─── Faculty dashboard ─────────────────────────────────
  socketService.on('dashboard:stats', (data) => {
    if (data && Object.keys(data).length > 0) d(updateStatsRealtime(data));
  });
  socketService.on('dashboard:pendingApprovals', (data) => {
    if (data !== undefined) d(updatePendingApprovalsRealtime(data));
  });
  socketService.on('dashboard:activities', (data) => { if (data) d(updateActivitiesRealtime(data)); });
  socketService.on('dashboard:metrics', (data) => { if (data) d(updateMetricsRealtime(data)); });

  // ─── HOD dashboard ─────────────────────────────────────
  socketService.on('dashboard:hod:stats', (data) => {
    if (data && Object.keys(data).length > 0) d(updateHODStatsRealtime(data));
  });
  socketService.on('dashboard:hod:announcements', (data) => { if (data) d(updateHODAnnouncementsRealtime(data)); });

  // ─── Operation events ──────────────────────────────────
  socketService.on('attendance:students', () => d(updateCountsRealtime({})));
  socketService.on('faculty_assigned', () => d(updateCountsRealtime({})));
  socketService.on('new_submission', () => d(updatePendingApprovalsRealtime(null)));
  socketService.on('club_enrollment', () => d(updateCountsRealtime({})));
  socketService.on('leave_request', () => d(updateCountsRealtime({})));
  socketService.on('achievement_verified', () => { d(updateApprovalsRealtime({})); d(updateCountsRealtime({})); });
  socketService.on('club_head_assigned', () => d(updateCountsRealtime({})));
  socketService.on('marks_updated', () => d(updateCountsRealtime({})));

  // ─── Notifications ─────────────────────────────────────
  socketService.on('notification', (n) => {
    d(addNotification({ ...n, id: n.id || Date.now().toString(), timestamp: n.timestamp || Date.now() }));
  });

  // ─── Doubt feature ─────────────────────────────────────
  socketService.on('doubt:new', (data) => { if (data) d(addDoubtFromSocket(data)); });
  socketService.on('doubt:reply', (data) => { if (data) d(addReplyFromSocket(data)); });
  socketService.on('doubt:delete', (data) => { if (data) d(removeDoubtFromSocket(data)); });
  socketService.on('doubt:update', (data) => { if (data) d(updateDoubtFromSocket(data)); });

  // ─── Generic realtime handler ──────────────────────────
  socketService.on('realtime:update', (data) => {
    if (!data) return;
    const { type, payload } = data;
    const map = {
      'student:counts': updateCountsRealtime,
      'student:approvals': updateApprovalsRealtime,
      'faculty:stats': updateStatsRealtime,
      'faculty:pendingApprovals': updatePendingApprovalsRealtime,
      'faculty:activities': updateActivitiesRealtime,
      'faculty:metrics': updateMetricsRealtime,
      'hod:stats': updateHODStatsRealtime,
      'hod:announcements': updateHODAnnouncementsRealtime,
    };
    if (map[type]) d(map[type](payload));
  });
}
