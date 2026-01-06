import React from "react";
import { motion } from "framer-motion";
import { FileCheck, Users, Award, BookOpen, Activity, CheckCircle, XCircle, Clock } from "lucide-react";

const FacultyMeritsCard = ({ metrics }) => {
  if (!metrics) return null;

  const items = [
    { label: "Approval Rate", value: `${metrics.approvalRate}%`, icon: <CheckCircle className="text-green-600" /> },
    { label: "Approved Certifications", value: metrics.approvedCertifications, icon: <Award className="text-yellow-600" /> },
    { label: "Approved Clubs", value: metrics.approvedClubs, icon: <Users className="text-blue-600" /> },
    { label: "Approved Workshops", value: metrics.approvedWorkshops, icon: <BookOpen className="text-purple-600" /> },
    { label: "Pending Approvals", value: metrics.pendingApprovals, icon: <Clock className="text-gray-600" /> },
    { label: "Total Approvals", value: metrics.totalApprovals, icon: <FileCheck className="text-indigo-600" /> },
    { label: "Total Approved", value: metrics.totalApproved, icon: <CheckCircle className="text-green-700" /> },
    { label: "Total Students", value: metrics.totalStudents, icon: <Users className="text-pink-600" /> },
    { label: "This Week Activity", value: metrics.performance?.thisWeekActivity, icon: <Activity className="text-orange-600" /> },
    { label: "Approved Count", value: metrics.performance?.approvedCount, icon: <CheckCircle className="text-emerald-600" /> },
    { label: "Rejected Count", value: metrics.performance?.rejectedCount, icon: <XCircle className="text-red-600" /> },
    { label: "Avg Approval Time", value: `${metrics.performance?.averageApprovalTime} hrs`, icon: <Clock className="text-gray-600" /> },
    { label: "Total Hours Worked", value: metrics.performance?.totalHoursWorked, icon: <Activity className="text-indigo-500" /> },
    { label: "Last Updated", value: metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : "N/A", icon: <Clock className="text-gray-700" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileCheck className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Faculty Performance & Merits</h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-100 shadow-sm"
          >
            <span className="w-6 h-6">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-600">{item.label}</p>
              <p className="text-lg font-bold text-gray-800">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FacultyMeritsCard;
