import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAnnouncements } from "../../../features/student/studentDashSlice";
import socketService from "../../../services/socketService";

const Announcements = () => {
  const dispatch = useDispatch();
  const { announcements, loading, error } = useSelector(
    (state) => state.studentDashboard
  );
  const listenersSetup = useRef(false);

  useEffect(() => {
    // Ensure socket is connected
    socketService.connect();
    
    // Fetch announcements via Redux
    dispatch(fetchStudentAnnouncements());
    
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

  const setupSocketListeners = () => {
    if (listenersSetup.current) return;
    
    // Use socketService.on which handles connection state automatically
    socketService.on("dashboard:announcements", handleAnnouncementUpdate);
    socketService.on("socket:connected", handleSocketConnected);
    socketService.on("socket:reconnected", handleSocketReconnected);
    
    listenersSetup.current = true;
    
    // If socket is already connected, fetch immediately
    if (socketService.getIsConnected()) {
      dispatch(fetchStudentAnnouncements());
    }
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

  if (loading) {
    return (
      <section className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Announcements</h3>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Announcements</h3>
        <div className="text-center py-8 text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Announcements</h3>
      {announcements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No announcements available</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {announcements.map((a, idx) => (
            <li key={a._id || idx} className="border-b pb-3 last:border-none">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-gray-900">{a.title}</p>
                {a.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(a.priority)}`}>
                    {a.priority}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{a.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Announcements;
