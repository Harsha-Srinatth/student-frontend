import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/**
 * Fetch all announcements for HOD
 */
export const fetchAnnouncements = createAsyncThunk(
  "hodAnnouncements/fetch",
  async ({ targetAudience, isActive, page = 1, limit = 20, forceRefresh = false }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { announcements, lastFetched } = state.hodAnnouncements;
      
      // If forceRefresh is false, data exists and is fresh (less than 2 minutes old), skip fetch
      // But always fetch if announcements array is empty (e.g., after logout/login)
      // IMPORTANT: Don't use cache if forceRefresh is true or if we need fresh data
      if (!forceRefresh && announcements.length > 0 && lastFetched && Date.now() - lastFetched < 2 * 60 * 1000) {
        return { fromCache: true, data: announcements };
      }
      
      // Always fetch from server if forceRefresh is true or cache is empty
      // This ensures we get the latest data from the database
      
      const params = { page, limit };
      if (targetAudience) params.targetAudience = targetAudience;
      if (isActive !== undefined) params.isActive = isActive;
      
      const response = await api.get("/hod/announcements", { params });
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
  "hodAnnouncements/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hod/announcements/${id}`);
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
  "hodAnnouncements/create",
  async (announcementData, { rejectWithValue, dispatch }) => {
    try {
      // If announcementData is FormData, send it directly
      // Otherwise, convert to FormData
      let formData = announcementData;
      if (!(announcementData instanceof FormData)) {
        formData = new FormData();
        Object.keys(announcementData).forEach((key) => {
          if (key !== 'image' && announcementData[key] !== null && announcementData[key] !== undefined) {
            if (Array.isArray(announcementData[key])) {
              announcementData[key].forEach((item) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, announcementData[key]);
            }
          }
        });
        if (announcementData.image instanceof File) {
          formData.append('image', announcementData.image);
        }
      }

      const response = await api.post("/hod/announcements", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh announcements list after creation with forceRefresh
      dispatch(fetchAnnouncements({ forceRefresh: true }));
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
  "hodAnnouncements/update",
  async ({ id, formData: updateData }, { rejectWithValue, dispatch }) => {
    try {
      // If updateData is FormData, send it directly
      // Otherwise, convert to FormData
      let formData = updateData;
      if (!(updateData instanceof FormData)) {
        formData = new FormData();
        Object.keys(updateData).forEach((key) => {
          if (key !== 'image' && updateData[key] !== null && updateData[key] !== undefined) {
            if (Array.isArray(updateData[key])) {
              updateData[key].forEach((item) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, updateData[key]);
            }
          }
        });
        if (updateData.image instanceof File) {
          formData.append('image', updateData.image);
        }
      }

      const response = await api.put(`/hod/announcements/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh announcements list after update with forceRefresh
      dispatch(fetchAnnouncements({ forceRefresh: true }));
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
  "hodAnnouncements/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/hod/announcements/${id}`);
      // Refresh announcements list after deletion with forceRefresh
      dispatch(fetchAnnouncements({ forceRefresh: true }));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete announcement");
    }
  }
);

const hodAnnouncementsSlice = createSlice({
  name: "hodAnnouncements",
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
          // Always update with fresh data from server, even if empty array
          state.announcements = Array.isArray(action.payload.data) ? action.payload.data : [];
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
} = hodAnnouncementsSlice.actions;

export default hodAnnouncementsSlice.reducer;

