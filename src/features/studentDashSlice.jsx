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
      console.log("data for student dashboard", response.data)
      return response.data;
    } catch (error) {
      return error.response?.data?.message || "Failed to load dashboard data"
      ;
    }
  }
);

// Thunk to fetch student achievements data
export const fetchStudentAchievements = createAsyncThunk(
  "dashboard/fetchStudentAchievements",
  async () => {
    const token = Cookies.get("token");
    console.log("Fetching student achievements with token:", token ? "present" : "missing");
    try {
      const response = await api.get("/student/achievements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Student achievements API response:", response.data);
      console.log("Response status:", response.status);
      return response.data;
    } catch (error) {
      console.error("Error fetching student achievements:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(error.response?.data?.message || "Failed to load achievements data");
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
      hackathonsCount: 0,
      projectsCount: 0,
    },
    pendingApprovals: [], // will include reviewedOn, reviewedBy, message
    rejectedApprovals: [],
    announcements: [],
    // New achievement data
    achievements: {
      academic: [], // certifications
      extracurricular: [], // workshops
      hackathons: [], // hackathons
      projects: [], // projects
    },
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
        state.pendingApprovals = (action.payload.pendingApprovals || []).map((a) => ({
          ...a,
          reviewedOn: a.reviewedOn,
          reviewedBy: a.reviewedBy,
          message: a.message,
        }));
        state.rejectedApprovals = action.payload.rejectedApprovals;
      })
      .addCase(fetchSDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAchievements.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Redux: Received achievements data:", action.payload);
        
        // Ensure we have the correct data structure
        if (action.payload && action.payload.achievements) {
          state.achievements = action.payload.achievements;
        } else {
          console.warn("No achievements data received:", action.payload);
          state.achievements = {
            academic: [],
            extracurricular: [],
            hackathons: [],
            projects: [],
          };
        }
        
        if (action.payload && action.payload.counts) {
          state.counts = {
            ...state.counts,
            certificationsCount: action.payload.counts.certificationsCount || 0,
            workshopsCount: action.payload.counts.workshopsCount || 0,
            hackathonsCount: action.payload.counts.hackathonsCount || 0,
            projectsCount: action.payload.counts.projectsCount || 0,
          };
        }
        
        console.log("Redux: Updated state:", {
          achievements: state.achievements,
          counts: state.counts
        });
      })
      .addCase(fetchStudentAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
