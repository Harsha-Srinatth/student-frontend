import React from "react";
import WelcomeBanner from "./WelcomeBanner";
import QuickStats from "./QuickStats";
import AttendencePer from "./AttendencePer";
import Credits from "./Credits";
import RecentActivities from "./RecentActivities";
import Announcements from "./Announcements";
import RejectedApprovals from "./RejectedApprovels";
const StudentHome = () => {
 
  return (
    <div className="flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn">
      <WelcomeBanner />

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
    </div>
  );
};

export default StudentHome;
