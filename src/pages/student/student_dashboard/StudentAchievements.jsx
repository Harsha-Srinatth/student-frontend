import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAchievements, isDataStale } from "../../../features/student/studentDashSlice";
import AchievementDetailModal from "../../../components/student/student_uploads/AchievementDetailModal";
import { Award, Users, Code, Briefcase, Calendar, Eye, CheckCircle, XCircle, Clock, Download, RefreshCw, Filter } from "lucide-react";
import { generateAchievementPdf } from "../../../utils/pdfUtil";

const TABS = [
  { key: "academic", label: "Academic", icon: Award, color: "teal" },
  { key: "extracurricular", label: "Extracurricular", icon: Users, color: "green" },
  { key: "clubs", label: "Clubs", icon: Briefcase, color: "orange" },
  { key: "hackathons", label: "Hackathons", icon: Code, color: "purple" },
  { key: "projects", label: "Projects", icon: Briefcase, color: "orange" },
];

const StudentAchievements = () => {
  const dispatch = useDispatch();
  const { achievements = {}, counts = {}, loading, error, student: studentProfile, achievementsLastFetched } = useSelector(
    (state) => state.studentDashboard
  );

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (isDataStale(achievementsLastFetched)) {
      dispatch(fetchStudentAchievements());
    }
  }, [dispatch, achievementsLastFetched]);

  const activeTabInfo = useMemo(() => {
    return TABS.find(tab => tab.key === activeTab) || TABS[0];
  }, [activeTab]);

  const filteredContent = useMemo(() => {
    const list = achievements[activeTab] || [];
    if (!verifiedOnly) return list;
    return list.filter((a) => {
      const status = (a.status || "").toLowerCase();
      return status === "approved" || status === "verified";
    });
  }, [achievements, activeTab, verifiedOnly]);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

 

  const getTabIconColor = (color) => {
    return 'text-white';
  };

  const getStatusColor = (status) => {
    if (status === 'approved' || status === 'verified') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const normalizeStatus = useCallback((status) => {
    if (!status || typeof status !== 'string') return 'pending';
    const s = status.toLowerCase();
    if (s.includes('verify') || s === 'approved') return 'approved';
    if (s.includes('reject')) return 'rejected';
    if (s.includes('pend')) return 'pending';
    return s;
  }, []);

  const modalTypeMap = {
    academic: 'certification',
    extracurricular: 'workshop',
    hackathons: 'hackathon',
    projects: 'project'
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-200 h-64"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = memo(() => {
    const Icon = activeTabInfo.icon;
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center shadow-sm">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTabInfo.label} Found</h3>
        <p className="text-gray-500 text-sm">You haven't added any {activeTabInfo.label.toLowerCase()} achievements yet.</p>
      </div>
    );
  });

  const sortedAchievements = filteredContent;

  const AchievementCard = memo(({ achievement, idx, onClick, onDownload, activeTabInfo, normalizeStatus, getTabIconColor, formatDate, getStatusColor }) => {
    const status = normalizeStatus(achievement.status);
    const Icon = activeTabInfo.icon;
    const statusColor = getStatusColor(status);
    
    return (
      <div
        key={achievement.id || idx}
        onClick={onClick}
        className="group cursor-pointer bg-green-50 rounded-xl sm:rounded-2xl border border-teal-100 p-4 sm:p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-300 flex flex-col"
      >
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1.5 line-clamp-2 group-hover:text-teal-600 transition-colors">
              {achievement.title || achievement.name || 'Untitled Achievement'}
            </h3>
            <p className="text-sm text-gray-600 truncate mb-2">
              {achievement.issuer || achievement.organizer || achievement.role || 'N/A'}
            </p>
            
            {/* Reviewed By Section - Always visible */}
            {(achievement.verifiedBy || achievement.verifiedByName || achievement.reviewedBy || achievement.reviewedByName) && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden border border-teal-200">
                  {achievement.verifiedByAvatar || achievement.reviewerAvatar ? (
                    <img
                      src={achievement.verifiedByAvatar || achievement.reviewerAvatar}
                      alt="Reviewer"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-[9px] font-semibold text-gray-700">
                      {(achievement.verifiedByName || achievement.reviewedByName || achievement.verifiedBy || achievement.reviewedBy || "?")
                        .toString()
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0,2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-teal-600 font-medium truncate">
                  {achievement.verifiedByName || achievement.reviewedByName || achievement.verifiedBy || achievement.reviewedBy}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {achievement.status && (
          <div className={`mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColor} w-fit`}>
            {status === 'approved' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approved</span>
              </>
            ) : status === 'rejected' ? (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Rejected</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {formatDate(achievement.verifiedDate || achievement.dateIssued || achievement.date || achievement.joinedOn)}
            </span>
          </div>

          {achievement.description && (
            <p className="text-sm text-teal-700 line-clamp-2 leading-relaxed">
              {achievement.description}
            </p>
          )}

          {achievement.technologies && achievement.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {achievement.technologies.slice(0, 3).map((tech, techIdx) => (
                <span
                  key={techIdx}
                  className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {achievement.technologies.length > 3 && (
                <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-md text-xs font-medium">
                  +{achievement.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-teal-100">
          <button
            aria-label="Download PDF"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors text-xs font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(e);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <div className="flex items-center gap-1 text-teal-400 group-hover:text-teal-600 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">View Details</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="w-full bg-gradient-to-br from-teal-50 to-white rounded-2xl sm:rounded-3xl shadow-sm border border-teal-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-8 gap-3">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-br from-teal-600 to-teal-800 bg-clip-text text-transparent mb-1">My Achievements</h2>
          <p className="text-black text-xs sm:text-sm">Track and showcase your verified accomplishments</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => dispatch(fetchStudentAchievements())}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-teal-200 text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-teal-200 rounded-xl cursor-pointer hover:bg-teal-50 transition-colors shadow-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-emerald-600 w-4 h-4"
            />
            <Filter className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">Verified Only</span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `bg-gradient-to-r from-teal-500 to-teal-600 shadow-md scale-105`
                  : "text-teal-600 bg-white border border-teal-200 hover:bg-teal-50 hover:border-teal-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600'}`} />
              <span className="text-sm">{tab.label}</span>
              {counts[tab.key] > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-600'
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[200px] w-full">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Achievements</h3>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : sortedAchievements.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {sortedAchievements.map((achievement, idx) => (
              <AchievementCard
                key={achievement.id || idx}
                achievement={achievement}
                idx={idx}
                activeTabInfo={activeTabInfo}
                normalizeStatus={normalizeStatus}
                getTabIconColor={getTabIconColor}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                onClick={() => handleAchievementClick(achievement)}
                onDownload={(e) => {
                  e.stopPropagation();
                  generateAchievementPdf({
                    title: achievement.title || achievement.name,
                    type: achievement.type,
                    studentName: (studentProfile && studentProfile.fullname) || '',
                    institution: (studentProfile && (studentProfile.institution || studentProfile.institute)) || '',
                    approvedBy: achievement.verifiedByName || achievement.verifiedBy,
                    approvedOn: achievement.verifiedDate,
                    status: achievement.status,
                    imageUrl: achievement.certificateUrl || achievement.imageUrl,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AchievementDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAchievement(null);
        }}
        achievement={selectedAchievement}
        type={modalTypeMap[activeTab] || activeTab}
        studentProfile={studentProfile}
      />
    </section>
  );
};

export default StudentAchievements;
