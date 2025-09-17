import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFacultyActivities } from "../features/facultyDashSlice";
import RecentVerificationsList from "./RecentVerificationsList";

const RecentVerifications = ({
  fullHeight = false,
  limit = 8,
  dataKey = "recentApprovals",
}) => {
  const dispatch = useDispatch();
  const { activities = {}, activitiesLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFacultyActivities());
  }, [dispatch]);

  const approvals = activities[dataKey] || [];

  return (
    <div className="w-full h-full">
      <RecentVerificationsList
        approvals={approvals}
        total={activities.totalApprovals || approvals.length}
        loading={activitiesLoading}
        error={error}
        onRetry={() => dispatch(fetchFacultyActivities())}
        variant={fullHeight ? "full" : "summary"}
        limit={limit}
        onViewAll={
          !fullHeight ? () => navigate("/faculty/verifications") : undefined
        }
      />
    </div>
  );
};

export default RecentVerifications;
