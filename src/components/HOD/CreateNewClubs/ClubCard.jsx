import React, { useState, useRef, useEffect } from 'react';
import { Users, User, Crown, MoreVertical, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

const ClubCard = ({ club, onEdit, onDelete, onAssign }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {club.imageUrl ? (
              <img
                src={club.imageUrl}
                alt={club.clubName}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{club.clubName}</h3>
              <span className="mt-1 inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {club.clubDepartment}
              </span>
            </div>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onAssign(club);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
              >
                <Users className="h-4 w-4" />
                Assign Members
              </button>
              <button
                onClick={() => {
                  onDelete(club.clubId);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
              >
                <Trash2 className="h-4 w-4" />
                Delete Club
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{club.description}</p>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Faculty Coordinator</p>
            <p className="text-sm font-medium text-gray-900">
              {club.facultyCoordinatorDetails?.fullname || 'Not Assigned'}
            </p>
            {club.facultyCoordinatorDetails && (
              <p className="text-xs text-gray-500">{club.facultyCoordinatorDetails.facultyid}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <Crown className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Student Head</p>
            <p className="text-sm font-medium text-gray-900">
              {club.studentHeadDetails?.fullname || 'Not Assigned'}
            </p>
            {club.studentHeadDetails && (
              <p className="text-xs text-gray-500">{club.studentHeadDetails.studentid}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Members</p>
            <p className="text-sm font-medium text-gray-900">{club.memberCount || club.members?.length || 0} members</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-700">₹</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Join Fee</p>
            <p className="text-sm font-medium text-gray-900">₹{club.amounttojoin || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
