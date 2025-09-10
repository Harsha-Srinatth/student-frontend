import React from "react";
import WelcomeBanner from "./WelcomeBanner";
import QuickStats from "./QuickStats";
import RecentActivities from "./RecentActivities";
import Announcements from "./Announcements";

const StudentHome = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <WelcomeBanner />
      <QuickStats />
      <RecentActivities />
      <Announcements />
    </div>
  );
};

export default StudentHome;
