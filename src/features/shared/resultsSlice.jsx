import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchResults = createAsyncThunk(
  'results/fetchResults',
  async (semester, { rejectWithValue }) => {
    try {
      const qs = semester ? `?semester=${semester}` : '';
      const res = await api.get(`/api/results${qs}`);
      // Backend returns array of semester records
      return res.data?.results || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load results');
    }
  }
);

const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    bySemester: {}, // { [sem]: { mid1:[], mid2:[] } }
    loading: false,
    error: null,
    lastLoadedSemester: null,
  },
  reducers: {
    clearResultsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // don't clear existing data to avoid UI flicker
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        const records = action.payload;
        if (Array.isArray(records)) {
          records.forEach((rec) => {
            const sem = Number(rec.semesterNumber);
            if (!Number.isNaN(sem)) {
              state.bySemester[sem] = {
                mid1: Array.isArray(rec.mid1) ? rec.mid1 : [],
                mid2: Array.isArray(rec.mid2) ? rec.mid2 : [],
              };
              state.lastLoadedSemester = sem;
            }
          });
        }
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResultsError } = resultsSlice.actions;
export default resultsSlice.reducer;


