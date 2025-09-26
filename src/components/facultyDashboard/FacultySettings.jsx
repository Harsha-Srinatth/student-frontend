import React, { useState, useEffect } from "react";
import { useSelector , useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileCheck, BookOpen, Users, Shield, Settings, Mail, Phone, User, Calendar, IdCard, Building2, Briefcase,Clock } from "lucide-react";
import { fetchFacultyDashboardData, fetchFacultyMetrics } from "../../features/facultyDashSlice";
import FacultyMeritsCard from "./facultyMerits";

// Faculty Details Card (passport size image, details right, all fields, improved UI)
const FacultyDetailsCard = ({ facultyData }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center text-center md:text-left relative overflow-hidden gap-10 border border-blue-100"
  >
    <div className="w-28 h-36 rounded-lg overflow-hidden border-4 border-blue-500 shadow-md mb-4 md:mb-0 md:mr-10 flex-shrink-0 bg-gray-100">
      <img
        src={facultyData.profilePic}
        alt="Faculty"
        className="w-full h-full object-cover"
        style={{ aspectRatio: '3/4', objectFit: 'cover' }}
      />
    </div>
    <div className="flex-1 space-y-2">
      <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2"><User className="w-6 h-6 text-blue-500" />{facultyData.fullname}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-left mt-2">
        <div className="flex items-center gap-2"><IdCard className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Faculty ID:</span> <span className="text-gray-800">{facultyData.facultyid}</span></div>
        <div className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Username:</span> <span className="text-gray-800">{facultyData.username}</span></div>
        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-800">{facultyData.email}</span></div>
        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Mobile:</span> <span className="text-gray-800">{facultyData.mobile}</span></div>
        <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Department:</span> <span className="text-gray-800">{facultyData.dept}</span></div>
        <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Institution:</span> <span className="text-gray-800">{facultyData.institution}</span></div>
        <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Designation:</span> <span className="text-gray-800">{facultyData.designation}</span></div>
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> <span className="font-semibold text-gray-700">Date of Join:</span> <span className="text-gray-800">{facultyData.dateofjoin ? new Date(facultyData.dateofjoin).toLocaleDateString() : ''}</span></div>
      </div>
    </div>
  </motion.div>
);


const FacultySettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get real data from Redux
  const faculty = useSelector((state) => state.facultyDashboard.faculty);
  const activities = useSelector((state) => state.facultyDashboard.activities);
  const loading = useSelector((state) => state.facultyDashboard.loading || state.facultyDashboard.activitiesLoading || state.facultyDashboard.metricsLoading);
  const error = useSelector((state) => state.facultyDashboard.error);
  const metrics = useSelector((state) => state.facultyDashboard.metrics);

  useEffect(() => {
    dispatch(fetchFacultyDashboardData());
  }, [dispatch]);
  //merits data
  useEffect(() => {
    dispatch(fetchFacultyMetrics());
  }, [dispatch]);

  // Fallback dummy data
  const facultyData = faculty
    ? {
        fullname: faculty.fullname,
        facultyid: faculty.facultyid,
        dept: faculty.dept,
        institution: faculty.institution,
        profilePic:
          faculty.image?.url ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=faculty",
        email: faculty.email,
        mobile: faculty.mobile,
        username: faculty.username,
        dateofjoin: faculty.dateofjoin,
        designation: faculty.designation,
      }
    : {
        fullname: "Dr. Harsha Srinath",
        facultyid: "FAC98765",
        dept: "Information Technology",
        institution: "SRKR Engineering College",
        profilePic:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=faculty",
        email: "harsha@srkr.edu",
        mobile: "9876543210",
        username: "harsha.srinath",
        dateofjoin: "2022-06-01T00:00:00.000Z",
        designation: "Professor",
      };

      const settingsMenu = [
        {
          icon: <FileCheck className="w-8 h-8 text-green-600" />,
          title: "Approvals",
          desc: "Approve student activities",
          path: "/faculty/approvals",
        },
        {
          icon: <BookOpen className="w-8 h-8 text-purple-600" />,
          title: "Documents",
          desc: "Upload & verify docs",
          path: "/faculty/docs",
        },
        {
          icon: <Users className="w-8 h-8 text-blue-600" />,
          title: "Students",
          desc: "Manage assigned students",
          path: "/faculty/students",
        },
        {
          icon: <Clock className="w-8 h-8 text-orange-600" />, // ⏰ leave requests icon
          title: "Leave Requests",
          desc: "Review student leave requests",
          path: "/faculty/leave-requests",
        },
        {
          icon: <Shield className="w-8 h-8 text-red-600" />,
          title: "Security",
          desc: "Change password & privacy",
          path: "/faculty/security",
        },
        {
          icon: <Settings className="w-8 h-8 text-gray-600" />,
          title: "Preferences",
          desc: "Customize faculty portal",
          path: "/faculty/preferences",
        },
      ];
      

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <div className="p-6 md:p-10 space-y-10">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md mb-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium text-base md:text-lg">{error}</p>
            </div>
          </div>
        )}
        {/* Faculty Details Card */}
        <FacultyDetailsCard facultyData={facultyData} />
       {/* Faculty Metrics Card */}
        <FacultyMeritsCard metrics={metrics} />

        {/* Settings Navigation */}
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
};

export default FacultySettings;