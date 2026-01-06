import React, { useEffect } from "react";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";
import { useSelector, useDispatch } from "react-redux";

const WelcomeBanner = () => {
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    // fetchSDashboardData will use cache if data is fresh (< 5 min old)
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  const bannerGradient =
    "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600";

  const loadingGradient =
    "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500";

  if (loading) {
    return (
      <section
        className={`${loadingGradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
      >
        <h2 className="text-2xl font-bold">Loading your dashboard...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`${loadingGradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
      >
        <h2 className="text-2xl font-bold text-red-200">
          Error: {error}
        </h2>
      </section>
    );
  }

  return (
    <section
      className={`${bannerGradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
    >
      <h2 className="text-2xl font-bold">
        Welcome back, {student?.fullname || "Student"} 👋
      </h2>
      <p className="mt-2">
        Here’s a quick overview of your student activity records.
      </p>
    </section>
  );
};

export default WelcomeBanner;
