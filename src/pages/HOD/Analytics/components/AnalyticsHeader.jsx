import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';

export default function AnalyticsHeader({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-700 to-teal-800 bg-clip-text text-transparent mb-2">
            Analytics & Performance Dashboard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Comprehensive insights into department performance and student attendance
          </p>
        </div>
        <div className="flex items-center gap-2 text-teal-700">
          <FiBarChart2 className="w-6 h-6" />
          <FiTrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-xs sm:text-sm opacity-90 mb-1">Departments</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalDepartments}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-xs sm:text-sm opacity-90 mb-1">Avg Performance</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.avgPerformance.toFixed(1)}%</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-xs sm:text-sm opacity-90 mb-1">Avg Attendance</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.avgAttendance.toFixed(1)}%</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-xs sm:text-sm opacity-90 mb-1">Achievements</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {stats.totalCertifications + stats.totalProjects}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

