// src/features/studentLeaveSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import Cookies from "js-cookie";

// Fetch all leave requests with caching
export const fetchLeaveRequests = createAsyncThunk(
  "studentLeave/fetchLeaveRequests",
  async ({ status = "all", page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    const state = getState();
    const leaveState = state.studentLeave;
    
    // Check cache if same filters and data exists
    if (leaveState.dataFetched && leaveState.lastFetched) {
      const cacheAge = Date.now() - leaveState.lastFetched;
      const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for leave requests
      
      // Check if same status filter and data exists
      if (cacheAge < CACHE_DURATION && 
          leaveState.cachedStatus === status && 
          leaveState.leaveRequests.length > 0) {
        // Return cached data with pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedRequests = leaveState.leaveRequests.slice(startIndex, endIndex);
        
        return {
          leaveRequests: paginatedRequests,
          stats: leaveState.leaveStats,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(leaveState.leaveRequests.length / limit),
            totalItems: leaveState.leaveRequests.length,
            hasNext: endIndex < leaveState.leaveRequests.length,
            hasPrev: startIndex > 0
          },
          _fromCache: true,
        };
      }
    }
    
    // Fetch fresh data
    try {
      const token = Cookies.get("token");
      const res = await api.get("/leave/student", 
        { params: { status, page, limit } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        return { ...res.data.data, cachedStatus: status };
      } else {
        return rejectWithValue(res.data.message || "Failed to fetch leave requests");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch leave requests");
    }
  }
);

// Submit a new leave request
export const submitLeaveRequest = createAsyncThunk(
  "studentLeave/submitLeaveRequest",
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const res = await api.post("/leave/submit", leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.data;
      } else {
        return rejectWithValue(res.data.message || "Failed to submit leave request");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to submit leave request");
    }
  }
);

// Fetch details of a specific leave request with caching
export const fetchLeaveRequestDetails = createAsyncThunk(
  "studentLeave/fetchLeaveRequestDetails",
  async (requestId, { getState, rejectWithValue }) => {
    const state = getState();
    const leaveState = state.studentLeave;
    
    // Check if this request is already in cache
    if (leaveState.selectedLeaveRequest && 
        leaveState.selectedLeaveRequest._id === requestId &&
        leaveState.detailsLastFetched) {
      const cacheAge = Date.now() - leaveState.detailsLastFetched;
      const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for details
      
      if (cacheAge < CACHE_DURATION) {
        return { ...leaveState.selectedLeaveRequest, _fromCache: true };
      }
    }
    
    // Fetch fresh data
    try {
      const token = Cookies.get("token");
      const res = await api.get(`/leave/details/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        return res.data.data;
      } else {
        return rejectWithValue(res.data.message || "Failed to fetch leave request details");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch leave request details");
    }
  }
);

// Slice
const studentLeaveSlice = createSlice({
  name: "studentLeave",
  initialState: {
    leaveRequests: [],
    leaveStats: { total: 0, pending: 0, approved: 0, rejected: 0 },
    pagination: {},
    selectedLeaveRequest: null,
    loading: false,
    error: null,
    // Cache management
    dataFetched: false,
    lastFetched: null,
    cachedStatus: null,
    detailsLastFetched: null,
  },
  reducers: {
    clearSelectedLeaveRequest: (state) => {
      state.selectedLeaveRequest = null;
      state.detailsLastFetched = null;
    },
    clearLeaveCache: (state) => {
      state.dataFetched = false;
      state.lastFetched = null;
      state.cachedStatus = null;
      state.leaveRequests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        
        // Skip update if from cache
        if (action.payload._fromCache) {
          return;
        }
        
        // Store all requests (not just paginated) for cache
        state.leaveRequests = action.payload.leaveRequests || [];
        state.leaveStats = action.payload.stats || {};
        state.pagination = action.payload.pagination || {};
        state.cachedStatus = action.payload.cachedStatus;
        state.lastFetched = Date.now();
        state.dataFetched = true;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      .addCase(submitLeaveRequest.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Invalidate cache when new request is submitted
          state.dataFetched = false;
          state.lastFetched = null;
          state.leaveRequests.unshift({
            _id: action.payload.leaveRequestId,
            status: action.payload.status,
            submittedAt: action.payload.submittedAt,
          });
          state.leaveStats.pending += 1;
          state.leaveStats.total += 1;
        }
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      .addCase(fetchLeaveRequestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Don't clear selectedLeaveRequest if from cache
        if (!state.detailsLastFetched) {
          state.selectedLeaveRequest = null;
        }
      })
      .addCase(fetchLeaveRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        
        // Skip update if from cache
        if (action.payload._fromCache) {
          return;
        }
        
        state.selectedLeaveRequest = action.payload || null;
        state.detailsLastFetched = Date.now();
      })
      .addCase(fetchLeaveRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedLeaveRequest, clearLeaveCache } = studentLeaveSlice.actions;
export default studentLeaveSlice.reducer;
