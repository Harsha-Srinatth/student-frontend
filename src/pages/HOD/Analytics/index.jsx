import React from 'react';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import AnalyticsHeader from './components/AnalyticsHeader';
import LoadingState from './components/LoadingState';
import ErrorBanner from './components/ErrorBanner';
import Filters from './components/Filters';
import DepartmentPerformanceChart from './components/DepartmentPerformanceChart';
import AttendanceChart from './components/AttendanceChart';
import AchievementsChart from './components/AchievementsChart';
import SectionAttendanceAnalysis from './components/SectionAttendanceAnalysis';

export default function Analytics() {
  const {
    departmentPerformance,
    sectionAttendance,
    availableSections,
    performanceChartData,
    totalStats,
    performanceLoading,
    attendanceLoading,
    sectionsLoading,
    error,
    selectedDepartment,
    selectedSemester,
    selectedSection,
    handleDepartmentChange,
    handleSemesterChange,
    handleSectionChange,
    handleClearFilters,
  } = useAnalyticsData();

  // Show loading state only on initial load
  if (performanceLoading && departmentPerformance.length === 0) {
    return <LoadingState message="Loading analytics dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 via-blue-50/40 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        {/* Header with Stats */}
        <AnalyticsHeader stats={totalStats} />

        {/* Error Banner */}
        <ErrorBanner error={error} />

        {/* Department Performance Chart */}
        <DepartmentPerformanceChart data={performanceChartData} />

        {/* Department Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart data={performanceChartData} />
          <AchievementsChart data={performanceChartData} />
        </div>

        {/* Section-wise Attendance Analysis */}
        <div className="space-y-6">
          <Filters
            selectedDepartment={selectedDepartment}
            selectedSemester={selectedSemester}
            selectedSection={selectedSection}
            departments={departmentPerformance}
            availableSections={availableSections}
            sectionsLoading={sectionsLoading}
            onDepartmentChange={handleDepartmentChange}
            onSemesterChange={handleSemesterChange}
            onSectionChange={handleSectionChange}
            onClear={handleClearFilters}
          />

          <SectionAttendanceAnalysis
            sectionAttendance={sectionAttendance}
            loading={attendanceLoading}
          />
        </div>
      </div>
    </div>
  );
}

