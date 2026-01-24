import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/shared/dashboardSlice";
import activitiesReducer from "../features/shared/activitiesSlice";
import StudentDashboardReducer from "../features/student/studentDashSlice";
import facultyDashboardReducer from "../features/faculty/facultyDashSlice";
import studentReducer from "../features/faculty/facultySlice";
import academicsReducer from "../features/shared/academicsSlice";
import resultsReducer from "../features/shared/resultsSlice";
import studentLeaveReducer from "../features/student/studentLeaveSlice";
import facultyLeaveReducer from "../features/faculty/facultyLeaveReqSlice";
import clubsReducer from "../features/shared/clubsSlice";
import realtimeReducer from "../features/shared/realtimeSlice";
import adminDashboardReducer from "../features/Admin/adminDashSlice";
import adminAnnouncementsReducer from "../features/Admin/adminAnnouncementsSlice";
import { socketMiddleware } from "../middleware/socketMiddleware";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    activities: activitiesReducer,
    studentDashboard: StudentDashboardReducer,
    facultyDashboard: facultyDashboardReducer,
    students: studentReducer,
    academics: academicsReducer,
    results: resultsReducer,
    studentLeave: studentLeaveReducer,
    facultyLeave: facultyLeaveReducer,
    clubs: clubsReducer,
    realtime: realtimeReducer,
    adminDashboard: adminDashboardReducer,
    adminAnnouncements: adminAnnouncementsReducer,
    // you can add more slices here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check in development to improve performance
      // The state contains Date objects and other non-serializable data which is fine
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          // Socket events may contain non-serializable data
          'realtime/updateStudentCounts',
          'realtime/updateStudentApprovals',
          'realtime/updateStudentAnnouncements',
          'studentDashboard/updateCountsRealtime',
          'studentDashboard/updateApprovalsRealtime',
          'studentDashboard/updateAnnouncementsRealtime',
          'adminAnnouncements/updateAnnouncementsRealtime',
          'adminDashboard/updateStatsRealtime',
        ],
        // Ignore these paths in the state (Date objects, etc.)
        ignoredActionPaths: [
          'payload.reviewedOn',
          'payload.requestedOn',
          'payload.timestamp',
          'payload.date',
          'meta.arg',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'studentDashboard.lastFetched',
          'studentDashboard.achievementsLastFetched',
          'studentDashboard.approvalsLastFetched',
          'realtime',
        ],
        // Increase warning threshold to reduce noise
        warnAfter: 128,
      },
    }).concat(socketMiddleware),
});
