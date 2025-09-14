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
    <div className="flex flex-col gap-6 w-full">
      <WelcomeBanner />

            {/* Top Row - Quick Stats and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance - takes 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <AttendencePer />
        </div>

        {/* Quick Stats - takes 1/3 width on large screens */}
        <div className="lg:col-span-1 flex flex-col">
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
