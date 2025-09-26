import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../services/api";

// Helper kept in case we need ad-hoc headers, but api already injects token
const authHeaders = () => {
  const t = Cookies.get("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ------------------------- Async Thunks -------------------------

// Fetch all leave requests for the faculty
export const fetchLeaveRequests = createAsyncThunk(
  "facultyLeave/fetchLeaveRequests",
  async (
    { status = "all", page = 1, limit = 20, sortBy = "submittedAt", sortOrder = "desc" } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/faculty/leave-requests", {
        params: { status, page, limit, sortBy, sortOrder },
        // api injects Authorization header; params are fine
      });
      // Normalize both shapes:
      // 1) { success, data: { leaveRequests, stats, pagination } }
      // 2) { leaveRequests, stats, pagination }
      const raw = response?.data ?? {};
      const payload = raw?.data ?? raw;
      console.log("this is from faculty leave req",raw,"this is playload",payload)
      return {
        leaveRequests: Array.isArray(payload?.leaveRequests) ? payload.leaveRequests : [],
        stats: payload?.stats || {},
        pagination: payload?.pagination || {},
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Process a leave request (approve/reject)
export const processLeaveRequest = createAsyncThunk(
  "facultyLeave/processLeaveRequest",
  async ({ studentid, requestId, status, approvalRemarks }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/faculty/leave-requests/${studentid}/${requestId}`,
        { status, approvalRemarks },
        // api injects Authorization header
      );
      return response.data.data; // { leaveRequestId, status, reviewedAt, reviewedBy, approvalRemarks }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch faculty dashboard stats
export const fetchFacultyStats = createAsyncThunk(
  "facultyLeave/fetchFacultyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/faculty/dashboard-stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch faculty profile
export const fetchFacultyProfile = createAsyncThunk(
  "facultyLeave/fetchFacultyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/faculty/profile");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ------------------------- Initial State -------------------------
const initialState = {
  leaveRequests: [],
  stats: {},        // Status counts: pending, approved, rejected
  pagination: {},
  leaveStats: {},   // Dashboard stats from backend
  facultyProfile: {},
  loading: false,
  error: null,
  success: false,
};

// ------------------------- Slice -------------------------
const facultyLeaveSlice = createSlice({
  name: "facultyLeave",
  initialState,
  reducers: {
    clearFacultyState: (state) => {
      state.leaveRequests = [];
      state.stats = {};
      state.pagination = {};
      state.leaveStats = {};
      state.facultyProfile = {};
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ----- Fetch Leave Requests -----
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.leaveRequests = payload.leaveRequests || [];
        state.stats = payload.stats || {};
        state.pagination = payload.pagination || {};
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ----- Process Leave Request -----
    builder
      .addCase(processLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(processLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedRequest = action.payload;
        const index = state.leaveRequests.findIndex(
          (r) => r._id === updatedRequest.leaveRequestId
        );
        if (index !== -1) {
          state.leaveRequests[index] = {
            ...state.leaveRequests[index],
            status: updatedRequest.status,
            reviewedAt: updatedRequest.reviewedAt,
            approvalRemarks: updatedRequest.approvalRemarks,
          };
        }
      })
      .addCase(processLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ----- Fetch Dashboard Stats -----
    builder
      .addCase(fetchFacultyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveStats = action.payload || {};
      })
      .addCase(fetchFacultyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ----- Fetch Faculty Profile -----
    builder
      .addCase(fetchFacultyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.facultyProfile = action.payload || {};
      })
      .addCase(fetchFacultyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ------------------------- Exports -------------------------
export const { clearFacultyState } = facultyLeaveSlice.actions;
export default facultyLeaveSlice.reducer;

// ------------------------- Selectors -------------------------
export const selectLeaveRequests = (state) =>
  state.facultyLeave?.leaveRequests || [];
export const selectLeaveStats = (state) => state.facultyLeave?.stats || {};
export const selectLeavePagination = (state) =>
  state.facultyLeave?.pagination || {};
export const selectFacultyStats = (state) => state.facultyLeave?.leaveStats || {};
export const selectFacultyProfile = (state) =>
  state.facultyLeave?.facultyProfile || {};
export const selectFacultyLoading = (state) =>
  state.facultyLeave?.loading || false;
export const selectFacultyError = (state) => state.facultyLeave?.error || null;
export const selectFacultySuccess = (state) =>
  state.facultyLeave?.success || false;
