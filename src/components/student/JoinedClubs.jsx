import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiChevronRight, FiX, FiUser, FiPhone, FiCalendar, FiDollarSign, FiAward, FiStar, FiBriefcase, FiTarget, FiShield } from "react-icons/fi";
import api from '../../services/api.jsx';
import { fetchClubs, fetchClubMembers } from '../../features/shared/clubsSlice';
import ClubMembers from './ClubMembers.jsx';

export default function JoinedClubs() {
  const dispatch = useDispatch();
  const { clubs, membersByClub, membersLoading, loading: clubsLoading } = useSelector((state) => state.clubs);
  
  const [enrolledClubs, setEnrolledClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // Fetch all clubs if not already loaded
  useEffect(() => {
    if (clubs.length === 0 && !clubsLoading) {
      dispatch(fetchClubs());
    }
  }, [dispatch, clubs.length, clubsLoading]);

  // Load enrolled clubs
  useEffect(() => {
    const loadEnrolledClubs = async () => {
      try {
        setLoading(true);
        // Fetch enrolled clubs
        const enrollRes = await api.get("/api/enrollments/alreadyenrolled");
        const enrollments = enrollRes.data?.clubsJoined || [];
        
        // Get full club details for enrolled clubs
        const enrolledWithDetails = enrollments.map(enrollment => {
          const clubDetail = clubs.find(c => c.clubId === enrollment.clubId);
          return {
            ...enrollment,
            club: clubDetail || null
          };
        });
        
        setEnrolledClubs(enrolledWithDetails);
      } catch (err) {
        console.error("Failed to load enrolled clubs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only load if we have clubs loaded
    if (clubs.length > 0) {
      loadEnrolledClubs();
    }
  }, [clubs]);

  const handleViewMembers = async (clubId) => {
    setSelectedClubId(clubId);
    setShowMembersModal(true);
    
    // Fetch members if not already loaded
    if (!membersByClub[clubId] && !membersLoading[clubId]) {
      dispatch(fetchClubMembers(clubId));
    }
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setSelectedClubId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to format role name and get styling
  const getRoleInfo = (role) => {
    const roleLower = (role || "member").toLowerCase();
    
    const roleConfig = {
      "president": {
        label: "President",
        icon: FiAward,
        bgColor: "bg-gradient-to-r from-amber-500 to-orange-600",
        textColor: "text-white",
        borderColor: "border-amber-400",
        badgeClass: "shadow-lg shadow-amber-500/30"
      },
      "vice-president": {
        label: "Vice President",
        icon: FiStar,
        bgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
        textColor: "text-white",
        borderColor: "border-purple-400",
        badgeClass: "shadow-lg shadow-purple-500/30"
      },
      "head": {
        label: "Head",
        icon: FiShield,
        bgColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
        textColor: "text-white",
        borderColor: "border-blue-400",
        badgeClass: "shadow-lg shadow-blue-500/30"
      },
      "co-ordinator": {
        label: "Co-ordinator",
        icon: FiTarget,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
        textColor: "text-white",
        borderColor: "border-green-400",
        badgeClass: "shadow-lg shadow-green-500/30"
      },
      "secretary": {
        label: "Secretary",
        icon: FiBriefcase,
        bgColor: "bg-gradient-to-r from-indigo-500 to-blue-600",
        textColor: "text-white",
        borderColor: "border-indigo-400",
        badgeClass: "shadow-lg shadow-indigo-500/30"
      },
      "member": {
        label: "Member",
        icon: FiUser,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        badgeClass: ""
      },
      "other": {
        label: "Other",
        icon: FiUser,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
        badgeClass: ""
      }
    };

    return roleConfig[roleLower] || roleConfig["member"];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading your clubs...</p>
      </div>
    );
  }

  if (enrolledClubs.length === 0) {
    return (
      <div className="text-center py-12">
        <FiUsers className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clubs Joined</h3>
        <p className="text-gray-600">You haven't joined any clubs yet. Explore and join clubs to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-br from-teal-600 to-green-600 p-2">
          <FiUsers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black">My Joined Clubs</h2>
          <p className="text-sm text-black">View details and members of clubs you've joined</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledClubs.map((enrollment, index) => {
          const club = enrollment.club;
          if (!club) return null;

          return (
            <motion.div
              key={enrollment.clubId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl hover:border-teal-600 transition-all duration-300"
            >
              {/* Club Image */}
              <div className="relative h-38 w-full overflow-hidden">
                <img
                  src={club.imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"}
                  alt={club.clubName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Role Badge - Top Left */}
                {(() => {
                  const roleInfo = getRoleInfo(enrollment.role);
                  const RoleIcon = roleInfo.icon;
                  return (
                    <div className="absolute top-3 left-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${roleInfo.bgColor} ${roleInfo.textColor} px-3 py-1.5 text-xs font-bold border-2 ${roleInfo.borderColor} ${roleInfo.badgeClass} backdrop-blur-sm`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {roleInfo.label}
                      </span>
                    </div>
                  );
                })()}
                
                {/* Enrolled Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                    Enrolled
                  </span>
                </div>
              </div>

              {/* Club Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{club.clubName}</h3>
                <p className="text-sm text-gray-800 line-clamp-2 mb-3 min-h-[2.5rem]">
                  {club.description || "No description available"}
                </p>

                {/* Club Leadership Info */}
                {(club.facultyCoordinatorDetails || club.studentHeadDetails) && (
                  <div className="mb-3 space-y-1.5 text-xs text-gray-900">
                    {club.facultyCoordinatorDetails && (
                      <div className="flex items-center gap-1.5">
                        <FiUser className="w-3 h-3 text-green-600" />
                        <span className="truncate">
                          Coordinator: {club.facultyCoordinatorDetails.fullname}
                        </span>
                      </div>
                    )}
                    {club.studentHeadDetails && (
                      <div className="flex items-center gap-1.5">
                        <FiUsers className="w-3 h-3 text-green-600" />
                        <span className="truncate">
                          Head: {club.studentHeadDetails.fullname}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Enrollment Details */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-black">
                    <FiCalendar className="w-3 h-3 text-green-600" />
                    <span>Joined: {formatDate(enrollment.joinedOn)}</span>
                  </div>
                  {club.amounttojoin > 0 && (
                    <div className="flex items-center gap-2 text-black">
                      <FiDollarSign className="w-3 h-3 text-red-600" />
                      <span>Fee: ₹{club.amounttojoin}</span>
                    </div>
                  )}
                </div>

                {/* View Members Button */}
                <button
                  onClick={() => handleViewMembers(enrollment.clubId)}
                  className="w-full rounded-lg bg-gradient-to-r from-teal-600 to-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-teal-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiUsers className="w-4 h-4" />
                  View Members
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && selectedClubId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0 bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center shadow-lg">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black">Club Members</h3>
                    <p className="text-sm text-black">
                      {clubs.find(c => c.clubId === selectedClubId)?.clubName || "Loading..."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeMembersModal}
                  className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Members List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <ClubMembers clubId={selectedClubId} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

