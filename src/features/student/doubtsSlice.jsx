import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Async Thunks ──────────────────────────────────────

export const fetchDoubts = createAsyncThunk(
  "doubts/fetchDoubts",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/student/doubts", { params: { page, limit } });
      return { ...data, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doubts");
    }
  }
);

export const fetchDoubtDetail = createAsyncThunk(
  "doubts/fetchDoubtDetail",
  async ({ doubtId, page = 1, limit = 30 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/student/doubts/${doubtId}`, { params: { page, limit } });
      return { ...data, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doubt");
    }
  }
);

export const createDoubt = createAsyncThunk(
  "doubts/createDoubt",
  async ({ title, description, tag }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/student/doubts", { title, description, tag });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create doubt");
    }
  }
);

export const createReply = createAsyncThunk(
  "doubts/createReply",
  async ({ doubtId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/student/doubts/${doubtId}/replies`, { content });
      return { ...data, doubtId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create reply");
    }
  }
);

export const deleteDoubt = createAsyncThunk(
  "doubts/deleteDoubt",
  async ({ doubtId }, { rejectWithValue }) => {
    try {
      await api.delete(`/student/doubts/${doubtId}`);
      return { doubtId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete doubt");
    }
  }
);

export const toggleSolved = createAsyncThunk(
  "doubts/toggleSolved",
  async ({ doubtId }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/student/doubts/${doubtId}/solve`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update doubt");
    }
  }
);

// ─── Helpers ────────────────────────────────────────────

const updateDoubtInList = (list, doubt) => {
  const idx = list.findIndex((d) => d._id === doubt._id);
  if (idx !== -1) list[idx] = { ...list[idx], ...doubt };
};

const bumpReplyCount = (state, doubtId) => {
  const update = (list) => {
    const d = list.find((item) => item._id === doubtId);
    if (d) d.replyCount = (d.replyCount || 0) + 1;
  };
  update(state.myDoubts);
  update(state.collegeDoubts);
  if (state.selectedDoubt?._id === doubtId) {
    state.selectedDoubt.replyCount = (state.selectedDoubt.replyCount || 0) + 1;
  }
};

// ─── Slice ──────────────────────────────────────────────

const doubtsSlice = createSlice({
  name: "doubts",
  initialState: {
    myDoubts: [],
    collegeDoubts: [],
    selectedDoubt: null,
    repliesByDoubt: {},

    // Pagination
    myDoubtsPage: 1,
    hasMoreMy: true,
    hasMoreCollege: true,
    repliesPage: {},
    hasMoreReplies: {},

    // Loading
    feedLoading: false,
    feedLoadingMore: false,
    detailLoading: false,
    createLoading: false,
    replyLoading: false,

    // Error
    feedError: null,
    detailError: null,
    createError: null,
  },
  reducers: {
    // Socket-driven: new doubt from someone in same college
    addDoubtFromSocket: (state, action) => {
      const { doubt } = action.payload;
      if (!doubt) return;
      const exists =
        state.myDoubts.some((d) => d._id === doubt._id) ||
        state.collegeDoubts.some((d) => d._id === doubt._id);
      if (!exists) state.collegeDoubts.unshift(doubt);
    },

    // Socket-driven: new reply
    addReplyFromSocket: (state, action) => {
      const { reply, doubtId } = action.payload;
      if (!reply || !doubtId) return;
      if (!state.repliesByDoubt[doubtId]) state.repliesByDoubt[doubtId] = [];
      const exists = state.repliesByDoubt[doubtId].some((r) => r._id === reply._id);
      if (!exists) {
        state.repliesByDoubt[doubtId].push(reply);
        bumpReplyCount(state, doubtId);
      }
    },

    // Socket-driven: doubt deleted
    removeDoubtFromSocket: (state, action) => {
      const { doubtId } = action.payload;
      state.myDoubts = state.myDoubts.filter((d) => d._id !== doubtId);
      state.collegeDoubts = state.collegeDoubts.filter((d) => d._id !== doubtId);
      delete state.repliesByDoubt[doubtId];
      if (state.selectedDoubt?._id === doubtId) state.selectedDoubt = null;
    },

    // Socket-driven: doubt updated (solved toggle)
    updateDoubtFromSocket: (state, action) => {
      const { doubt } = action.payload;
      if (!doubt) return;
      updateDoubtInList(state.myDoubts, doubt);
      updateDoubtInList(state.collegeDoubts, doubt);
      if (state.selectedDoubt?._id === doubt._id) {
        state.selectedDoubt = { ...state.selectedDoubt, ...doubt };
      }
    },

    clearSelectedDoubt: (state) => {
      state.selectedDoubt = null;
    },

    clearDoubtsData: () => doubtsSlice.getInitialState(),
  },
  extraReducers: (builder) => {
    builder
      // fetchDoubts
      .addCase(fetchDoubts.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;
        state[page === 1 ? "feedLoading" : "feedLoadingMore"] = true;
        state.feedError = null;
      })
      .addCase(fetchDoubts.fulfilled, (state, action) => {
        const { myDoubts, collegeDoubts, pagination, page } = action.payload;
        if (page === 1) {
          state.myDoubts = myDoubts;
          state.collegeDoubts = collegeDoubts;
        } else {
          const myIds = new Set(state.myDoubts.map((d) => d._id));
          const colIds = new Set(state.collegeDoubts.map((d) => d._id));
          state.myDoubts.push(...myDoubts.filter((d) => !myIds.has(d._id)));
          state.collegeDoubts.push(...collegeDoubts.filter((d) => !colIds.has(d._id)));
        }
        state.hasMoreMy = pagination.hasMoreMy;
        state.hasMoreCollege = pagination.hasMoreCollege;
        state.myDoubtsPage = page;
        state.feedLoading = false;
        state.feedLoadingMore = false;
      })
      .addCase(fetchDoubts.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedLoadingMore = false;
        state.feedError = action.payload || "Failed to fetch doubts";
      })

      // fetchDoubtDetail
      .addCase(fetchDoubtDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDoubtDetail.fulfilled, (state, action) => {
        const { doubt, replies, pagination, page } = action.payload;
        state.selectedDoubt = doubt;
        if (page === 1) {
          state.repliesByDoubt[doubt._id] = replies;
        } else {
          const existing = state.repliesByDoubt[doubt._id] || [];
          const ids = new Set(existing.map((r) => r._id));
          state.repliesByDoubt[doubt._id] = [...existing, ...replies.filter((r) => !ids.has(r._id))];
        }
        state.repliesPage[doubt._id] = page;
        state.hasMoreReplies[doubt._id] = pagination.hasMore;
        state.detailLoading = false;
      })
      .addCase(fetchDoubtDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || "Failed to fetch doubt";
      })

      // createDoubt
      .addCase(createDoubt.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createDoubt.fulfilled, (state, action) => {
        const { doubt } = action.payload;
        if (!state.myDoubts.some((d) => d._id === doubt._id)) {
          state.myDoubts.unshift(doubt);
        }
        state.createLoading = false;
      })
      .addCase(createDoubt.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create doubt";
      })

      // createReply
      .addCase(createReply.pending, (state) => { state.replyLoading = true; })
      .addCase(createReply.fulfilled, (state, action) => {
        const { reply, doubtId } = action.payload;
        if (!state.repliesByDoubt[doubtId]) state.repliesByDoubt[doubtId] = [];
        if (!state.repliesByDoubt[doubtId].some((r) => r._id === reply._id)) {
          state.repliesByDoubt[doubtId].push(reply);
          bumpReplyCount(state, doubtId);
        }
        state.replyLoading = false;
      })
      .addCase(createReply.rejected, (state) => { state.replyLoading = false; })

      // deleteDoubt
      .addCase(deleteDoubt.fulfilled, (state, action) => {
        const { doubtId } = action.payload;
        state.myDoubts = state.myDoubts.filter((d) => d._id !== doubtId);
        state.collegeDoubts = state.collegeDoubts.filter((d) => d._id !== doubtId);
        delete state.repliesByDoubt[doubtId];
        if (state.selectedDoubt?._id === doubtId) state.selectedDoubt = null;
      })

      // toggleSolved
      .addCase(toggleSolved.fulfilled, (state, action) => {
        const { doubt } = action.payload;
        updateDoubtInList(state.myDoubts, doubt);
        updateDoubtInList(state.collegeDoubts, doubt);
        if (state.selectedDoubt?._id === doubt._id) {
          state.selectedDoubt = { ...state.selectedDoubt, ...doubt };
        }
      });
  },
});

export const {
  addDoubtFromSocket,
  addReplyFromSocket,
  removeDoubtFromSocket,
  updateDoubtFromSocket,
  clearSelectedDoubt,
  clearDoubtsData,
} = doubtsSlice.actions;

export default doubtsSlice.reducer;
