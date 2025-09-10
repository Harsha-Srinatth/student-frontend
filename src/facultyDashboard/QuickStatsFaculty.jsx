import React from "react";
import { ClipboardCheck, Users, FileBarChart, BookOpen } from "lucide-react";

const stats = [
  { icon: <ClipboardCheck size={28} />, label: "Pending Approvals", value: 8 },
  { icon: <Users size={28} />, label: "Active Students", value: 120 },
  { icon: <BookOpen size={28} />, label: "Workshops Conducted", value: 15 },
  { icon: <FileBarChart size={28} />, label: "Reports Generated", value: 5 },
];

const QuickStatsFaculty = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <div className="text-green-600">{s.icon}</div>
          <div className="text-xl font-bold">{s.value}</div>
          <div className="text-sm text-gray-600">{s.label}</div>
        </div>
      ))}
    </section>
  );
};

export default QuickStatsFaculty;
