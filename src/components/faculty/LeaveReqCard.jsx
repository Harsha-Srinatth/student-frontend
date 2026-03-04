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
          color: 'bg-[#D39C2F]/20 text-[#D39C2F] border-[#D39C2F]/40',
          icon: <Clock size={16} className="text-[#5E6B7C]"/>,
          label: 'Pending Review'
        };
      case 'approved':
        return {
          color: 'bg-[#D39C2F]/20 text-[#D39C2F] border-[#D39C2F]/40',
          icon: <CheckCircle size={16} className="text-[#D39C2F]"/>,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-[#C0846A]/20 text-[#C0846A] border-[#C0846A]/40',
          icon: <XCircle size={16} className="text-[#C0846A]"/>,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle size={16} className="text-[#5E6B7C]"/>,
          label: status
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-[#C0846A]';
      case 'high':
        return 'bg-[#D39C2F]';
      case 'medium':
        return 'bg-[#D39C2F]'; // mustard
      case 'low':
        return 'bg-[#C0846A]'; // brown
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
       <div className="bg-[#E9E6E1] rounded-2xl shadow-sm border border-[#374763]/20 hover:shadow-md transition-all duration-200">
      {/* Priority Strip */}
      <div className={`h-1 w-full ${getPriorityColor(request?.priority)} rounded-t-2xl`}></div>
      
      <div className="p-6 bg-[#D9D6D0]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getLeaveTypeEmoji(request?.leaveType)}</div>
            <div>
              <h3 className="text-xl font-bold text-[#2F3E5C] capitalize">
                {String(request?.leaveType || 'other').replace('_', ' ')} Leave
              </h3>
              <p className="text-sm text-[#5E6B7C]">
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
        <div className="bg-[#E9E6E1] rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-[#2F3E5C] mb-3 flex items-center">
            <User className="mr-2 text-[#5E6B7C]" size={18} />
            Student Information
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-[#5E6B7C]">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium w-20">Name:</span>
                <span className="text-[#2F3E5C]">{request?.studentName || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium w-20">ID:</span>
                <span className="text-[#2F3E5C]">{request?.studentId || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-1" />
                <span className="text-[#2F3E5C]">{request?.studentEmail || '-'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span className="text-[#2F3E5C]">{request?.dept || '-'} - Sem {request?.semester || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium w-20">Section:</span>
                <span className="text-[#2F3E5C]">{request?.section || '-'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-[#2F3E5C]">{request?.studentPhone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Details */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#E9E6E1] rounded-xl p-4 text-center border border-[#374763]/20">
            <Calendar className="w-6 h-6 text-[#5E6B7C] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#5E6B7C] mb-1">Start Date</p>
            <p className="text-lg font-bold text-[#2F3E5C]">{formatDate(request?.startDate)}</p>
          </div>
          <div className="bg-[#E9E6E1] rounded-xl p-4 text-center border border-[#374763]/20">
            <Calendar className="w-6 h-6 text-[#5E6B7C] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#5E6B7C] mb-1">End Date</p>
            <p className="text-lg font-bold text-[#2F3E5C]">{formatDate(request?.endDate)}</p>
          </div>
          <div className="bg-[#E9E6E1] rounded-xl p-4 text-center border border-[#374763]/20">
            <Clock className="w-6 h-6 text-[#5E6B7C] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#5E6B7C] mb-1">Duration</p>
            <p className="text-lg font-bold text-[#2F3E5C]">{request?.totalDays ?? '-'} days</p>
          </div>
        </div>

        {/* Reason */}
         <div className="mb-4">
          <h4 className="font-semibold text-[#2F3E5C] mb-2">Reason for Leave</h4>
          <p className="text-[#5E6B7C] bg-[#E9E6E1] rounded-xl p-4 leading-relaxed">
            {request?.reason || '-'}
          </p>
        </div>

        {/* Emergency Contact (if applicable) */}
        {request?.emergencyContact && request.emergencyContact.name && (
          <div className="bg-[#E9E6E1] border border-[#C0846A]/30 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-[#2F3E5C] mb-2 flex items-center">
              <AlertCircle className="mr-2" size={18} />
              Emergency Contact
            </h4>
            <div className="grid md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-[#5E6B7C]">Name: </span>
                <span className="text-[#2F3E5C]">{request.emergencyContact.name}</span>
              </div>
              <div>
                <span className="font-medium text-[#5E6B7C]">Phone: </span>
                <span className="text-[#2F3E5C]">{request.emergencyContact.phone}</span>
              </div>
              <div>
                <span className="font-medium text-[#5E6B7C]">Relation: </span>
                <span className="text-[#2F3E5C]">{request.emergencyContact.relation || 'Not specified'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        {request?.alternateAssessmentRequired && (
          <div className="bg-[#E9E6E1] border border-[#D39C2F]/30 rounded-xl p-3 mb-4">
            <div className="flex items-center text-[#2F3E5C]">
              <GraduationCap className="mr-2" size={18} />
              <span className="text-sm font-medium">
                Alternate assessment arrangements required
              </span>
            </div>
          </div>
        )}

        {/* Faculty Review (if reviewed) */}
        {request?.status !== 'pending' && request?.reviewedByName && (
          <div className="bg-[#E9E6E1] rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-[#2F3E5C] mb-2 flex items-center">
              <MessageCircle className="mr-2" size={18} />
              Faculty Review
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[#5E6B7C]">Reviewed by: </span>
                <span className="text-[#2F3E5C]">{request.reviewedByName}</span>
              </div>
              <div>
                <span className="font-medium text-[#5E6B7C]">Review date: </span>
                <span className="text-[#2F3E5C]">{formatDateTime(request?.reviewedAt)}</span>
              </div>
              {request?.approvalRemarks && (
                <div className="mt-2">
                  <span className="font-medium text-[#5E6B7C]">Comments: </span>
                  <p className="text-[#2F3E5C] italic mt-1">"{request.approvalRemarks}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#374763]/20">
          <button
            onClick={onView}
            className="flex items-center space-x-2 px-4 py-2 text-[#2F3E5C] hover:bg-[#E9E6E1] rounded-xl transition-colors"
          >
            <Eye size={18} />
            <span>View Details</span>
          </button>

          {request?.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => onReject()}
                className="px-6 py-2 bg-[#C0846A] text-white rounded-xl hover:bg-[#a36a57] transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove()}
                className="px-6 py-2 bg-[#D39C2F] text-white rounded-xl hover:bg-[#b8892b] transition-colors font-medium"
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