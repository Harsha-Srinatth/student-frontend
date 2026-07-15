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

export const deleteReply = createAsyncThunk(
  "doubts/deleteReply",
  async ({ doubtId, replyId }, { rejectWithValue }) => {
    try {
      await api.delete(`/student/doubts/${doubtId}/replies/${replyId}`);
      return { doubtId, replyId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete reply");
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

// ─── Gemini 2.5 Flash — direct call, no discovery, no fallback ──────────────
const GEMINI_KEY  = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_URL  =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const fetchDoubtSummary = createAsyncThunk(
  "doubts/fetchDoubtSummary",
  async ({ doubtId }, { rejectWithValue, getState }) => {
    try {
      if (!GEMINI_KEY.startsWith("AIza")) {
        return rejectWithValue("VITE_GEMINI_API_KEY not set in student-frontend/.env");
      }

      const replies = getState().doubts.repliesByDoubt[doubtId] || [];
      if (replies.length < 2) {
        return { doubtId, summary: "Not enough replies yet to generate a summary.", keywords: [] };
      }

      const repliesText = replies
        .slice(0, 50)
        .map((r, i) => `${i + 1}. ${r.content.slice(0, 300)}`)
        .join("\n");

      const prompt =
        `You are a concise academic assistant. Read these student replies to a doubt and:\n` +
        `1. Write a sentence summary capturing the key ideas.\n` +
        `2. List 3-5 short keywords (topics/concepts mentioned).\n\n` +
        `Replies:\n${repliesText}\n\n` +
        `Respond ONLY in this exact format (no extra text):\n` +
        `Summary: <your sentence summary here>\n` +
        `Keywords: <keyword1, keyword2, keyword3>`;

      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 250 },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `Gemini error ${res.status}`;
        return rejectWithValue(msg);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const summaryMatch  = text.match(/Summary:\s*(.+?)(?:\n|$)/i);
      const keywordsMatch = text.match(/Keywords:\s*(.+?)(?:\n|$)/i);
      const summary  = summaryMatch?.[1]?.trim() || text;
      const keywords = keywordsMatch
        ? keywordsMatch[1].split(",").map((k) => k.trim()).filter(Boolean)
        : [];

      return { doubtId, summary, keywords };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to generate summary");
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
    viewerStudentId: null,

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

    // AI Summary — keyed by doubtId
    summaryByDoubt: {},
    summaryLoading: false,
    summaryError: null,
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

    // Socket-driven: reply deleted
    removeReplyFromSocket: (state, action) => {
      const { doubtId, replyId } = action.payload;
      if (!state.repliesByDoubt[doubtId]) return;
      state.repliesByDoubt[doubtId] = state.repliesByDoubt[doubtId].filter((r) => r._id !== replyId);
      const list = state.repliesByDoubt[doubtId];
      const newCount = list?.length ?? 0;
      const updateCount = (d) => {
        if (d._id === doubtId) d.replyCount = Math.max(0, (d.replyCount || 0) - 1);
      };
      state.myDoubts.forEach(updateCount);
      state.collegeDoubts.forEach(updateCount);
      if (state.selectedDoubt?._id === doubtId) {
        state.selectedDoubt.replyCount = Math.max(0, (state.selectedDoubt.replyCount || 0) - 1);
      }
    },

    clearSelectedDoubt: (state) => {
      state.selectedDoubt = null;
      state.viewerStudentId = null;
      state.summaryError = null;
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
        const { doubt, replies, pagination, page, currentStudentId } = action.payload;
        state.selectedDoubt = doubt;
        if (currentStudentId != null) state.viewerStudentId = currentStudentId;
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

      // deleteReply
      .addCase(deleteReply.fulfilled, (state, action) => {
        const { doubtId, replyId } = action.payload;
        if (!state.repliesByDoubt[doubtId]) return;
        state.repliesByDoubt[doubtId] = state.repliesByDoubt[doubtId].filter((r) => r._id !== replyId);
        const updateCount = (d) => {
          if (d._id === doubtId) d.replyCount = Math.max(0, (d.replyCount || 0) - 1);
        };
        state.myDoubts.forEach(updateCount);
        state.collegeDoubts.forEach(updateCount);
        if (state.selectedDoubt?._id === doubtId) {
          state.selectedDoubt.replyCount = Math.max(0, (state.selectedDoubt.replyCount || 0) - 1);
        }
      })

      // toggleSolved
      .addCase(toggleSolved.fulfilled, (state, action) => {
        const { doubt } = action.payload;
        updateDoubtInList(state.myDoubts, doubt);
        updateDoubtInList(state.collegeDoubts, doubt);
        if (state.selectedDoubt?._id === doubt._id) {
          state.selectedDoubt = { ...state.selectedDoubt, ...doubt };
        }
      })

      // fetchDoubtSummary
      .addCase(fetchDoubtSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchDoubtSummary.fulfilled, (state, action) => {
        const { doubtId, summary, keywords } = action.payload;
        state.summaryByDoubt[doubtId] = { summary, keywords };
        state.summaryLoading = false;
      })
      .addCase(fetchDoubtSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload || "Failed to generate summary";
      });
  },
});

export const {
  addDoubtFromSocket,
  addReplyFromSocket,
  removeDoubtFromSocket,
  removeReplyFromSocket,
  updateDoubtFromSocket,
  clearSelectedDoubt,
  clearDoubtsData,
} = doubtsSlice.actions;

export default doubtsSlice.reducer;
