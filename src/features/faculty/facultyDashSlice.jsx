import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk for fetching faculty dashboard data
// Redux is the cache - only fetch if data doesn't exist
export const fetchFacultyDashboardData = createAsyncThunk(
  'facultyDashboard/fetchData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { faculty, stats } = state.facultyDashboard;
      
      // If data already exists in Redux (our cache), skip fetch
      if (faculty && stats && stats.totalStudents !== undefined) {
        return { 
          faculty, 
          stats, 
          approvalsGiven: state.facultyDashboard.approvalsGiven || [],
          recentActivities: state.facultyDashboard.recentActivities || [],
          fromCache: true 
        };
      }
      
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/home', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch faculty dashboard data');
    }
  }
);

// Async thunk for fetching pending approvals list
// Redux is the cache - only fetch if data doesn't exist
export const fetchPendingApprovals = createAsyncThunk(
  'facultyDashboard/fetchPendingApprovals',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { pendingApprovals, pendingLoading } = state.facultyDashboard;
      
      // If data already exists in Redux (our cache) and we're not loading, skip fetch
      // Only skip if we have actual data (length > 0) or if we just fetched empty array
      // Always fetch if we're currently loading to avoid race conditions
      if (!pendingLoading && pendingApprovals !== null && pendingApprovals !== undefined) {
        return pendingApprovals;
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
      // Only skip if we have actual data (length > 0) or if we just fetched empty array
      // Always fetch if we're currently loading to avoid race conditions
      if (!activitiesLoading && activities !== null && activities !== undefined && Object.keys(activities).length > 0) {
        return activities;
      }
      
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/activities', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data || { recentActivities: [], recentApprovals: [], totalActivities: 0, totalApprovals: 0 };
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

const facultyDashboardSlice = createSlice({
  name: 'facultyDashboard',
  initialState: {
    faculty: null,
    pendingApprovals: [],
    pendingLoading: false,
    stats: {
      totalStudents: 0,
      pendingApprovals: 0,
      approvedCertifications: 0,
      approvedWorkshops: 0,
      approvedClubs: 0,
      totalApproved: 0,
      totalApprovals: 0,
      approvalRate: 0
    },
    activities: {
      recentActivities: [],
      recentApprovals: [],
      totalActivities: 0,
      totalApprovals: 0
    },
    approvalsGiven: [], // Store all approvals given by faculty
    recentActivities: [], // Store recent activity log
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
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    // Invalidate cache to force refresh on next fetch
    // Clears data so next fetch will go to API
    invalidateCache: (state) => {
      state.faculty = null;
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
      state.pendingApprovals = [];
      state.activities = {
        recentActivities: [],
        recentApprovals: [],
        totalActivities: 0,
        totalApprovals: 0
      };
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if not from cache (i.e., fresh API response)
        if (!action.payload.fromCache) {
          state.faculty = action.payload.faculty;
          state.stats = action.payload.stats;
          state.approvalsGiven = action.payload.approvalsGiven || [];
          state.recentActivities = action.payload.recentActivities || [];
        }
        state.error = null;
      })
      .addCase(fetchFacultyDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pending approvals data
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.pendingLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingLoading = false;
        state.pendingApprovals = action.payload || [];
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
        state.activities = action.payload;
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
      });
  }
});

export const { clearError, updateStats, invalidateCache, updatePendingApprovalsCount } = facultyDashboardSlice.actions;
export default facultyDashboardSlice.reducer;
