import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk for fetching faculty dashboard data
// Redux is the cache - only fetch if data doesn't exist
export const fetchFacultyDashboardData = createAsyncThunk(
  'facultyDashboard/fetchData',
  async ({ forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { faculty, stats } = state.facultyDashboard;
      
      // If forceRefresh is false and data already exists in Redux (our cache), skip fetch
      // Check if we have actual data (not just initial null state)
      if (!forceRefresh && faculty !== null && stats !== null && stats.totalStudents !== undefined) {
        if (import.meta.env.DEV) {
          console.log('📦 fetchFacultyDashboardData: Returning from cache', new Error().stack);
        }
        return { 
          faculty, 
          stats, 
          approvalsGiven: state.facultyDashboard.approvalsGiven || [],
          recentActivities: state.facultyDashboard.recentActivities || [],
          fromCache: true 
        };
      }
      
      if (import.meta.env.DEV) {
        console.log('🌐 fetchFacultyDashboardData: Fetching from API', new Error().stack);
      }
      
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/home', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Debug: Log the response structure
      console.log('📊 Faculty dashboard API response:', {
        hasFaculty: !!response.data.faculty,
        hasStats: !!response.data.stats,
        statsKeys: response.data.stats ? Object.keys(response.data.stats) : [],
        fullResponse: response.data
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch faculty dashboard data');
    }
  }
);

// Async thunk for fetching pending approvals list
// API returns array of students with pendingApprovals (each item has type, description, achievementId).
// Redux is the cache - only fetch if data doesn't exist.
export const fetchPendingApprovals = createAsyncThunk(
  'facultyDashboard/fetchPendingApprovals',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { pendingApprovals, pendingLoading } = state.facultyDashboard;

      if (!pendingLoading && Array.isArray(pendingApprovals)) {
        return { fromCache: true, data: pendingApprovals };
      }

      const response = await api.get('/faculty/pending-approvals');
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending approvals');
    }
  }
);

// Async thunk for fetching faculty activities
// Redux is the cache - only fetch if data doesn't exist
export const fetchFacultyActivities = createAsyncThunk(
  'facultyDashboard/fetchActivities',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { activities, activitiesLoading } = state.facultyDashboard;
      
      // If data already exists in Redux (our cache) and we're not loading, skip fetch
      // Only skip if we have actual data (object with keys) and we're not currently loading
      if (!activitiesLoading && activities !== null && activities !== undefined && typeof activities === 'object' && Object.keys(activities).length > 0) {
        return { fromCache: true, data: activities };
      }
      
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/activities', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data || { recentActivities: [], recentApprovals: [], totalActivities: 0, totalApprovals: 0 };
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch faculty activities');
    }
  }
);

// Async thunk for fetching faculty metrics
export const fetchFacultyMetrics = createAsyncThunk(
  'facultyDashboard/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/metrics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("this is from merits",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch faculty metrics');
    }
  }
);

/**
 * Fetch announcements for the faculty
 * Redux store acts as cache - components should check state first before calling
 */
// Track in-flight requests to prevent duplicate concurrent fetches
let announcementsFetchInProgress = false;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 2000; // 2 seconds cooldown between fetches

