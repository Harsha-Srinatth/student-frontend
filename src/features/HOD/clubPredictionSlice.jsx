import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Async Thunk ─────────────────────────────────────────────────────────────

/**
 * POST /api/club/predict-joiners
 * Sends the HOD questionnaire answers + club details to the backend.
 * Returns predictedStudents, confidence, topStudents, breakdown.
 */
export const fetchClubPrediction = createAsyncThunk(
  "clubPrediction/fetchPrediction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/club/predict-joiners", payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get prediction"
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  // Prediction result
  predictedStudents   : null,
  confidence          : null,
  topStudents         : [],
  breakdown           : null,
  totalStudentsFetched: null,
  clubInfo            : null,

  // UI state
  loading : false,
  error   : null,
  step    : 1,      // 1 = Club Details, 2 = Questionnaire, 3 = Results

  // Form data
  formData: {
    // Step 1 – Club details
    title      : "",
    description: "",
    clubType   : "",

    // Step 2 – HOD questionnaire
    activityType    : "",
    meetingFrequency: "",
    timeCommitment  : "",
    membershipFee   : "",
    minCgpa         : "0",
    targetSemester  : "all",
    targetDept      : "all",
  },
};

const clubPredictionSlice = createSlice({
  name: "clubPrediction",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    updateFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetPrediction() {
      return initialState;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubPrediction.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchClubPrediction.fulfilled, (state, action) => {
        state.loading             = false;
        state.predictedStudents   = action.payload.predictedStudents;
        state.confidence          = action.payload.confidence;
        state.topStudents         = action.payload.topStudents || [];
        state.breakdown           = action.payload.breakdown;
        state.totalStudentsFetched= action.payload.totalStudentsFetched;
        state.clubInfo            = action.payload.clubInfo;
        state.step                = 3;
      })
      .addCase(fetchClubPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload || "Prediction failed";
      });
  },
});

export const { setStep, updateFormData, resetPrediction, clearError } =
  clubPredictionSlice.actions;

export default clubPredictionSlice.reducer;
