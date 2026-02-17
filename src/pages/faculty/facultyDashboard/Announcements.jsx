import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchFacultyAnnouncements } from "../../../features/faculty/facultyDashSlice";
import socketService from "../../../services/socketService";
import AnnouncementDetailView from "../../../components/shared/AnnouncementDetailView";
import { 
  Bell, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import api from "../../../services/api";

const FacultyAnnouncements = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { announcements: announcementsRaw, announcementsLoading, error, announcementsLastFetched, faculty } = useSelector(
    (state) => state.facultyDashboard
  );
  // Ensure announcements is always an array
  const announcements = Array.isArray(announcementsRaw) ? announcementsRaw : [];
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  
  const listenersSetup = useRef(false);
  const hasFetchedRef = useRef(false);
  const fetchTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  const announcementsRef = useRef(announcements);
  const lastFetchedRef = useRef(announcementsLastFetched);
  const lastDispatchTime = useRef(0);
  const DISPATCH_COOLDOWN = 2000;
  
  useEffect(() => {
    announcementsRef.current = announcements;
    lastFetchedRef.current = announcementsLastFetched;
  }, [announcements, announcementsLastFetched]);

  const handleAnnouncementUpdate = useCallback((data) => {
    console.log("Received announcement update:", data);
    const now = Date.now();
    if (now - lastDispatchTime.current < DISPATCH_COOLDOWN) return;
    
    if (!isFetchingRef.current) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      
      fetchTimeoutRef.current = setTimeout(() => {
        if (!isFetchingRef.current) {
          lastDispatchTime.current = Date.now();
          isFetchingRef.current = true;
          dispatch(fetchFacultyAnnouncements({ forceRefresh: true })).finally(() => {
            isFetchingRef.current = false;
          });
        }
        fetchTimeoutRef.current = null;
      }, 500);
    }
  }, [dispatch]);

  const handleSocketConnected = useCallback(() => {
    const now = Date.now();
    if (now - lastDispatchTime.current < DISPATCH_COOLDOWN) return;
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    
    const currentAnnouncements = announcementsRef.current;
    const currentLastFetched = lastFetchedRef.current;
    const now2 = Date.now();
    const isStale = !currentLastFetched || (now2 - currentLastFetched > 2 * 60 * 1000);
    
    if ((!currentAnnouncements || currentAnnouncements.length === 0) || isStale) {
      if (!isFetchingRef.current) {
        fetchTimeoutRef.current = setTimeout(() => {
          if (!isFetchingRef.current) {
            lastDispatchTime.current = Date.now();
            isFetchingRef.current = true;
            dispatch(fetchFacultyAnnouncements({ forceRefresh: true })).finally(() => {
              isFetchingRef.current = false;
            });
          }
          fetchTimeoutRef.current = null;
        }, 1000);
      }
    }
  }, [dispatch]);

  const handleSocketReconnected = useCallback(() => {
    const now = Date.now();
    if (now - lastDispatchTime.current < DISPATCH_COOLDOWN) return;
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    
    const currentAnnouncements = announcementsRef.current;
    const currentLastFetched = lastFetchedRef.current;
    const now2 = Date.now();
    const isStale = !currentLastFetched || (now2 - currentLastFetched > 2 * 60 * 1000);
    
    if ((!currentAnnouncements || currentAnnouncements.length === 0) || isStale) {
      if (!isFetchingRef.current) {
        fetchTimeoutRef.current = setTimeout(() => {
          if (!isFetchingRef.current) {
            lastDispatchTime.current = Date.now();
            isFetchingRef.current = true;
            dispatch(fetchFacultyAnnouncements({ forceRefresh: true })).finally(() => {
              isFetchingRef.current = false;
            });
          }
          fetchTimeoutRef.current = null;
        }, 1000);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      const currentAnnouncements = announcementsRef.current;
      const currentLastFetched = lastFetchedRef.current;
      const now = Date.now();
      const isFresh = currentLastFetched && (now - currentLastFetched < 2 * 60 * 1000);
      
      if (!currentAnnouncements || currentAnnouncements.length === 0 || !isFresh) {
        hasFetchedRef.current = true;
        if (!isFetchingRef.current) {
          isFetchingRef.current = true;
          dispatch(fetchFacultyAnnouncements()).finally(() => {
            isFetchingRef.current = false;
          });
        }
      } else {
        hasFetchedRef.current = true;
      }
    }
    
    setupSocketListeners();
    
    return () => {
      if (listenersSetup.current) {
        socketService.off("dashboard:announcements", handleAnnouncementUpdate);
        socketService.off("socket:connected", handleSocketConnected);
        socketService.off("socket:reconnected", handleSocketReconnected);
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [dispatch, handleAnnouncementUpdate, handleSocketConnected, handleSocketReconnected]);

  // Check if user can edit/delete this announcement
  const canModifyAnnouncement = (announcement) => {
    if (!announcement.clubId) return false; // Only club announcements can be modified
    if (!faculty?.facultyid) return false;
    // Check if current user is the creator
    return announcement.createdBy?.adminId === faculty.facultyid;
  };

  // Handle edit
  const handleEdit = (e, announcement) => {
    e.stopPropagation(); // Prevent card click
    setEditAnnouncement(announcement);
    navigate(`/faculty/club-announcements/edit/${announcement._id}`, { state: { announcement } });
  };

  // Handle delete
  const handleDelete = async (e, announcementId) => {
    e.stopPropagation(); // Prevent card click
    
    if (!window.confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
      return;
    }

    setDeletingId(announcementId);
    try {
      await api.delete(`/faculty/clubs/announcements/${announcementId}`);
      // Refresh announcements
      dispatch(fetchFacultyAnnouncements({ forceRefresh: true }));
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
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: "bg-gradient-to-br from-red-50 via-red-50/80 to-orange-50/50",
          border: "border-l-4 border-red-500",
          badge: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
          icon: AlertCircle,
          iconColor: "text-red-500",
          glow: "shadow-red-500/20"
        };
      case 'medium':
        return {
          bg: "bg-gradient-to-br from-amber-50 via-amber-50/80 to-yellow-50/50",
          border: "border-l-4 border-amber-500",
          badge: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
          glow: "shadow-amber-500/20"
        };
      case 'low':
        return {
          bg: "bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-green-50/50",
          border: "border-l-4 border-emerald-500",
          badge: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
          glow: "shadow-emerald-500/20"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/50",
          border: "border-l-4 border-blue-500",
          badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30",
          icon: Info,
          iconColor: "text-blue-500",
          glow: "shadow-blue-500/20"
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="relative p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0aC0xNmMtMi4yMDkgMC00LTEuNzkxLTQtNFYyNmMwLTIuMjA5IDEuNzkxLTQgNC00aDE2YzIuMjA5IDAgNCAxLjc5MSA0IDR2OHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1.5">Announcements</h2>
              <p className="text-indigo-100 text-sm font-medium">Stay updated with important faculty information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {announcements.length > 0 && (
              <div className="flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg">
                    {announcements.length}
                  </span>
                  <span className="text-indigo-100 text-sm">
                    {announcements.length === 1 ? 'announcement' : 'announcements'}
                  </span>
                </div>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/faculty/club-announcements/create')}
              className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg hover:bg-white/30 transition-all text-white font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Club Announcement
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {announcementsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium text-lg">Loading announcements...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Announcements</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                <Bell className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-500 text-center max-w-md">
              There are no announcements at the moment. New announcements will appear here when available.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((announcement, idx) => {
              const config = getPriorityConfig(announcement.priority || 'medium');
              const Icon = config.icon;
              
              return (
                <div
                  key={announcement._id || idx}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className={`group relative ${config.bg} ${config.border} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${config.glow} cursor-pointer`}
                >
                  <div className="flex items-start gap-5">
                    {/* Club Profile Image or Enhanced Icon */}
                    {announcement.clubImage ? (
                      <div className="flex-shrink-0">
                        <img
                          src={announcement.clubImage}
                          alt={announcement.clubName || "Club"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md"
                        />
                      </div>
                    ) : (
                      <div className={`flex-shrink-0 p-4 ${config.bg} rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${config.iconColor}`} />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                            {announcement.title}
                          </h3>
                          {announcement.clubName && (
                            <p className="text-sm text-gray-600 mt-1 font-medium">
                              {announcement.clubName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {canModifyAnnouncement(announcement) && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleEdit(e, announcement)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit announcement"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, announcement._id)}
                                disabled={deletingId === announcement._id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete announcement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${config.badge}`}>
                            {announcement.priority || 'medium'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-5 leading-relaxed whitespace-pre-wrap text-[15px]">
                        {announcement.content}
                      </p>
                      
                      {/* Enhanced Footer */}
                      <div className="flex items-center gap-6 text-sm flex-wrap">
                        <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span className="font-semibold">{formatDate(announcement.createdAt)}</span>
                        </div>
                        {announcement.eventDate && (
                          <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">Event: {formatDate(announcement.eventDate)}</span>
                          </div>
                        )}
                        {announcement.targetYears && announcement.targetYears.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold">{announcement.targetYears.join(", ")} Year{announcement.targetYears.length > 1 ? "s" : ""}</span>
                          </div>
                        )}
                        {announcement.targetAudience && announcement.targetAudience.length > 0 && !announcement.clubId && (
                          <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold capitalize">{announcement.targetAudience.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated gradient overlay */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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
    </div>
  );
};

export default FacultyAnnouncements;
