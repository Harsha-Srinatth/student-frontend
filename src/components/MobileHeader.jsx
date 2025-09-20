import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const MobileHeader = () => {
  // Get values from cookies
  const userRole = Cookies.get("userRole") || "student";
  const fullname = Cookies.get("fullname") || Cookies.get("name") || "";
  const username = Cookies.get("username") || "";
  const imageUrl = Cookies.get("imageUrl") || "";

  // Display name fallback
  const displayName = fullname || username || "User";

  // Routes
  const homeRoute = userRole === "faculty" ? "/faculty/home" : "/student/home";
  const settingsRoute =
    userRole === "faculty" ? "/faculty/settings" : "/student/settings";

  // Tagline based on role
  const tagline =
    userRole === "faculty"
      ? "Guide, validate, and support student growth"
      : "Track and showcase your achievements effortlessly";

  return (
    <header className="w-full h-16 bg-gradient-to-r from-gray-900 via-indigo-950 to-black 
      px-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      
      {/* Left: Logo + App name + tagline */}
      <Link to={homeRoute} className="flex items-center gap-2 min-w-0">
        {/* Logo */}
        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 
          rounded-full flex items-center justify-center 
          text-white font-bold shadow-md hover:scale-105 transition overflow-hidden">
          <img
            src="/logo.jpg"
            alt="App Logo"
            className="w-full h-full object-cover"
          />
        </div>


        {/* App name + tagline */}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white truncate">
            Smart Student Hub
          </span>
          <span className="text-[11px] text-gray-300 truncate max-w-[40vw]">
            {tagline}
          </span>
        </div>
      </Link>

      {/* Right: Username + avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden xs:block text-sm font-medium text-gray-200 truncate max-w-[100px]">
          {displayName}
        </span>

        <Link to={settingsRoute} className="shrink-0 group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border-2 
                border-transparent group-hover:border-blue-500 
                transition shadow-md"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
              text-white flex items-center justify-center text-sm font-semibold 
              border-2 border-transparent group-hover:border-purple-400 
              shadow-md transition">
              {(displayName || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
