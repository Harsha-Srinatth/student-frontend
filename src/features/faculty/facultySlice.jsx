import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import Cookies from 'js-cookie';

// Async thunk for fetching students by faculty ID
// Redux is the cache - only fetch if data doesn't exist
export const fetchStudentsByFaculty = createAsyncThunk(
  'students/fetchByFaculty',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { students } = state.students;
      
      // If students already exist in Redux (our cache), skip fetch
      if (students && students.length > 0) {
        return { students, totalCount: students.length, fromCache: true };
      }
      
      const token = Cookies.get('token');
      const response = await api.get(`/faculty/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Async thunk for fetching student count by faculty ID
// DEPRECATED: Use dashboard stats.totalStudents instead
// This is kept for backward compatibility but tries to use existing data first
export const fetchStudentCount = createAsyncThunk(
  'students/fetchCount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      
      // First try to get count from students list
      if (state.students.students && state.students.students.length > 0) {
        return { totalCount: state.students.students.length, fromCache: true };
      }
      
      // Then try to get from dashboard stats
      if (state.facultyDashboard.stats && state.facultyDashboard.stats.totalStudents > 0) {
        return { totalCount: state.facultyDashboard.stats.totalStudents, fromCache: true };
      }
      
      // Only fetch if no data available
      const token = Cookies.get('token');
      const response = await api.get(`/faculty/students/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student count');
    }
  }
);

// Async thunk for fetching detailed student information
export const fetchStudentDetails = createAsyncThunk(
  'students/fetchDetails',
  async (studentid, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      const response = await api.get(`/faculty/student-details/${studentid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student details');
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    // Students list data
    students: [],
    totalCount: 0,
    studentsLoading: false,
    studentsError: null,
    
    // Student count data
    count: 0,
    countLoading: false,
    countError: null,
    
    // Selected student details
    selectedStudent: null,
    detailsLoading: false,
    detailsError: null,
    
    // UI state
    showStudentModal: false,
  },
  reducers: {
    // Clear errors
    clearStudentsError: (state) => {
      state.studentsError = null;
    },
    clearCountError: (state) => {
      state.countError = null;
    },
    clearDetailsError: (state) => {
      state.detailsError = null;
    },
    
    // Modal management
    showStudentModal: (state) => {
      state.showStudentModal = true;
    },
    hideStudentModal: (state) => {
      state.showStudentModal = false;
      state.selectedStudent = null;
    },
    
    // Clear all data
    clearStudentsData: (state) => {
      state.students = [];
      state.totalCount = 0;
      state.count = 0;
      state.selectedStudent = null;
      state.studentsError = null;
      state.countError = null;
      state.detailsError = null;
    },
    // Invalidate cache to force refresh on next fetch
    // Clears data so next fetch will go to API
    invalidateStudentsCache: (state) => {
      state.students = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students by faculty
      .addCase(fetchStudentsByFaculty.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(fetchStudentsByFaculty.fulfilled, (state, action) => {
        state.studentsLoading = false;
        // Only update if not from cache (i.e., fresh API response)
        if (!action.payload.fromCache) {
          state.students = action.payload.students;
          state.totalCount = action.payload.totalCount;
        }
        state.studentsError = null;
      })
      .addCase(fetchStudentsByFaculty.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      })
      
      // Fetch student count
      .addCase(fetchStudentCount.pending, (state) => {
        state.countLoading = true;
        state.countError = null;
      })
      .addCase(fetchStudentCount.fulfilled, (state, action) => {
        state.countLoading = false;
        state.count = action.payload.totalCount;
        state.countError = null;
      })
      .addCase(fetchStudentCount.rejected, (state, action) => {
        state.countLoading = false;
        state.countError = action.payload;
      })
      
      // Fetch student details
      .addCase(fetchStudentDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedStudent = action.payload.student;
        state.detailsError = null;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      });
  },
});

export const {
  clearStudentsError,
  clearCountError,
  clearDetailsError,
  showStudentModal,
  hideStudentModal,
  clearStudentsData,
  invalidateStudentsCache,
} = studentSlice.actions;

export default studentSlice.reducer;
