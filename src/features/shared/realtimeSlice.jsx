import { createSlice } from '@reduxjs/toolkit';

/**
 * Real-time data slice
 * Stores all live values (counts, status, notifications, etc.) from Socket.IO
 */
const realtimeSlice = createSlice({
  name: 'realtime',
  initialState: {
    // Connection status
    isConnected: false,
    connectionError: null,
    reconnectAttempts: 0,
    
    // Student dashboard real-time data
    student: {
      counts: {
        certificationsCount: null,
        workshopsCount: null,
        clubsJoinedCount: null,
        pendingApprovalsCount: null,
        hackathonsCount: null,
        projectsCount: null,
        approvedCount: null,
        rejectedCount: null,
        pendingCount: null,
      },
      pendingApprovals: null,
      rejectedApprovals: null,
      approvedApprovals: null,
      announcements: null,
      attendance: null, // Store latest attendance update
    },
    
    // Faculty dashboard real-time data
    faculty: {
      stats: {
        totalStudents: null,
        pendingApprovals: null,
        approvedCertifications: null,
        approvedWorkshops: null,
        approvedClubs: null,
        totalApproved: null,
        totalApprovals: null,
        approvalRate: null,
      },
      pendingApprovals: null,
      activities: null,
      metrics: null,
    },
    
    // Shared real-time data
    shared: {
      notifications: [],
      activities: null,
      announcements: null,
    },
    
    // Last update timestamps
    lastUpdated: {
      student: null,
      faculty: null,
      shared: null,
    },
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
    
    // Student dashboard updates
    updateStudentCounts: (state, action) => {
      if (action.payload && Object.keys(action.payload).length > 0) {
        state.student.counts = {
          ...state.student.counts,
          ...action.payload,
        };
        state.lastUpdated.student = Date.now();
      }
    },
    
    updateStudentApprovals: (state, action) => {
      if (!action.payload) return;
      
      // Only update counts if provided (optimization - don't send full arrays)
      if (action.payload.counts) {
        state.student.counts = {
          ...state.student.counts,
          ...action.payload.counts,
        };
      }
      
      // Only update arrays if explicitly provided (not null/undefined)
      if (action.payload.pendingApprovals !== undefined && action.payload.pendingApprovals !== null) {
        state.student.pendingApprovals = action.payload.pendingApprovals;
      }
      if (action.payload.rejectedApprovals !== undefined && action.payload.rejectedApprovals !== null) {
        state.student.rejectedApprovals = action.payload.rejectedApprovals;
      }
      if (action.payload.approvedApprovals !== undefined && action.payload.approvedApprovals !== null) {
        state.student.approvedApprovals = action.payload.approvedApprovals;
      }
      state.lastUpdated.student = Date.now();
    },
    
    updateStudentAnnouncements: (state, action) => {
      state.student.announcements = action.payload;
      state.lastUpdated.student = Date.now();
    },
    
    updateStudentAttendance: (state, action) => {
      state.student.attendance = action.payload;
      state.lastUpdated.student = Date.now();
    },
    
    // Faculty dashboard updates
    updateFacultyStats: (state, action) => {
      state.faculty.stats = {
        ...state.faculty.stats,
        ...action.payload,
      };
      state.lastUpdated.faculty = Date.now();
    },
    
    updateFacultyPendingApprovals: (state, action) => {
      state.faculty.pendingApprovals = action.payload;
      state.lastUpdated.faculty = Date.now();
    },
    
    updateFacultyActivities: (state, action) => {
      state.faculty.activities = action.payload;
      state.lastUpdated.faculty = Date.now();
    },
    
    updateFacultyMetrics: (state, action) => {
      state.faculty.metrics = action.payload;
      state.lastUpdated.faculty = Date.now();
    },
    
    // Shared updates
    addNotification: (state, action) => {
      state.shared.notifications.unshift(action.payload);
      // Keep only last 50 notifications
      if (state.shared.notifications.length > 50) {
        state.shared.notifications = state.shared.notifications.slice(0, 50);
      }
      state.lastUpdated.shared = Date.now();
    },
    
    removeNotification: (state, action) => {
      state.shared.notifications = state.shared.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.shared.notifications = [];
    },
    
    updateSharedActivities: (state, action) => {
      state.shared.activities = action.payload;
      state.lastUpdated.shared = Date.now();
    },
    
    updateSharedAnnouncements: (state, action) => {
      state.shared.announcements = action.payload;
      state.lastUpdated.shared = Date.now();
    },
    
    // Generic update handler for dashboard updates
    updateDashboard: (state, action) => {
      const { type, data } = action.payload;
      
      if (type === 'student') {
        if (data.counts) {
          state.student.counts = { ...state.student.counts, ...data.counts };
        }
        if (data.pendingApprovals !== undefined) {
          state.student.pendingApprovals = data.pendingApprovals;
        }
        if (data.rejectedApprovals !== undefined) {
          state.student.rejectedApprovals = data.rejectedApprovals;
        }
        if (data.approvedApprovals !== undefined) {
          state.student.approvedApprovals = data.approvedApprovals;
        }
        if (data.announcements !== undefined) {
          state.student.announcements = data.announcements;
        }
        state.lastUpdated.student = Date.now();
      } else if (type === 'faculty') {
        if (data.stats) {
          state.faculty.stats = { ...state.faculty.stats, ...data.stats };
        }
        if (data.pendingApprovals !== undefined) {
          state.faculty.pendingApprovals = data.pendingApprovals;
        }
        if (data.activities !== undefined) {
          state.faculty.activities = data.activities;
        }
        if (data.metrics !== undefined) {
          state.faculty.metrics = data.metrics;
        }
        state.lastUpdated.faculty = Date.now();
      }
    },
    
    // Clear all real-time data
    clearRealtimeData: (state) => {
      state.student = {
        counts: {
          certificationsCount: null,
          workshopsCount: null,
          clubsJoinedCount: null,
          pendingApprovalsCount: null,
          hackathonsCount: null,
          projectsCount: null,
          approvedCount: null,
          rejectedCount: null,
          pendingCount: null,
        },
        pendingApprovals: null,
        rejectedApprovals: null,
        approvedApprovals: null,
        announcements: null,
        attendance: null,
      };
      state.faculty = {
        stats: {
          totalStudents: null,
          pendingApprovals: null,
          approvedCertifications: null,
          approvedWorkshops: null,
          approvedClubs: null,
          totalApproved: null,
          totalApprovals: null,
          approvalRate: null,
        },
        pendingApprovals: null,
        activities: null,
        metrics: null,
      };
      state.shared = {
        notifications: [],
        activities: null,
        announcements: null,
      };
      state.lastUpdated = {
        student: null,
        faculty: null,
        shared: null,
      };
    },
  },
});

export const {
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
  removeNotification,
  clearNotifications,
  updateSharedActivities,
  updateSharedAnnouncements,
  updateDashboard,
  clearRealtimeData,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;

