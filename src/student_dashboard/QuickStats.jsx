import React, { useEffect } from "react";
import { Award, Activity, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSDashboardData } from "../features/studentDashSlice";
import { useNavigate } from "react-router-dom";

const QuickStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { counts = {}, pendingApprovals = [], loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  const approvedCount = pendingApprovals.filter(a => a.status === "approved").length;
  const rejectedCount = pendingApprovals.filter(a => a.status === "rejected").length;
  const pendingCount = pendingApprovals.filter(a => a.status === "pending").length;

  const stats = [
    { icon: <Award size={28} />, label: "Certifications", value: counts?.certificationsCount ?? 0, path: "/student/achievements/all/docs" },
    { icon: <BookOpen size={28} />, label: "Workshops", value: counts?.workshopsCount ?? 0, path: "/student/achievements/all/docs" },
    { icon: <Activity size={28} />, label: "Clubs Joined", value: counts?.clubsJoinedCount ?? 0, path: "/student/achievements/all/docs" },
    { icon: <CheckCircle size={28} />, label: "Approved", value: approvedCount, color: "text-green-600", path: "/student/approvals/approved" },
    { icon: <XCircle size={28} />, label: "Rejected", value: rejectedCount, color: "text-red-600", path: "/student/approvals/rejected" },
    { icon: <Clock size={28} />, label: "Pending", value: pendingCount, color: "text-yellow-600", path: "/student/pending/approvels" },
  ];

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Quick Stats</h3>
        <p className="text-sm text-gray-500">Your activity overview</p>
      </div>
      <section className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {stats.map((s, idx) => (
          <div
            key={idx}
            onClick={() => navigate(s.path)}
            className="cursor-pointer flex flex-col items-center justify-center gap-2 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105 hover:border-indigo-200"
          >
            <div className={`${s.color || "text-indigo-600"} p-2 rounded-lg bg-white shadow-sm`}>
              {s.icon}
            </div>
            <div className="text-lg font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-600 text-center leading-tight">{s.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default QuickStats;