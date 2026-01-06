import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

/**
 * Fetch student dashboard data
 * Redux store acts as cache - components should check state first before calling
 */
export const fetchSDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("/student/home", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("this is the response of the dashboard data",response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to load dashboard data");
    }
  }
);

/**
 * Fetch student achievements data
 * Redux store acts as cache - components should check state first before calling
 */
export const fetchStudentAchievements = createAsyncThunk(
  "dashboard/fetchStudentAchievements",
  async () => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("/student/achievements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("this is the response of the achievements data",response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to load achievements data");
    }
  }
);

/**
 * Fetch all approvals for the student
 * Redux store acts as cache - components should check state first before calling
 */
export const fetchAllApprovals = createAsyncThunk(
  "dashboard/fetchAllApprovals",
  async () => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("/student/all-approvals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("this is the response of the all approvals data",response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to load all approvals");
    }
  }
);

/**
 * Helper function to check if data is stale
 * Components can use this to decide if they need to refresh
 */
export const isDataStale = (lastFetched, maxAgeMinutes = 5) => {
  if (!lastFetched) return true;
  const cacheAge = Date.now() - lastFetched;
  return cacheAge > (maxAgeMinutes * 60 * 1000);
};

const dashboardSlice = createSlice({
  name: "studentDashboard",
  initialState: {
    student: null,
    counts: {
      certificationsCount: 0,
      workshopsCount: 0,
      clubsJoinedCount: 0,
      pendingApprovalsCount: 0,
      hackathonsCount: 0,
      projectsCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
    },
    pendingApprovals: [],
    rejectedApprovals: [],
    approvedApprovals: [],
    announcements: [],
    achievements: {
      academic: [],
      extracurricular: [],
      hackathons: [],
      projects: [],
    },
    loading: false,
    error: null,
    // Timestamps for stale checking (Redux is the cache, timestamps help determine freshness)
    lastFetched: null,
    achievementsLastFetched: null,
    approvalsLastFetched: null,
  },
  reducers: {
    // Clear cache if needed (e.g., after logout or data update)
    clearDashboardCache: (state) => {
      state.student = null;
      state.counts = {
        certificationsCount: 0,
        workshopsCount: 0,
        clubsJoinedCount: 0,
        pendingApprovalsCount: 0,
        hackathonsCount: 0,
        projectsCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 0,
      };
      state.pendingApprovals = [];
      state.rejectedApprovals = [];
      state.approvedApprovals = [];
      state.achievements = {
        academic: [],
        extracurricular: [],
        hackathons: [],
        projects: [],
      };
      state.lastFetched = null;
      state.achievementsLastFetched = null;
      state.approvalsLastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        if (state.student) {
          state.student.profileImage = action.payload.student?.profileImage || null;
        }
        
        if (action.payload.counts) {
          state.counts = {
            ...state.counts,
            ...action.payload.counts,
            approvedCount: action.payload.counts.approvedCount ?? 0,
            rejectedCount: action.payload.counts.rejectedCount ?? 0,
            pendingCount: action.payload.counts.pendingCount ?? 0,
          };
        }
        
        state.announcements = action.payload.announcements || [];
        state.pendingApprovals = (action.payload.pendingApprovals || []).map((a) => ({
          ...a,
          reviewedOn: a.reviewedOn,
          reviewedBy: a.reviewedBy,
          message: a.message,
        }));
        state.rejectedApprovals = action.payload.rejectedApprovals || [];
        state.approvedApprovals = action.payload.approvedApprovals || [];
        
        // Update timestamp (Redux is the cache)
        state.lastFetched = Date.now();
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
        
        if (action.payload && action.payload.achievements) {
          state.achievements = action.payload.achievements;
          state.achievementsLastFetched = Date.now();
        } else {
          state.achievements = {
            academic: [],
            extracurricular: [],
            hackathons: [],
            projects: [],
          };
        }
      })
      .addCase(fetchStudentAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApprovals = action.payload.pendingApprovals || [];
        state.rejectedApprovals = action.payload.rejectedApprovals || [];
        state.approvedApprovals = action.payload.approvedApprovals || [];
        state.approvalsLastFetched = Date.now();
      })
      .addCase(fetchAllApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDashboardCache } = dashboardSlice.actions;
export default dashboardSlice.reducer;
