import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaveRequests,
  submitLeaveRequest,
  fetchLeaveRequestDetails,
} from "../../features/studentLeaveSlice";
import LeaveRequestForm from "../../components/student/LeaveRequestForm";
import LeaveRequestModal from "../../components/student/LeaveReqModel";
import { 
  Plus, BarChart3, Clock, CheckCircle, XCircle, Search, 
  Filter, Calendar, AlertCircle, FileText, Eye, Users
} from "lucide-react";

const StudentLeaveDashboard = () => {
  const dispatch = useDispatch();
  const {
    leaveRequests,
    leaveStats,
    pagination,
    loading,
    selectedLeaveRequest,
  } = useSelector((state) => state.studentLeave);

  const [showForm, setShowForm] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch leave requests on mount or when filter changes
  useEffect(() => {
    dispatch(
      fetchLeaveRequests({ status: statusFilter, page: 1, limit: 20 })
    );
  }, [dispatch, statusFilter]);

  const handleSubmit = async (data) => {
    await dispatch(submitLeaveRequest(data));
    setShowForm(false);
    dispatch(fetchLeaveRequests({ status: statusFilter, page: 1, limit: 20 }));
  };

  // Filtered list by search term
  const filteredLeaves = leaveRequests.filter((req) => {
    if (!searchTerm) return true;
    return (
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectRequest = async (req) => {
    setRequestDetails(null);
    const res = await dispatch(fetchLeaveRequestDetails(req._id));
    if (res.payload) setRequestDetails(res.payload);
  };
  
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 w-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your leave requests and track status</p>
              </div>
            </div>
            <button
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" /> 
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            icon={<BarChart3 className="w-6 h-6" />} 
            label="Total Requests" 
            value={leaveStats.total || 0}
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            textColor="text-blue-700"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6" />} 
            label="Pending" 
            value={leaveStats.pending || 0}
            color="from-yellow-500 to-orange-500"
            bgColor="bg-yellow-50"
            textColor="text-yellow-700"
          />
          <StatCard 
            icon={<CheckCircle className="w-6 h-6" />} 
            label="Approved" 
            value={leaveStats.approved || 0}
            color="from-green-500 to-emerald-600"
            bgColor="bg-green-50"
            textColor="text-green-700"
          />
          <StatCard 
            icon={<XCircle className="w-6 h-6" />} 
            label="Rejected" 
            value={leaveStats.rejected || 0}
            color="from-red-500 to-red-600"
            bgColor="bg-red-50"
            textColor="text-red-700"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by leave type or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leave Requests Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Leave Requests</h2>
            <div className="text-sm text-gray-500">
              {filteredLeaves.length} {filteredLeaves.length === 1 ? 'request' : 'requests'} found
            </div>
          </div>

          {filteredLeaves.length === 0 ? (
            <NoData />
          ) : (
            <div className="grid gap-4 lg:gap-6">
              {filteredLeaves.map((req) => (
                <LeaveCard
                  key={req._id}
                  request={req}
                  onClick={() => handleSelectRequest(req)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <LeaveRequestForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      )}
      {requestDetails && (
        <LeaveRequestModal request={requestDetails} onClose={() => setRequestDetails(null)} />
      )}
    </div>
  );
};

export default StudentLeaveDashboard;

// === Enhanced Helper Components ===
const StatCard = ({ icon, label, value, color, bgColor, textColor }) => (
  <div className={`${bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600 truncate">{label}</p>
        <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
      </div>
    </div>
  </div>
);

const NoData = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
    <div className="max-w-sm mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leave Requests Found</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        You haven't submitted any leave requests yet. Click "New Request" to get started.
      </p>
    </div>
  </div>
);

const LeaveCard = ({ request, onClick }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { 
          color: 'bg-gradient-to-r from-yellow-100 to-orange-100', 
          textColor: 'text-yellow-800', 
          badge: 'bg-yellow-500',
          icon: <Clock className="w-4 h-4" />
        };
      case 'approved':
        return { 
          color: 'bg-gradient-to-r from-green-100 to-emerald-100', 
          textColor: 'text-green-800', 
          badge: 'bg-green-500',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'rejected':
        return { 
          color: 'bg-gradient-to-r from-red-100 to-rose-100', 
          textColor: 'text-red-800', 
          badge: 'bg-red-500',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return { 
          color: 'bg-gradient-to-r from-gray-100 to-slate-100', 
          textColor: 'text-gray-800', 
          badge: 'bg-gray-500',
          icon: <AlertCircle className="w-4 h-4" />
        };
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

  const statusConfig = getStatusConfig(request.status);
  const totalDays = request.totalDays || (request.startDate && request.endDate ? 
    Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000*60*60*24)) + 1 : 0);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] group overflow-hidden w-full"
    >
      {/* Status Bar */}
      <div className={`h-1.5 w-full ${statusConfig.color.replace('bg-gradient-to-r from-', 'bg-').replace(' to-emerald-100', '').replace(' to-yellow-100', '').replace(' to-orange-100', '').replace(' to-red-100', '').replace(' to-rose-100', '').replace(' to-slate-100', '')}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getLeaveTypeEmoji(request.leaveType)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize text-lg group-hover:text-blue-600 transition-colors">
                {request.leaveType ? request.leaveType.replace("_", " ") : "Unknown"} Leave
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {request.submittedAt
                  ? new Date(request.submittedAt).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${statusConfig.color} border`}>
              {statusConfig.icon}
              <span className={`text-sm font-semibold ${statusConfig.textColor} uppercase tracking-wide`}>
                {request.status || "PENDING"}
              </span>
            </div>
            <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">View Details</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {request.startDate && request.endDate
                  ? `${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`
                  : "Dates not specified"}
              </span>
            </div>
            {totalDays > 0 && (
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  {totalDays} {totalDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
              {request.reason || "No reason provided"}
            </p>
          </div>

          {request.alternateAssessmentRequired && (
            <div className="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <Users className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-amber-800 text-sm font-medium">Assessment arrangement required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};