import React from "react";
import WelcomeBanner from "./WelcomeBanner";
import QuickStatsFaculty from "./QuickStatsFaculty";
import PendingApprovals from "./PendingApprovals";
import RecentVerifications from "./RecentVerifications";
import Announcements from "./Announcements"; // reuse same one

const HomeFaculty = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <WelcomeBanner />
      <QuickStatsFaculty />
      <PendingApprovals />
      <RecentVerifications />
      <Announcements />
    </div>
  );
};

export default HomeFaculty;
