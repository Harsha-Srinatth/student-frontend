import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/**
 * Fetch admin dashboard stats
 */
export const fetchAdminDashboardStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { stats, lastFetched } = state.adminDashboard;
      
      // If data exists and is fresh (less than 5 minutes old), skip fetch
      if (stats && lastFetched && Date.now() - lastFetched < 5 * 60 * 1000) {
        return { fromCache: true, data: stats };
      }
      
      const response = await api.get("/admin/dashboard/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load dashboard stats");
    }
  }
);

/**
 * Fetch department performance data
 */
export const fetchDepartmentPerformance = createAsyncThunk(
  "adminDashboard/fetchDepartmentPerformance",
  async (department, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { departmentPerformance, performanceLastFetched } = state.adminDashboard;
      
      // If data exists and is fresh, skip fetch
      if (departmentPerformance && performanceLastFetched && Date.now() - performanceLastFetched < 5 * 60 * 1000) {
        return { fromCache: true, data: departmentPerformance };
      }
      
      const params = department ? { department } : {};
      const response = await api.get("/admin/dashboard/department-performance", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load department performance");
    }
  }
);

/**
 * Fetch section-wise attendance
 */
export const fetchSectionWiseAttendance = createAsyncThunk(
  "adminDashboard/fetchSectionAttendance",
  async ({ department, semester }, { rejectWithValue }) => {
    try {
      const params = { department };
      if (semester) params.semester = semester;
      
      const response = await api.get("/admin/dashboard/attendance/section-wise", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load section attendance");
    }
  }
);

/**
 * Fetch student attendance by section
 */
export const fetchStudentAttendanceBySection = createAsyncThunk(
  "adminDashboard/fetchStudentAttendance",
  async ({ department, semester }, { rejectWithValue }) => {
    try {
      const params = { department };
      if (semester) params.semester = semester;
      
      const response = await api.get("/admin/dashboard/attendance/students", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load student attendance");
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    stats: null,
    departmentPerformance: [],
    sectionAttendance: null,
    studentAttendance: null,
    loading: false,
    performanceLoading: false,
    attendanceLoading: false,
    error: null,
    lastFetched: null,
    performanceLastFetched: null,
    attendanceLastFetched: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboardCache: (state) => {
      state.stats = null;
      state.departmentPerformance = [];
      state.sectionAttendance = null;
      state.studentAttendance = null;
      state.lastFetched = null;
      state.performanceLastFetched = null;
      state.attendanceLastFetched = null;
    },
    // Real-time update handlers
    updateStatsRealtime: (state, action) => {
      if (action.payload) {
        state.stats = {
          ...state.stats,
          ...action.payload,
        };
        state.lastFetched = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.fromCache) {
          state.stats = action.payload.data;
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Department performance
      .addCase(fetchDepartmentPerformance.pending, (state) => {
        state.performanceLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentPerformance.fulfilled, (state, action) => {
        state.performanceLoading = false;
        if (!action.payload.fromCache) {
          state.departmentPerformance = action.payload.data || [];
          state.performanceLastFetched = Date.now();
        }
      })
      .addCase(fetchDepartmentPerformance.rejected, (state, action) => {
        state.performanceLoading = false;
        state.error = action.payload;
      })
      // Section attendance
      .addCase(fetchSectionWiseAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.error = null;
      })
      .addCase(fetchSectionWiseAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.sectionAttendance = action.payload.data;
        state.attendanceLastFetched = Date.now();
      })
      .addCase(fetchSectionWiseAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.error = action.payload;
      })
      // Student attendance
      .addCase(fetchStudentAttendanceBySection.pending, (state) => {
        state.attendanceLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentAttendanceBySection.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.studentAttendance = action.payload.data;
        state.attendanceLastFetched = Date.now();
      })
      .addCase(fetchStudentAttendanceBySection.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearDashboardCache,
  updateStatsRealtime,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;

