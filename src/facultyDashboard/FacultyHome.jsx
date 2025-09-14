import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WelcomeBanner from "./WelcomeBanner";
import QuickStatsFaculty from "./QuickStatsFaculty";
import PendingApprovals from "./PendingApprovals";
import RecentVerifications from "./RecentVerifications";
import StudentCount from "../components/facultyDashboard/StudentCount";
// import Announcements from "./Announcements"; // reuse same one

const HomeFaculty = () => {
  const { faculty } = useSelector((state) => state.facultyDashboard);

  return (
    <div className="flex flex-col gap-6 w-full">
      <WelcomeBanner />
      
      {/* Student Count Card with Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentCount />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
                <p className="text-gray-600 mt-1">View and manage all your students</p>
              </div>
              <Link
                to="/faculty/search/student-profiles"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                View Students
              </Link>
            </div>
          </div>
        </div>
      
      <QuickStatsFaculty />
      <PendingApprovals />
      <RecentVerifications />
      {/* <Announcements /> */}
    </div>
  );
};

export default HomeFaculty;
