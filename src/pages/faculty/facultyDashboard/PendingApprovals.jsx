import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals } from "../../../features/faculty/facultyDashSlice";
import StudentDetailView from "./StudentDetailView";
import PendingApprovalsList from "./PendingApprovalsList";
import { mergeArrays } from "../../../utils/realtimeHelpers";

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const facultyDashboard = useSelector((state) => state.facultyDashboard);
  const realtimeData = useSelector((state) => state.realtime?.faculty);
  
  // Merge real-time pending approvals with existing approvals
  const pendingApprovals = useMemo(() => {
    return mergeArrays(
      facultyDashboard.pendingApprovals || [],
      realtimeData?.pendingApprovals
    );
  }, [facultyDashboard.pendingApprovals, realtimeData?.pendingApprovals]);
  
  const { pendingLoading, error } = facultyDashboard;
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Check for real-time updates
  const lastRealtimeUpdate = useSelector((state) => state.realtime?.lastUpdated?.faculty);

  useEffect(() => {
    // Always fetch on mount - Redux will handle caching
    // Also refetch if real-time update occurred recently
    const shouldRefetch = !lastRealtimeUpdate || 
      (Date.now() - lastRealtimeUpdate < 5000);
    
    if (shouldRefetch) {
      dispatch(fetchPendingApprovals());
    }
  }, [dispatch, lastRealtimeUpdate]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    dispatch(fetchPendingApprovals()); // Refresh the list
  };

  if (selectedStudent) {
    return (
      <StudentDetailView 
        student={selectedStudent} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <PendingApprovalsList
        items={pendingApprovals}
        loading={pendingLoading}
        error={error}
        onRetry={() => dispatch(fetchPendingApprovals())}
        onItemClick={handleStudentClick}
        variant="full"
      />
    </div>
  );
};

export default PendingApprovals;
