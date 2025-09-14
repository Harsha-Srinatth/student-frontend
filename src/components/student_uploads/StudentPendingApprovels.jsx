import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSDashboardData } from '../../features/studentDashSlice';
import { Clock, Award, User, Briefcase, Code, X, CheckCircle } from 'lucide-react';
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(3)].map((_, idx) => (
      <div key={idx} className="animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl h-28 w-full border border-gray-200" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <Clock className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-600 mb-2">No Pending Approvals</h3>
    <p className="text-gray-500">You have no pending approvals at the moment.</p>
  </div>
);

const StudentPendingApprovels = () => {
  const dispatch = useDispatch();
  const { pendingApprovals = [], loading, error } = useSelector(
    (state) => state.studentDashboard
  );
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  const handleCardClick = (approval) => {
    setSelected(approval);
    setModalOpen(true);
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
        <button
          onClick={() => dispatch(fetchSDashboardData())}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Approvals</h3>
          <p className="text-red-500">{error}</p>
        </div>
      ) : pendingApprovals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.map((approval, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(approval)}
              className={`group cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-[1.03] animate-fadeInUp`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(approval.type)}`}>
                  {TYPE_ICONS[approval.type] || TYPE_ICONS.other}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-700">
                    {approval.description || approval.type}
                  </h3>
                  <p className="text-xs text-gray-500">Requested on: {formatDate(approval.requestedOn)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                </div>
              </div>
              {approval.message && (
                <div className="text-xs text-gray-600 mt-1 italic">{approval.message}</div>
              )}
            </div>
          ))}
        </div>
      )}
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
      `}</style>
    </section>
  );
};

export default StudentPendingApprovels;