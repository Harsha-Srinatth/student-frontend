import React, { useState } from "react";
import { StudentSidebarLinks, FacultySidebarLinks } from "../../context/Links";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const rawLinks =
    userRole === "faculty" ? FacultySidebarLinks : StudentSidebarLinks;

  // 🎨 Assign hover colors dynamically to links
  const colors = [
    "blue",
    "green",
    "pink",
    "orange",
    "purple",
    "teal",
    "yellow",
  ];

  const sidebarLinks = rawLinks.map((link, idx) => ({
    ...link,
    hoverColor: colors[idx % colors.length], // rotate colors
  }));

  return (
    <div className="h-full flex flex-col w-64 
      bg-gradient-to-b from-gray-900 via-indigo-950 to-black 
      text-gray-100 border-r border-gray-800 shadow-2xl">
      
      {/* 🔹 Logo & App Name */}
      <div className="flex-shrink-0 flex flex-col items-center py-6 px-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 
          rounded-full flex items-center justify-center 
          text-white font-bold shadow-md hover:scale-105 transition overflow-hidden">
          <img
            src="/logo2.jpg"
            alt="App Logo"
            className="w-full h-full object-cover"
           />
         </div>

          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {userRole === "faculty" ? "Faculty Portal" : "Student Hub"}
          </h1>
        </div>
        <span
          className={`mt-2 text-xs px-3 py-1 rounded-full shadow-sm ${
            userRole === "faculty"
              ? "bg-green-200/20 text-green-300 border border-green-400/30"
              : "bg-blue-200/20 text-blue-300 border border-blue-400/30"
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

            // Tailwind classes for hover based on color
            const hoverClass = {
              blue: "hover:bg-blue-600/30 hover:text-blue-300",
              green: "hover:bg-green-600/30 hover:text-green-300",
              pink: "hover:bg-pink-600/30 hover:text-pink-300",
              orange: "hover:bg-orange-600/30 hover:text-orange-300",
              purple: "hover:bg-purple-600/30 hover:text-purple-300",
              teal: "hover:bg-teal-600/30 hover:text-teal-300",
              yellow: "hover:bg-yellow-600/30 hover:text-yellow-300",
            }[link.hoverColor];

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
                  className={`relative flex items-center gap-3 p-3 rounded-xl 
                    transition-all duration-500 ease-in-out group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg"
                        : `${hoverClass} text-gray-300`
                    }`}
                >
                  {/* Icon */}
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {isTabLoading && activeTab === link.route ? (
                      <div className="w-6 h-6 rounded-lg bg-gray-400 animate-pulse" />
                    ) : (
                      <div
                        className={`w-6 h-6 transition-all duration-500 ease-in-out ${
                          isActive
                            ? "scale-110 text-white"
                            : "group-hover:scale-110"
                        }`}
                      >
                        {link.icon}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium transition-all duration-500 ease-in-out ${
                      isTabLoading && activeTab === link.route
                        ? "bg-gray-400 rounded w-20 h-4 animate-pulse"
                        : isActive
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {!isTabLoading || activeTab !== link.route
                      ? link.label
                      : ""}
                  </span>

                  {/* Active Indicator */}
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
      <div className="px-4 py-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 
            text-sm font-medium text-red-400 rounded-lg 
            hover:bg-red-500/20 hover:text-red-300 
            transition-all duration-500 ease-in-out"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
