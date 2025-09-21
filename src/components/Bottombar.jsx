import React, { useState } from "react";
import { StudentSidebarLinks, FacultySidebarLinks } from "../context/Links";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Plus, LogOut } from "lucide-react"; // Added logout icon

const Bottombar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const userRole = Cookies.get("userRole");

  const allLinks =
    userRole === "faculty" ? FacultySidebarLinks : StudentSidebarLinks;

  const bottombarQuickLinks =
    userRole === "faculty"
      ? [
          { ...allLinks.find((l) => l.label === "Dashboard") },
          { ...allLinks.find((l) => l.label === "Activity Approvals") },
          { ...allLinks.find((l) => l.label === "Verification History") },
        ]
      : [
          { ...allLinks.find((l) => l.label === "Dashboard") },
          { ...allLinks.find((l) => l.label === "Upload Files") },
          { ...allLinks.find((l) => l.label === "Pending Tasks") },
          { ...allLinks.find((l) => l.label === "Achievements") },
        ];

  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Logout handler
  const handleLogout = () => {
    Cookies.remove("userRole");
    Cookies.remove("token");
    navigate("/landing/page");
  };

  return (
    <>
      {/* 🔹 Bottom bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 w-full 
        bg-gradient-to-r from-gray-900 via-indigo-950 to-black
        rounded-t-xl shadow-xl border-t border-gray-700 z-50"
      >
        <div className="h-16 flex justify-around items-center relative">
          {bottombarQuickLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <Link
                key={link.label}
                to={link.route}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive
                    ? "text-blue-400 scale-110"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.icon}
              </Link>
            );
          })}

          {/* 🔹 Floating "View More" icon button */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute -top-7 left-1/2 transform -translate-x-1/2 
              bg-gradient-to-r from-blue-600 to-purple-600 text-white 
              w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
              hover:scale-110 transition duration-300"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 🔹 Overlay + Expandable Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-gray-900 via-indigo-950 to-black 
              w-full rounded-t-2xl p-4 grid grid-cols-3 gap-4 max-h-[70vh] 
              overflow-y-auto border-t border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {allLinks.map((link) => (
              <Link
                key={link.label}
                to={link.route}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-3 rounded-lg 
                  hover:bg-gray-800 transition-all duration-200"
              >
                <div className="text-gray-300 group-hover:text-white">
                  {link.icon}
                </div>
                <span className="text-xs mt-1 text-gray-400 group-hover:text-gray-200 text-center">
                  {link.label}
                </span>
              </Link>
            ))}

            {/* 🔹 Logout Button */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-3 rounded-lg 
                hover:bg-red-600/30 transition-all duration-200 text-red-400"
            >
              <LogOut size={24} />
              <span className="text-xs mt-1 text-red-400">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Bottombar;
