import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApprovals, isDataStale } from "../../../features/student/studentDashSlice";
import { Clock, XCircle, CheckCircle } from "lucide-react";

const StudentPendingApprovels = () => {
  const dispatch = useDispatch();
  const {
    pendingApprovals = [],
    rejectedApprovals = [],
    approvedApprovals = [],
    loading,
    error,
    approvalsLastFetched,
  } = useSelector((state) => state.studentDashboard);

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    // Redux store is the cache - only fetch if data doesn't exist or is stale (>3 min)
    // Don't fetch if already loading to prevent infinite loops
    if (loading) return;
    
    const hasFetchedBefore = approvalsLastFetched !== null;
    const isStale = isDataStale(approvalsLastFetched, 3);

    // Only fetch if we've never fetched before, or if data is stale
    if (!hasFetchedBefore || isStale) {
      dispatch(fetchAllApprovals());
    }
  }, [dispatch, approvalsLastFetched, loading]);

  const tabs = [
    {
      id: "pending",
      label: "Pending",
      count: pendingApprovals.length,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: rejectedApprovals.length,
      icon: <XCircle className="w-4 h-4" />,
    },
    {
      id: "approved",
      label: "Approved",
      count: approvedApprovals.length,
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  // Get current records based on active tab
  const getCurrentRecords = () => {
    switch (activeTab) {
      case "pending":
        return pendingApprovals;
      case "rejected":
        return rejectedApprovals;
      case "approved":
        return approvedApprovals;
      default:
        return [];
    }
  };

  const currentRecords = getCurrentRecords();

  // Rest of component JSX...
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Approvals</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentRecords.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {activeTab} approvals found.
        </p>
      ) : (
        <div className="space-y-4">
          {currentRecords.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg hover:shadow-md cursor-pointer"
              onClick={() => {
                setSelected(item);
                setModalOpen(true);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{item.type}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    activeTab === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : activeTab === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {activeTab}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Approval Details</h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelected(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Type:</strong> {selected.type}
              </p>
              <p>
                <strong>Description:</strong> {selected.description}
              </p>
              {selected.message && (
                <p>
                  <strong>Message:</strong> {selected.message}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setModalOpen(false);
                setSelected(null);
              }}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPendingApprovels;
