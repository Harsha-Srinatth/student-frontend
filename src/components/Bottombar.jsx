
import React from 'react';
import { StudentBottombarLinks, FacultyBottombarLinks } from '../context/Links';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Bottombar = () => {
  const location = useLocation();
  const { pathname } = location;
  
  // Get user role and appropriate links
  const userRole = Cookies.get('userRole');
  const bottombarLinks = userRole === 'faculty' ? FacultyBottombarLinks : StudentBottombarLinks;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-100 rounded-t-xl shadow-lg border-t border-gray-800 z-50">
      {/* Role Indicator */}
      <div className="px-4 py-1 text-center">
        <span className={`text-xs px-2 py-1 rounded-full ${
          userRole === 'faculty' 
            ? 'bg-green-200 text-green-800' 
            : 'bg-blue-200 text-blue-800'
        }`}>
          {userRole === 'faculty' ? 'Faculty Portal' : 'Student Hub'}
        </span>
      </div>
      
      {/* Navigation Links */}
      <div className="h-16 text-black flex justify-around px-2 py-2">
        <div className="w-full flex justify-around items-center">
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          
          return (
            <Link
              key={link.label}
              to={link.route}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 
                rounded-lg transition-all duration-200 
                ${isActive 
                  ? 'bg-blue-600 text-black shadow-md shadow-blue-500/20 scale-105' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
              `}
            >
              <div className={`
                flex items-center justify-center 
                ${isActive ? 'text-black' : 'text-gray-400'}
              `}>
                <img 
                  src={link.imageURL}
                  alt=""
                  width={isActive ? 22 : 20}
                  height={isActive ? 22 : 20}
                  className={`
                    transition-all duration-200
                    ${isActive ? 'opacity-100' : 'opacity-70'}
                  `}
                />
              </div>
              
              <p className={`
                text-xs font-medium transition-all duration-200
                ${isActive ? 'text-black' : 'text-gray-400'}
              `}>
                {link.label}
              </p>
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default Bottombar;