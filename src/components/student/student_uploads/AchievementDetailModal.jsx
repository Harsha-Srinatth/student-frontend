import React from 'react';
import { X, Calendar, User, Award, ExternalLink, Github, Eye, CheckCircle, Clock } from 'lucide-react';

const AchievementDetailModal = ({ isOpen, onClose, achievement, type }) => {
  if (!isOpen || !achievement) return null;
  console.log("Achievement details for student",achievement);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'certificate':
      case 'certification':
        return <Award className="w-6 h-6 text-blue-500" />;
      case 'workshop':
        return <User className="w-6 h-6 text-green-500" />;
      case 'club':
        return <Award className="w-6 h-6 text-purple-500" />;
      case 'internship':
        return <User className="w-6 h-6 text-amber-500" />;
      case 'project':
        return <Github className="w-6 h-6 text-orange-500" />;
      case 'hackathon':
        return <Award className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'certificate':
      case 'certification':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'workshop':
        return 'from-green-50 to-green-100 border-green-200';
      case 'club':
        return 'from-purple-50 to-purple-100 border-purple-200';
      case 'internship':
        return 'from-amber-50 to-amber-100 border-amber-200';
      case 'project':
        return 'from-orange-50 to-orange-100 border-orange-200';
      case 'hackathon':
        return 'from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden animate-slideInUp transition-all duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTypeColor(type)} p-8 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300`}>
          <div className="flex items-center gap-6">
            {getTypeIcon(type)}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 capitalize mb-1 transition-all duration-300">
                {achievement.title || achievement.name || achievement.description || achievement.type}
              </h2>
              <p className="text-gray-600 capitalize text-lg transition-all duration-300">
                {achievement.issuer || achievement.organizer || achievement.role || achievement.type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-60 rounded-full transition-colors duration-200"
          >
            <X className="w-7 h-7 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto max-h-[calc(92vh-220px)] transition-all duration-300">
          {/* Image Section */}
          {(achievement.imageUrl || achievement.certificateUrl || achievement.image) && (
            <div className="mb-6">
              <div className="relative group">
                <img
                  src={achievement.imageUrl || achievement.certificateUrl || achievement.image}
                  alt={achievement.title || achievement.name || achievement.description || achievement.type}
                  className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(achievement.dateIssued || achievement.joinedOn || achievement.date || achievement.requestedOn)}
                    </p>
                  </div>
                </div>

                {achievement.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-800 leading-relaxed">{achievement.description}</p>
                  </div>
                )}

                {achievement.outcome && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Outcome</p>
                    <p className="text-gray-800 leading-relaxed">{achievement.outcome}</p>
                  </div>
                )}

                {achievement.technologies && achievement.technologies.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Technologies Used</p>
                    <div className="flex flex-wrap gap-2">
                      {achievement.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {achievement.type && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="text-gray-800 capitalize">{achievement.type}</p>
                  </div>
                )}

                {achievement.requestedOn && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Requested On</p>
                    <p className="text-gray-800">{formatDate(achievement.requestedOn)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Links and Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Links & Resources</h3>
              
              <div className="space-y-3">
                {achievement.repoLink && (
                  <a
                    href={achievement.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-gray-900">Repository</p>
                      <p className="text-sm text-gray-500 truncate">{achievement.repoLink}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}

                {achievement.demoLink && (
                  <a
                    href={achievement.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-gray-900">Demo Link</p>
                      <p className="text-sm text-gray-500 truncate">{achievement.demoLink}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}

                {achievement.certificateUrl && (
                  <a
                    href={achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <Award className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-gray-900">Certificate</p>
                      <p className="text-sm text-gray-500">View Certificate</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}
                {(achievement.imageUrl || achievement.image) && !achievement.certificateUrl && (
                  <a
                    href={achievement.imageUrl || achievement.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <Award className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-gray-900">Attachment</p>
                      <p className="text-sm text-gray-500 truncate">Open image</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {(achievement.status || achievement.reviewedBy || achievement.verifiedByName || achievement.reviewedByName) && (
            <div className={`mt-10 p-0 rounded-2xl border-none shadow-none transition-all duration-300 flex flex-col items-center w-full`}>
              <div className={`w-full md:w-2/3 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r ${
                achievement.status === 'approved' || (achievement.status && achievement.status.toLowerCase() === 'verified')
                  ? 'from-green-50 to-green-100'
                  : achievement.status === 'rejected'
                  ? 'from-red-50 to-red-100'
                  : 'from-yellow-50 to-yellow-100'
              } rounded-2xl shadow-lg p-6 border border-opacity-30 border-gray-200 transition-all duration-300`}>  
                <div className="flex items-center gap-4 min-w-[120px]">
                  <div className={`rounded-full p-2 bg-white shadow-md border-2 transition-all duration-300 ${
                    achievement.status === 'approved' || (achievement.status && achievement.status.toLowerCase() === 'verified')
                      ? 'border-green-300'
                      : achievement.status === 'rejected'
                      ? 'border-red-300'
                      : 'border-yellow-300'
                  }`}>
                    {achievement.status === 'approved' || (achievement.status && achievement.status.toLowerCase() === 'verified') ? (
                      <CheckCircle className="w-8 h-8 text-green-600 transition-all duration-300" />
                    ) : achievement.status === 'rejected' ? (
                      <X className="w-8 h-8 text-red-600 transition-all duration-300" />
                    ) : (
                      <Clock className="w-8 h-8 text-yellow-600 transition-all duration-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`font-bold text-lg transition-all duration-300 ${
                      achievement.status === 'approved' || (achievement.status && achievement.status.toLowerCase() === 'verified')
                        ? 'text-green-800'
                        : achievement.status === 'rejected'
                        ? 'text-red-800'
                        : 'text-yellow-800'
                    }`}>
                      {achievement.status === 'approved' || (achievement.status && achievement.status.toLowerCase() === 'verified') ? 'Approved' :
                       achievement.status === 'rejected' ? 'Rejected' :
                       'Pending'}
                    </span>
                    {(achievement.verifiedDate || achievement.reviewedOn) && (
                      <span className="text-xs text-gray-500">{formatDate(achievement.verifiedDate || achievement.reviewedOn)}</span>
                    )}
                  </div>
                </div>
                {(achievement.verifiedBy || achievement.verifiedByName || achievement.reviewedBy || achievement.reviewedByName) && (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center overflow-hidden border border-current/20 shadow-md">
                      {achievement.verifiedByAvatar || achievement.reviewerAvatar ? (
                        <img
                          src={achievement.verifiedByAvatar || achievement.reviewerAvatar}
                          alt="Reviewer"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-700">
                          {(achievement.verifiedByName || achievement.reviewedByName || achievement.verifiedBy || achievement.reviewedBy || "?")
                            .toString()
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0,2)
                            .join('')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-800 text-base">Reviewed by</span>
                      <span className="text-lg font-bold text-gray-700">{achievement.verifiedByName || achievement.reviewedByName || achievement.verifiedBy || achievement.reviewedBy}</span>
                    </div>
                  </div>
                )}
              </div>
              {(achievement.remarks || achievement.message) && (
                <div className="w-full md:w-2/3 mt-3 px-6">
                  <span className="block font-medium text-gray-700">Remarks:</span>
                  <span className="block text-gray-800 bg-gray-100 rounded-lg px-3 py-2 mt-1 shadow-inner">{achievement.remarks || achievement.message}</span>
                </div>
              )}
              {achievement.status === 'pending' && (
                <div className="w-full md:w-2/3 mt-2 px-6">
                  <span className="italic text-gray-500">This achievement is awaiting faculty verification.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t flex justify-end transition-all duration-300">
          <button
            onClick={onClose}
            className="px-7 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailModal;
