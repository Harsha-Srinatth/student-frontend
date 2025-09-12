import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import Cookies from "js-cookie";

// Thunk to fetch student dashboard data
export const fetchSDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async () => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("/student/home",
      {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return error.response?.data?.message || "Failed to load dashboard data"
      ;
    }
  }
);

const dashboardSlice = createSlice({
  name: "studentDashboard",
  initialState: {
    student: "student",
    counts: {
      certificationsCount: 0,
      workshopsCount: 0,
      clubsJoinedCount: 0,
      pendingApprovalsCount: 0,
    },
    pendingApprovals:[],
    announcements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.counts = action.payload.counts;
        state.announcements = action.payload.announcements;
        state.pendingApprovals = action.payload.pendingApprovals;
      })
      .addCase(fetchSDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
