import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals } from "../../../features/faculty/facultyDashSlice";
import StudentDetailView from "./StudentDetailView";
import PendingApprovalsList from "./PendingApprovalsList";

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const { pendingApprovals, pendingLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Always fetch on mount - Redux will handle caching
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

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
