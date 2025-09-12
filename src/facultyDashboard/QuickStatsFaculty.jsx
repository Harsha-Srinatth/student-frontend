import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipboardCheck, Users, Award, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import { fetchFacultyDashboardData } from "../features/facultyDashSlice";

const QuickStatsFaculty = () => {
  const dispatch = useDispatch();
  const { stats = {}, faculty = null, loading, error } = useSelector(
    (state) => state.facultyDashboard
  );

  const [animatedStats, setAnimatedStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    approvedCertifications: 0,
    approvedWorkshops: 0,
    approvedClubs: 0,
    totalApproved: 0
  });

  useEffect(() => {
    dispatch(fetchFacultyDashboardData());
  }, [dispatch]);

  // Animate numbers
  useEffect(() => {
    if (stats.totalStudents > 0) {
      const timer = setTimeout(() => {
        setAnimatedStats(stats);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stats]);

  const statsConfig = [
    { 
      icon: <Users size={28} />, 
      label: "Total Students", 
      value: animatedStats.totalStudents,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      icon: <ClipboardCheck size={28} />, 
      label: "Pending Approvals", 
      value: animatedStats.pendingApprovals,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    { 
      icon: <Award size={28} />, 
      label: "Approved Certifications", 
      value: animatedStats.approvedCertifications,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      icon: <BookOpen size={28} />, 
      label: "Approved Workshops", 
      value: animatedStats.approvedWorkshops,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      icon: <CheckCircle size={28} />, 
      label: "Approved Clubs", 
      value: animatedStats.approvedClubs,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    { 
      icon: <TrendingUp size={28} />, 
      label: "Total Approved", 
      value: animatedStats.totalApproved,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  ];

  if (loading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow animate-pulse"
          >
            <div className="w-7 h-7 bg-gray-200 rounded"></div>
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
        <p className="text-red-600">Error loading faculty stats: {error}</p>
        <button 
          onClick={() => dispatch(fetchFacultyDashboardData())}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsConfig.map((stat, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 border ${stat.borderColor} hover:scale-105`}
        >
          <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
            {stat.icon}
          </div>
          <div className={`text-xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-600 text-center leading-tight">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
};

export default QuickStatsFaculty;
