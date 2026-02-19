import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";
import { CheckCircle, XCircle, Clock, User, MessageCircle, ArrowRight } from "lucide-react";

const RecentActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentDashboard = useSelector((state) => state.studentDashboard);
  const pendingApprovals = studentDashboard.pendingApprovals || [];
  const rejectedApprovals = studentDashboard.rejectedApprovals || [];
  const approvedApprovals = studentDashboard.approvedApprovals || [];
  const { loading, error } = studentDashboard;

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

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
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
      case "rejected": return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      default: return <Clock className="w-3.5 h-3.5 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-none animate-pulse">
              <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-500 text-sm mb-2">Error loading activities</p>
          <button onClick={() => dispatch(fetchSDashboardData())} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
        </div>
      </section>
    );
  }

  if (allActivities.length === 0) {
    return (
      <section className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="text-center py-8">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activities</p>
          <p className="text-xs text-gray-400">Your submissions will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-base sm:text-lg font-semibold truncate">Recent Activities</h3>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {allActivities.length} total
          </span>
          {hasMore && (
            <button
              onClick={() => navigate("/student/pending/approvels")}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
        {recentActivities.map((a, idx) => (
          <li
            key={idx}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b pb-3 last:border-none hover:bg-gray-50 p-2.5 sm:p-3 rounded-lg gap-2"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-blue-100 rounded flex-shrink-0">{getStatusIcon(a.status)}</div>
                <p className="font-medium text-gray-800 capitalize text-sm truncate">
                  {a.type || "Activity"} - {a.description}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeAgo(a.requestedOn)}</span>
                {a.reviewedOn && (a.reviewedByName || a.reviewedBy) && (
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> by {a.reviewedByName || a.reviewedBy}</span>
                )}
              </div>
              {a.message && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MessageCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="italic truncate">"{a.message}"</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <span className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 ${
                a.status === "approved" ? "bg-green-100 text-green-700"
                : a.status === "rejected" ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}>
                {getStatusIcon(a.status)}
                <span className="hidden sm:inline">{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block">
                {new Date(a.requestedOn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentActivities;
