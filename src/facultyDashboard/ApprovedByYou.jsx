import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyActivities } from "../features/facultyDashSlice";

const TABS = [
  { key: "certifications", label: "Certifications" },
  { key: "workshops", label: "Workshops" },
  { key: "clubs", label: "Clubs/Hackathon/Others" },
];

const ApprovedByYou = () => {
  const dispatch = useDispatch();
  const { activities = {}, activitiesLoading, error } = useSelector(
    (state) => state.facultyDashboard
  );
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [tabContent, setTabContent] = useState([]);

  useEffect(() => {
    dispatch(fetchFacultyActivities());
  }, [dispatch]);

  useEffect(() => {
    if (!activities.recentApprovals) return;
    let filtered = [];
    if (activeTab === "certifications") {
      filtered = activities.recentApprovals.filter(
        (a) => a.type === "certificate" || a.type === "certification"
      );
    } else if (activeTab === "workshops") {
      filtered = activities.recentApprovals.filter(
        (a) => a.type === "workshop"
      );
    } else {
      filtered = activities.recentApprovals.filter(
        (a) =>
          a.type === "club" ||
          a.type === "hackathon" ||
          a.type === "other" ||
          a.type === "clubs" ||
          a.type === "hackthons"
      );
    }
    setTabContent(filtered);
  }, [activities, activeTab]);

  return (
    <section className="bg-white rounded-2xl shadow p-6 animate-fadeInUp">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Approved by You</h2>
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ${
              activeTab === tab.key
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-[120px] animate-slideInRight">
        {activitiesLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : tabContent.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No records found in this category.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tabContent.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-blue-50 rounded-lg p-3 shadow-sm hover:bg-blue-100 transition-colors duration-200"
              >
                <div>
                  <div className="font-semibold text-blue-800 capitalize">{item.description}</div>
                  <div className="text-xs text-gray-500">{item.studentName} • {new Date(item.approvedOn).toLocaleDateString()}</div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-xl font-medium ${item.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {item.status === "approved" ? "Approved" : "Rejected"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ApprovedByYou;
