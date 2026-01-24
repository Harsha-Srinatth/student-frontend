import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyAnnouncements } from "../../../features/faculty/facultyDashSlice";
import socketService from "../../../services/socketService";

const FacultyAnnouncements = () => {
  const dispatch = useDispatch();
  const { announcements, loading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const listenersSetup = useRef(false);

  useEffect(() => {
    // Ensure socket is connected
    socketService.connect();
    
    // Fetch announcements via Redux
    dispatch(fetchFacultyAnnouncements());
    
    // Set up socket listeners using socketService.on (works even if socket not connected yet)
    setupSocketListeners();
    
    // Cleanup on unmount
    return () => {
      if (listenersSetup.current) {
        socketService.off("dashboard:announcements", handleAnnouncementUpdate);
        socketService.off("socket:connected", handleSocketConnected);
        socketService.off("socket:reconnected", handleSocketReconnected);
      }
    };
  }, [dispatch]);

  const handleAnnouncementUpdate = (data) => {
    console.log("Received announcement update:", data);
    // Refetch announcements when socket update is received
    dispatch(fetchFacultyAnnouncements());
  };

  const handleSocketConnected = () => {
    console.log("Socket connected, fetching announcements");
    dispatch(fetchFacultyAnnouncements());
  };

  const handleSocketReconnected = () => {
    console.log("Socket reconnected, fetching announcements");
    dispatch(fetchFacultyAnnouncements());
  };

  const setupSocketListeners = () => {
    if (listenersSetup.current) return;
    
    // Use socketService.on which handles connection state automatically
    socketService.on("dashboard:announcements", handleAnnouncementUpdate);
    socketService.on("socket:connected", handleSocketConnected);
    socketService.on("socket:reconnected", handleSocketReconnected);
    
    listenersSetup.current = true;
    
    // If socket is already connected, fetch immediately
    if (socketService.getIsConnected()) {
      dispatch(fetchFacultyAnnouncements());
    }
  };
  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '📅';
      case 'deadline': return '⏰';
      case 'policy': return '📋';
      case 'workshop': return '🎓';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white w-full rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
            <p className="text-gray-600 mt-1">Stay updated with important faculty information</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {announcements.length} announcements
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zm0-4h6v-2H4v2zm0-4h6V9H4v2zm0-4h6V5H4v2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-600">No announcements at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement, idx) => (
              <div
                key={announcement._id || idx}
                className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${getPriorityColor(announcement.priority || 'medium')}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📢</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {announcement.priority || 'medium'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                      {announcement.targetAudience && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="capitalize">{announcement.targetAudience.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAnnouncements;
