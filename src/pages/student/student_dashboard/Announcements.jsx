import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchStudentAnnouncements, fetchSDashboardData } from "../../../features/student/studentDashSlice";
import socketService from "../../../services/socketService";
import AnnouncementDetailView from "../../../components/shared/AnnouncementDetailView";
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Info, 
  Sparkles,
  Plus,
  Users,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import api from "../../../services/api";

const Announcements = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { announcements: announcementsRaw, loading, error, student } = useSelector(
    (state) => state.studentDashboard
  );
  // Ensure announcements is always an array
  const announcements = Array.isArray(announcementsRaw) ? announcementsRaw : [];
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const listenersSetup = useRef(false);

  useEffect(() => {
    dispatch(fetchStudentAnnouncements());
    // Ensure student data is loaded for permission checks
    if (!student) {
      dispatch(fetchSDashboardData());
    }
    setupSocketListeners();
    
    return () => {
      if (listenersSetup.current) {
        socketService.off("dashboard:announcements", handleAnnouncementUpdate);
        socketService.off("socket:connected", handleSocketConnected);
        socketService.off("socket:reconnected", handleSocketReconnected);
      }
    };
  }, [dispatch, student]);

  const handleAnnouncementUpdate = (data) => {
    console.log("Received announcement update:", data);
    dispatch(fetchStudentAnnouncements());
  };

  const handleSocketConnected = () => {
    console.log("Socket connected, fetching announcements");
    dispatch(fetchStudentAnnouncements());
  };

  const handleSocketReconnected = () => {
    console.log("Socket reconnected, fetching announcements");
    dispatch(fetchStudentAnnouncements());
  };

  const getRegistrationLink = (announcement) => {
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

  // Check if user can edit/delete this announcement
  const canModifyAnnouncement = (announcement) => {
    if (!announcement.clubId) return false; // Only club announcements can be modified
    
    // Get studentid from multiple possible sources
    const currentStudentId = student?.studentid || student?.studentId;
    
    if (!currentStudentId) {
      return false;
    }
    
    // Check if current user is the creator
    const announcementCreatorId = announcement.createdBy?.adminId;
    const isCreator = announcementCreatorId === currentStudentId;
    
    return isCreator;
  };

  // Handle edit
  const handleEdit = (e, announcement) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/student/club-announcements/edit/${announcement._id}`, { state: { announcement } });
  };

  // Handle delete
  const handleDelete = async (e, announcementId) => {
    e.stopPropagation(); // Prevent card click
    
    if (!window.confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
      return;
    }

    setDeletingId(announcementId);
    try {
      await api.delete(`/student/clubs/announcements/${announcementId}`);
      // Refresh announcements
      dispatch(fetchStudentAnnouncements());
    } catch (error) {
      console.error("Delete announcement error:", error);
      alert(error.response?.data?.message || "Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  const setupSocketListeners = () => {
    if (listenersSetup.current) return;
    
    socketService.on("dashboard:announcements", handleAnnouncementUpdate);
    socketService.on("socket:connected", handleSocketConnected);
    socketService.on("socket:reconnected", handleSocketReconnected);
    
    listenersSetup.current = true;
    
    if (socketService.getIsConnected()) {
      dispatch(fetchStudentAnnouncements());
    }
  };

  const defaultCardConfig = {
    bg: "bg-gradient-to-br from-teal-50 to-teal-100/50",
    border: "border-l-4 border-teal-500",
    icon: Info,
    iconColor: "text-teal-500",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <section className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">Announcements</h3>
              <p className="text-sm text-gray-500">Stay updated with latest news</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-6 text-teal-600 font-medium">Loading announcements...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">Announcements</h3>
              <p className="text-sm text-teal-500">Stay updated with latest news</p>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-teal-50 via-teal-50 to-teal-50 border-b border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">Announcements</h3>
              <p className="text-sm text-gray-600 mt-0.5">Stay updated with latest news and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {announcements.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-teal-200">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-teal-700">
                  {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'}
                </span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/student/club-announcements/create')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Club Announcement
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                <Bell className="w-12 h-12 text-teal-500" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">No Announcements Yet</h4>
            <p className="text-gray-500 text-center max-w-sm">
              There are no announcements at the moment. Check back later for updates!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement, idx) => {
              const config = defaultCardConfig;
              const Icon = config.icon;
              const registrationLink = getRegistrationLink(announcement);
              
              return (
                <div
                  key={announcement._id || idx}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className={`group relative ${config.bg} ${config.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    {/* Club Profile Image or Icon */}
                    {announcement.clubImage ? (
                      <div className="flex-shrink-0">
                        <img
                          src={announcement.clubImage}
                          alt={announcement.clubName || "Club"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-md"
                        />
                      </div>
                    ) : (
                      <div className={`flex-shrink-0 p-3 ${config.bg} rounded-lg`}>
                        <Icon className={`w-6 h-6 ${config.iconColor}`} />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                            {announcement.title}
                          </h4>
                          {announcement.clubName && (
                            <p className="text-sm text-gray-600 mt-1 font-medium">
                              {announcement.clubName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                          {canModifyAnnouncement(announcement) && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleEdit(e, announcement)}
                                className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                title="Edit announcement"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, announcement._id)}
                                disabled={deletingId === announcement._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete announcement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {registrationLink && (
                            <a
                              href={/^https?:\/\//i.test(registrationLink) ? registrationLink : `https://${registrationLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-sm"
                              title="Open registration or participation link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Register / Participate
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(announcement.createdAt)}</span>
                        </div>
                        {announcement.eventDate && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-teal-500" />
                              <span className="font-medium">Event: {formatDate(announcement.eventDate)}</span>
                            </div>
                          </>
                        )}
                        {announcement.targetYears && announcement.targetYears.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">{announcement.targetYears.join(", ")} Year{announcement.targetYears.length > 1 ? "s" : ""}</span>
                            </div>
                          </>
                        )}
                        {registrationLink && (
                          <>
                            <span className="text-gray-300">•</span>
                            <a
                              href={/^https?:\/\//i.test(registrationLink) ? registrationLink : `https://${registrationLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 font-medium text-teal-600 hover:text-teal-700 hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Register / Participate
                            </a>
                          </>
                        )}
                        {announcement.targetAudience && announcement.targetAudience.length > 0 && !announcement.clubId && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span className="capitalize">{announcement.targetAudience.join(", ")}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailView
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </section>
  );
};

export default Announcements;
