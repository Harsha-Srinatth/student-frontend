import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import {
  fetchDepartmentPerformance,
  fetchSectionWiseAttendance,
  fetchAvailableSections,
} from '../../../../features/HOD/hodDashSlice';
import {
  transformPerformanceData,
  transformAttendancePieData,
  calculateTotalStats,
} from '../utils/dataTransformers';

export function useAnalyticsData() {
  const dispatch = useDispatch();
  const {
    departmentPerformance,
    sectionAttendance,
    availableSections,
    performanceLoading,
    attendanceLoading,
    sectionsLoading,
    error,
  } = useSelector((state) => state.hodDashboard);

  // Get HOD's department from Redux store (hodAssignmentSlice)
  const hodInfo = useSelector((state) => state.hodAssignment?.hodInfo);
  const hodDepartment = hodInfo?.department?.name || hodInfo?.department || Cookies.get('department') || '';

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Set default department to HOD's department on mount
  useEffect(() => {
    if (hodDepartment && !selectedDepartment) {
      setSelectedDepartment(hodDepartment);
    }
  }, [hodDepartment, selectedDepartment]);

  // Fetch department performance when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(fetchDepartmentPerformance(selectedDepartment));
    }
  }, [dispatch, selectedDepartment]);

  // Fetch available sections when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(
        fetchAvailableSections({
          department: selectedDepartment,
          semester: selectedSemester,
        })
      );
    } else {
      setSelectedSection('');
    }
  }, [dispatch, selectedDepartment, selectedSemester]);

  // Fetch section attendance when department or filters change
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(
        fetchSectionWiseAttendance({
          department: selectedDepartment,
          semester: selectedSemester,
          section: selectedSection,
        })
      );
    }
  }, [dispatch, selectedDepartment, selectedSemester, selectedSection]);

  // Transform data for charts
  const performanceChartData = useMemo(
    () => transformPerformanceData(departmentPerformance),
    [departmentPerformance]
  );

  const attendancePieData = useMemo(
    () => transformAttendancePieData(sectionAttendance),
    [sectionAttendance]
  );

  const totalStats = useMemo(
    () => calculateTotalStats(departmentPerformance),
    [departmentPerformance]
  );

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    if (!department) {
      setSelectedSemester('');
      setSelectedSection('');
    }
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    // Reset section when semester changes to fetch new sections
    setSelectedSection('');
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleClearFilters = () => {
    setSelectedDepartment(hodDepartment || '');
    setSelectedSemester('');
    setSelectedSection('');
  };

  return {
    // Data
    departmentPerformance,
    sectionAttendance,
    availableSections,
    performanceChartData,
    attendancePieData,
    totalStats,
    
    // Loading states
    performanceLoading,
    attendanceLoading,
    sectionsLoading,
    
    // Error
    error,
    
    // Filters
    selectedDepartment,
    selectedSemester,
    selectedSection,
    handleDepartmentChange,
    handleSemesterChange,
    handleSectionChange,
    handleClearFilters,
  };
}

