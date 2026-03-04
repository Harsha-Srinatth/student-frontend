import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaveRequests,
  submitLeaveRequest,
  fetchLeaveRequestDetails,
} from "../../features/student/studentLeaveSlice";
import LeaveRequestForm from "./LeaveRequestForm";
import LeaveRequestModal from "./LeaveReqModel";
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 via-white to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 w-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-teal-900 to-teal-700 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">Leave Management</h1>
                <p className="text-black text-sm mt-1">Manage your leave requests and track status</p>
              </div>
            </div>
            <button
              className="flex items-center justify-center bg-gradient-to-r from-teal-900 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-900 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
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
            color="from-teal-900 to-teal-700"
            bgColor="bg-teal-50"
            textColor="text-teal-700"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6" />} 
            label="Pending" 
            value={leaveStats.pending || 0}
            color="from-teal-900 to-teal-700"
            bgColor="bg-teal-50"
            textColor="text-teal-700"
          />
          <StatCard 
            icon={<CheckCircle className="w-6 h-6" />} 
            label="Approved" 
            value={leaveStats.approved || 0}
              color="from-teal-900 to-teal-700"
            bgColor="bg-teal-50"
            textColor="text-teal-700"
          />
          <StatCard 
            icon={<XCircle className="w-6 h-6" />} 
            label="Rejected" 
            value={leaveStats.rejected || 0}
            color="from-teal-900 to-teal-700"
            bgColor="bg-teal-50"
            textColor="text-teal-700"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Search by leave type or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200 text-gray-700 bg-white min-w-[160px]"
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
            <h2 className="text-xl font-semibold text-black">Your Leave Requests</h2>
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
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-teal-900" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">No Leave Requests Found</h3>
      <p className="text-black text-sm leading-relaxed">
        You haven't submitted any leave requests yet. Click "New Request" to get started.
      </p>
    </div>
  </div>
);

const LeaveCard = ({ request, onClick }) => {

  const getLeaveTypeEmoji = (type) => ({
    medical: '🏥',
    personal: '👤', 
    emergency: '🚨',
    family: '👨‍👩‍👧‍👦',
    academic: '🎓',
    other: '📝'
  }[type] || '📝');

  const totalDays = request.totalDays || (request.startDate && request.endDate ? 
    Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000*60*60*24)) + 1 : 0);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] group overflow-hidden w-full"
    >
      {/* Status Bar - single color */}
      <div className="h-1.5 w-full bg-teal-500" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getLeaveTypeEmoji(request.leaveType)}</span>
            <div>
              <h3 className="font-semibold text-lg text-teal-900 transition-colors">
                {request.leaveType ? request.leaveType.replace("_", " ") : "Unknown"} Leave
              </h3>
              <p className="text-teal-900 text-sm mt-1">
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
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              <span className="text-sm font-semibold uppercase tracking-wide">
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
              <div className="flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
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