import React, { useState } from "react";
import RoleSelector from "./RoleSelector";
import StudentLogin from "./StudentLogin";
import FacultyLogin from "./FacultyLogin";

const Roleforlogin = () => {
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {!role ? (
            <div className="p-8">
              <RoleSelector 
                onSelectRole={setRole} 
                title="Welcome Back"
                subtitle="Sign in to your account to continue"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => setRole("")}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
              </div>
              
              <div className="pt-16">
                {role === "student" ? (
                  <StudentLogin />
                ) : (
                  <FacultyLogin />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roleforlogin;
