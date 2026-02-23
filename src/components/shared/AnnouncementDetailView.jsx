import React from "react";
import { 
  X, 
  Calendar, 
  Users, 
  Clock, 
  Info,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";

const getRegistrationLink = (announcement) => {
  if (!announcement) return null;
  // Support multiple possible field names from API (camelCase, snake_case, or alternate names)
  const link =
    announcement.participationOrRegistrationLink ??
    announcement.participation_or_registration_link ??
    announcement.participationLink ??
    announcement.participation_link ??
    announcement.registrationLink ??
    announcement.registration_link ??
    announcement.eventLink ??
    announcement.event_link ??
    announcement.link;
  return link && String(link).trim() ? link : null;
};

const AnnouncementDetailView = ({ announcement, onClose }) => {
  if (!announcement) return null;
  const registrationLink = getRegistrationLink(announcement);

  const defaultConfig = {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    border: "border-blue-500",
    icon: Info,
    iconColor: "text-blue-500",
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

  const config = defaultConfig;
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

          {/* Register / Participate link (club events) */}
          {registrationLink && (
            <div className="pt-2">
              <a
                href={/^https?:\/\//i.test(registrationLink) ? registrationLink : `https://${registrationLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors shadow-md"
              >
                <ExternalLink className="w-5 h-5" />
                Register / Participate
              </a>
              <p className="text-sm text-gray-500 mt-2">Opens in a new tab</p>
            </div>
          )}

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

