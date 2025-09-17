import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals } from "../features/facultyDashSlice";
import StudentDetailView from "./StudentDetailView";
import PendingApprovalsList from "./PendingApprovalsList";

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const { pendingApprovals, pendingLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    dispatch(fetchPendingApprovals()); // Refresh the list
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'certificate': return '📜';
      case 'workshop': return '🎓';
      case 'club': return '🏆';
      case 'internship': return '💼';
      case 'project': return '💡';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'certificate': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'workshop': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'club': return 'bg-green-50 text-green-700 border-green-200';
      case 'internship': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'project': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
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
