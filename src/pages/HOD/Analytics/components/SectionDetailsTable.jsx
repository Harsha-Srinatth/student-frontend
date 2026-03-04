import React from 'react';
import { motion } from 'framer-motion';
import { getAttendanceColor, getAttendanceBadgeColor } from '../utils/dataTransformers';
import { FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function SectionDetailsTable({ sections }) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Section Details</h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-teal-50 to-teal-50">
              <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900 text-sm">
                Section
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900 text-sm">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Total Students
                </div>
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900 text-sm">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4" />
                  Avg Attendance %
                </div>
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-900 text-sm">
                Excellent
                <div className="text-xs font-normal text-emerald-600">(90-100%)</div>
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-900 text-sm">
                Good
                <div className="text-xs font-normal text-blue-600">(75-89%)</div>
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-900 text-sm">
                Average
                <div className="text-xs font-normal text-amber-600">(60-74%)</div>
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-900 text-sm">
                Poor
                <div className="text-xs font-normal text-red-600">(&lt;60%)</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-bold">
                    {section.section || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  {section.totalStudents}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${getAttendanceBadgeColor(
                      section.avgAttendance
                    )}`}
                  >
                    {section.avgAttendance >= 75 ? (
                      <FiTrendingUp className="w-3 h-3" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3" />
                    )}
                    {section.avgAttendance}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                    {section.attendanceRanges.excellent || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm">
                    {section.attendanceRanges.good || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                    {section.attendanceRanges.average || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                    {section.attendanceRanges.poor || 0}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

