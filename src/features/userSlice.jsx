// // features/userSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// const initialState = {
//   studentId: Cookies.get("studentId") || null,
//   facultyId: Cookies.get("facultyId") || null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setIds: (state, action) => {
//       // Useful if you want to update ids later
//       state.studentId = action.payload.studentId || state.studentId;
//       state.facultyId = action.payload.facultyId || state.facultyId;
//     },
//     clearIds: (state) => {
//       state.studentId = null;
//       state.facultyId = null;
//       Cookies.remove("studentId");
//       Cookies.remove("facultyId");
//     },
//   },
// });

// export const { setIds, clearIds } = userSlice.actions;
// export default userSlice.reducer;
