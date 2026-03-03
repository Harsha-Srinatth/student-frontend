import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Users, ChevronDown, Sparkles, Shield, Crown, Award, User } from "lucide-react";

const ROLES = [
  { value: "member", label: "Member", icon: User, color: "from-gray-500 to-gray-600" },
  { value: "president", label: "President", icon: Crown, color: "from-yellow-500 to-amber-600" },
  { value: "vice-president", label: "Vice President", icon: Award, color: "from-blue-500 to-cyan-600" },
  { value: "secretary", label: "Secretary", icon: Shield, color: "from-purple-500 to-indigo-600" },
  { value: "co-ordinator", label: "Co-ordinator", icon: Shield, color: "from-purple-500 to-indigo-600" },
  { value: "head", label: "Head", icon: Crown, color: "from-yellow-500 to-amber-600" },
  { value: "other", label: "Other", icon: User, color: "from-gray-500 to-gray-600" },
];

export default function EnrollmentModal({ isOpen, club, onClose, onConfirm, isLoading }) {
  const [selectedRole, setSelectedRole] = useState("member");
  const [isHoveringRole, setIsHoveringRole] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole("member");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(selectedRole);
  };

  const selectedRoleData = ROLES.find(r => r.value === selectedRole) || ROLES[0];
  const SelectedRoleIcon = selectedRoleData.icon;

  return (
    <AnimatePresence>
      {isOpen && club && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header with Club Image */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden flex-shrink-0">
              <img
                src={club.imageUrl || club.img}
                alt={club.clubName || club.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect fill="%23e5e7eb" width="400" height="200"/%3E%3Ctext fill="%239ca3af" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EClub Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="absolute right-3 top-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-black hover:bg-white hover:scale-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Club Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                    {club.clubName || club.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2 mb-1.5">
                  {club.description || 'Join this amazing club and connect with like-minded members'}
                </p>
                {/* Club Leadership Info */}
                {(club.facultyCoordinatorDetails || club.studentHeadDetails) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {club.facultyCoordinatorDetails && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <User className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white/90 truncate max-w-[100px]">
                          {club.facultyCoordinatorDetails.fullname}
                        </span>
                      </div>
                    )}
                    {club.studentHeadDetails && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Crown className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white/90 truncate max-w-[100px]">
                          {club.studentHeadDetails.fullname}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
              {/* Welcome Section */}
              <div className="flex items-start gap-3 mb-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-1.5 tracking-tight">
                    Confirm Enrollment
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    You're about to join <span className="font-semibold text-gray-900">{club.clubName || club.name}</span>. 
                    Your enrollment will be processed immediately.
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                  Select Your Role
                </label>
                <div 
                  className="relative"
                  onMouseEnter={() => setIsHoveringRole(true)}
                  onMouseLeave={() => setIsHoveringRole(false)}
                >
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm font-semibold text-gray-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isHoveringRole ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {/* Selected Role Preview */}
                  <div className={`mt-2.5 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r ${selectedRoleData.color} text-white shadow-md transition-all duration-200`}>
                    <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <SelectedRoleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Selected Role</p>
                      <p className="text-sm font-bold text-white truncate">{selectedRoleData.label}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 mb-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-blue-900 mb-2 text-xs">What happens next?</p>
                    <ul className="space-y-1.5 text-xs text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">✓</span>
                        <span>Your enrollment will be confirmed instantly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">✓</span>
                        <span>You'll receive member access to club activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">✓</span>
                        <span>Payment (if required) can be completed later</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-green-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Join</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
