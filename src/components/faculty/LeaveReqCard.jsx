import React from 'react';
import { 
  Calendar, Clock, User, Phone, Mail, GraduationCap,
  CheckCircle, XCircle, AlertCircle, Eye, MessageCircle
} from 'lucide-react';

const FacultyLeaveRequestCard = ({ request, onView, onApprove, onReject }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={16} />,
          label: 'Pending Review'
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={16} />,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle size={16} />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle size={16} />,
          label: status
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLeaveTypeEmoji = (type) => {
    const emojiMap = {
      medical: '🏥',
      personal: '👤',
      emergency: '🚨',
      family: '👨‍👩‍👧‍👦',
      academic: '🎓',
      other: '📝'
    };
    return emojiMap[type] || '📝';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(request?.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Priority Strip */}
      <div className={`h-1 w-full ${getPriorityColor(request?.priority)} rounded-t-2xl`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getLeaveTypeEmoji(request?.leaveType)}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {String(request?.leaveType || 'other').replace('_', ' ')} Leave
              </h3>
              <p className="text-sm text-gray-600">
                Submitted on {formatDateTime(request?.submittedAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="text-sm font-medium">{statusConfig.label}</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getPriorityColor(request?.priority)}`}>
              {String(request?.priority || 'NA').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <User className="mr-2" size={18} />
            Student Information
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-600 w-20">Name:</span>
                <span className="text-gray-900">{request?.studentName || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-600 w-20">ID:</span>
                <span className="text-gray-900">{request?.studentId || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-900">{request?.studentEmail || '-'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-900">{request?.dept || '-'} - Sem {request?.semester || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-600 w-20">Section:</span>
                <span className="text-gray-900">{request?.section || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-900">{request?.studentPhone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Details */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800 mb-1">Start Date</p>
            <p className="text-lg font-bold text-blue-900">{formatDate(request?.startDate)}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800 mb-1">End Date</p>
            <p className="text-lg font-bold text-blue-900">{formatDate(request?.endDate)}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800 mb-1">Duration</p>
            <p className="text-lg font-bold text-blue-900">{request?.totalDays ?? '-' } days</p>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Reason for Leave</h4>
          <p className="text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
            {request?.reason || '-'}
          </p>
        </div>

        {/* Emergency Contact (if applicable) */}
        {request?.emergencyContact && request.emergencyContact.name && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-red-900 mb-2 flex items-center">
              <AlertCircle className="mr-2" size={18} />
              Emergency Contact
            </h4>
            <div className="grid md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-red-700">Name: </span>
                <span className="text-red-900">{request.emergencyContact.name}</span>
              </div>
              <div>
                <span className="font-medium text-red-700">Phone: </span>
                <span className="text-red-900">{request.emergencyContact.phone}</span>
              </div>
              <div>
                <span className="font-medium text-red-700">Relation: </span>
                <span className="text-red-900">{request.emergencyContact.relation || 'Not specified'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        {request?.alternateAssessmentRequired && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <div className="flex items-center text-blue-800">
              <GraduationCap className="mr-2" size={18} />
              <span className="text-sm font-medium">
                Alternate assessment arrangements required
              </span>
            </div>
          </div>
        )}

        {/* Faculty Review (if reviewed) */}
        {request?.status !== 'pending' && request?.reviewedByName && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MessageCircle className="mr-2" size={18} />
              Faculty Review
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Reviewed by: </span>
                <span className="text-gray-900">{request.reviewedByName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Review date: </span>
                <span className="text-gray-900">{formatDateTime(request?.reviewedAt)}</span>
              </div>
              {request?.approvalRemarks && (
                <div className="mt-2">
                  <span className="font-medium text-gray-600">Comments: </span>
                  <p className="text-gray-900 italic mt-1">"{request.approvalRemarks}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onView}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Eye size={18} />
            <span>View Details</span>
          </button>

          {request?.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => onReject()}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove()}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyLeaveRequestCard;
