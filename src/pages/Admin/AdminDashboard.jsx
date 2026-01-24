import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardStats } from "../../features/Admin/adminDashSlice";
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBullhorn, 
  FaChartLine,
  FaBuilding 
} from "react-icons/fa";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.overview?.totalStudents || 0,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Faculty",
      value: stats?.overview?.totalFaculty || 0,
      icon: FaChalkboardTeacher,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Announcements",
      value: stats?.overview?.activeAnnouncements || 0,
      icon: FaBullhorn,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Departments",
      value: stats?.overview?.totalDepartments || 0,
      icon: FaBuilding,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your college management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Department Stats */}
      {stats?.departmentStats && stats.departmentStats.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Department Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.departmentStats.map((dept, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{dept.department}</h3>
                <p className="text-2xl font-bold text-purple-600">{dept.studentCount}</p>
                <p className="text-sm text-gray-600 mt-1">students</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Announcements */}
      {stats?.recentAnnouncements && stats.recentAnnouncements.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            {stats.recentAnnouncements.map((announcement, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-xl border-l-4 border-purple-500 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {announcement.priority}
                      </span>
                      <span>
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

