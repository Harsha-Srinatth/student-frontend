import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, User, Phone, Mail, Crown, Shield, Award, AlertCircle } from "lucide-react";
import { fetchClubMembers } from "../../features/shared/clubsSlice";

export default function ClubMembers({ clubId }) {
  const dispatch = useDispatch();
  const { membersByClub, membersLoading, membersError } = useSelector((state) => state.clubs);
  const { student: reduxStudent } = useSelector((state) => state.studentDashboard);
  const studentid = reduxStudent?.studentid;
  const members = membersByClub[clubId] || [];
  const loading = membersLoading[clubId] || false;
  const error = membersError[clubId];

  useEffect(() => {
    if (clubId && !members.length && !loading) {
      dispatch(fetchClubMembers(clubId));
    }
  }, [clubId, dispatch, members.length, loading]);

  const getRoleIcon = (role) => {
    const roleLower = role?.toLowerCase() || 'member';
    if (roleLower.includes('president') || roleLower.includes('head')) return Crown;
    if (roleLower.includes('secretary') || roleLower.includes('coordinator')) return Shield;
    if (roleLower.includes('vice')) return Award;
    return User;
  };

  const getRoleColor = (role) => {
    const roleLower = role?.toLowerCase() || 'member';
    if (roleLower.includes('president') || roleLower.includes('head')) {
      return 'from-yellow-500 to-amber-600 bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (roleLower.includes('secretary') || roleLower.includes('coordinator')) {
      return 'from-purple-500 to-indigo-600 bg-purple-50 text-purple-700 border-purple-200';
    }
    if (roleLower.includes('vice')) {
      return 'from-blue-500 to-cyan-600 bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'from-gray-500 to-gray-600 bg-gray-50 text-gray-700 border-gray-200';
  };

  if (!clubId) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Select a Club</h3>
        <p className="text-gray-500 text-xs sm:text-sm">Please select a club to view its members</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 xl:p-8">
      <div className="mb-3 sm:mb-4 flex items-center justify-end">
        {members.length > 0 && (
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium tabular-nums">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-800 font-medium">Loading members...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl sm:rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-red-900 mb-1">Error Loading Members</h3>
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Members Found</h3>
              <p className="text-gray-600 text-xs sm:text-sm">This club doesn't have any members yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {members.map((member, index) => {
                const RoleIcon = getRoleIcon(member.role);
                const roleColors = getRoleColor(member.role);
                const isCurrentUser = member.studentid === studentid;
                
                return (
                  <motion.div
                    key={member.studentid}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.25 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 min-w-0 shadow-sm hover:shadow-md hover:border-teal-400 transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-green-50/0 group-hover:from-teal-50/40 group-hover:to-green-50/40 transition-all duration-200 pointer-events-none" />
                    
                    {isCurrentUser && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-0.5 bg-gradient-to-r from-teal-600 to-green-600 text-white text-[10px] sm:text-xs font-semibold rounded shadow-sm">
                          You
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 w-full min-w-0">
                      <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className={`relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${roleColors.split(' ')[0]} ${roleColors.split(' ')[1]} flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200`}>
                          <RoleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight mb-0.5 group-hover:text-teal-700 transition-colors break-words line-clamp-2">
                            {member.fullname || "Unknown Member"}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-wide truncate">
                            ID: {member.studentid}
                          </p>
                        </div>
                      </div>

                      <div className="mb-2 sm:mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-medium border ${roleColors}`}>
                          <RoleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="capitalize">{member.role || "Member"}</span>
                        </span>
                      </div>

                      {(member.mobileno || member.email) && (
                        <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t border-gray-100">
                          {member.mobileno && (
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-teal-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 mb-0">Phone</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-800 break-all leading-tight">{member.mobileno}</p>
                              </div>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-teal-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 mb-0">Email</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-800 break-all leading-tight truncate">{member.email}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
