import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboardSlice";
import activitiesReducer from "../features/activitiesSlice";
import StudentDashboardReducer from "../features/studentDashSlice";
import facultyDashboardReducer from "../features/facultyDashSlice";
import studentReducer from "../features/facultySlice";
import academicsReducer from "../features/academicsSlice";
import resultsReducer from "../features/resultsSlice";
import studentLeaveReducer from "../features/studentLeaveSlice"; // ✅ already imported
import facultyLeaveReducer from "../features/facultyLeaveReqSlice"; // ✅ import the faculty slice

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
    facultyLeave: facultyLeaveReducer, // ✅ hooked up here
    // you can add more slices here
  },
});
