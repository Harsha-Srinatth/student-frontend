// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFacultyActivities } from "../features/facultyDashSlice";
// import RecentVerificationsList from "./RecentVerificationsList";

// const RecentVerificationsPage = () => {
//   const dispatch = useDispatch();
//   const { activities = {}, activitiesLoading, error } = useSelector(
//     (state) => state.facultyDashboard
//   );

//   useEffect(() => {
//     dispatch(fetchFacultyActivities());
//   }, [dispatch]);

//   const recentApprovals = activities.recentApprovals || [];

//   return (
//     <div className="flex flex-col gap-6 w-full min-h-screen overflow-y-auto transition-opacity duration-500 ease-out animate-fadeIn">
//       <RecentVerificationsList
//         approvals={recentApprovals}
//         total={activities.totalApprovals}
//         loading={activitiesLoading}
//         error={error}
//         onRetry={() => dispatch(fetchFacultyActivities())}
//         variant="full"
//         limit={50}
//       />
//     </div>
//   );
// };

// export default RecentVerificationsPage;
