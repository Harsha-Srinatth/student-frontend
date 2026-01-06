import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentsByFaculty, fetchStudentDetails, showStudentModal, hideStudentModal } from '../../../features/faculty/facultySlice';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StudentList = () => {
  const dispatch = useDispatch();
  const { 
    students, 
    totalCount, 
    studentsLoading, 
    studentsError, 
    selectedStudent, 
    showStudentModal: showModal,
    detailsLoading 
  } = useSelector((state) => state.students);

  const [searchTerm, setSearchTerm] = useState(""); // added search state

  useEffect(() => {
    // Only fetch if students not already in Redux or data is stale
    if (!students || students.length === 0) {
      dispatch(fetchStudentsByFaculty());
    }
  }, [dispatch, students]);

  const handleStudentClick = (studentid) => {
    dispatch(fetchStudentDetails(studentid));
    dispatch(showStudentModal());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Compute attendance percentage from student's attendance array
  const computeAttendancePercentage = (attendanceArray) => {
    if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) return null;
    const totalEntries = attendanceArray.length;
    const presentCount = attendanceArray.reduce((acc, entry) => acc + (entry.present ? 1 : 0), 0);
    return Math.round((presentCount / totalEntries) * 100);
  };

  // Color mapping for attendance percentage
  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return '#10B981'; // Emerald
    if (percentage >= 85) return '#0EA5E9'; // Sky Blue
    if (percentage >= 75) return '#8B5CF6'; // Violet
    return '#F43F5E'; // Rose
  };

  if (studentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{studentsError}</p>
        <button 
          onClick={() => dispatch(fetchStudentsByFaculty())}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // search/filter logic
  const term = (searchTerm || "").trim().toLowerCase();
  const filteredStudents = (students || []).filter(student => {
    if (!term) return true;
    return (
      (student.fullname || '').toString().toLowerCase().includes(term) ||
      (student.username || '').toString().toLowerCase().includes(term) ||
      (student.studentid || '').toString().toLowerCase().includes(term) ||
      (student.programName || '').toString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  My Students
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">
                      Total Students: <span className="font-bold text-blue-600 text-xl">{students.length}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-blue-600">Active Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Students*/}
        <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative w-full max-w-lg">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
              placeholder="Search by name, username, ID, or program..."
            />
          </div>
        </div>
        {/* Students Grid */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Students Found</h3>
              <p className="text-gray-500 mb-6">No students are currently assigned to this faculty.</p>
              <button 
                onClick={() => dispatch(fetchStudentsByFaculty())}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Students Found</h3>
              <p className="text-gray-500 mb-6">No students match your search.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  dispatch(fetchStudentsByFaculty());
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredStudents.map((student, index) => {
              const attendancePct = computeAttendancePercentage(student.attendance);
              const attendanceColor = attendancePct != null ? getAttendanceColor(attendancePct) : null;
              return (
                <div
                  key={student.studentid}
                  onClick={() => handleStudentClick(student.studentid)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group transform relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Attendance Progress Bar - Top Right */}
                  {attendancePct != null && (
                    <div className="absolute top-4 right-4 z-10">
                      <div style={{ width: 38, height: 38, filter: `drop-shadow(0 0 4px ${attendanceColor}55)` }}>
                        <CircularProgressbar
                          value={attendancePct}
                          text={`${attendancePct}%`}
                          styles={buildStyles({
                            pathColor: attendanceColor,
                            textColor: attendanceColor,
                            trailColor: '#E5E7EB',
                            textSize: '2rem',
                            fontWeight: 'bold',
                          })}
                          strokeWidth={8}
                        />
                      </div>
                    </div>
                  )}
                {/* Profile Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 shadow-lg">
                      {student.image?.url ? (
                        <img
                          src={student.image.url}
                          alt={student.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {student.fullname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {student.fullname}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{student.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs text-blue-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Student ID</span>
                      <span className="text-sm font-mono font-bold text-gray-800">
                        {student.studentid}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Program</span>
                      <span className="text-sm font-semibold text-gray-800 truncate ml-2">
                        {student.programName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Semester</span>
                        <span className="text-sm font-semibold text-gray-800 mt-1">
                          {student.semester || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</span>
                        <span className="text-sm font-semibold text-gray-800 mt-1">
                          {formatDate(student.dateofjoin)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-blue-600 font-semibold flex items-center group-hover:text-blue-700">
                    View Details
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideInRight">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {selectedStudent.image?.url ? (
                      <img
                        src={selectedStudent.image.url}
                        alt={selectedStudent.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xl">
                        {selectedStudent.fullname.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.fullname}</h2>
                    <p className="text-gray-600">@{selectedStudent.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(hideStudentModal())}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Student ID</label>
                    <p className="text-lg font-mono text-gray-900">{selectedStudent.studentid}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-gray-900">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program</label>
                    <p className="text-lg text-gray-900">{selectedStudent.programName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Semester</label>
                    <p className="text-lg text-gray-900">{selectedStudent.semester || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Institution</label>
                    <p className="text-lg text-gray-900">{selectedStudent.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-lg text-gray-900">{selectedStudent.dept}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="text-lg text-gray-900">{selectedStudent.mobileno}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Joining</label>
                    <p className="text-lg text-gray-900">{formatDate(selectedStudent.dateofjoin)}</p>
                  </div>
                </div>
              </div>

              {/* Activities Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStudent.certifications?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">Certificates</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStudent.workshops?.length || 0}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Workshops</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedStudent.clubsJoined?.length || 0}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">Clubs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;