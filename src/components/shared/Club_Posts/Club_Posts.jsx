import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Image as ImageIcon,
  Calendar,
  Users,
  X,
  Upload,
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  MapPin,
  FileText,
  ChevronDown,
  Crown,
  UserCheck,
} from "lucide-react";
import api from "../../../services/api";
import { fetchClubs } from "../../../features/shared/clubsSlice";
import Cookies from "js-cookie";

const Club_Posts = () => {
  const dispatch = useDispatch();
  const { clubs } = useSelector((state) => state.clubs);
  const { student: reduxStudent } = useSelector((state) => state.studentDashboard);
  const { faculty: reduxFaculty } = useSelector((state) => state.facultyDashboard);
  
  const [userRole, setUserRole] = useState(null); // 'student' or 'faculty'
  const [userClubs, setUserClubs] = useState([]); // Clubs where user is head/coordinator
  const [selectedClub, setSelectedClub] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    description: "",
    selectedYears: [],
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const yearOptions = [
    { value: "1st", label: "1st Year" },
    { value: "2nd", label: "2nd Year" },
    { value: "3rd", label: "3rd Year" },
    { value: "4th", label: "4th Year" },
  ];

  // Determine user role and fetch clubs
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = Cookies.get("token");
        const role = Cookies.get("userRole");
        
        if (!token || !role) {
          setLoading(false);
          return;
        }

        setUserRole(role);
        
        // Fetch all clubs first
        if (clubs.length === 0) {
          await dispatch(fetchClubs()).unwrap();
        }
        
        // Filter user clubs after clubs are loaded
        filterUserClubs(role);
      } catch (error) {
        console.error("Error checking user role:", error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [dispatch, clubs.length]);

  // Filter clubs where user is head or coordinator
  const filterUserClubs = (role) => {
    let userClubsList = [];
    
    if (role === "student" && reduxStudent?.studentid) {
      // Find clubs where student is head
      userClubsList = clubs.filter(
        (club) => club.studentHead === reduxStudent.studentid
      );
    } else if (role === "faculty" && reduxFaculty?.facultyid) {
      // Find clubs where faculty is coordinator
      userClubsList = clubs.filter(
        (club) => club.facultyCoordinator === reduxFaculty.facultyid
      );
    }
    
    setUserClubs(userClubsList);
    setLoading(false);
    
    // Auto-select first club if available and none selected
    if (userClubsList.length > 0 && !selectedClub) {
      setSelectedClub(userClubsList[0]);
    }
  };

  // Fetch posts for selected club
  useEffect(() => {
    if (selectedClub) {
      fetchClubPosts();
    }
  }, [selectedClub]);

  const fetchClubPosts = async () => {
    if (!selectedClub) return;
    
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await api.get(`/api/clubs/${selectedClub.clubId}/posts`);
      // setPosts(response.data.posts || []);
      
      // For now, use mock data or empty array
      setPosts([]);
    } catch (error) {
      console.error("Error fetching club posts:", error);
      setToast({
        type: "error",
        message: "Failed to load posts. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearToggle = (year) => {
    setFormData((prev) => {
      const newYears = prev.selectedYears.includes(year)
        ? prev.selectedYears.filter((y) => y !== year)
        : [...prev.selectedYears, year];
      return { ...prev, selectedYears: newYears };
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToast({
        type: "error",
        message: "Image size must be under 10MB",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      eventName: "",
      eventDate: "",
      description: "",
      selectedYears: [],
      image: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClub) {
      setToast({
        type: "error",
        message: "Please select a club",
      });
      return;
    }

    if (!formData.eventName.trim() || !formData.eventDate) {
      setToast({
        type: "error",
        message: "Event name and date are required",
      });
      return;
    }

    if (formData.selectedYears.length === 0) {
      setToast({
        type: "error",
        message: "Please select at least one year",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const postData = new FormData();
      postData.append("clubId", selectedClub.clubId);
      postData.append("eventName", formData.eventName);
      postData.append("eventDate", formData.eventDate);
      postData.append("description", formData.description || "");
      formData.selectedYears.forEach((year) => {
        postData.append("targetYears", year);
      });
      
      if (formData.image) {
        postData.append("image", formData.image);
      }

      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await api.post("/api/clubs/posts", postData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setToast({
        type: "success",
        message: "Event posted successfully!",
      });
      
      resetForm();
      setShowPostModal(false);
      fetchClubPosts();
      
      // TODO: Push notifications to selected year students
      // This space is reserved for notification integration
      // Example:
      // await pushNotificationsToYears(selectedClub.clubId, formData.selectedYears, {
      //   title: formData.eventName,
      //   message: `New event from ${selectedClub.clubName}`,
      //   clubId: selectedClub.clubId,
      // });
      
    } catch (error) {
      console.error("Error posting event:", error);
      setToast({
        type: "error",
        message: error.response?.data?.message || "Failed to post event. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDate(dateString);
  };

  // Show toast notification
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading && userClubs.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (userClubs.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <Crown className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Club Access
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            {userRole === "student"
              ? "You are not assigned as a head of any club."
              : "You are not assigned as a coordinator of any club."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Club Posts</h2>
              <p className="text-sm text-gray-600">
                Manage and post events for your clubs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Club Selector */}
            <select
              value={selectedClub?.clubId || ""}
              onChange={(e) => {
                const club = userClubs.find((c) => c.clubId === e.target.value);
                setSelectedClub(club);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
            >
              {userClubs.map((club) => (
                <option key={club.clubId} value={club.clubId}>
                  {club.clubName}
                </option>
              ))}
            </select>
            
            {/* Create Post Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </motion.button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Start by creating your first event post for {selectedClub?.clubName}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create First Post
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <motion.div
                key={post._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Club Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={selectedClub?.imageUrl || "https://via.placeholder.com/60"}
                      alt={selectedClub?.clubName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    />
                  </div>
                  
                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {post.eventName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedClub?.clubName}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    
                    {post.description && (
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {post.description}
                      </p>
                    )}
                    
                    {post.image?.url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image.url}
                          alt={post.eventName}
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Event Date and Target Years */}
                    <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {formatDate(post.eventDate)}
                        </span>
                      </div>
                      {post.targetYears && post.targetYears.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">
                            {post.targetYears.join(", ")} Year
                            {post.targetYears.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowPostModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Create Event Post</h3>
                      <p className="text-sm text-blue-100">
                        {selectedClub?.clubName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !submitting && setShowPostModal(false)}
                    disabled={submitting}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Annual Tech Fest 2024"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe the event, its purpose, and what participants can expect..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Year Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Years <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select which year students should participate (notifications will be sent to selected years)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {yearOptions.map((year) => (
                        <motion.button
                          key={year.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleYearToggle(year.value)}
                          className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                            formData.selectedYears.includes(year.value)
                              ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {year.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Image
                    </label>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium mb-1">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Notification Space - Reserved for Backend Integration */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Notification Integration
                        </p>
                        <p className="text-xs text-blue-700">
                          Notifications will be automatically sent to students of selected years when this post is created.
                          This space is reserved for backend notification service integration.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        resetForm();
                        setShowPostModal(false);
                      }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Post Event
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Club_Posts;

