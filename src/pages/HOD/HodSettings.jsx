import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Megaphone,
  BarChart3,
  Building2,
  Users,
  UserPlus,
  Settings,
  IdCard,
  Shield,
  Briefcase,
  CheckCircle2,
  AtSign,
  Smartphone,
  GraduationCap,
  Award,
} from "lucide-react";
import { fetchHODDashboardStats } from "../../features/HOD/hodDashSlice";
import {
  setHODInfo,
  fetchDepartmentFaculty,
  fetchDepartmentStudents,
  selectAssignmentStats,
} from "../../features/HOD/hodAssignmentSlice";
import NotificationSettings from "../../components/shared/NotificationSettings";
import Cookies from "js-cookie";
import api from "../../services/api";

const shimmerCls = "animate-pulse bg-gray-200";

export default function HodSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.hodDashboard);
  const { hodInfo } = useSelector((s) => s.hodAssignment);
  const assignmentStats = useSelector(selectAssignmentStats);
  const [hodInfoLoading, setHodInfoLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchHODDashboardStats());
    dispatch(fetchDepartmentFaculty());
    dispatch(fetchDepartmentStudents());
  }, [dispatch]);

  useEffect(() => {
    const fetchHODInfo = async () => {
      if (!hodInfo) {
        setHodInfoLoading(true);
        try {
          const response = await api.get("/hod/info");
          const raw = response.data?.data?.hod ?? response.data?.hod ?? response.data?.data;
          if (raw && (raw.hodId || raw.fullname || raw.email)) {
            dispatch(setHODInfo({
              ...raw,
              mobile: raw.mobile ?? raw.mobileno ?? raw.phone ?? raw.contactNumber ?? raw.mobileNo,
            }));
          }
        } catch (err) {
          console.error("Error fetching HOD info:", err);
        } finally {
          setHodInfoLoading(false);
        }
      }
    };
    fetchHODInfo();
  }, [dispatch, hodInfo]);

  const loadingDetail = loading || hodInfoLoading;

  const hodData = useMemo(() => {
    const info = hodInfo || {};
    const dept = info.department?.name || info.department || Cookies.get("department") || "—";
    const college = info.collegeName ?? info.college?.name ?? Cookies.get("collegeId") ?? "—";
    return {
      fullname: info.fullname || info.name || "HOD",
      email: info.email || "—",
      mobileno: info.mobile ?? info.mobileno ?? info.phone ?? info.contactNumber ?? info.mobileNo ?? "—",
      hodId: info.hodId || Cookies.get("hodId") || "—",
      department: dept,
      college,
      profilePic:
        info.profileImage?.url ||
        info.profilePic ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=hod",
    };
  }, [hodInfo]);

  const settingsMenu = [
    {
      icon: <Megaphone className="w-8 h-8 text-teal-700" />,
      title: "Announcements",
      desc: "Create & manage announcements",
      path: "/hod/announcements",
    },
    {
      icon: <UserPlus className="w-8 h-8 text-teal-700" />,
      title: "Assign Faculty",
      desc: "Manage faculty assignments",
      path: "/hod/assign-faculty",
    },
    {
      icon: <Building2 className="w-8 h-8 text-teal-700" />,
      title: "Clubs",
      desc: "Manage clubs & activities",
      path: "/hod/clubs",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-teal-700" />,
      title: "Analytics",
      desc: "Department performance insights",
      path: "/hod/analytics",
    },
    {
      icon: <Users className="w-8 h-8 text-teal-700" />,
      title: "Dashboard",
      desc: "Overview & statistics",
      path: "/hod/dashboard",
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-700" />,
      title: "Security",
      desc: "Password & privacy settings",
      path: "/hod/settings",
    },
  ];

  const detailFields = [
      { label: "Full Name", value: hodData.fullname, icon: <User className="w-5 h-5 text-teal-700" /> },
    { label: "Email", value: hodData.email, icon: <AtSign className="w-5 h-5 text-teal-700" /> },
    { label: "Mobile", value: hodData.mobileno, icon: <Smartphone className="w-5 h-5 text-teal-700" /> },
    { label: "HOD ID", value: hodData.hodId, icon: <IdCard className="w-5 h-5 text-teal-700" /> },
    { label: "Department", value: hodData.department, icon: <GraduationCap className="w-5 h-5 text-teal-700" /> },
    { label: "College", value: hodData.college, icon: <Building2 className="w-5 h-5 text-teal-700" /> },
  ];

  const countItems = [
    { label: "Total Students", value: assignmentStats?.totalStudents ?? stats?.overview?.totalStudents ?? 0, icon: User },
    { label: "Total Faculty", value: assignmentStats?.totalFaculty ?? stats?.overview?.totalFaculty ?? 0, icon: UserPlus },
    { label: "Sections", value: assignmentStats?.totalSections ?? 0, icon: Building2 },
    { label: "Assigned Faculty", value: assignmentStats?.assignedFacultyCount ?? 0, icon: CheckCircle2 },
    { label: "Active Announcements", value: stats?.overview?.activeAnnouncements ?? 0, icon: Megaphone },
    { label: "Clubs", value: stats?.overview?.totalClubs ?? 0, icon: Briefcase },
  ];

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <div className="p-6 md:p-10 space-y-10">
        {/* Profile Card — same layout as StudentSettings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            {loadingDetail ? (
              <div className={`w-28 h-7 rounded-lg ${shimmerCls}`} />
            ) : (
              <span className="px-4 py-1 bg-teal-700 text-white text-sm font-semibold rounded-full shadow">
                ID: {hodData.hodId}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="shrink-0">
              <div className="w-32 h-32 overflow-hidden rounded-xl shadow-md border-4 border-teal-100">
                {loadingDetail ? (
                  <div className={`w-full h-full ${shimmerCls} rounded`} />
                ) : (
                  <img
                    src={hodData.profilePic}
                    alt="HOD"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detailFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {loadingDetail ? (
                    <span className={`inline-block w-40 h-5 ${shimmerCls} rounded`} />
                  ) : (
                    <>
                      {field.icon}
                      <div>
                        <div className="text-xs text-gray-500">{field.label}</div>
                        <div className="text-base font-medium text-gray-800">
                          {field.value || "—"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Department Overview — same style as "Your Scores" in StudentSettings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-800">Department Overview</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countItems.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <span className="w-6 h-6 flex-shrink-0 text-teal-600">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                    <p className="text-base font-bold text-gray-800">
                      {loading ? (
                        <span className={`inline-block w-12 h-5 ${shimmerCls} rounded`} />
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NotificationSettings
            userType="hod"
            userId={hodData.hodId}
            currentToken={hodInfo?.fcmToken}
            isLoading={hodInfoLoading}
          />
        </motion.div>

        {/* Settings Navigation — same card grid as StudentSettings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {settingsMenu.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-md p-6 cursor-pointer flex flex-col items-center text-center hover:shadow-xl transition"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <h3 className="text-lg font-semibold text-gray-800 mt-3">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
