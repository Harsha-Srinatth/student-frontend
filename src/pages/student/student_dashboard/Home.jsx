import React from "react";
import WelcomeBanner from "../../../components/shared/WelcomeBanner";
import PageContainer from "../../../components/shared/PageContainer";
import QuickStats from "./QuickStats";
import AttendencePer from "./AttendencePer";
import Credits from "./Credits";
import TopTenStudents from "../../../components/shared/weeklyPerformance/topTenSudents.jsx";
import RecentActivities from "./RecentActivities";
import Announcements from "./Announcements";
import RejectedApprovals from "./RejectedApprovels";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";

const StudentHome = () => {
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchSDashboardData());
  }, [dispatch]);

  return (
    <PageContainer>
      <WelcomeBanner
        name={student?.fullname}
        loading={loading}
        error={error}
        greeting="Welcome back"
        description="Here's a quick overview of your student activity records."
        emoji="👋"
        announcementsRoute="/student/announcements"
      />

      {/* Leaderboard: top 10 by points — shown at top below header */}
      <div className="mb-6">
        <TopTenStudents />
      </div>

      {/* Top Row - Quick Stats and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="h-full">
          <AttendencePer />
        </div>
        <div className="h-full">
          <QuickStats />
        </div>
      </div>
      <Credits />
      {/* Bottom Row - Activities and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <RejectedApprovals />
        <Announcements />
        
      </div>
    </PageContainer>
  );
};

export default StudentHome;
