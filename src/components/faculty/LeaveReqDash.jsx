import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, Clock, CheckCircle, XCircle, BarChart3, 
  Search, Filter
} from 'lucide-react';

import FacultyLeaveRequestCard from '../../components/faculty/LeaveReqCard';
import FacultyLeaveRequestModal from '../../components/faculty/LeaveReqModel';

// Thunks & selectors from your redux slice
import {
  fetchLeaveRequests,
  processLeaveRequest,
  fetchFacultyStats,
  fetchFacultyProfile,
  selectLeaveRequests,
  selectLeaveStats,
  selectFacultyProfile,
  selectFacultyLoading,
  selectFacultyError
} from '../../features/facultyLeaveReqSlice';

const FacultyDashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const leaveRequests = useSelector(selectLeaveRequests) || [];
  const leaveStats = useSelector(selectLeaveStats) || {}; // counts if provided by backend
  const facultyProfile = useSelector(selectFacultyProfile) || {};
  const isLoading = useSelector(selectFacultyLoading);
  const error = useSelector(selectFacultyError);

  // Local UI state
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Derived stats fallback (if backend didn't provide)
  const derivedStats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
    ...leaveStats // override with server-provided if available
  };

  // Load data on mount
  useEffect(() => {
    // params can be adjusted as needed
    dispatch(fetchFacultyProfile());
    dispatch(fetchFacultyStats());
    dispatch(fetchLeaveRequests({ status: 'all', page: 1, limit: 50 }));
  }, [dispatch]);

  // Recompute filteredRequests whenever source data or filters change
  useEffect(() => {
    let filtered = Array.isArray(leaveRequests) ? [...leaveRequests] : [];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    // Search filter (name, id, leaveType, reason)
    if (searchTerm && searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        (request.studentName || '').toLowerCase().includes(q) ||
        (request.studentId || '').toLowerCase().includes(q) ||
        (request.leaveType || '').toLowerCase().includes(q) ||
        (request.reason || '').toLowerCase().includes(q)
      );
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, statusFilter, priorityFilter, searchTerm]);

  // Approve / Reject handler — uses your thunk and refreshes requests after success
  const handleApproveReject = async (requestId, status, remarks = '') => {
    try {
      // find the request to get student id (thunk expects studentid and requestId)
      const request = leaveRequests.find(r => r._id === requestId);
      if (!request) {
        alert('Request not found');
        return;
      }

      // dispatch and wait for result; unwrap() will throw on rejection
      // Using object shape your thunk expects: { studentid, requestId, status, approvalRemarks }
      // note: createAsyncThunk returns a promise so we can await dispatch(...)
      // If your project uses redux-toolkit's unwrapResult you can import and use it; here we rely on the returned promise's unwrap method.
      // eslint-disable-next-line no-await-in-loop
      await dispatch(processLeaveRequest({
        studentid: request.studentId,
        requestId: requestId,
        status,
        approvalRemarks: remarks
      })).unwrap?.();

      // refetch latest list & stats after processing
      await dispatch(fetchLeaveRequests({ status: 'all', page: 1, limit: 50 })).unwrap?.();
      await dispatch(fetchFacultyStats()).unwrap?.();

      // close modal
      setSelectedRequest(null);

      alert(`Leave request ${status} successfully!`);
    } catch (err) {
      console.error('Error processing leave request:', err);
      alert('Error updating leave request. Please try again.');
    }
  };

  // Local faculty info fallback if profile not loaded yet
  const facultyInfo = {
    facultyid: facultyProfile.facultyid || facultyProfile.id || 'FAC001',
    fullname: facultyProfile.fullname || facultyProfile.name || 'Faculty Member',
    dept: facultyProfile.dept || facultyProfile.department || 'Department',
    designation: facultyProfile.designation || 'Faculty',
    email: facultyProfile.email || facultyProfile.contactEmail || ''
  };

  if (isLoading && filteredRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load data</h3>
          <p className="text-gray-600 mb-4">There was an error fetching faculty data. Please try again later.</p>
          <button
            onClick={() => {
              dispatch(fetchLeaveRequests({ status: 'all', page: 1, limit: 50 }));
              dispatch(fetchFacultyStats());
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage student leave requests</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-900">{facultyInfo.fullname}</p>
              <p className="text-sm text-gray-500">{facultyInfo.dept} Department</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{derivedStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{derivedStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{derivedStats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{derivedStats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or leave type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leave Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No leave requests found</h3>
            <p className="text-gray-600">
              {leaveRequests.length === 0 
                ? "No students have submitted leave requests yet."
                : "No requests match your current filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <FacultyLeaveRequestCard
                key={request._id}
                request={request}
                onView={() => setSelectedRequest(request)}
                onApprove={(remarks) => handleApproveReject(request._id, 'approved', remarks)}
                onReject={(remarks) => handleApproveReject(request._id, 'rejected', remarks)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <FacultyLeaveRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={(remarks) => handleApproveReject(selectedRequest._id, 'approved', remarks)}
          onReject={(remarks) => handleApproveReject(selectedRequest._id, 'rejected', remarks)}
          facultyInfo={facultyInfo}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
