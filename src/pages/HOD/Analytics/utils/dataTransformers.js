// Data transformation utilities for analytics

/**
 * Transform department performance data for charts
 */
export const transformPerformanceData = (departmentPerformance) => {
  if (!Array.isArray(departmentPerformance)) return [];
  
  return departmentPerformance.map((dept) => ({
    name: dept.department || 'Unknown',
    performance: dept.performanceScore || 0,
    attendance: dept.avgAttendance || 0,
    certifications: dept.totalCertifications || 0,
    projects: dept.totalProjects || 0,
  }));
};

/**
 * Transform section attendance data for pie chart
 */
export const transformAttendancePieData = (sectionAttendance) => {
  if (!sectionAttendance?.sections || !Array.isArray(sectionAttendance.sections)) {
    return [];
  }
  
  return sectionAttendance.sections.map((section) => ({
    name: `Section ${section.section}`,
    value: section.avgAttendance || 0,
    section: section.section,
  }));
};

/**
 * Get attendance status color based on percentage
 */
export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'text-emerald-600';
  if (percentage >= 75) return 'text-blue-600';
  if (percentage >= 60) return 'text-amber-600';
  return 'text-red-600';
};

/**
 * Get attendance status badge color
 */
export const getAttendanceBadgeColor = (percentage) => {
  if (percentage >= 90) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (percentage >= 75) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (percentage >= 60) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

/**
 * Format percentage value
 */
export const formatPercentage = (value) => {
  return `${Number(value).toFixed(1)}%`;
};

/**
 * Calculate total statistics from department performance
 */
export const calculateTotalStats = (departmentPerformance) => {
  if (!Array.isArray(departmentPerformance) || departmentPerformance.length === 0) {
    return {
      totalDepartments: 0,
      avgPerformance: 0,
      avgAttendance: 0,
      totalCertifications: 0,
      totalProjects: 0,
    };
  }

  const totals = departmentPerformance.reduce(
    (acc, dept) => ({
      totalDepartments: acc.totalDepartments + 1,
      avgPerformance: acc.avgPerformance + (dept.performanceScore || 0),
      avgAttendance: acc.avgAttendance + (dept.avgAttendance || 0),
      totalCertifications: acc.totalCertifications + (dept.totalCertifications || 0),
      totalProjects: acc.totalProjects + (dept.totalProjects || 0),
    }),
    {
      totalDepartments: 0,
      avgPerformance: 0,
      avgAttendance: 0,
      totalCertifications: 0,
      totalProjects: 0,
    }
  );

  return {
    ...totals,
    avgPerformance: totals.avgPerformance / totals.totalDepartments,
    avgAttendance: totals.avgAttendance / totals.totalDepartments,
  };
};

