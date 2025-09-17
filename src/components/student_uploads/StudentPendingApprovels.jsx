import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllApprovals } from '../../features/studentDashSlice';
import { Clock, Award, User, Briefcase, Code, X, CheckCircle, XCircle } from 'lucide-react';
import AchievementDetailModal from './AchievementDetailModal';

const TYPE_ICONS = {
  certificate: <Award className="w-6 h-6 text-blue-500" />,
  workshop: <User className="w-6 h-6 text-green-500" />,
  club: <Award className="w-6 h-6 text-purple-500" />,
  internship: <Briefcase className="w-6 h-6 text-amber-500" />,
  project: <Code className="w-6 h-6 text-orange-500" />,
  other: <Award className="w-6 h-6 text-gray-500" />,
};

const getTypeColor = (type) => {
  switch (type) {
    case 'certificate': return 'from-blue-50 to-blue-100 border-blue-200';
    case 'workshop': return 'from-green-50 to-green-100 border-green-200';
    case 'club': return 'from-purple-50 to-purple-100 border-purple-200';
    case 'internship': return 'from-amber-50 to-amber-100 border-amber-200';
    case 'project': return 'from-orange-50 to-orange-100 border-orange-200';
    default: return 'from-gray-50 to-gray-100 border-gray-200';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(6)].map((_, idx) => (
      <div key={idx} className="animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl h-32 w-full border border-gray-200" />
    ))}
  </div>
);

const StudentPendingApprovels = () => {
  const dispatch = useDispatch();
  const { 
    pendingApprovals = [], 
    rejectedApprovals = [], 
    approvedApprovals = [],
    loading, 
    error 
  } = useSelector((state) => state.studentDashboard);

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    dispatch(fetchAllApprovals());
  }, [dispatch]);

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingApprovals.length, icon: <Clock className="w-4 h-4" /> },
    { id: 'rejected', label: 'Rejected', count: rejectedApprovals.length, icon: <XCircle className="w-4 h-4" /> },
    { id: 'approved', label: 'Approved', count: approvedApprovals.length, icon: <CheckCircle className="w-4 h-4" /> },
  ];

  // Get current records based on active tab
  const getCurrentRecords = () => {
    switch (activeTab) {
      case 'pending': return pendingApprovals;
      case 'rejected': return rejectedApprovals;
      case 'approved': return approvedApprovals;
      default: return pendingApprovals;
    }
  };

  // Sort latest first
  const currentRecords = useMemo(() => {
    return [...getCurrentRecords()].sort((a, b) => new Date(b.requestedOn) - new Date(a.requestedOn));
  }, [activeTab, pendingApprovals, rejectedApprovals, approvedApprovals]);

  const handleCardClick = (approval) => {
    setSelected(approval);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen lg:min-h-[calc(100vh-2rem)] transition-opacity duration-500 ease-out animate-fadeIn">
      <section className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Approvals</h2>
          <button
            onClick={() => dispatch(fetchAllApprovals())}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Approvals</h3>
              <p className="text-red-500 max-w-md">{error}</p>
            </div>
          ) : currentRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {activeTab === 'pending' && <Clock className="w-8 h-8 text-gray-400" />}
                {activeTab === 'rejected' && <XCircle className="w-8 h-8 text-gray-400" />}
                {activeTab === 'approved' && <CheckCircle className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Approvals
              </h3>
              <p className="text-gray-500 max-w-md">
                {activeTab === 'pending' && "You have no pending approvals at the moment."}
                {activeTab === 'rejected' && "You have no rejected approvals."}
                {activeTab === 'approved' && "You have no approved approvals yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentRecords.map((approval, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(approval)}
                  className={`group cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] animate-fadeInUp min-h-[120px] flex flex-col`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 flex-1">
                    {approval.imageUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 hidden sm:block">
                        <img
                          src={approval.imageUrl}
                          alt={approval.description || approval.type}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(approval.type)} flex-shrink-0`}>
                      {TYPE_ICONS[approval.type] || TYPE_ICONS.other}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 line-clamp-2 text-sm sm:text-base">
                        {approval.description || approval.type}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Requested on: {formatDate(approval.requestedOn)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        activeTab === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : activeTab === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {activeTab === 'pending' && <Clock className="w-3 h-3" />}
                        {activeTab === 'rejected' && <XCircle className="w-3 h-3" />}
                        {activeTab === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </span>
                    </div>
                  </div>
                  {approval.message && (
                    <div className="text-xs text-gray-600 italic line-clamp-2">{approval.message}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Detail Modal */}
      <AchievementDetailModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        achievement={selected}
        type={selected?.type}
      />
      
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StudentPendingApprovels;
