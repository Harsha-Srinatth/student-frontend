import React from 'react';
import { X, Calendar, User, Award, ExternalLink, Github, CheckCircle, Clock, Download } from 'lucide-react';
import { generateAchievementPdf } from '../../../utils/pdfUtil';

const AchievementDetailModal = ({ isOpen, onClose, achievement, type, studentProfile }) => {
  if (!isOpen || !achievement) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      certificate: { icon: Award, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
      certification: { icon: Award, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
      workshop: { icon: User, color: 'green', gradient: 'from-green-500 to-green-600' },
      club: { icon: Award, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
      internship: { icon: User, color: 'amber', gradient: 'from-amber-500 to-amber-600' },
      project: { icon: Github, color: 'orange', gradient: 'from-orange-500 to-orange-600' },
      hackathon: { icon: Award, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    };
    return configs[type] || { icon: Award, color: 'gray', gradient: 'from-gray-500 to-gray-600' };
  };

  const getStatusConfig = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'approved' || normalized === 'verified') {
      return {
        label: 'Approved',
        icon: CheckCircle,
        color: 'emerald',
        bg: 'from-emerald-50 to-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconColor: 'text-emerald-600'
      };
    }
    if (normalized === 'rejected') {
      return {
        label: 'Rejected',
        icon: X,
        color: 'red',
        bg: 'from-red-50 to-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        iconColor: 'text-red-600'
      };
    }
    return {
      label: 'Pending',
      icon: Clock,
      color: 'amber',
      bg: 'from-amber-50 to-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconColor: 'text-amber-600'
    };
  };

  const typeConfig = getTypeConfig(type);
  const statusConfig = getStatusConfig(achievement.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  const reviewerName = achievement.verifiedByName || achievement.reviewedByName || achievement.verifiedBy || achievement.reviewedBy;
  const reviewerAvatar = achievement.verifiedByAvatar || achievement.reviewerAvatar;

  const handleDownload = () => {
    generateAchievementPdf({
      title: achievement.title || achievement.name,
      type: achievement.type || type,
      studentName: (studentProfile && studentProfile.fullname) || '',
      institution: (studentProfile && (studentProfile.institution || studentProfile.institute)) || '',
      approvedBy: reviewerName,
      approvedOn: achievement.verifiedDate || achievement.reviewedOn,
      status: achievement.status,
      imageUrl: achievement.certificateUrl || achievement.imageUrl || achievement.image,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideInUp flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${typeConfig.gradient} p-6 border-b border-white/20`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TypeIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white mb-1.5 leading-tight">
                  {achievement.title || achievement.name || 'Achievement Details'}
                </h2>
                <p className="text-white/90 text-sm font-medium">
                  {achievement.issuer || achievement.organizer || achievement.role || type}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Image Section - Compact */}
          {(achievement.imageUrl || achievement.certificateUrl || achievement.image) && (
            <div className="mb-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg bg-gray-50">
                <img
                  src={achievement.imageUrl || achievement.certificateUrl || achievement.image}
                  alt={achievement.title || achievement.name}
                  className="w-full h-auto max-h-96 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(achievement.dateIssued || achievement.joinedOn || achievement.date || achievement.requestedOn)}
                    </p>
                  </div>
                </div>

                {achievement.description && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{achievement.description}</p>
                  </div>
                )}

                {achievement.outcome && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Outcome</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{achievement.outcome}</p>
                  </div>
                )}

                {achievement.technologies && achievement.technologies.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {achievement.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Links & Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                Links & Resources
              </h3>
              
              <div className="space-y-3">
                {achievement.repoLink && (
                  <a
                    href={achievement.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
                  >
                    <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">Repository</p>
                      <p className="text-xs text-gray-500 truncate">{achievement.repoLink}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </a>
                )}

                {achievement.demoLink && (
                  <a
                    href={achievement.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-gray-900 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">Demo Link</p>
                      <p className="text-xs text-gray-500 truncate">{achievement.demoLink}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </a>
                )}

                {(achievement.certificateUrl || achievement.imageUrl || achievement.image) && (
                  <a
                    href={achievement.certificateUrl || achievement.imageUrl || achievement.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
                  >
                    <Award className="w-5 h-5 text-gray-600 group-hover:text-gray-900 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">Certificate</p>
                      <p className="text-xs text-gray-500">View full certificate</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {(achievement.status || reviewerName) && (
            <div className={`bg-gradient-to-r ${statusConfig.bg} rounded-2xl p-6 border ${statusConfig.border} shadow-sm`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md border-2 ${statusConfig.border}`}>
                    <StatusIcon className={`w-7 h-7 ${statusConfig.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</p>
                    <p className={`text-xl font-bold ${statusConfig.text}`}>{statusConfig.label}</p>
                    {(achievement.verifiedDate || achievement.reviewedOn) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(achievement.verifiedDate || achievement.reviewedOn)}
                      </p>
                    )}
                  </div>
                </div>

                {reviewerName && (
                  <div className="flex items-center gap-4 flex-1 sm:justify-end">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-md">
                      {reviewerAvatar ? (
                        <img
                          src={reviewerAvatar}
                          alt="Reviewer"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-base font-bold text-gray-700">
                          {reviewerName
                            .toString()
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0,2)
                            .join('')
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Reviewed By</p>
                      <p className="text-base font-bold text-gray-900">{reviewerName}</p>
                    </div>
                  </div>
                )}
              </div>

              {(achievement.remarks || achievement.message) && (
                <div className="mt-4 pt-4 border-t border-white/30">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Remarks</p>
                  <p className="text-sm text-gray-700 bg-white/50 rounded-lg px-4 py-3">{achievement.remarks || achievement.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailModal;
