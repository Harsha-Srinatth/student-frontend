// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../services/api"; // axios instance
import Cookies from "js-cookie";

export default function StudentLogin() {
  const [studentid, setStudentid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login/as/student", {
        studentid,
        password,
        
      });

      // Assuming the response contains token in response.data.token
      const token = response.data.token;

      // Save token in cookies (expires in 7 days)
      Cookies.set("token", token, { expires: 7, secure: true });

      // Optionally, redirect the user after login
      //window.location.href = "/dashboard"; // change as needed
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-200 rounded-2xl">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
              S
            </div>
            <span className="font-bold text-lg">Smart Student Hub</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>

          {error && (
            <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Register Number</label>
            <input
              type="text"
              placeholder="Enter Reg.No || Admission.No"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={studentid}
              onChange={(e) => setStudentid(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        {/* Right Side - Illustration (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-indigo-50 items-center justify-center flex-col p-8">
          <img
            src="https://undraw.co/api/illustrations/student?color=indigo"
            alt="Illustration"
            className="max-w-xs"
          />
          <h3 className="mt-6 text-xl font-bold">Smart Student Hub</h3>
          <p className="mt-2 text-gray-600 text-center max-w-sm">
            We’ve got tools to help you grow your learning journey. Stay
            productive anytime, anywhere.
          </p>
          <button className="mt-4 px-4 py-2 border rounded-lg text-indigo-600 hover:bg-indigo-100">
            Start Academy
          </button>
        </div>
      </div>
    </div>
  );
}
