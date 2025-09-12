import React, { useEffect } from "react";
import { fetchSDashboardData } from "../features/studentDashSlice";
import { useSelector, useDispatch } from "react-redux";

const WelcomeBanner = () => {
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold">Loading your dashboard...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-200">
          Error: {error}
        </h2>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
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
