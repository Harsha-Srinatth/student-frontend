import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFacultyActivities } from "../../../features/faculty/facultyDashSlice";
import RecentVerificationsList from "./RecentVerificationsList";

const RecentVerifications = ({
  fullHeight = false,
  limit = 8,
  dataKey = "recentApprovals",
}) => {
  const dispatch = useDispatch();
  const { activities = null, activitiesLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if we don't have activities data yet (activities is null or empty)
    // Redux thunk will handle caching - it won't fetch if data already exists
    if ((!activities || Object.keys(activities).length === 0) && !activitiesLoading) {
      dispatch(fetchFacultyActivities());
    }
  }, [dispatch, activities, activitiesLoading]);

  const approvals = activities?.[dataKey] || [];

  return (
    <div className="w-full h-full">
      <RecentVerificationsList
        approvals={approvals}
        total={activities?.totalApprovals || approvals.length}
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
