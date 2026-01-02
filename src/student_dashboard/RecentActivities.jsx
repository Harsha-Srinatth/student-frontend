import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSDashboardData } from "../features/studentDashSlice";
import { CheckCircle, XCircle, Clock, User, MessageCircle, ArrowRight } from "lucide-react";

const RecentActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    pendingApprovals = [],
    rejectedApprovals = [],
    approvedApprovals = [],
    loading,
    error,
  } = useSelector((state) => state.studentDashboard);

  useEffect(() => {
    // fetchSDashboardData will use cache if data is fresh (< 5 min old)
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  // Combine all activities and sort by latest
  const allActivities = [...approvedApprovals, ...pendingApprovals, ...rejectedApprovals].sort(
    (a, b) => new Date(b.requestedOn) - new Date(a.requestedOn)
  );

  const MAX_DISPLAY = 8;
  const recentActivities = allActivities.slice(0, MAX_DISPLAY);
  const hasMore = allActivities.length > MAX_DISPLAY;

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b pb-3 last:border-none animate-pulse"
            >
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
      <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-2">Error loading activities</p>
          <button
            onClick={() => dispatch(fetchSDashboardData())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (allActivities.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activities</p>
          <p className="text-sm text-gray-400">Your submissions will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{allActivities.length} total</span>
          </div>
          {hasMore && (
            <button
              onClick={() => navigate("/student/pending/approvels")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        {recentActivities.map((a, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start border-b pb-3 last:border-none hover:bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:shadow-sm group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-100 rounded">
                  {getStatusIcon(a.status)}
                </div>
                <p className="font-medium text-gray-800 capitalize">
                  {a.type || "Activity"} - {a.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Requested {getTimeAgo(a.requestedOn)}</span>
                </div>
                {a.reviewedOn && (a.reviewedByName || a.reviewedBy) && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Reviewed {getTimeAgo(a.reviewedOn)}</span>
                  </div>
                )}
              </div>

              {(a.reviewedByName || a.reviewedBy) && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <User className="w-3 h-3" />
                  <span>by {a.reviewedByName || a.reviewedBy}</span>
                </div>
              )}

              {a.message && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MessageCircle className="w-3 h-3" />
                  <span className="italic">"{a.message}"</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 text-sm rounded-xl font-medium flex items-center gap-1 ${
                  a.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : a.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {getStatusIcon(a.status)}
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(a.requestedOn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
        ))}

        {/* Fill empty space if less than MAX_DISPLAY */}
        {recentActivities.length < MAX_DISPLAY &&
          Array.from({ length: MAX_DISPLAY - recentActivities.length }).map((_, idx) => (
            <li key={`empty-${idx}`} className="h-24"></li>
          ))}
      </ul>
    </section>
  );
};

export default RecentActivities;