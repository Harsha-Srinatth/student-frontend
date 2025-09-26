// src/features/studentLeaveSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import Cookies from "js-cookie";

// Fetch all leave requests
export const fetchLeaveRequests = createAsyncThunk(
  "studentLeave/fetchLeaveRequests",
  async ({ status = "all", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token")
      const res = await api.get("/leave/student", { params: { status, page, limit } },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        return res.data.data;
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
      const token = Cookies.get("token")
      const res = await api.post("/leave/submit", leaveData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
// Fetch details of a specific leave request
export const fetchLeaveRequestDetails = createAsyncThunk(
  "studentLeave/fetchLeaveRequestDetails",
  async (requestId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token")
      const res = await api.get(`/leave/details/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ); 
      // 👆 OR keep `/leave/details/${studentId}/${requestId}` if your route expects studentid in URL.
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
  },
  reducers: {
    clearSelectedLeaveRequest: (state) => {
      state.selectedLeaveRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload.leaveRequests || [];
        state.leaveStats = action.payload.stats || {};
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(submitLeaveRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.leaveRequests.unshift({
            _id: action.payload.leaveRequestId,
            status: action.payload.status,
            submittedAt: action.payload.submittedAt,
          });
          state.leaveStats.pending += 1;
          state.leaveStats.total += 1;
        }
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchLeaveRequestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedLeaveRequest = null;
      })
      .addCase(fetchLeaveRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLeaveRequest = action.payload || null;
      })
      .addCase(fetchLeaveRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedLeaveRequest } = studentLeaveSlice.actions;

export default studentLeaveSlice.reducer;
