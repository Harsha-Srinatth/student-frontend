import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiUsers, FiUser, FiPhone } from "react-icons/fi";
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

  if (!clubId) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Please select a club to view members</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2">
          <FiUsers className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Club Members</h2>
          <p className="text-sm text-gray-600">View all members of this club</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Members List */}
      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No members found in this club</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <motion.div
                  key={member.studentid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {member.fullname || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        ID: {member.studentid}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {member.role || "member"}
                        </span>
                        {member.mobileno && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            <FiPhone className="w-3 h-3" />
                            {member.mobileno}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

