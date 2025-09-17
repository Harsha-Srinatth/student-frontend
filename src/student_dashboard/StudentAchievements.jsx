import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAchievements } from "../features/studentDashSlice";
import AchievementDetailModal from "../components/student_uploads/AchievementDetailModal";
import { Award, Users, Code, Briefcase, Calendar, ExternalLink, Eye, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { generateAchievementPdf } from "../utils/pdfUtil";

const TABS = [
  { key: "academic", label: "Academic", icon: Award, color: "blue" },
  { key: "extracurricular", label: "Extracurricular", icon: Users, color: "green" },
  { key: "hackathons", label: "Hackathons", icon: Code, color: "purple" },
  { key: "projects", label: "Projects", icon: Briefcase, color: "orange" },
];

const StudentAchievements = () => {
  const dispatch = useDispatch();
  const { achievements = {}, counts = {}, loading, error, student: studentProfile } = useSelector(
    (state) => state.studentDashboard
  );

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentAchievements());
  }, [dispatch]);

  const getTabContent = () => achievements[activeTab] || [];

  const filteredContent = useMemo(() => {
    const list = getTabContent();
    if (!verifiedOnly) return list;
    return list.filter((a) => (a.status || "").toLowerCase() === "verified");
  }, [achievements, activeTab, verifiedOnly]);

  const getTabCount = () => {
    switch (activeTab) {
      case 'academic':
        return counts.certificationsCount || 0;
      case 'extracurricular':
        return counts.workshopsCount || 0;
      case 'hackathons':
        return counts.hackathonsCount || 0;
      case 'projects':
        return counts.projectsCount || 0;
      default:
        return 0;
    }
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const getTabColor = (color) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
      green: 'from-green-50 to-green-100 border-green-200 text-green-700',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
    };
    return colors[color] || colors.blue;
  };

  const getTabIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const normalizeStatus = (status) => {
    if (!status || typeof status !== 'string') return 'pending';
    const s = status.toLowerCase();
    if (s.includes('verify')) return 'verified';
    if (s.includes('reject')) return 'rejected';
    if (s.includes('pend')) return 'pending';
    return s;
  };

  const modalTypeMap = {
    academic: 'certification',
    extracurricular: 'workshop',
    hackathons: 'hackathon',
    projects: 'project'
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gray-200 rounded-xl h-20"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        {React.createElement(TABS.find(tab => tab.key === activeTab)?.icon || Award, { 
          className: "w-8 h-8 text-gray-400" 
        })}
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">No {TABS.find(tab => tab.key === activeTab)?.label} Found</h3>
      <p className="text-gray-500">You haven't added any {TABS.find(tab => tab.key === activeTab)?.label.toLowerCase()} yet.</p>
    </div>
  );

  // Sort achievements by latest first
  const sortedAchievements = useMemo(() => {
    return [...(verifiedOnly ? filteredContent : getTabContent())].sort((a, b) => {
      const dateA = new Date(a.verifiedDate || a.dateIssued || a.date || a.joinedOn || 0);
      const dateB = new Date(b.verifiedDate || b.dateIssued || b.date || b.joinedOn || 0);
      return dateB - dateA;
    });
  }, [filteredContent, getTabContent, verifiedOnly]);

  return (
    <section className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Achievements</h2>
          <p className="text-gray-600">Your verified accomplishments and activities</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => dispatch(fetchStudentAchievements())}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Refresh
          </button>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-gray-700">Verified only</span>
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getTabCount();
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 font-medium rounded-t-lg transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${getTabColor(tab.color)} border-b-2 border-current`
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? getTabIconColor(tab.color) : ''}`} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isActive ? 'bg-white bg-opacity-50' : 'bg-gray-200'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[300px] w-full">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Achievements</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : sortedAchievements.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAchievements.map((achievement, idx) => (
                <div
                  key={achievement.id || idx}
                  onClick={() => handleAchievementClick(achievement)}
                  className="group cursor-pointer bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:scale-105"
                >
                  {/* Achievement Card JSX remains unchanged */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${getTabColor(TABS.find(tab => tab.key === activeTab)?.color)}`}>
                        {React.createElement(TABS.find(tab => tab.key === activeTab)?.icon || Award, { 
                          className: `w-5 h-5 ${getTabIconColor(TABS.find(tab => tab.key === activeTab)?.color)}`
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate group-hover:text-gray-900">
                          {achievement.title || achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {achievement.issuer || achievement.organizer || achievement.role}
                        </p>
                        {achievement.verifiedBy && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {achievement.verifiedByAvatar ? (
                                <img
                                  src={achievement.verifiedByAvatar}
                                  alt="Reviewer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <span className="text-[10px] font-medium text-gray-600">
                                  {(achievement.verifiedBy || "?")
                                    .toString()
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0,2)
                                    .join('')}
                                </span>
                              )}
                            </div>
                            <span>Reviewed by {achievement.verifiedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {achievement.status && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          normalizeStatus(achievement.status) === 'verified' 
                            ? 'bg-green-100 text-green-700' 
                            : normalizeStatus(achievement.status) === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {normalizeStatus(achievement.status) === 'verified' ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </div>
                          ) : normalizeStatus(achievement.status) === 'rejected' ? (
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        aria-label="Download PDF"
                        className="p-1.5 rounded bg-white text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={(e) => {
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
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(achievement.verifiedDate || achievement.dateIssued || achievement.date || achievement.joinedOn)}
                      </span>
                    </div>

                    {achievement.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {achievement.description}
                      </p>
                    )}

                    {achievement.technologies && achievement.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {achievement.technologies.slice(0, 3).map((tech, techIdx) => (
                          <span
                            key={techIdx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {achievement.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{achievement.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
      />
    </section>
  );
};

export default StudentAchievements;