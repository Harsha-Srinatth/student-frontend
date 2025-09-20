import React from "react";
import { useSelector } from "react-redux";

const WelcomeBanner = () => {
  // Use the correct slice name
  const { faculty, loading, error } = useSelector(
    (state) => state.facultyDashboard
  );

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
      <section className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-200">Error: {error}</h2>
      </section>
    );
  }

  return (
    <section
      className={`${bannerGradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
    >
      <h2 className="text-2xl font-bold">
        Welcome, {faculty?.fullname || faculty?.name || "Faculty"} 👩‍🏫
      </h2>
      <p className="mt-2">
        Here’s an overview of approvals and student activity tracking.
      </p>
    </section>
  );
};

export default WelcomeBanner;
