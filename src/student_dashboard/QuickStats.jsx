import React, { useEffect } from "react";
import { Award, FileCheck, Activity, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSDashboardData } from "../features/studentDashSlice";

const QuickStats = () => {
  const dispatch = useDispatch();
  const { counts = {}, loading, error } = useSelector(
    (state) => state.studentDashboard // ✅ must match slice name
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  const stats = [
    { icon: <Award size={28} />, label: "Certifications", value: counts?.certificationsCount ?? 0 },
    { icon: <BookOpen size={28} />, label: "Workshops", value: counts?.workshopsCount ?? 0 },
    { icon: <Activity size={28} />, label: "Clubs Joined", value: counts?.clubsJoinedCount ?? 0 },
    { icon: <FileCheck size={28} />, label: "Pending Approvals", value: counts?.pendingApprovalsCount ?? 0 },
  ];

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <div className="text-indigo-600">{s.icon}</div>
          <div className="text-xl font-bold">{s.value}</div>
          <div className="text-sm text-gray-600">{s.label}</div>
        </div>
      ))}
    </section>
  );
};

export default QuickStats;
