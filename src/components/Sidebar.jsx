import React, { useEffect, useState } from "react";
import { StudentSidebarLinks, FacultySidebarLinks } from "../context/Links";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Cookies from "js-cookie";
import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const [activeTab, setActiveTab] = useState(pathname);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      Cookies.remove("userRole");
      navigate("/roleforlogin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const userRole = Cookies.get("userRole");
  const sidebarLinks =
    userRole === "faculty" ? FacultySidebarLinks : StudentSidebarLinks;

  return (
    <div className="h-full flex flex-col w-64 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 border-r border-gray-200 shadow-lg">
      {/* 🔹 Logo & App Name Section */}
      <div className="flex-shrink-0 flex flex-col items-center py-6 px-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Placeholder for Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {userRole === "faculty" ? "Faculty Portal" : "Student Hub"}
          </h1>
        </div>
        <span
          className={`mt-2 text-xs px-3 py-1 rounded-full ${
            userRole === "faculty"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {userRole === "faculty" ? "Faculty" : "Student"}
        </span>
      </div>

      {/* 🔹 Navigation Links */}
      <nav className="flex-1 px-3 mt-6">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  onClick={() => {
                    if (activeTab !== link.route) {
                      setIsTabLoading(true);
                      setActiveTab(link.route);
                      setTimeout(() => setIsTabLoading(false), 500);
                    }
                  }}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group 
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-md"
                        : "hover:bg-gray-200 hover:shadow-sm"
                    }`}
                >
                  {/* 🔹 Icon with skeleton shimmer */}
                  <div className="relative w-6 h-6">
                    {isTabLoading && activeTab === link.route ? (
                      <div className="w-6 h-6 rounded-lg bg-gray-300 animate-pulse" />
                    ) : (
                      <div
                        className={`w-6 h-6 transition-all duration-300 ${
                          isActive
                            ? "scale-110 text-white"
                            : "text-gray-600 group-hover:text-blue-600"
                        }`}
                      >
                        {link.icon}
                      </div>
                    )}
                  </div>

                  {/* 🔹 Label */}
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${
                      isTabLoading && activeTab === link.route
                        ? "bg-gray-300 rounded w-20 h-4 animate-pulse"
                        : isActive
                        ? "text-white"
                        : "text-gray-700 group-hover:text-blue-700"
                    }`}
                  >
                    {!isTabLoading || activeTab !== link.route
                      ? link.label
                      : ""}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l animate-pulse"></span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 🔹 Logout */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
