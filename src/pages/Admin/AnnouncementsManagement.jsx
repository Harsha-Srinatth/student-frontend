import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  clearAnnouncementsCache
} from "../../features/Admin/adminAnnouncementsSlice";
import socketService from "../../services/socketService";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function AnnouncementsManagement() {
  const dispatch = useDispatch();
  const { announcements, loading, creating, updating, deleting, error } = useSelector(
    (state) => state.adminAnnouncements
  );
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: ["both"],
    priority: "medium",
    expiresAt: "",
  });
  const listenersSetup = useRef(false);

  useEffect(() => {
    // Ensure socket is connected
    socketService.connect();
    
    // Clear cache to ensure fresh fetch on mount/reconnect
    dispatch(clearAnnouncementsCache());
    
    // Fetch announcements with forceRefresh to bypass cache
    dispatch(fetchAnnouncements({ forceRefresh: true }));
    
    // Set up socket listeners for reconnection
    setupSocketListeners();
    
    // Cleanup on unmount
    return () => {
      if (listenersSetup.current) {
        socketService.off("socket:connected", handleSocketConnected);
        socketService.off("socket:reconnected", handleSocketReconnected);
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

  const setupSocketListeners = () => {
    if (listenersSetup.current) return;
    
    // Use socketService.on which handles connection state automatically
    socketService.on("socket:connected", handleSocketConnected);
    socketService.on("socket:reconnected", handleSocketReconnected);
    
    listenersSetup.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await dispatch(updateAnnouncement({ id: editingAnnouncement._id, ...formData })).unwrap();
      } else {
        await dispatch(createAnnouncement(formData)).unwrap();
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
      title: announcement.title,
      content: announcement.content,
      targetAudience: announcement.targetAudience,
      priority: announcement.priority,
      expiresAt: announcement.expiresAt 
        ? new Date(announcement.expiresAt).toISOString().split('T')[0]
        : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
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
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Manage announcements for students and faculty</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingAnnouncement(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all"
        >
          <FaPlus className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600">No announcements yet. Create one to get started!</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Target: {announcement.targetAudience.join(", ")}</span>
                    <span>•</span>
                    <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                    {announcement.expiresAt && (
                      <>
                        <span>•</span>
                        <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <div className="flex gap-4">
                    {["student", "faculty", "both"].map((audience) => (
                      <label key={audience} className="flex items-center gap-2">
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
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700 capitalize">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAnnouncement(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 shadow-lg transition-all"
                  >
                    {editingAnnouncement ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}