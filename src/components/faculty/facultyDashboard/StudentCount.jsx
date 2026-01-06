import React from 'react';
import { useSelector } from 'react-redux';

const StudentCount = () => {
  // Get count from dashboard stats (already fetched by FacultyHome)
  // Fallback to students list count if dashboard stats not available
  const dashboardStats = useSelector((state) => state.facultyDashboard.stats);
  const studentsList = useSelector((state) => state.students.students);
  const dashboardLoading = useSelector((state) => state.facultyDashboard.loading);
  
  // Use dashboard stats first, then students list, then 0
  const count = dashboardStats?.totalStudents || studentsList?.length || 0;
  const countLoading = dashboardLoading;
  const countError = useSelector((state) => state.facultyDashboard.error);

  // Only show loading if dashboard is loading and we don't have any data
  if (countLoading && count === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (countError) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-600">{countError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600 mt-1">{count}</p>
          <p className="text-sm text-gray-500 mt-1">Students under your guidance</p>
        </div>
        <div className="text-right">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCount;
