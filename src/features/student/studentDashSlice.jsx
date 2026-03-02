import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

/**
 * Fetch student dashboard data
 * Redux store acts as cache - components should check state first before calling
 */
export const fetchSDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async ({ forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    const state = getState();
    const { student, counts, lastFetched } = state.studentDashboard;
    
    // If forceRefresh is false and data already exists in Redux (our cache), skip fetch
    // Check if we have actual data (not just initial null state) and it's fresh (less than 5 minutes old)
    if (!forceRefresh && student !== null && counts !== null && lastFetched && Date.now() - lastFetched < 5 * 60 * 1000) {
      if (import.meta.env.DEV) {
        console.log('📦 fetchSDashboardData: Returning from cache');
      }
      return { 
        fromCache: true,
        student,
        counts,
        announcements: state.studentDashboard.announcements || [],
        pendingApprovals: state.studentDashboard.pendingApprovals || [],
        rejectedApprovals: state.studentDashboard.rejectedApprovals || [],
        approvedApprovals: state.studentDashboard.approvedApprovals || [],
        topTenStudents: state.studentDashboard.topTenStudents || [],
      };
    }
    
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
    topTenStudents: [],
    teachingPoints: 0,
    projectsPoints: 0,
    problemSolvingRank: 0,
    extraCurricularPoints: 0,
    coCurricularPoints: 0,
    weightedPoints: 0,
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
        const { type, announcement, announcementId } = action.payload;
        
        if (type === "new" && announcement) {
          // Check if announcement already exists (avoid duplicates)
          const exists = state.announcements.some((a) => a._id === announcement._id);
          if (!exists) {
            state.announcements.unshift(announcement);
          }
        } else if (type === "update" && announcement) {
          const index = state.announcements.findIndex((a) => a._id === announcement._id);
          if (index !== -1) {
            state.announcements[index] = { ...state.announcements[index], ...announcement };
          } else {
            // If not found, add it (might be a new announcement)
            state.announcements.unshift(announcement);
          }
        } else if (type === "delete" && announcementId) {
          state.announcements = state.announcements.filter((a) => a._id !== announcementId);
        } else if (!type && Array.isArray(action.payload)) {
          // Fallback: if payload is array, replace entire list
          state.announcements = action.payload;
        }
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
      state.topTenStudents = [];
      state.teachingPoints = 0;
      state.projectsPoints = 0;
      state.problemSolvingRank = 0;
      state.extraCurricularPoints = 0;
      state.coCurricularPoints = 0;
      state.weightedPoints = 0;
      state.lastFetched = null;
      state.achievementsLastFetched = null;
      state.approvalsLastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSDashboardData.pending, (state) => {
        // Only set loading if we don't have data or forceRefresh is true
        const hasData = state.student !== null && state.counts !== null && state.lastFetched;
        if (!hasData) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchSDashboardData.fulfilled, (state, action) => {
        // Only update if not from cache (i.e., fresh API response)
        if (!action.payload.fromCache) {
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
        state.topTenStudents = action.payload.topTenStudents || [];
        state.teachingPoints = action.payload.teachingPoints || 0;
        state.projectsPoints = action.payload.projectsPoints || 0;
        state.problemSolvingRank = action.payload.problemSolvingRank || 0;
        state.extraCurricularPoints = action.payload.extraCurricularPoints || 0;
        state.coCurricularPoints = action.payload.coCurricularPoints || 0;
        state.weightedPoints = action.payload.weightedPoints || 0;
        } else {
          // From cache - don't touch loading state to avoid unnecessary toggles
          if (import.meta.env.DEV) {
            console.log('📦 Using cached student dashboard data');
          }
        }
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
          // Ensure we always set an array, even if data is missing or malformed
          const announcementsData = action.payload?.data;
          state.announcements = Array.isArray(announcementsData) ? announcementsData : [];
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
