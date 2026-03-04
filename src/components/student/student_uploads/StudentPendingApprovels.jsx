import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApprovals, isDataStale } from "../../../features/student/studentDashSlice";
import { Clock, XCircle, CheckCircle, Calendar, FileText, Eye, X, AlertCircle } from "lucide-react";

const StudentPendingApprovels = () => {
  const dispatch = useDispatch();
  
  // Read directly from store (source of truth - updated by socket)
  const studentDashboard = useSelector((state) => state.studentDashboard);
  const pendingApprovals = studentDashboard.pendingApprovals || [];
  const rejectedApprovals = studentDashboard.rejectedApprovals || [];
  const approvedApprovals = studentDashboard.approvedApprovals || [];
  
  const { loading, error, approvalsLastFetched } = studentDashboard;

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // Check for real-time count changes
  const realtimeCounts = useSelector((state) => state.realtime?.student?.counts);
  const lastRealtimeUpdate = useSelector((state) => state.realtime?.lastUpdated?.student);

  useEffect(() => {
    if (loading) return;
    
    const hasFetchedBefore = approvalsLastFetched !== null;
    const isStale = isDataStale(approvalsLastFetched, 3);
    
    const shouldRefetchForRealtime = lastRealtimeUpdate && 
      (Date.now() - lastRealtimeUpdate < 5000) && 
      approvalsLastFetched && 
      (lastRealtimeUpdate > approvalsLastFetched);

    if (!hasFetchedBefore || isStale || shouldRefetchForRealtime) {
      dispatch(fetchAllApprovals());
    }
  }, [dispatch, approvalsLastFetched, loading, lastRealtimeUpdate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTabConfig = (tabId) => {
    const configs = {
      pending: {
        icon: Clock,
        gradient: 'bg-teal-900',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
        iconColor: 'text-teal-600'
      },
      rejected: {
        icon: XCircle,
        gradient: 'bg-teal-900',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
        iconColor: 'text-teal-600'
      },
      approved: {
        icon: CheckCircle,
        gradient: 'bg-teal-900',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-700',
        iconColor: 'text-teal-600'
      }
    };
    return configs[tabId] || configs.pending;
  };

  const tabs = [
    {
      id: "pending",
      label: "Pending",
      count: pendingApprovals.length,
      icon: Clock,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: rejectedApprovals.length,
      icon: XCircle,
    },
    {
      id: "approved",
      label: "Approved",
      count: approvedApprovals.length,
      icon: CheckCircle,
    },
  ];

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
  const activeTabConfig = getTabConfig(activeTab);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-200 h-32"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => {
    const Icon = activeTabConfig.icon;
    return (
      <div className="text-center py-16 px-4">
        <div className={`w-20 h-20 mx-auto mb-6 ${activeTabConfig.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
          <Icon className={`w-10 h-10 ${activeTabConfig.iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} Approvals</h3>
        <p className="text-gray-500 text-sm">You don't have any {activeTab} approval requests at the moment.</p>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold text-teal-900 mb-1 sm:mb-2">My Approvals</h2>
        <p className="text-teal-900 text-md sm:text-sm">Track the status of your approval requests</p>
      </div>

      {/* Tabs */}
      <div className="flex pl-2 gap-2 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const tabConfig = getTabConfig(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `bg-gradient-to-r ${tabConfig.gradient} text-white shadow-md scale-105`
                  : "text-black bg-white border border-gray-200 hover:bg-teal-50 hover:border-gray-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tabConfig.iconColor}`} />
              <span className="text-md">{tab.label}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : tabConfig.badge
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Error Loading Approvals</h3>
            <p className="text-black text-md">{error}</p>
          </div>
        ) : currentRecords.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {currentRecords.map((item, idx) => (
              <div
                key={idx}
                className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col"
                onClick={() => {
                  setSelected(item);
                  setModalOpen(true);
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${activeTabConfig.bg} flex items-center justify-center shadow-sm`}>
                    <FileText className={`w-6 h-6 ${activeTabConfig.iconColor}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${activeTabConfig.badge} border ${activeTabConfig.border}`}>
                    {activeTab}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 capitalize leading-tight group-hover:text-blue-600 transition-colors">
                    {item.type || 'Approval Request'}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.description || 'No description provided'}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(item.requestedOn || item.date || item.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-medium">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selected && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => {
            setModalOpen(false);
            setSelected(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${activeTabConfig.gradient} p-6 border-b border-white/20`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-1.5 capitalize leading-tight">
                      {selected.type || 'Approval Details'}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white`}>
                      {(() => {
                        const Icon = activeTabConfig.icon;
                        return Icon ? <Icon className="w-3 h-3" /> : null;
                      })()}
                      {activeTab}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelected(null);
                  }}
                  className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    Description
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">
                    {selected.description || 'No description provided'}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</h4>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {selected.type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</h4>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(selected.requestedOn || selected.date || selected.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Message/Remarks */}
                {selected.message && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                      {activeTab === 'rejected' ? 'Rejection Reason' : activeTab === 'approved' ? 'Approval Message' : 'Message'}
                    </h4>
                    <div className={`${activeTabConfig.bg} rounded-xl p-4 border ${activeTabConfig.border}`}>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selected.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`${activeTabConfig.bg} rounded-2xl p-6 border ${activeTabConfig.border} shadow-sm`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md border-2 ${activeTabConfig.border}`}>
                      {(() => {
                        const Icon = activeTabConfig.icon;
                        return Icon ? <Icon className={`w-6 h-6 ${activeTabConfig.iconColor}`} /> : null;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</p>
                      <p className={`text-xl font-bold ${activeTabConfig.text} capitalize`}>
                        {activeTab}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelected(null);
                }}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPendingApprovels;
