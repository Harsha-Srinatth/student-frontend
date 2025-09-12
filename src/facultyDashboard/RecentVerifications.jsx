import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyActivities } from "../features/facultyDashSlice";
import { Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";

const RecentVerifications = () => {
  const dispatch = useDispatch();
  const { activities = {}, activitiesLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );

  useEffect(() => {
    dispatch(fetchFacultyActivities());
  }, [dispatch]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Get recent approvals (last 10)
  const recentApprovals = activities.recentApprovals || [];

  if (activitiesLoading) {
    return (
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Verifications</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-none animate-pulse">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Verifications</h3>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading verifications</p>
          <button 
            onClick={() => dispatch(fetchFacultyActivities())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (recentApprovals.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Verifications</h3>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent verifications</p>
          <p className="text-sm text-gray-400">Approvals will appear here once you start reviewing submissions</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Verifications</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{activities.totalApprovals || 0} total</span>
        </div>
      </div>
      
      <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto">
        {recentApprovals.map((approval, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start border-b pb-3 last:border-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-blue-100 rounded">
                  {approval.type === 'certificate' ? (
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  ) : approval.type === 'workshop' ? (
                    <Calendar className="w-3 h-3 text-blue-600" />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                <p className="font-medium text-gray-800 capitalize">
                  {approval.type} - {approval.description}
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{approval.studentName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(approval.approvedOn)}</span>
                </div>
              </div>
              
              {approval.message && (
                <p className="text-xs text-gray-400 mt-1 italic">
                  "{approval.message}"
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 text-sm rounded-xl font-medium ${
                  approval.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {approval.status === "approved" ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Approved
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Rejected
                  </div>
                )}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(approval.approvedOn)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      {recentApprovals.length >= 10 && (
        <div className="text-center mt-4">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Verifications →
          </button>
        </div>
      )}
    </section>
  );
};

export default RecentVerifications;
