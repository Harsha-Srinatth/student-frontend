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
import hodDashboardReducer from "../features/HOD/hodDashSlice";
import hodAnnouncementsReducer from "../features/HOD/hodAnnouncementsSlice";
import hodAssignmentReducer from "../features/HOD/hodAssignmentSlice";
import doubtsReducer from "../features/student/doubtsSlice";
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
    hodDashboard: hodDashboardReducer,
    hodAnnouncements: hodAnnouncementsReducer,
    hodAssignment: hodAssignmentReducer,
    doubts: doubtsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'studentDashboard/updateCountsRealtime',
          'studentDashboard/updateApprovalsRealtime',
          'studentDashboard/updateAnnouncementsRealtime',
          'facultyDashboard/updateStatsRealtime',
          'facultyDashboard/updateAnnouncementsRealtime',
          'hodAnnouncements/updateAnnouncementsRealtime',
          'hodDashboard/updateStatsRealtime',
          'realtime/setConnectionStatus',
          'realtime/addNotification',
          'doubts/addDoubtFromSocket',
          'doubts/addReplyFromSocket',
          'doubts/removeDoubtFromSocket',
          'doubts/updateDoubtFromSocket',
        ],
        ignoredActionPaths: [
          'payload.reviewedOn',
          'payload.requestedOn',
          'payload.timestamp',
          'payload.date',
          'payload.createdAt',
          'payload.solvedAt',
          'meta.arg',
        ],
        ignoredPaths: [
          'studentDashboard.lastFetched',
          'studentDashboard.achievementsLastFetched',
          'studentDashboard.approvalsLastFetched',
          'realtime',
        ],
        warnAfter: 128,
      },
    }).concat(socketMiddleware),
});
