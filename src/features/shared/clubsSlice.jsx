import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all clubs
export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/clubs');
      if (res.data?.ok) {
        return res.data.clubs || [];
      }
      throw new Error(res.data?.message || 'Failed to fetch clubs');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load clubs');
    }
  }
);

// Fetch club members
export const fetchClubMembers = createAsyncThunk(
  'clubs/fetchClubMembers',
  async (clubId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/clubs/${clubId}/members`);
      if (res.data?.ok) {
        return { clubId, members: res.data.members || [] };
      }
      throw new Error(res.data?.message || 'Failed to fetch members');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load members');
    }
  }
);

const clubsSlice = createSlice({
  name: 'clubs',
  initialState: {
    clubs: [],
    membersByClub: {}, // { [clubId]: [{ studentid, fullname, mobileno, role }] }
    loading: false,
    membersLoading: {},
    error: null,
    membersError: {},
  },
  reducers: {
    clearClubsError: (state) => {
      state.error = null;
    },
    clearMembersError: (state, action) => {
      const clubId = action.payload;
      if (clubId) {
        delete state.membersError[clubId];
      } else {
        state.membersError = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clubs
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch club members
      .addCase(fetchClubMembers.pending, (state, action) => {
        const clubId = action.meta.arg;
        state.membersLoading[clubId] = true;
        state.membersError[clubId] = null;
      })
      .addCase(fetchClubMembers.fulfilled, (state, action) => {
        const { clubId, members } = action.payload;
        state.membersByClub[clubId] = members;
        state.membersLoading[clubId] = false;
      })
      .addCase(fetchClubMembers.rejected, (state, action) => {
        const clubId = action.meta.arg;
        state.membersLoading[clubId] = false;
        state.membersError[clubId] = action.payload;
      });
  },
});

export const { clearClubsError, clearMembersError } = clubsSlice.actions;
export default clubsSlice.reducer;

