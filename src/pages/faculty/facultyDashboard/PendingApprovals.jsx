import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals } from "../../../features/faculty/facultyDashSlice";
import StudentDetailView from "./StudentDetailView";
import PendingApprovalsList from "./PendingApprovalsList";

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const facultyDashboard = useSelector((state) => state.facultyDashboard);
  
  // Read directly from store (source of truth - updated by socket)
  const pendingApprovals = facultyDashboard.pendingApprovals;
  
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
