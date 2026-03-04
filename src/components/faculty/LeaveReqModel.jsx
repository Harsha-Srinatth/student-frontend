import React, { useState } from 'react';
import { 
  X, Calendar, Clock, User, MessageCircle, AlertCircle, 
  CheckCircle, XCircle, Phone, FileText, Target, Users,
  Mail, GraduationCap, Send
} from 'lucide-react';
import Toast from '../shared/Toast';

const FacultyLeaveRequestModal = ({ request, onClose, onApprove, onReject, facultyInfo }) => {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-[#D39C2F]/10 text-[#D39C2F] border-[#D39C2F]/30',
          icon: <Clock size={20} />,
          label: 'Pending Review'
        };
      case 'approved':
        return {
          color: 'bg-[#5E6B7C]/10 text-[#5E6B7C] border-[#5E6B7C]/30',
          icon: <CheckCircle size={20} />,
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-[#C0846A]/10 text-[#C0846A] border-[#C0846A]/30',
          icon: <XCircle size={20} />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-[#E9E6E1] text-[#2F3E5C] border-[#374763]/30',
          icon: <AlertCircle size={20} />,
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
         return 'bg-[#5E6B7C]';
      case 'low': 
         return 'bg-[#2F3E5C]';
      default: 
         return 'bg-[#374763]';
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
      setToast({ type: "error", message: error.response?.data?.message || error.message || "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = getStatusConfig(request?.status || 'unknown');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
<div className="bg-[#D9D6D0] rounded-2xl p-6">
  <h3 className="text-lg font-semibold text-[#2F3E5C] mb-4 flex items-center">
    <User className="mr-2" size={20} />
    Student Information
  </h3>
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-[#E9E6E1] rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-[#5E6B7C]">Full Name</p>
        <p className="text-lg font-bold text-[#2F3E5C]">{request?.studentName || '-'}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-[#5E6B7C]">Student ID</p>
        <p className="text-[#2F3E5C] font-semibold">{request?.studentId || '-'}</p>
      </div>
      <div className="flex items-center">
        <Mail className="w-4 h-4 text-[#5E6B7C] mr-2" />
        <p className="text-[#2F3E5C]">{request?.studentEmail || '-'}</p>
      </div>
    </div>
    <div className="bg-[#E9E6E1] rounded-xl p-4 space-y-3">
      <div className="flex items-center">
        <GraduationCap className="w-4 h-4 text-[#5E6B7C] mr-2" />
        <p className="text-[#2F3E5C]">{request?.dept || '-'} Department</p>
      </div>
      <div>
        <p className="text-sm font-medium text-[#5E6B7C]">Semester & Section</p>
        <p className="text-[#2F3E5C] font-semibold">
          Semester {request?.semester || '-'}, Section {request?.section || '-'}
        </p>
      </div>
      <div className="flex items-center">
        <Phone className="w-4 h-4 text-[#5E6B7C] mr-2" />
        <p className="text-[#2F3E5C]">{request?.studentPhone || '-'}</p>
      </div>
    </div>
  </div>
</div>

         {/* Leave Duration */}
<div className="bg-[#D9D6D0] rounded-2xl p-6">
  <h3 className="text-lg font-semibold text-[#2F3E5C] mb-4 flex items-center">
    <Calendar className="mr-2" size={20} />
    Leave Duration
  </h3>
  <div className="grid md:grid-cols-3 gap-4">
    <div className="bg-[#E9E6E1] rounded-xl p-4 text-center">
      <p className="text-sm font-medium text-[#5E6B7C] mb-1">Start Date</p>
      <p className="text-lg font-bold text-[#2F3E5C]">{formatDate(request?.startDate)}</p>
    </div>
    <div className="bg-[#E9E6E1] rounded-xl p-4 text-center">
      <p className="text-sm font-medium text-[#5E6B7C] mb-1">End Date</p>
      <p className="text-lg font-bold text-[#2F3E5C]">{formatDate(request?.endDate)}</p>
    </div>
    <div className="bg-[#E9E6E1] rounded-xl p-4 text-center">
      <p className="text-sm font-medium text-[#5E6B7C] mb-1">Total Days</p>
      <p className="text-lg font-bold text-[#2F3E5C] flex items-center justify-center">
        <Clock className="mr-1" size={18} />
        {request?.totalDays ?? '-'}
      </p>
    </div>
  </div>
</div> 

          {/* Priority and Type */}
          <div className="grid md:grid-cols-2 gap-4">
  <div className="bg-[#D9D6D0] rounded-xl p-4">
    <h4 className="font-semibold text-[#2F3E5C] mb-2 flex items-center">
      <Target className="mr-2" size={18} />
      Priority Level
    </h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                request?.priority === 'urgent' ? 'bg-[#C0846A]/20 text-[#C0846A]' :
                request?.priority === 'high' ? 'bg-[#D39C2F]/20 text-[#D39C2F]' :
                request?.priority === 'medium' ? 'bg-[#D39C2F]/20 text-[#D39C2F]' :
                'bg-[#5E6B7C]/20 text-[#5E6B7C]'
              }`}>
                {String(request?.priority || 'NA').toUpperCase()}
              </div>
            </div>
            
            <div className="bg-[#D9D6D0] rounded-xl p-4">
              <h4 className="font-semibold text-[#2F3E5C] mb-2">Leave Type</h4>
              <p className="text-[#5E6B7C] capitalize">{String(request?.leaveType || 'other').replace('_', ' ')}</p>
            </div>
          </div>

          {/* Reason */}
<div className="bg-[#E9E6E1] rounded-xl p-6">
  <h3 className="text-lg font-semibold text-[#2F3E5C] mb-3 flex items-center">
    <FileText className="mr-2" size={20} />
    Reason for Leave
  </h3>
  <p className="text-[#5E6B7C] leading-relaxed text-base">
    {request?.reason || '-'}
  </p>
</div>

          {/* Emergency Contact (if applicable) */}
{request?.emergencyContact && request.emergencyContact.name && (
  <div className="bg-[#E9E6E1] border-2 border-[#C0846A] rounded-xl p-6">
    <h3 className="text-lg font-semibold text-[#2F3E5C] mb-4 flex items-center">
      <AlertCircle className="mr-2" size={20} />
      Emergency Contact Information
    </h3>
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm font-medium text-[#C0846A] mb-1">Name</p>
        <p className="text-[#2E2926] font-semibold">{request.emergencyContact.name}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-[#C0846A] mb-1">Phone</p>
        <p className="text-[#2E2926] font-semibold flex items-center">
          <Phone size={16} className="mr-1" />
          {request.emergencyContact.phone}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-[#C0846A] mb-1">Relationship</p>
        <p className="text-[#2E2926] font-semibold">{request.emergencyContact.relation || 'Not specified'}</p>
      </div>
    </div>
  </div>
)}

          {/* Additional Information */}
{request?.alternateAssessmentRequired && (
  <div className="bg-[#E9E6E1] border-2 border-[#2F3E5C] rounded-xl p-4">
    <div className="flex items-center">
      <Users className="text-[#5E6B7C] mr-3" size={20} />
      <p className="text-[#2F3E5C] font-semibold">
        Alternate assessment arrangements required for missed classes/exams
      </p>
    </div>
  </div>
)}

          {/* Faculty Review Section (if already reviewed) */}
          {request?.status !== 'pending' && request?.reviewedByName && (
            <div className="border-2 border-[#2F3E5C] rounded-xl p-6 bg-[#E9E6E1]">
              <h3 className="text-lg font-semibold text-[#2F3E5C] mb-4 flex items-center">
                <MessageCircle className="mr-2" size={20} />
                Faculty Review
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#5E6B7C] mb-1">Reviewed By</p>
                    <p className="text-[#2F3E5C] font-semibold">{request.reviewedByName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#5E6B7C] mb-1">Review Date</p>
                    <p className="text-[#2F3E5C] font-semibold">
                      {formatDate(request?.reviewedAt)} at {formatTime(request?.reviewedAt)}
                    </p>
                  </div>
                </div>
                
                {request?.approvalRemarks && (
                  <div className="bg-[#E9E6E1] rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="text-[#5E6B7C] mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-sm font-medium text-[#5E6B7C] mb-2">Faculty Comments</p>
                        <p className="text-[#2F3E5C] leading-relaxed italic">
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
  <div className="flex justify-center space-x-4 pt-6 border-t border-[#2F3E5C]">
    <button
      onClick={() => {
        setApprovalAction('reject');
        setShowApprovalForm(true);
      }}
      className="px-8 py-3 bg-[#C0846A] text-white rounded-xl hover:bg-[#A86850] transition-colors font-semibold flex items-center space-x-2"
    >
      <XCircle size={20} />
      <span>Reject Request</span>
    </button>
    <button
      onClick={() => {
        setApprovalAction('approve');
        setShowApprovalForm(true);
      }}
      className="px-8 py-3 bg-[#D39C2F] text-white rounded-xl hover:bg-[#B68520] transition-colors font-semibold flex items-center space-x-2"
    >
      <CheckCircle size={20} />
      <span>Approve Request</span>
    </button>
  </div>
)}

   {/* Approval Form */}
{showApprovalForm && (
  <form
    onSubmit={handleApprovalSubmit}
    className="bg-[#E9E6E1] rounded-xl p-6 border-t border-[#2F3E5C]"
  >
    <h3 className="text-lg font-semibold text-[#2F3E5C] mb-4">
      {approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
    </h3>

    <div className="mb-4">
      <label className="block text-sm font-medium text-[#2F3E5C] mb-2">
        Comments/Remarks {approvalAction === 'reject' ? '(Required)' : '(Optional)'}
      </label>
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#D9D6D0] focus:border-[#2F3E5C] transition-all resize-none"
        rows={4}
        maxLength={300}
        placeholder={
          approvalAction === 'approve'
            ? 'Add any instructions or comments for the student...'
            : 'Please provide a reason for rejection...'
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
        className="flex-1 px-6 py-3 border-2 border-[#2F3E5C] text-[#2F3E5C] rounded-xl font-semibold hover:bg-[#D9D6D0] transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || (approvalAction === 'reject' && !remarks.trim())}
        className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors flex items-center justify-center ${
          approvalAction === 'approve'
            ? 'bg-[#D39C2F] hover:bg-[#B68520] disabled:bg-[#D9C47D]'
            : 'bg-[#C0846A] hover:bg-[#A86850] disabled:bg-[#D1A38C]'
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