import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Image as ImageIcon,
  Calendar,
  Users,
  X,
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import api from "../../../services/api";

const CreateClubAnnouncement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = !!id;
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    clubId: "",
    eventName: "",
    eventDate: "",
    description: "",
    selectedYears: [],
    image: null,
    participationOrRegistrationLink: "",
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const yearOptions = [
    { value: "1st", label: "1st Year" },
    { value: "2nd", label: "2nd Year" },
    { value: "3rd", label: "3rd Year" },
    { value: "4th", label: "4th Year" },
  ];

  // Fetch user's clubs and announcement data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clubs
        const clubsResponse = await api.get("/student/clubs/my");
        if (clubsResponse.data?.success) {
          setClubs(clubsResponse.data.data || []);
        }

        // If editing, fetch announcement data
        if (isEditMode) {
          const announcement = location.state?.announcement;
          if (announcement) {
            // Populate form with existing data
            setFormData({
              clubId: announcement.clubId || "",
              eventName: announcement.title || "",
              eventDate: announcement.eventDate ? new Date(announcement.eventDate).toISOString().split('T')[0] : "",
              description: announcement.content || "",
              selectedYears: announcement.targetYears || [],
              image: null, // Don't preload image file
              participationOrRegistrationLink: announcement.participationOrRegistrationLink || "",
            });
            
            // Set image preview if exists
            if (announcement.image?.url) {
              setImagePreview(announcement.image.url);
            }
          } else {
            // If no state, try to fetch from API
            try {
              const annResponse = await api.get(`/student/clubs/announcements/${id}`);
              if (annResponse.data?.success) {
                const ann = annResponse.data.data;
                setFormData({
                  clubId: ann.clubId || "",
                  eventName: ann.title || "",
                  eventDate: ann.eventDate ? new Date(ann.eventDate).toISOString().split('T')[0] : "",
                  description: ann.content || "",
                  selectedYears: ann.targetYears || [],
                  image: null,
                  participationOrRegistrationLink: ann.participationOrRegistrationLink || "",
                });
                if (ann.image?.url) {
                  setImagePreview(ann.image.url);
                }
              }
            } catch (err) {
              console.error("Error fetching announcement:", err);
              setToast({
                type: "error",
                message: "Failed to load announcement. Redirecting...",
              });
              setTimeout(() => navigate("/student/announcements"), 2000);
            }
          }
        } else if (clubsResponse.data?.data?.length > 0) {
          // Set first club as default for create mode
          setFormData(prev => ({ ...prev, clubId: clubsResponse.data.data[0].clubId }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setToast({
          type: "error",
          message: "Failed to load data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, id, location.state, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clubId) {
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
      postData.append("clubId", formData.clubId);
      postData.append("title", formData.eventName);
      postData.append("content", formData.description || "");
      postData.append("eventDate", formData.eventDate);
      if (formData.participationOrRegistrationLink?.trim()) {
        postData.append("participationOrRegistrationLink", formData.participationOrRegistrationLink.trim());
      }
      formData.selectedYears.forEach((year) => {
        postData.append("targetYears", year);
      });
      
      if (formData.image) {
        postData.append("image", formData.image);
      }

      let response;
      if (isEditMode) {
        response = await api.put(`/student/clubs/announcements/${id}`, postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/student/clubs/announcements", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data?.success) {
        setToast({
          type: "success",
          message: isEditMode 
            ? "Club announcement updated successfully!" 
            : "Club announcement created successfully!",
        });
        
        setTimeout(() => {
          navigate("/student/announcements");
        }, 1500);
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      setToast({
        type: "error",
        message: error.response?.data?.message || "Failed to create announcement. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClub = clubs.find(c => c.clubId === formData.clubId);

  // Show toast notification
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
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

  if (clubs.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Club Access
          </h3>
          <p className="text-gray-500 text-center max-w-sm mb-6">
            You are not assigned as a head of any club.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/student/announcements")}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Announcements
          </motion.button>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/student/announcements")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Club Announcement" : "Create Club Announcement"}
              </h2>
              <p className="text-sm text-gray-600">
                Post an event announcement for your club
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form - Same as faculty version */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Club Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Club <span className="text-red-500">*</span>
            </label>
            <select
              name="clubId"
              value={formData.clubId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club.clubId} value={club.clubId}>
                  {club.clubName}
                </option>
              ))}
            </select>
            {selectedClub && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <img
                  src={selectedClub.imageUrl || "https://via.placeholder.com/40"}
                  alt={selectedClub.clubName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">{selectedClub.clubName}</p>
                  <p className="text-xs text-gray-600">{selectedClub.description || "Club announcement"}</p>
                </div>
              </div>
            )}
          </div>

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

          {/* Participation / Registration Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Participation / Registration Link
            </label>
            <input
              type="url"
              name="participationOrRegistrationLink"
              value={formData.participationOrRegistrationLink}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional link for students to register or participate in the event
            </p>
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

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/student/announcements")}
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
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create Announcement
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

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

export default CreateClubAnnouncement;

