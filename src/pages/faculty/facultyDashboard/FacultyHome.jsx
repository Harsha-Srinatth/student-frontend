import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../../components/shared/WelcomeBanner";
import PageContainer from "../../../components/shared/PageContainer";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import QuickStatsFaculty from "./QuickStatsFaculty";
import PendingApprovals from "./PendingApprovals";
import RecentVerifications from "./RecentVerifications";
import StudentCount from "../../../components/faculty/facultyDashboard/StudentCount";
import FetchTopTenStudents from "../../../components/shared/weeklyPerformance/FetchTopTenStudents.jsx";
import Announcements from "./Announcements";
import { fetchFacultyDashboardData } from "../../../features/faculty/facultyDashSlice";

const HomeFaculty = () => {
  const dispatch = useDispatch();
  const { faculty, loading, error, stats } = useSelector((state) => state.facultyDashboard);

  // Track if we've attempted to fetch data (prevents repeated fetches)
  const hasFetchedRef = React.useRef(false);

  // Debug: Log state changes (only in development and only when loading state changes)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🏠 FacultyHome state:', {
        loading,
        faculty: faculty ? (faculty.fullname || faculty.name) : 'null',
        stats: stats ? `set (totalStudents: ${stats.totalStudents})` : 'null',
        statsTotalStudents: stats?.totalStudents
      });
    }
  }, [loading]); // Only log when loading changes, not on every stats/faculty update

  useEffect(() => {
    // Only fetch once on mount if we don't have data yet
    // Use ref to prevent re-fetching when state changes
    if (!hasFetchedRef.current && (faculty === null || stats === null)) {
      hasFetchedRef.current = true;
      dispatch(fetchFacultyDashboardData());
    }
  }, [dispatch]); // Only depend on dispatch, not on faculty/stats

  // Show loading if actively loading OR if we don't have data yet
  // Only check if stats is null (not fetched), not individual properties
  // Socket updates may only update partial stats, so we shouldn't show loading
  // if stats object exists (even if some properties are undefined)
  const isLoading = loading || faculty === null || stats === null;
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSkeleton type="banner" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <WelcomeBanner
        name={faculty?.fullname || faculty?.name}
        loading={loading}
        error={error}
        greeting="Welcome"
        description="Here's an overview of approvals and student activity tracking."
        emoji="👩‍🏫"
        announcementsRoute="/faculty/announcements"
      />

      {/* Leaderboard: top 10 students (fetched from API) */}
      <div className="mb-6">
        <FetchTopTenStudents leaderboardPath="/faculty/students/leaderboard" profilePath="/faculty/students/view-all" />
      </div>

      {/* Student Count Card with Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentCount />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Students
              </h3>
              <p className="text-gray-600 mt-1">
                View and manage all your students
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/faculty/search/student-profiles"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                View Students
              </Link>
              <Link
                to="/faculty/students/view-all"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Search & Profiles
              </Link>
            </div>
          </div>
        </div>
      </div>

      <QuickStatsFaculty />
      <PendingApprovals />

      {/* Recent Verifications - summary mode for home page */}
      <RecentVerifications />

      <Announcements />
    </PageContainer>
  );
};

export default HomeFaculty;