import React from 'react';
import { 
  X, Calendar, Clock, User, MessageCircle, AlertCircle, 
  CheckCircle, XCircle, Phone, FileText, Target, Users 
} from 'lucide-react';

const LeaveRequestModal = ({ request, onClose }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock size={20} />, label: 'Pending Review' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle size={20} />, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle size={20} />, label: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <AlertCircle size={20} />, label: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLeaveTypeEmoji = (type) => ({
    medical: '🏥',
    personal: '👤',
    emergency: '🚨',
    family: '👨‍👩‍👧‍👦',
    academic: '🎓',
    other: '📝'
  }[type] || '📝');

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'N/A';
  const formatTime = (date) => date ? new Date(date).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }) : 'N/A';

  const statusConfig = getStatusConfig(request.status);
  const totalDays = request.totalDays || (request.startDate && request.endDate ? Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000*60*60*24)) + 1 : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Priority Strip */}
        <div className={`h-2 w-full ${getPriorityColor(request.priority)}`}></div>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getLeaveTypeEmoji(request.leaveType)}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{request.leaveType.replace('_',' ')} Leave Request</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submitted on {formatDate(request.submittedAt)} at {formatTime(request.submittedAt)}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 ${statusConfig.color}`}>
              {statusConfig.icon}<span className="text-lg font-bold">{statusConfig.label}</span>
            </div>
          </div>

          {/* Leave Duration */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Calendar className="mr-2" size={20}/> Leave Duration
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Start Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(request.startDate)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">End Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(request.endDate)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Days</p>
                <p className="text-lg font-bold text-blue-600 flex items-center justify-center">
                  <Clock className="mr-1" size={18}/> {totalDays}
                </p>
              </div>
            </div>
          </div>

          {/* Priority & Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center"><Target className="mr-2" size={18}/> Priority Level</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>{request.priority.toUpperCase()}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Leave Type</h4>
              <p className="text-gray-700 capitalize">{request.leaveType.replace('_',' ')}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="mr-2" size={20}/> Reason for Leave
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">{request.reason}</p>
          </div>

          {/* Emergency Contact */}
          {request.emergencyContact?.name && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center"><AlertCircle className="mr-2" size={20}/> Emergency Contact Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{request.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Phone</p>
                  <p className="text-gray-900 font-semibold flex items-center"><Phone className="mr-1" size={16}/> {request.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Relationship</p>
                  <p className="text-gray-900 font-semibold">{request.emergencyContact.relation || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alternate Assessment */}
          {request.alternateAssessmentRequired && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center">
              <Users className="text-blue-600 mr-3" size={20}/>
              <p className="text-blue-800 font-semibold">Alternate assessment arrangements required for missed classes/exams</p>
            </div>
          )}

          {/* Faculty Review */}
          {request.status !== 'pending' && (
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><User className="mr-2" size={20}/> Faculty Review</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Reviewed By</p>
                  <p className="text-gray-900 font-semibold">{request.reviewedByName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Review Date</p>
                  <p className="text-gray-900 font-semibold">{request.reviewedAt ? formatDate(request.reviewedAt) : 'Not reviewed yet'}</p>
                </div>
              </div>
              {request.approvalRemarks && (
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="text-gray-400 mt-1 flex-shrink-0" size={18}/>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Faculty Comments</p>
                      <p className="text-gray-800 leading-relaxed italic">"{request.approvalRemarks}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
