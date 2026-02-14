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
    const baseApprovals = facultyDashboard.pendingApprovals === null ? null : (facultyDashboard.pendingApprovals || []);
    if (baseApprovals === null) return null; // Don't merge if we haven't fetched yet
    return mergeArrays(
      baseApprovals,
      realtimeData?.pendingApprovals
    );
  }, [facultyDashboard.pendingApprovals, realtimeData?.pendingApprovals]);
  
  const { pendingLoading, error } = facultyDashboard;
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Only fetch if we don't have data yet (pendingApprovals is null)
    // Redux thunk will handle caching - it won't fetch if data already exists
    if (pendingApprovals === null && !pendingLoading) {
      dispatch(fetchPendingApprovals());
    }
  }, [dispatch, pendingApprovals, pendingLoading]);

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
        items={pendingApprovals === null ? [] : pendingApprovals}
        loading={pendingLoading || pendingApprovals === null}
        error={error}
        onRetry={() => dispatch(fetchPendingApprovals())}
        onItemClick={handleStudentClick}
        variant="full"
      />
    </div>
  );
};

export default PendingApprovals;
