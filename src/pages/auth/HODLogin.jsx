import React, { useState } from "react";
import api from "../../services/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/shared/PasswordInput";

export default function HODLogin() {
  const navigate = useNavigate();
  const [hodId, setHodId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/hod/login", {
        hodId,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      const cookieOpts = { expires: 7, secure: typeof window !== "undefined" && window.location.protocol === "https:" };
      Cookies.set("token", token, cookieOpts);
      Cookies.set("userRole", "hod", cookieOpts);
      Cookies.set("hodId", user.hodId, cookieOpts);
      Cookies.set("collegeId", user.collegeId, cookieOpts);
      if (user.department) {
        Cookies.set("department", user.department, cookieOpts);
      }

      navigate("/hod/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Login Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">HOD Portal</h2>
                <p className="text-gray-600">Sign in to manage your department</p>
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

              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">HOD ID</label>
                  <input
                    type="text"
                    placeholder="Enter your HOD ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    value={hodId}
                    onChange={(e) => setHodId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <PasswordInput
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => navigate('/hod/register')}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-50 to-indigo-50 items-center justify-center p-8">
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">HOD Control Center</h3>
              <p className="text-gray-600 text-lg max-w-sm mx-auto">
                Manage announcements, assign faculty, view analytics, and monitor department performance all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

