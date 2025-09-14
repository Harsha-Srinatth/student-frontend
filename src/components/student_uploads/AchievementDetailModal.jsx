import React from 'react';
import { X, Calendar, User, Award, ExternalLink, Github, Eye, CheckCircle, Clock } from 'lucide-react';

const AchievementDetailModal = ({ isOpen, onClose, achievement, type }) => {
  if (!isOpen || !achievement) return null;

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
      case 'certification':
        return <Award className="w-6 h-6 text-blue-500" />;
      case 'workshop':
        return <User className="w-6 h-6 text-green-500" />;
      case 'hackathon':
        return <Award className="w-6 h-6 text-purple-500" />;
      case 'project':
        return <Github className="w-6 h-6 text-orange-500" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'certification':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'workshop':
        return 'from-green-50 to-green-100 border-green-200';
      case 'hackathon':
        return 'from-purple-50 to-purple-100 border-purple-200';
      case 'project':
        return 'from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideInUp">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTypeColor(type)} p-6 border-b`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {getTypeIcon(type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {achievement.title || achievement.name}
                </h2>
                <p className="text-gray-600 capitalize">
                  {achievement.issuer || achievement.organizer || achievement.role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Image Section */}
          {achievement.imageUrl && (
            <div className="mb-6">
              <div className="relative group">
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title || achievement.name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(achievement.dateIssued || achievement.joinedOn || achievement.date)}
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
              </div>
            </div>
          </div>

          {/* Verification Status */}
          {achievement.status && (
            <div className={`mt-6 p-4 rounded-lg border ${
              achievement.status === 'verified' 
                ? 'bg-green-50 border-green-200' 
                : achievement.status === 'rejected'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {achievement.status === 'verified' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : achievement.status === 'rejected' ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600" />
                )}
                <span className={`font-medium ${
                  achievement.status === 'verified' 
                    ? 'text-green-800' 
                    : achievement.status === 'rejected'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}>
                  {achievement.status === 'verified' ? 'Verified Achievement' : 
                   achievement.status === 'rejected' ? 'Rejected Achievement' : 
                   'Pending Verification'}
                </span>
              </div>
              <div className={`text-sm ${
                achievement.status === 'verified' 
                  ? 'text-green-700' 
                  : achievement.status === 'rejected'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                {achievement.verifiedBy && (
                  <p>Verified by: {achievement.verifiedBy}</p>
                )}
                {achievement.verifiedDate && (
                  <p>Verified on: {formatDate(achievement.verifiedDate)}</p>
                )}
                {achievement.remarks && (
                  <p className="mt-1">Remarks: {achievement.remarks}</p>
                )}
                {achievement.status === 'pending' && (
                  <p className="mt-1 italic">This achievement is awaiting faculty verification.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailModal;
