import React from "react";
import { Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";

const RecentVerificationsList = ({
  approvals = [],
  total = 0,
  loading = false,
  error = null,
  onRetry,
  variant = "summary", // "summary" = home card, "full" = full page
  limit = 10,
  onViewAll,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const items = variant === "summary" ? approvals.slice(0, limit) : approvals;

  return (
    <section
      className={`flex flex-col bg-white shadow-md rounded-2xl p-6 animate-fadeIn 
        w-full ${variant === "full" ? "h-full" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Verifications</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{total || 0} total</span>
        </div>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-3 overflow-y-auto max-h-[400px] lg:max-h-[600px]">
        {items.map((approval, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start border-b pb-3 last:border-none 
              hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-blue-100 rounded">
                  {approval.type === "certificate" ? (
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  ) : approval.type === "workshop" ? (
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
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-3 py-1 text-sm rounded-xl font-medium ${
                  approval.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {approval.status === "approved" ? "Approved" : "Rejected"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(approval.approvedOn)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* View all button */}
      {variant === "summary" && approvals.length > limit && onViewAll && (
        <div className="text-center mt-4">
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Verifications →
          </button>
        </div>
      )}
    </section>
  );
};

export default RecentVerificationsList;
