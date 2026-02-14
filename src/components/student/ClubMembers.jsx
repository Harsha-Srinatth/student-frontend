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
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center shadow-sm">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Club</h3>
        <p className="text-gray-500 text-sm">Please select a club to view its members</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Club Members</h2>
            <p className="text-gray-600 text-sm mt-1">Connect with fellow club members</p>
          </div>
        </div>
        {members.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-sm font-medium text-blue-700">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Loading members...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Members</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center shadow-sm">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Members Found</h3>
              <p className="text-gray-500 text-sm">This club doesn't have any members yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {members.map((member, index) => {
                const RoleIcon = getRoleIcon(member.role);
                const roleColors = getRoleColor(member.role);
                const isCurrentUser = member.studentid === studentid;
                
                return (
                  <motion.div
                    key={member.studentid}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 pointer-events-none"></div>
                    
                    {/* Current User Badge */}
                    {isCurrentUser && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-lg shadow-md">
                          You
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 w-full">
                      {/* Header Section - Avatar & Name */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColors.split(' ')[0]} ${roleColors.split(' ')[1]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <RoleIcon className="w-8 h-8 text-white" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1.5 group-hover:text-blue-600 transition-colors break-words">
                            {member.fullname || "Unknown Member"}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono tracking-wide">
                            ID: {member.studentid}
                          </p>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${roleColors} shadow-sm group-hover:shadow-md transition-shadow`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          <span className="capitalize">{member.role || "Member"}</span>
                        </span>
                      </div>

                      {/* Contact Info Section */}
                      {(member.mobileno || member.email) && (
                        <div className="space-y-2.5 pt-4 border-t border-gray-100">
                          {member.mobileno && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Phone className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                <p className="text-sm font-semibold text-gray-900 break-all">{member.mobileno}</p>
                              </div>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Mail className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                <p className="text-sm font-semibold text-gray-900 break-all">{member.email}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
