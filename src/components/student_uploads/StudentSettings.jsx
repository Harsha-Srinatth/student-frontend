import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  BookOpen,
  Calendar,
  Shield,
  Settings,
  AtSign,
  Smartphone,
  GraduationCap,
  Building2,
  IdCard,
  Users,
} from "lucide-react";

import api from "../../services/api.jsx";

const shimmerCls = "animate-pulse bg-gray-200";

const StudentSettings = ({ student }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/student/profile");
        if (!isMounted) return;
        setProfile(res?.data?.data || null);
        console.log("this is from student settings", res.data.data);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const studentData = useMemo(() => {
    if (profile) return profile;
    if (student) return student;
    return {
      fullname: "—",
      studentid: "—",
      dept: "—",
      institution: "—",
      programName: "—",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
    };
  }, [profile, student]);

  const settingsMenu = [
    {
      icon: <User className="w-8 h-8 text-blue-600" />,
      title: "Profile",
      desc: "Update personal details",
      path: "/student/profile",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Leave Requests",
      desc: "Apply & track leave status",
      path: "/student/leave",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      title: "Grades",
      desc: "View your results & credits",
      path: "/student/grades",
    },
    {
      icon: <Calendar className="w-8 h-8 text-pink-600" />,
      title: "Attendance",
      desc: "Check attendance percentage",
      path: "/student/attendance",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Security",
      desc: "Change password & privacy",
      path: "/student/security",
    },
    {
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      title: "Preferences",
      desc: "Customize your dashboard",
      path: "/student/preferences",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <div className="p-6 md:p-10 space-y-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
        >
          {/* Student ID Badge */}
          <div className="absolute top-4 right-4">
            {loading ? (
              <div className={`w-28 h-7 rounded-lg ${shimmerCls}`}></div>
            ) : (
              <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full shadow">
                ID: {studentData.studentid}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture Left */}
            <div className="shrink-0">
              <div className="w-32 h-32 overflow-hidden rounded-xl shadow-md border-4 border-blue-100">
                {loading ? (
                  <div className={`w-full h-full ${shimmerCls}`}></div>
                ) : (
                  <img
                    src={studentData.profilePic}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Details Right */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: studentData.fullname, icon: <User className="w-5 h-5 text-blue-600" /> },
                { label: "Email", value: studentData.email, icon: <AtSign className="w-5 h-5 text-green-600" /> },
                { label: "Username", value: studentData.username, icon: <IdCard className="w-5 h-5 text-purple-600" /> },
                { label: "Mobile", value: studentData.mobileno, icon: <Smartphone className="w-5 h-5 text-pink-600" /> },
                { label: "Department / Branch", value: studentData.dept || studentData.branch, icon: <GraduationCap className="w-5 h-5 text-yellow-600" /> },
                { label: "Program", value: studentData.programName, icon: <BookOpen className="w-5 h-5 text-indigo-600" /> },
                { label: "Institution", value: studentData.institution, icon: <Building2 className="w-5 h-5 text-teal-600" /> },
                { label: "Faculty Name", value: studentData.facultyName, icon: <Users className="w-5 h-5 text-red-600" /> },
                { label: "Faculty ID", value: studentData.facultyid, icon: <IdCard className="w-5 h-5 text-gray-700" /> },
              ].map((field, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {loading ? (
                    <span className={`inline-block w-40 h-5 ${shimmerCls} rounded`}></span>
                  ) : (
                    <>
                      {field.icon}
                      <div>
                        <div className="text-xs text-gray-500">{field.label}</div>
                        <div className="text-base font-medium text-gray-800">{field.value || "—"}</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(loading ? Array.from({ length: 6 }) : settingsMenu).map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="bg-white rounded-2xl shadow-md p-6 cursor-pointer flex flex-col items-center text-center hover:shadow-xl transition"
              onClick={() => !loading && navigate(item.path)}
            >
              {loading ? (
                <div className={`w-8 h-8 rounded ${shimmerCls}`}></div>
              ) : (
                item.icon
              )}
              <h3 className="text-lg font-semibold text-gray-800 mt-3">
                {loading ? (
                  <span className={`inline-block w-24 h-5 ${shimmerCls} rounded`}></span>
                ) : (
                  item.title
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {loading ? (
                  <span className={`inline-block w-36 h-4 ${shimmerCls} rounded`}></span>
                ) : (
                  item.desc
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {error && (
          <div className="text-center text-red-600 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
};

export default StudentSettings;