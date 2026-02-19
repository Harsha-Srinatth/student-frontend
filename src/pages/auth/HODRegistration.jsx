import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import PasswordInput from "../../components/shared/PasswordInput";
import { requestPermission } from "../../../firebase.js";

export default function HODRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hodId: "",
    collegeId: "",
    department: "",
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [collegeName, setCollegeName] = useState(null);
  const [checkingCollege, setCheckingCollege] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  // Request FCM token on component mount
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await requestPermission();
        if (token) {
          setFcmToken(token);
          console.log("FCM token obtained:", token);
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };
    getFCMToken();
  }, []);

  // Check college name when collegeId changes
  useEffect(() => {
    const checkCollege = async () => {
      const collegeIdValue = formData.collegeId?.trim();
      if (!collegeIdValue || collegeIdValue.length < 2) {
        setCollegeName(null);
        return;
      }

      setCheckingCollege(true);
      try {
        const response = await api.get(`/college/${encodeURIComponent(collegeIdValue)}`);
        if (response.data?.success && response.data?.data) {
          setCollegeName(response.data.data.collegeName);
        } else {
          setCollegeName(null);
        }
      } catch (error) {
        // College not found or error - that's okay, user can still register
        // Only log if it's not a 404 (expected during typing)
        if (error.response?.status !== 404) {
          console.error("College lookup error:", error);
        }
        setCollegeName(null);
      } finally {
        setCheckingCollege(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkCollege, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.collegeId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      console.log("Sending registration data:", dataToSend);
      // Ensure fullname and username are present
      if (!dataToSend.fullname || !dataToSend.username) {
        setError("Full name and username are required");
        setLoading(false);
        return;
      }
      
      // Add FCM token if available
      if (fcmToken) {
        dataToSend.fcmToken = fcmToken;
      }
      
      const response = await api.post("/register/hod", dataToSend);

      setSuccess(true);
      setTimeout(() => {
        navigate("/hod/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">HOD Registration</h2>
              <p className="text-gray-600">Create your HOD account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-700 font-medium">Registration successful! Redirecting...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">HOD ID *</label>
                  <input
                    type="text"
                    name="hodId"
                    placeholder="Enter HOD ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.hodId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">College ID *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="collegeId"
                      placeholder="Enter college ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.collegeId}
                      onChange={handleChange}
                      required
                    />
                    {checkingCollege && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    )}
                    {collegeName && !checkingCollege && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {collegeName && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{collegeName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Department *</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department (e.g., CSE, ECE)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Username *</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username (min 3 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mobile *</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password *</label>
                  <PasswordInput
                    name="password"
                    placeholder="Enter password (min 8 characters)"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password *</label>
                  <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading || success
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </div>
                ) : success ? (
                  'Registration Successful!'
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate('/hod/login')}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

