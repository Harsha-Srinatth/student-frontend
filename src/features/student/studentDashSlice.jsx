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
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to load all approvals");
    }
  }
);

/**
 * Fetch announcements for the student
 * Redux store acts as cache - components should check state first before calling
 */
export const fetchStudentAnnouncements = createAsyncThunk(
  "dashboard/fetchStudentAnnouncements",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const { announcements, lastFetched } = state.studentDashboard;
    
    // If data exists and is fresh (less than 2 minutes old), skip fetch
    if (announcements.length > 0 && lastFetched && Date.now() - lastFetched < 2 * 60 * 1000) {
      return { fromCache: true, data: announcements };
    }
    
    try {
      const response = await api.get("/student/announcements");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load announcements");
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
      clubs: [],
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
    // Real-time update handlers
    // These bypass the stale check and update data immediately via Socket.IO
    updateCountsRealtime: (state, action) => {
      if (action.payload) {
        console.log('🔄 Updating counts in Redux:', {
          previous: state.counts,
          incoming: action.payload,
        });
        state.counts = {
          ...state.counts,
          ...action.payload,
        };
        console.log('✅ Updated counts:', state.counts);
        // Update timestamp to reflect real-time data freshness
        state.lastFetched = Date.now();
      } else {
        console.warn('⚠️ updateCountsRealtime called with no payload');
      }
    },
    updateApprovalsRealtime: (state, action) => {
      if (action.payload.pendingApprovals !== undefined) {
        state.pendingApprovals = action.payload.pendingApprovals;
      }
      if (action.payload.rejectedApprovals !== undefined) {
        state.rejectedApprovals = action.payload.rejectedApprovals;
      }
      if (action.payload.approvedApprovals !== undefined) {
        state.approvedApprovals = action.payload.approvedApprovals;
      }
      // Update counts if provided
      if (action.payload.counts) {
        state.counts = {
          ...state.counts,
          ...action.payload.counts,
        };
      }
      // Update timestamp to reflect real-time data freshness
      state.approvalsLastFetched = Date.now();
      state.lastFetched = Date.now();
    },
    updateAnnouncementsRealtime: (state, action) => {
      if (action.payload) {
        state.announcements = action.payload;
        // Update timestamp to reflect real-time data freshness
        state.lastFetched = Date.now();
      }
    },
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
        clubs: [],
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
        // Backend already sends data in correct format, no need to transform
        state.pendingApprovals = action.payload.pendingApprovals || [];
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
            clubs: [],
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
      })
      // Fetch announcements
      .addCase(fetchStudentAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.fromCache) {
          state.announcements = action.payload.data || [];
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchStudentAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearDashboardCache,
  updateCountsRealtime,
  updateApprovalsRealtime,
  updateAnnouncementsRealtime,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
