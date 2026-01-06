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
    // you can add more slices here
  },
});