export const fetchFacultyAnnouncements = createAsyncThunk(
  'facultyDashboard/fetchAnnouncements',
  async ({ forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    const state = getState();
    const { announcements, announcementsLastFetched, loading } = state.facultyDashboard;
    
    // Early return: If fetch is in progress and not forcing refresh, return immediately
    if (announcementsFetchInProgress && !forceRefresh) {
      // Return cached data without logging (reduce console noise)
      return { fromCache: true, data: announcements || [], silent: true };
    }
    
    // Early return: If already loading and not forcing refresh, return cached data
    if (loading && !forceRefresh) {
      return { fromCache: true, data: announcements || [], silent: true };
    }
    
    // Cooldown check: Prevent rapid successive calls (within 2 seconds)
    const now = Date.now();
    if (!forceRefresh && (now - lastFetchTime < FETCH_COOLDOWN)) {
      return { fromCache: true, data: announcements || [], silent: true };
    }
    
    // If forceRefresh is false and data exists and is fresh (less than 2 minutes old), skip fetch
    if (!forceRefresh && announcements && Array.isArray(announcements) && announcementsLastFetched && Date.now() - announcementsLastFetched < 2 * 60 * 1000) {
      return { fromCache: true, data: announcements, silent: true };
    }
    
    // Mark as in progress and update last fetch time
    announcementsFetchInProgress = true;
    lastFetchTime = now;
    
    try {
      const response = await api.get('/faculty/announcements');
      // Backend returns { success: true, data: [...] }
      // Return response.data directly (same as student pattern)
      console.log('📥 Fetched announcements from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch announcements:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to load announcements');
    } finally {
      // Clear in-progress flag after a short delay to allow the reducer to update
      setTimeout(() => {
        announcementsFetchInProgress = false;
      }, 100);
    }
  }
);

const facultyDashboardSlice = createSlice({
  name: 'facultyDashboard',
  initialState: {
    faculty: null,
    pendingApprovals: null, // Changed from [] to null to distinguish between "not fetched" and "empty array"
    pendingLoading: false,
    pendingApprovalsLastFetched: null,
    activitiesLastFetched: null,
    stats: null, // Changed from {} to null to distinguish between "not fetched" and "empty data"
    activities: null, // Changed from {} to null to distinguish between "not fetched" and "empty data"
    approvalsGiven: [], // Store all approvals given by faculty
    recentActivities: [], // Store recent activity log
    announcements: [], // Store announcements
    announcementsLastFetched: null, // Timestamp for announcements cache
    metrics: {
      performance: {
        approvalRate: 0,
        averageApprovalTime: 0,
        totalHoursWorked: 0,
        thisWeekActivity: 0,
        approvedCount: 0,
        rejectedCount: 0,
        lastLogin: null
      }
    },
    loading: false,
    activitiesLoading: false,
    metricsLoading: false,
    announcementsLoading: false, // Separate loading state for announcements
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action) => {
      if (state.stats === null) {
        state.stats = {
          totalStudents: 0,
          pendingApprovals: 0,
          approvedCertifications: 0,
          approvedWorkshops: 0,
          approvedClubs: 0,
          totalApproved: 0,
          totalApprovals: 0,
          approvalRate: 0
        };
      }
      state.stats = { ...state.stats, ...action.payload };
    },
    // Real-time update handlers
    updateStatsRealtime: (state, action) => {
      if (action.payload) {
        // Initialize stats if null
        if (state.stats === null) {
          state.stats = {
            totalStudents: 0,
            pendingApprovals: 0,
            approvedCertifications: 0,
            approvedWorkshops: 0,
            approvedClubs: 0,
            totalApproved: 0,
            totalApprovals: 0,
            approvalRate: 0
          };
        }
        // Only update properties that are explicitly provided in the payload
        // This prevents overwriting existing values with undefined
        const updates = {};
        Object.keys(action.payload).forEach(key => {
          if (action.payload[key] !== undefined && action.payload[key] !== null) {
            updates[key] = action.payload[key];
          }
        });
        // Only update if there are actual updates to apply
        if (Object.keys(updates).length > 0) {
          state.stats = { ...state.stats, ...updates };
        }
      } else {
        console.warn('⚠️ updateStatsRealtime called with no payload');
      }
    },
    updatePendingApprovalsRealtime: (state, action) => {
      if (action.payload !== undefined) {
        state.pendingApprovals = action.payload;
        // Update pending count in stats only if stats exists
        if (state.stats !== null && Array.isArray(action.payload)) {
          state.stats.pendingApprovals = action.payload.length;
        }
      }
    },
    updateActivitiesRealtime: (state, action) => {
      if (action.payload) {
        state.activities = action.payload;
      }
    },
    updateMetricsRealtime: (state, action) => {
      if (action.payload) {
        state.metrics = action.payload;
      }
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
        state.announcementsLastFetched = Date.now();
      }
    },
    // Invalidate cache to force refresh on next fetch
    // Clears data so next fetch will go to API
    invalidateCache: (state) => {
      state.faculty = null;
      state.stats = null; // Reset to null to force refetch
      state.pendingApprovals = null;
      state.activities = null;
    },
    // Update pending approvals count when an approval is processed
    updatePendingApprovalsCount: (state, action) => {
      if (state.stats) {
        state.stats.pendingApprovals = Math.max(0, (state.stats.pendingApprovals || 0) + action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard data
      .addCase(fetchFacultyDashboardData.pending, (state) => {
        // CRITICAL: Only set loading to true if we don't already have data
        // This prevents flickering when data is already loaded and we're just refreshing
        // Even if the thunk returns from cache, pending is still dispatched, so we need this check
        const hasData = state.faculty !== null && state.stats !== null && state.stats.totalStudents !== undefined;
        if (!hasData) {
          // Only set loading if we truly don't have data
          state.loading = true;
          if (import.meta.env.DEV) {
            console.log('🔄 Setting loading=true (no data yet)');
          }
        } else {
          // Data exists - CRITICAL: don't touch loading state at all
          // This prevents toggles when fetch is called but returns from cache
          // The fulfilled handler will also not touch loading when fromCache=true
          if (import.meta.env.DEV) {
            console.log('⏸️ Pending dispatched but data exists - preserving loading state:', state.loading);
          }
        }
        state.error = null;
      })
      .addCase(fetchFacultyDashboardData.fulfilled, (state, action) => {
        // Only update if not from cache (i.e., fresh API response)
        if (!action.payload.fromCache) {
          console.log('✅ Updating faculty dashboard state with API response');
          
          // Always update with fresh data
          if (action.payload.faculty) {
            state.faculty = action.payload.faculty;
            console.log('✅ Updated faculty:', state.faculty?.fullname || state.faculty?.name);
          }
          
          // If stats exist in response, use them (merge with defaults if needed)
          if (action.payload.stats) {
            state.stats = {
              totalStudents: action.payload.stats.totalStudents ?? 0,
              pendingApprovals: action.payload.stats.pendingApprovals ?? 0,
              approvedCertifications: action.payload.stats.approvedCertifications ?? 0,
              approvedWorkshops: action.payload.stats.approvedWorkshops ?? 0,
              approvedClubs: action.payload.stats.approvedClubs ?? 0,
              totalApproved: action.payload.stats.totalApproved ?? 0,
              totalApprovals: action.payload.stats.totalApprovals ?? 0,
              approvalRate: action.payload.stats.approvalRate ?? 0,
              // Include any additional stats from backend
              ...action.payload.stats
            };
            console.log('✅ Updated stats:', state.stats);
          } else if (state.stats === null) {
            // If no stats in response and we don't have stats yet, initialize with defaults
            console.warn('⚠️ No stats in API response, initializing with defaults');
            state.stats = {
              totalStudents: 0,
              pendingApprovals: 0,
              approvedCertifications: 0,
              approvedWorkshops: 0,
              approvedClubs: 0,
              totalApproved: 0,
              totalApprovals: 0,
              approvalRate: 0
            };
          }
          
          // These fields might not be in the API response, so use fallbacks
          state.approvalsGiven = action.payload.approvalsGiven || state.approvalsGiven || [];
          state.recentActivities = action.payload.recentActivities || state.recentActivities || [];
          
          // Only set loading to false if we actually fetched from API
          state.loading = false;
          console.log('✅ Set loading=false (API fetch completed)');
        } else {
          // From cache - CRITICAL: don't touch loading state at all to avoid unnecessary toggles
          // The pending handler already didn't set it to true (because data exists)
          // So we must not set it to false here either - preserve whatever loading state we have
          if (import.meta.env.DEV) {
            console.log('📦 Using cached faculty dashboard data - NOT touching loading state (stays:', state.loading, ')');
          }
        }
        
        state.error = null;
      })
      .addCase(fetchFacultyDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Failed to fetch faculty dashboard data:', action.payload);
      })
      // Pending approvals data
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.pendingLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingLoading = false;
        if (action.payload.fromCache) {
          // Data from cache, don't update
          return;
        }
        state.pendingApprovals = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        state.pendingApprovalsLastFetched = Date.now();
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.pendingLoading = false;
        state.error = action.payload;
      })
      // Activities data
      .addCase(fetchFacultyActivities.pending, (state) => {
        state.activitiesLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyActivities.fulfilled, (state, action) => {
        state.activitiesLoading = false;
        if (action.payload.fromCache) {
          // Data from cache, don't update
          state.error = null;
          return;
        }
        state.activities = action.payload.data || action.payload;
        state.activitiesLastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchFacultyActivities.rejected, (state, action) => {
        state.activitiesLoading = false;
        state.error = action.payload;
      })
      // Metrics data
      .addCase(fetchFacultyMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
        state.error = null;
      })
      .addCase(fetchFacultyMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.error = action.payload;
      })
      // Fetch announcements
      .addCase(fetchFacultyAnnouncements.pending, (state) => {
        // Use separate announcementsLoading state to avoid affecting main loading
        state.announcementsLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyAnnouncements.fulfilled, (state, action) => {
        state.announcementsLoading = false;
        if (!action.payload.fromCache) {
          // Backend returns { success: true, data: [...] }
          // Extract data array (same as student pattern)
          const announcementsData = action.payload?.data;
          state.announcements = Array.isArray(announcementsData) ? announcementsData : [];
          state.announcementsLastFetched = Date.now();
          console.log('✅ Updated announcements from API:', state.announcements.length);
        } else if (!action.payload.silent) {
          // Data from cache - only log if not silent (reduce console noise)
          console.log('📦 Announcements data from cache, no state update');
        }
        // If silent, don't log anything
        state.error = null;
      })
      .addCase(fetchFacultyAnnouncements.rejected, (state, action) => {
        state.announcementsLoading = false;
        state.error = action.payload;
        // Clear in-progress flag on error
        announcementsFetchInProgress = false;
      });
  }
});

export const { 
  clearError, 
  updateStats, 
  invalidateCache, 
  updatePendingApprovalsCount,
  updateStatsRealtime,
  updatePendingApprovalsRealtime,
  updateActivitiesRealtime,
  updateMetricsRealtime,
  updateAnnouncementsRealtime,
} = facultyDashboardSlice.actions;
export default facultyDashboardSlice.reducer;
