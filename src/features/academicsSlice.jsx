import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCurriculum = createAsyncThunk(
  'academics/fetchCurriculum',
  async (semester, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/curriculum?semester=${semester}`);
      return res.data?.subjects || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load curriculum');
    }
  }
);

export const submitAttendance = createAsyncThunk(
  'academics/submitAttendance',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/attendance', payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit attendance');
    }
  }
);

export const saveMidMarks = createAsyncThunk(
  'academics/saveMidMarks',
  async (entries, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/marks/bulk', { entries });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save marks');
    }
  }
);

const academicsSlice = createSlice({
  name: 'academics',
  initialState: {
    curriculum: [],
    curriculumLoading: false,
    curriculumError: null,

    attendanceSubmitting: false,
    attendanceError: null,

    marksSaving: false,
    marksError: null,
  },
  reducers: {
    clearAcademicsErrors: (state) => {
      state.curriculumError = null;
      state.attendanceError = null;
      state.marksError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurriculum.pending, (state) => {
        state.curriculumLoading = true;
        state.curriculumError = null;
      })
      .addCase(fetchCurriculum.fulfilled, (state, action) => {
        state.curriculumLoading = false;
        state.curriculum = action.payload;
      })
      .addCase(fetchCurriculum.rejected, (state, action) => {
        state.curriculumLoading = false;
        state.curriculumError = action.payload;
      })

      .addCase(submitAttendance.pending, (state) => {
        state.attendanceSubmitting = true;
        state.attendanceError = null;
      })
      .addCase(submitAttendance.fulfilled, (state) => {
        state.attendanceSubmitting = false;
      })
      .addCase(submitAttendance.rejected, (state, action) => {
        state.attendanceSubmitting = false;
        state.attendanceError = action.payload;
      })

      .addCase(saveMidMarks.pending, (state) => {
        state.marksSaving = true;
        state.marksError = null;
      })
      .addCase(saveMidMarks.fulfilled, (state) => {
        state.marksSaving = false;
      })
      .addCase(saveMidMarks.rejected, (state, action) => {
        state.marksSaving = false;
        state.marksError = action.payload;
      });
  },
});

export const { clearAcademicsErrors } = academicsSlice.actions;
export default academicsSlice.reducer;


