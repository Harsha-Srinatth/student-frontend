import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  api  from '../services/api';

// Async thunk for fetching faculty dashboard data
export const fetchFacultyDashboardData = createAsyncThunk(
  'facultyDashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
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
export const fetchPendingApprovals = createAsyncThunk(
  'facultyDashboard/fetchPendingApprovals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/faculty/pending-approvals');
      console.log("this is the response of the pending approvals",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending approvals');
    }
  }
);

// Async thunk for fetching faculty activities
export const fetchFacultyActivities = createAsyncThunk(
  'facultyDashboard/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/faculty/activities', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("this is the response of the activities",response.data)
      return response.data;;
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
    approvalsGiven: [], // NEW: store all approvals given by faculty
    recentActivities: [], // NEW: store recent activity log
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
        state.faculty = action.payload.faculty;
        state.stats = action.payload.stats;
        state.approvalsGiven = action.payload.approvalsGiven || [];
        state.recentActivities = action.payload.recentActivities || [];
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

export const { clearError, updateStats } = facultyDashboardSlice.actions;
export default facultyDashboardSlice.reducer;
