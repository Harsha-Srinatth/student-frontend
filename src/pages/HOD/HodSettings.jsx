import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User, Megaphone, BarChart3, Building2, Users,
  UserPlus, Settings, Mail, Phone, IdCard, Shield,
} from "lucide-react";
import { fetchHODDashboardStats } from "../../features/HOD/hodDashSlice";
import NotificationSettings from "../../components/shared/NotificationSettings";
import Cookies from "js-cookie";

const shimmerCls = "animate-pulse bg-gray-200 rounded";

export default function HodSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.hodDashboard);

  useEffect(() => {
    if (!stats) dispatch(fetchHODDashboardStats());
  }, [dispatch, stats]);

  // HOD info from cookies (set at login) + dashboard stats
  const hodId = Cookies.get("hodId") || "—";
  const department = Cookies.get("department") || "—";
  const collegeId = Cookies.get("collegeId") || "—";

  const quickLinks = [
    { icon: <Megaphone className="w-7 h-7 text-purple-600" />, title: "Announcements", desc: "Create & manage announcements", path: "/hod/announcements" },
    { icon: <UserPlus className="w-7 h-7 text-blue-600" />, title: "Assign Faculty", desc: "Manage faculty assignments", path: "/hod/assign-faculty" },
    { icon: <Building2 className="w-7 h-7 text-emerald-600" />, title: "Clubs", desc: "Manage clubs & activities", path: "/hod/clubs" },
    { icon: <BarChart3 className="w-7 h-7 text-orange-600" />, title: "Analytics", desc: "Department performance insights", path: "/hod/analytics" },
    { icon: <Users className="w-7 h-7 text-pink-600" />, title: "Dashboard", desc: "Overview & statistics", path: "/hod/dashboard" },
    { icon: <Shield className="w-7 h-7 text-red-600" />, title: "Security", desc: "Password & privacy settings", path: "/hod/settings" },
  ];

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 py-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        {loading ? (
          <div className={`w-28 h-4 mt-0.5 ${shimmerCls}`} />
        ) : (
          <p className="text-sm font-semibold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full p-3 sm:p-5 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={26} className="text-purple-600" />
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your HOD account and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ring-4 ring-purple-100">
            H
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">HOD</h2>
              <span className="px-3 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {department}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-3">
              <InfoRow icon={<IdCard size={16} className="text-purple-400" />} label="HOD ID" value={hodId} />
              <InfoRow icon={<Building2 size={16} className="text-purple-400" />} label="College ID" value={collegeId} />
              <InfoRow icon={<Users size={16} className="text-purple-400" />} label="Department" value={department} />
              <InfoRow icon={<User size={16} className="text-purple-400" />} label="Total Students" value={stats?.overview?.totalStudents?.toString() || "—"} />
              <InfoRow icon={<UserPlus size={16} className="text-purple-400" />} label="Total Faculty" value={stats?.overview?.totalFaculty?.toString() || "—"} />
              <InfoRow icon={<Megaphone size={16} className="text-purple-400" />} label="Active Announcements" value={stats?.overview?.activeAnnouncements?.toString() || "—"} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(link.path)}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 text-left w-full"
            >
              <div className="flex-shrink-0 p-2 bg-gray-50 rounded-xl">
                {link.icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{link.title}</p>
                <p className="text-xs text-gray-500 truncate">{link.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">Notifications</h2>
        <NotificationSettings />
      </div>
    </div>
  );
}

