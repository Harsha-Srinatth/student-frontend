import React, { useState } from "react";
import { StudentSidebarLinks, FacultySidebarLinks } from "../context/Links";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Plus, User } from "lucide-react";

const Bottombar = () => {
  const location = useLocation();
  const { pathname } = location;
  const userRole = Cookies.get("userRole");

  // Sidebar links = all features
  const allLinks =
    userRole === "faculty" ? FacultySidebarLinks : StudentSidebarLinks;

  // Quick access for bottom bar (no labels)
  const bottombarQuickLinks =
    userRole === "faculty"
      ? [
          { ...allLinks.find((l) => l.label === "Home") },
          { ...allLinks.find((l) => l.label === "Student Activity Validation") },
          { ...allLinks.find((l) => l.label === "Recent Verifications") },
        ]
      : [
          { ...allLinks.find((l) => l.label === "Home") },
          { ...allLinks.find((l) => l.label === "Results") || { route: "" } }, // Activities → Results
          { ...allLinks.find((l) => l.label === "Upload Documents") },
        ];

  const profileLink =
    userRole === "faculty"
      ? allLinks.find((l) => l.label === "Settings")
      : allLinks.find((l) => l.label === "Settings");

  // State for + menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-100 rounded-t-xl shadow-lg border-t border-gray-300 z-50">
        <div className="h-16 flex justify-around items-center relative">
          {bottombarQuickLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <Link
                key={link.label}
                to={link.route}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-blue-600 scale-110"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {link.icon}
              </Link>
            );
          })}

          {/* Floating + button */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
          >
            <Plus size={24} />
          </button>

          {/* Profile icon */}
          <Link
            to={profileLink.route}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              pathname === profileLink.route
                ? "text-blue-600 scale-110"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User size={22} />
          </Link>
        </div>
      </div>

      {/* Overlay + Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-2xl p-4 grid grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {allLinks.map((link) => (
              <Link
                key={link.label}
                to={link.route}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="text-gray-600">{link.icon}</div>
                <span className="text-xs mt-1 text-gray-500 text-center">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Bottombar;