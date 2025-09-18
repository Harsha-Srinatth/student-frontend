import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const MobileHeader = () => {
  // Get values from cookies
  const userRole = Cookies.get('userRole') || 'student';
  const fullname = Cookies.get('fullname') || Cookies.get('name') || '';
  const username = Cookies.get('username') || '';
  const imageUrl = Cookies.get('imageUrl') || '';

  // Display name fallback
  const displayName = fullname || username || 'User';

  // Routes
  const homeRoute = userRole === 'faculty' ? '/faculty/home' : '/student/home';
  const settingsRoute =
    userRole === 'faculty' ? '/faculty/settings' : '/student/settings';

  // Tagline based on role
  const tagline =
    userRole === 'faculty'
      ? 'Guide, validate, and support student growth'
      : 'Track and showcase your achievements effortlessly';

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Logo + App name + tagline */}
      <Link to={homeRoute} className="flex items-center gap-2 min-w-0">
        {/* Replace this div with your real logo */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          L
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-gray-900 truncate">
            Smart Student Hub
          </span>
          <span className="text-[11px] text-gray-500 truncate max-w-[40vw]">
            {tagline}
          </span>
        </div>
      </Link>

      {/* Right: Username + avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden xs:block text-sm font-medium text-gray-700 truncate max-w-[100px]">
          {displayName}
        </span>

        <Link to={settingsRoute} className="shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {(displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
