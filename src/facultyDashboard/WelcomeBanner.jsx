import React from "react";
import { useSelector } from "react-redux";

const WelcomeBanner = () => {
  const { faculty, loading, error } = useSelector(
    (state) => state.studentDashboard
  );

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
    <section className="p-6 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold">Welcome, {faculty?.fullname || "Faculty"} 👩‍🏫</h2>
      <p className="mt-2">Here’s an overview of approvals and student activity tracking.</p>
       
    </section>
  );
};

export default WelcomeBanner;
