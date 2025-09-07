import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/authSlice";
import dashboardReducer from '../features/dashboardSlice';
import activitiesReducer from "../features/activitiesSlice";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dashboard: dashboardReducer,
    activities: activitiesReducer,
 // you can add more slices here
  },
});
