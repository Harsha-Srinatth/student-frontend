import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/**
 * Fetch all announcements for admin
 */
export const fetchAnnouncements = createAsyncThunk(
  "adminAnnouncements/fetch",
  async ({ targetAudience, isActive, page = 1, limit = 20, forceRefresh = false }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { announcements, lastFetched } = state.adminAnnouncements;
      
      // If forceRefresh is false, data exists and is fresh (less than 2 minutes old), skip fetch
      // But always fetch if announcements array is empty (e.g., after logout/login)
      if (!forceRefresh && announcements.length > 0 && lastFetched && Date.now() - lastFetched < 2 * 60 * 1000) {
        return { fromCache: true, data: announcements };
      }
      
      const params = { page, limit };
      if (targetAudience) params.targetAudience = targetAudience;
      if (isActive !== undefined) params.isActive = isActive;
      
      const response = await api.get("/admin/announcements", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load announcements");
    }
  }
);

/**
 * Fetch single announcement by ID
 */
export const fetchAnnouncementById = createAsyncThunk(
  "adminAnnouncements/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/announcements/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load announcement");
    }
  }
);

/**
 * Create new announcement
 */
export const createAnnouncement = createAsyncThunk(
  "adminAnnouncements/create",
  async (announcementData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/admin/announcements", announcementData);
      // Refresh announcements list after creation
      dispatch(fetchAnnouncements({}));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create announcement");
    }
  }
);

/**
 * Update announcement
 */
export const updateAnnouncement = createAsyncThunk(
  "adminAnnouncements/update",
  async ({ id, ...updateData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/admin/announcements/${id}`, updateData);
      // Refresh announcements list after update
      dispatch(fetchAnnouncements({}));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update announcement");
    }
  }
);

/**
 * Delete announcement
 */
export const deleteAnnouncement = createAsyncThunk(
  "adminAnnouncements/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/admin/announcements/${id}`);
      // Refresh announcements list after deletion
      dispatch(fetchAnnouncements({}));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete announcement");
    }
  }
);

const adminAnnouncementsSlice = createSlice({
  name: "adminAnnouncements",
  initialState: {
    announcements: [],
    currentAnnouncement: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
    clearAnnouncementsCache: (state) => {
      state.announcements = [];
      state.currentAnnouncement = null;
      state.lastFetched = null;
    },
    // Real-time update handlers
    updateAnnouncementsRealtime: (state, action) => {
      if (action.payload) {
        const { type, announcement, announcementId } = action.payload;
        
        if (type === "new" && announcement) {
          state.announcements.unshift(announcement);
          state.pagination.total += 1;
        } else if (type === "update" && announcement) {
          const index = state.announcements.findIndex((a) => a._id === announcement._id);
          if (index !== -1) {
            state.announcements[index] = { ...state.announcements[index], ...announcement };
          }
        } else if (type === "delete" && announcementId) {
          state.announcements = state.announcements.filter((a) => a._id !== announcementId);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
        state.lastFetched = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.fromCache) {
          state.announcements = action.payload.data || [];
          state.pagination = action.payload.pagination || state.pagination;
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnnouncement = action.payload.data;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.creating = false;
        // Announcement will be added via fetchAnnouncements or realtime update
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Update announcement
      .addCase(updateAnnouncement.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.updating = false;
        // Announcement will be updated via fetchAnnouncements or realtime update
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.deleting = false;
        // Announcement will be removed via fetchAnnouncements or realtime update
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentAnnouncement,
  clearAnnouncementsCache,
  updateAnnouncementsRealtime,
} = adminAnnouncementsSlice.actions;

export default adminAnnouncementsSlice.reducer;

