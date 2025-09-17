import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from '../features/dashboardSlice';
import activitiesReducer from "../features/activitiesSlice";
import StudentDashboardReducer from "../features/studentDashSlice";
import facultyDashboardReducer from "../features/facultyDashSlice";
import studentReducer from "../features/studentSlice";


export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    activities: activitiesReducer,
    studentDashboard: StudentDashboardReducer,
    facultyDashboard: facultyDashboardReducer,
    students: studentReducer
    
 // you can add more slices here
  },
});
