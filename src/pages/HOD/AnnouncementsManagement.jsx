import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  clearAnnouncementsCache,
  updateAnnouncementsRealtime
} from "../../features/HOD/hodAnnouncementsSlice";
import socketService from "../../services/socketService";
import AnnouncementDetailView from "../../components/shared/AnnouncementDetailView";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Search, 
  Filter,
  Calendar,
  Users,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp,
  Clock,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  XCircle
} from "lucide-react";

export default function AnnouncementsManagement() {
  const dispatch = useDispatch();
  const { announcements, loading, creating, updating, deleting, error } = useSelector(
    (state) => state.hodAnnouncements
  );
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: ["both"],
    priority: "medium",
    expiresAt: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const listenersSetup = useRef(false);

  useEffect(() => {
    dispatch(clearAnnouncementsCache());
    dispatch(fetchAnnouncements({ forceRefresh: true }));
    setupSocketListeners();
    
    return () => {
      if (listenersSetup.current) {
        socketService.off("socket:connected", handleSocketConnected);
        socketService.off("socket:reconnected", handleSocketReconnected);
        socketService.off("dashboard:announcements", handleAnnouncementUpdate);
      }
    };
  }, [dispatch]);

  const handleSocketConnected = () => {
    console.log("Socket connected, fetching announcements");
    dispatch(clearAnnouncementsCache());
    dispatch(fetchAnnouncements({ forceRefresh: true }));
  };

  const handleSocketReconnected = () => {
    console.log("Socket reconnected, fetching announcements");
    dispatch(clearAnnouncementsCache());
    dispatch(fetchAnnouncements({ forceRefresh: true }));
  };

  const handleAnnouncementUpdate = (data) => {
    console.log("📢 HOD: Received announcement update via socket:", data);
    // Update Redux store immediately with realtime data
    if (data && data.type) {
      dispatch(updateAnnouncementsRealtime(data));
    }
    // Also fetch fresh data to ensure consistency (with a small delay to avoid race conditions)
    setTimeout(() => {
      dispatch(fetchAnnouncements({ forceRefresh: true }));
    }, 500);
  };

  const setupSocketListeners = () => {
    if (listenersSetup.current) return;
    
    socketService.on("socket:connected", handleSocketConnected);
    socketService.on("socket:reconnected", handleSocketReconnected);
    socketService.on("dashboard:announcements", handleAnnouncementUpdate);
    
    listenersSetup.current = true;
    console.log("✅ HOD: Socket listeners set up for announcements");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      submitData.append("priority", formData.priority);
      submitData.append("expiresAt", formData.expiresAt || "");
      formData.targetAudience.forEach((audience) => {
        submitData.append("targetAudience", audience);
      });
      
      // Add image if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let result;
      if (editingAnnouncement) {
        result = await dispatch(updateAnnouncement({ id: editingAnnouncement._id, formData: submitData })).unwrap();
      } else {
        result = await dispatch(createAnnouncement(submitData)).unwrap();
        // Optimistically add the new announcement to the list immediately
        if (result && result.data) {
          dispatch(updateAnnouncementsRealtime({
            type: "new",
            announcement: result.data
          }));
        }
      }
      setShowModal(false);
      setEditingAnnouncement(null);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || "",
      content: announcement.content || "",
      targetAudience: Array.isArray(announcement.targetAudience) 
        ? announcement.targetAudience 
        : announcement.targetAudience 
          ? [announcement.targetAudience] 
          : ["both"],
      priority: announcement.priority || "medium",
      expiresAt: announcement.expiresAt 
        ? new Date(announcement.expiresAt).toISOString().split('T')[0]
        : "",
      image: announcement.image || null,
    });
    setImagePreview(announcement.image?.url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
      return;
    }
    try {
      await dispatch(deleteAnnouncement(id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      targetAudience: ["both"],
      priority: "medium",
      expiresAt: "",
      image: null,
    });
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-gradient-to-br from-red-50 to-red-100/50",
          border: "border-l-4 border-red-500",
          badge: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
          icon: AlertCircle,
          iconColor: "text-red-500",
        };
      case "medium":
        return {
          bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
          border: "border-l-4 border-amber-500",
          badge: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
        };
      case "low":
        return {
          bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
          border: "border-l-4 border-emerald-500",
          badge: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
          border: "border-l-4 border-blue-500",
          badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30",
          icon: Info,
          iconColor: "text-blue-500",
        };
    }
  };

  // Filter and deduplicate announcements by _id to fix React key warning
  const filteredAnnouncements = announcements
    .filter((announcement, index, self) => 
      // Remove duplicates by keeping only the first occurrence of each _id
      index === self.findIndex(a => a._id === announcement._id)
    )
    .filter((announcement) => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === "all" || announcement.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

  if (loading && announcements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-teal-700 to-teal-800 rounded-2xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0aC0xNmMtMi4yMDkgMC00LTEuNzkxLTQtNFYyNmMwLTIuMjA5IDEuNzkxLTQgNC00aDE2YzIuMjA5IDAgNCAxLjc5MSA0IDR2OHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Announcements Management</h1>
              <p className="text-teal-100 text-base">Create and manage announcements for students and faculty</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingAnnouncement(null);
              setShowModal(true);
            }}
            className="flex items-center gap-3 px-6 py-4 bg-white text-teal-700 rounded-xl hover:bg-teal-50 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg"
          >
            <Plus className="w-6 h-6" />
            Create Announcement
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        {filteredAnnouncements.length !== announcements.length && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </div>
        )}
      </div>

      {/* Announcements Grid */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {announcements.length === 0 ? "No Announcements Yet" : "No Results Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {announcements.length === 0 
                ? "Create your first announcement to get started!" 
                : "Try adjusting your search or filter criteria."}
            </p>
            {announcements.length === 0 && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingAnnouncement(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Create First Announcement
              </button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const config = getPriorityConfig(announcement.priority);
            const Icon = config.icon;
            
            return (
              <div
                key={announcement._id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className={`group relative ${config.bg} ${config.border} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-4 ${config.bg} rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${config.iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {announcement.title}
                        </h3>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${config.badge} flex-shrink-0`}>
                          {announcement.priority}
                        </span>
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-4 py-2 rounded-lg">
                          <Users className="w-4 h-4 text-teal-700" />
                          <span className="font-semibold capitalize">
                            {Array.isArray(announcement.targetAudience) 
                              ? announcement.targetAudience.join(", ") 
                              : announcement.targetAudience || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-4 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-teal-700" />
                          <span className="font-semibold">
                            {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        {announcement.expiresAt && (
                          <div className="flex items-center gap-2 text-gray-600 bg-white/60 px-4 py-2 rounded-lg">
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
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-3 text-teal-700 hover:bg-teal-50 rounded-xl transition-all hover:scale-110 shadow-sm hover:shadow-md"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="p-3 text-teal-700 hover:bg-teal-50 rounded-xl transition-all hover:scale-110 shadow-sm hover:shadow-md"
                      title="Delete"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-teal-700 to-teal-800 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter announcement title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter announcement content..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Image <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 w-full px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-gray-700 font-semibold"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all flex flex-col items-center justify-center gap-3"
                  >
                    <div className="p-3 bg-teal-100 rounded-full">
                      <Upload className="w-6 h-6 text-teal-700" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold">Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Target Audience <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {["student", "faculty", "both"].map((audience) => (
                    <label 
                      key={audience} 
                      className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              targetAudience: [...formData.targetAudience, audience],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              targetAudience: formData.targetAudience.filter((a) => a !== audience),
                            });
                          }
                        }}
                        className="w-5 h-5 text-teal-700 rounded focus:ring-teal-500"
                      />
                      <span className="text-gray-700 font-semibold capitalize">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Expiry Date <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(creating || updating) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingAnnouncement ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailView
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
}
