import React from "react";
import { 
  X, 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Image as ImageIcon
} from "lucide-react";

const AnnouncementDetailView = ({ announcement, onClose }) => {
  if (!announcement) return null;

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-gradient-to-br from-red-50 to-red-100/50",
          border: "border-red-500",
          badge: "bg-gradient-to-r from-red-500 to-red-600 text-white",
          icon: AlertCircle,
          iconColor: "text-red-500",
        };
      case "medium":
        return {
          bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
          border: "border-amber-500",
          badge: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
        };
      case "low":
        return {
          bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
          border: "border-emerald-500",
          badge: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
          border: "border-blue-500",
          badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
          icon: Info,
          iconColor: "text-blue-500",
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const config = getPriorityConfig(announcement.priority || "medium");
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 ${config.bg} p-6 rounded-t-2xl border-b-4 ${config.border} z-10`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 ${config.bg} rounded-xl shadow-md`}>
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-3xl font-bold text-gray-900">{announcement.title}</h2>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${config.badge} flex-shrink-0`}>
                    {announcement.priority || "medium"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">{formatDate(announcement.createdAt)}</span>
                  </div>
                  {announcement.targetAudience && announcement.targetAudience.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold capitalize">{announcement.targetAudience.join(", ")}</span>
                    </div>
                  )}
                  {announcement.expiresAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">
                        Expires: {new Date(announcement.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {announcement.image && announcement.image.url && (
            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
              <img
                src={announcement.image.url}
                alt={announcement.title}
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden items-center justify-center h-64 bg-gray-100">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Image failed to load</p>
                </div>
              </div>
            </div>
          )}

          {/* Description/Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {announcement.content}
            </div>
          </div>

          {/* Footer Info */}
          {announcement.createdBy && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Created by <span className="font-semibold text-gray-700">{announcement.createdBy.adminName || "Admin"}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailView;

