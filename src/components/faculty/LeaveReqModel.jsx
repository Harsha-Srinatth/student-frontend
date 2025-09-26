import React, { useState } from 'react';
import { 
  X, Calendar, Clock, User, MessageCircle, AlertCircle, 
  CheckCircle, XCircle, Phone, FileText, Target, Users,
  Mail, GraduationCap, Send
} from 'lucide-react';

const FacultyLeaveRequestModal = ({ request, onClose, onApprove, onReject, facultyInfo }) => {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={20} />,
          label: 'Pending Review'
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={20} />,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle size={20} />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle size={20} />,
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (approvalAction === 'approve') {
        await onApprove(remarks);
      } else {
        await onReject(remarks);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = getStatusConfig(request?.status || 'unknown');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Priority Strip */}
        <div className={`h-2 w-full ${getPriorityColor(request?.priority)}`}></div>
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getLeaveTypeEmoji(request?.leaveType)}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {String(request?.leaveType || 'other').replace('_', ' ')} Leave Request
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submitted by {request?.studentName || '-'} on {formatDate(request?.submittedAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="text-lg font-bold">{statusConfig.label}</span>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Student Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{request?.studentName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Student ID</p>
                  <p className="text-gray-900 font-semibold">{request?.studentId || '-'}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{request?.studentEmail || '-'}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{request?.dept || '-'} Department</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Semester & Section</p>
                  <p className="text-gray-900 font-semibold">Semester {request?.semester || '-'}, Section {request?.section || '-'}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{request?.studentPhone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Duration */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Leave Duration
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Start Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(request?.startDate)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">End Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(request?.endDate)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Days</p>
                <p className="text-lg font-bold text-blue-600 flex items-center justify-center">
                  <Clock className="mr-1" size={18} />
                  {request?.totalDays ?? '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Priority and Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Target className="mr-2" size={18} />
                Priority Level
              </h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                request?.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                request?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                request?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {String(request?.priority || 'NA').toUpperCase()}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Leave Type</h4>
              <p className="text-gray-700 capitalize">{String(request?.leaveType || 'other').replace('_', ' ')}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="mr-2" size={20} />
              Reason for Leave
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {request?.reason || '-'}
            </p>
          </div>

          {/* Emergency Contact (if applicable) */}
          {request?.emergencyContact && request.emergencyContact.name && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertCircle className="mr-2" size={20} />
                Emergency Contact Information
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{request.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Phone</p>
                  <p className="text-gray-900 font-semibold flex items-center">
                    <Phone size={16} className="mr-1" />
                    {request.emergencyContact.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Relationship</p>
                  <p className="text-gray-900 font-semibold">{request.emergencyContact.relation || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {request?.alternateAssessmentRequired && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center">
                <Users className="text-blue-600 mr-3" size={20} />
                <p className="text-blue-800 font-semibold">
                  Alternate assessment arrangements required for missed classes/exams
                </p>
              </div>
            </div>
          )}

          {/* Faculty Review Section (if already reviewed) */}
          {request?.status !== 'pending' && request?.reviewedByName && (
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="mr-2" size={20} />
                Faculty Review
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Reviewed By</p>
                    <p className="text-gray-900 font-semibold">{request.reviewedByName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Review Date</p>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(request?.reviewedAt)} at {formatTime(request?.reviewedAt)}
                    </p>
                  </div>
                </div>
                
                {request?.approvalRemarks && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Faculty Comments</p>
                        <p className="text-gray-800 leading-relaxed italic">
                          "{request.approvalRemarks}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Form (for pending requests) */}
          {request?.status === 'pending' && !showApprovalForm && (
            <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setApprovalAction('reject');
                  setShowApprovalForm(true);
                }}
                className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center space-x-2"
              >
                <XCircle size={20} />
                <span>Reject Request</span>
              </button>
              <button
                onClick={() => {
                  setApprovalAction('approve');
                  setShowApprovalForm(true);
                }}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2"
              >
                <CheckCircle size={20} />
                <span>Approve Request</span>
              </button>
            </div>
          )}

          {/* Approval Form */}
          {showApprovalForm && (
            <form onSubmit={handleApprovalSubmit} className="bg-gray-50 rounded-xl p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments/Remarks {approvalAction === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                  rows={4}
                  maxLength={300}
                  placeholder={
                    approvalAction === 'approve' 
                      ? "Add any instructions or comments for the student..."
                      : "Please provide a reason for rejection..."
                  }
                  required={approvalAction === 'reject'}
                />
                <p className="text-gray-500 text-sm mt-1">{remarks.length}/300 characters</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowApprovalForm(false);
                    setRemarks('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (approvalAction === 'reject' && !remarks.trim())}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors flex items-center justify-center ${
                    approvalAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  } disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      {approvalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyLeaveRequestModal;
