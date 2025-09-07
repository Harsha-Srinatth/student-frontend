import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    { id: 1, title: "AI Workshop", date: "Jan 15, 2024", selected: true },
    { id: 2, title: "Web Development Seminar", date: "Feb 20, 2024", selected: false },
    { id: 3, title: "Data Science Club", date: "Mar 02, 2024", selected: true },
    { id: 4, title: "Hackathon 2023", date: "Mar 10, 2024", selected: true },
  ],
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    toggleActivity: (state, action) => {
      const activity = state.list.find((a) => a.id === action.payload);
      if (activity) activity.selected = !activity.selected;
    },
  },
});

export const { toggleActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
