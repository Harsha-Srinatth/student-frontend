import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/authSlice";
import dashboardReducer from '../features/dashboardSlice';
import activitiesReducer from "../features/activitiesSlice";
import StudentDashboardReducer from "../features/studentDashSlice";
import facultyDashboardReducer from "../features/facultyDashSlice";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
    activities: activitiesReducer,
    studentDashboard: StudentDashboardReducer,
    facultyDashboard: facultyDashboardReducer
    
 // you can add more slices here
  },
});
