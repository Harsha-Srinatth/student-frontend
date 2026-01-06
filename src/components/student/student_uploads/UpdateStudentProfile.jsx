import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  AtSign,
  Lock,
  GraduationCap,
  BookOpen,
  Calendar,
  Users,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../../services/api";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";

const UpdateStudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { student: reduxStudent, loading: reduxLoading } = useSelector(
    (state) => state.studentDashboard
  );

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    dept: "",
    programName: "",
    semester: "",
    facultyid: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch student data on mount
  useEffect(() => {
    if (!reduxStudent && !reduxLoading) {
      dispatch(fetchSDashboardData());
    }
  }, [dispatch, reduxStudent, reduxLoading]);

  // Populate form when student data is available
  useEffect(() => {
    if (reduxStudent) {
      setFormData({
        fullname: reduxStudent.fullname || "",
        username: reduxStudent.username || "",
        email: reduxStudent.email || "",
        password: "", // Don't populate password
        dept: reduxStudent.dept || "",
        programName: reduxStudent.programName || "",
        semester: reduxStudent.semester || "",
        facultyid: reduxStudent.facultyid || "",
      });
    }
  }, [reduxStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation (if provided)
    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Required fields validation
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare update payload - only include fields that have values
      const updatePayload = {};
      
      if (formData.fullname.trim()) updatePayload.fullname = formData.fullname.trim();
      if (formData.username.trim()) updatePayload.username = formData.username.trim();
      if (formData.email.trim()) updatePayload.email = formData.email.trim();
      if (formData.password.trim()) updatePayload.password = formData.password.trim();
      if (formData.dept.trim()) updatePayload.dept = formData.dept.trim();
      if (formData.programName.trim()) updatePayload.programName = formData.programName.trim();
      if (formData.semester.trim()) updatePayload.semester = formData.semester.trim();
      if (formData.facultyid.trim()) updatePayload.facultyid = formData.facultyid.trim();

      const response = await api.put("/student/profile/update", updatePayload);

      if (response.data) {
        setSuccess("Profile updated successfully!");
        
        // Refresh dashboard data to get updated info
        dispatch(fetchSDashboardData());

        // Clear password field after successful update
        setFormData((prev) => ({ ...prev, password: "" }));

        // Redirect to settings after 2 seconds
        setTimeout(() => {
          navigate("/student/settings");
        }, 2000);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (reduxLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <div className="p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/student/settings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-2">Edit your personal information and account details</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter new password (min 8 characters)"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only fill this if you want to change your password
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              Academic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="dept"
                    value={formData.dept}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter department"
                  />
                </div>
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="programName"
                    value={formData.programName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter program name"
                  />
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter semester"
                  />
                </div>
              </div>

              {/* Faculty ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty ID
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="facultyid"
                    value={formData.facultyid}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter faculty ID"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/settings")}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateStudentProfile;

