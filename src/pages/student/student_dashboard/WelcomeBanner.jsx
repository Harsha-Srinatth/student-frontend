import React, { useEffect } from "react";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";
import { useSelector, useDispatch } from "react-redux";

const WelcomeBanner = () => {
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  const bannerGradient =
    "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600";

  if (loading) {
    return (
      <section className={`${bannerGradient} px-4 py-5 sm:p-6 text-white rounded-2xl shadow-lg`}>
        <div className="h-7 w-48 bg-white/20 rounded animate-pulse" />
        <div className="h-4 w-64 bg-white/10 rounded mt-3 animate-pulse" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${bannerGradient} px-4 py-5 sm:p-6 text-white rounded-2xl shadow-lg`}>
        <h2 className="text-lg sm:text-2xl font-bold text-red-200 break-words">Error: {error}</h2>
      </section>
    );
  }

  return (
    <section className={`${bannerGradient} px-4 py-5 sm:p-6 text-white rounded-2xl shadow-lg`}>
      <h2 className="text-lg sm:text-2xl font-bold break-words">
        Welcome back, {student?.fullname || "Student"} 👋
      </h2>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-white/90">
        Here's a quick overview of your student activity records.
      </p>
    </section>
  );
};

export default WelcomeBanner;
