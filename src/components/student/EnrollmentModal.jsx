import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiUsers, FiChevronDown } from "react-icons/fi";

const ROLES = [
  { value: "member", label: "Member" },
  { value: "president", label: "President" },
  { value: "vice-president", label: "Vice President" },
  { value: "secretary", label: "Secretary" },
  { value: "co-ordinator", label: "Co-ordinator" },
  { value: "head", label: "Head" },
  { value: "other", label: "Other" },
];

export default function EnrollmentModal({ isOpen, club, onClose, onConfirm, isLoading }) {
  const [selectedRole, setSelectedRole] = useState("member");

  useEffect(() => {
    if (isOpen) {
      setSelectedRole("member");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(selectedRole);
  };

  return (
    <AnimatePresence>
      {isOpen && club && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header with Club Image */}
            <div className="relative h-32 w-full overflow-hidden">
            <img
              src={club.imageUrl || club.img}
              alt={club.clubName || club.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white transition-colors shadow-md"
              disabled={isLoading}
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white">{club.clubName || club.name}</h3>
              <p className="text-sm text-white/90 mt-1">{club.description ? club.description.substring(0, 50) + '...' : 'Join this club'}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-full bg-blue-100 p-3">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Enrollment
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You're about to join <span className="font-medium text-gray-900">{club.clubName || club.name}</span>. 
                  Your enrollment will be processed immediately. Payment can be made later if required.
                </p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={isLoading}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Your enrollment will be confirmed instantly</li>
                    <li>• You'll receive member access to club activities</li>
                    <li>• Payment (if required) can be completed later</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Joining...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4" />
                    Confirm Join
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

