import React from "react";
import { Award, FileCheck, Activity, BookOpen } from "lucide-react";

const stats = [
  { icon: <Award size={28} />, label: "Certifications", value: 12 },
  { icon: <BookOpen size={28} />, label: "Workshops", value: 5 },
  { icon: <Activity size={28} />, label: "Clubs Joined", value: 3 },
  { icon: <FileCheck size={28} />, label: "Pending Approvals", value: 2 },
];

const QuickStats = () => {
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
