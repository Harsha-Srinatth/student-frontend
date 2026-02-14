import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchHODDashboardStats } from "../../features/HOD/hodDashSlice";
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBullhorn, 
  FaBuilding 
} from "react-icons/fa";

export default function HODDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.hodDashboard);

  useEffect(() => {
    dispatch(fetchHODDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-white rounded-xl border border-red-200 shadow-lg max-w-md"
        >
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchHODDashboardStats())}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.overview?.totalStudents || 0,
      icon: FaUsers,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Faculty",
      value: stats?.overview?.totalFaculty || 0,
      icon: FaChalkboardTeacher,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      title: "Active Announcements",
      value: stats?.overview?.activeAnnouncements || 0,
      icon: FaBullhorn,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Total Sections",
      value: stats?.overview?.totalSections || 0,
      icon: FaBuilding,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            HOD Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Overview of your department management</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-5 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-md`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">{stat.title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Sections Overview */}
        {stats?.sectionStats && stats.sectionStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <FaBuilding className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Students by Section</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {stats.sectionStats.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate flex-1">
                      {section.section || "N/A"}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{section.studentCount}</p>
                    <p className="text-xs sm:text-sm text-gray-600">students</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Announcements */}
        {stats?.recentAnnouncements && stats.recentAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <FaBullhorn className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Announcements</h2>
            </div>
            <div className="space-y-3">
              {stats.recentAnnouncements.map((announcement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-l-4 border-purple-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {announcement.priority}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

