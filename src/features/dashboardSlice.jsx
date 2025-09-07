import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: { name: 'John Doe', avatar: null },
  gpa: 3.8,
  semesters: [3.0, 3.3, 3.5, 3.8],
  nextDeadline: { title: 'Internship Application', date: '2024-03-15' },
  activities: [
    { id: 1, title: 'AI Workshop', date: 'Jan 15, 2024', done: true },
    { id: 2, title: 'Web Development Seminar', date: 'Feb 20, 2024', done: true },
    { id: 3, title: 'Data Science Club', date: 'Mar 02, 2024', done: true },
    { id: 4, title: 'Hackathon 2023', date: 'Mar 10, 2024', done: false },
  ],
  certifications: [
    { id: 'ml', title: 'Machine Learning', date: 'Jan 12, 2024', note: 'Completed online course' }
  ],
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleActivity(state, action) {
      const a = state.activities.find(x => x.id === action.payload)
      if (a) a.done = !a.done
    },
    updateGPA(state, action) {
      state.gpa = action.payload
    },
  },
})

export const { toggleActivity, updateGPA } = dashboardSlice.actions
export default dashboardSlice.reducer
