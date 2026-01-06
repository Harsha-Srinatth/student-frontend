import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyActivities } from "../../../features/faculty/facultyDashSlice";
import {
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  User2,
  Building2,
  CalendarDays,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { generateAchievementPdf } from "../../../utils/pdfUtil";

const TABS = [
  { key: "certifications", label: "Certifications", icon: Award, color: "from-amber-500 to-orange-600" },
  { key: "workshops", label: "Workshops", icon: BookOpen, color: "from-blue-500 to-indigo-600" },
  { key: "clubs", label: "Clubs & Others", icon: Users, color: "from-purple-500 to-pink-600" },
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
    if (!activities?.recentApprovals) return;
    let filtered = [];
    if (activeTab === "certifications") {
      filtered = activities.recentApprovals.filter(
        (a) => a.type === "certificate" || a.type === "certification"
      );
    } else if (activeTab === "workshops") {
      filtered = activities.recentApprovals.filter((a) => a.type === "workshop");
    } else {
      const othersTypes = new Set([
        "club",
        "clubs",
        "hackathon",
        "hackathons",
        "hackthons",
        "other",
        "others",
        "project",
        "projects",
        "internship",
        "internships",
      ]);
      filtered = activities.recentApprovals.filter((a) =>
        othersTypes.has((a.type || "").toLowerCase())
      );
    }
    setTabContent(filtered);
  }, [activities, activeTab]);

  const getTabIcon = (key) => {
    const tab = TABS.find(t => t.key === key);
    return tab ? tab.icon : FileText;
  };

  const getTabColor = (key) => {
    const tab = TABS.find(t => t.key === key);
    return tab ? tab.color : "from-blue-500 to-indigo-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Container - Dark Theme */}
      <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
        
        {/* Header Section */}
        <div className="relative p-8 pb-6 bg-gradient-to-br from-slate-700 to-slate-800">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25 flex items-center justify-center transform rotate-3 transition-all duration-500">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-2xl blur-md -z-10" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Approved by You
              </h1>
              <p className="text-slate-300 mt-2 text-lg">
                Track and export student achievements you've reviewed
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                  {tabContent.length} Records
                </div>
                <div className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                  Faculty Review
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 pb-8 bg-slate-800">
          <div className="flex flex-wrap gap-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-800
                    ${isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-xl` 
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white shadow-lg'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-6'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-sm -z-10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8 bg-slate-800">
          <div className="min-h-[400px]">
            {activitiesLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="bg-slate-700/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-600 rounded-xl" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-slate-600 rounded-lg w-3/5" />
                          <div className="h-3 bg-slate-600 rounded w-4/5" />
                        </div>
                        <div className="w-24 h-8 bg-slate-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center shadow-lg">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-300 text-lg font-medium">{error}</p>
              </div>
            ) : tabContent.length === 0 ? (
              <div className="bg-slate-700/30 rounded-2xl p-12 text-center shadow-inner">
                <div className="w-20 h-20 bg-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-300 text-lg font-medium">
                  No records found in this category
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Check back later for new approvals
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {tabContent.map((item, idx) => {
                  const status = (item.status || "").toLowerCase();
                  const isApproved = status === "approved" || status === "verified";
                  const dateStr = new Date(
                    item.approvedOn || item.reviewedOn || item.timestamp
                  ).toLocaleDateString();

                  return (
                    <div
                      key={idx}
                      className="group relative bg-slate-700/40 hover:bg-slate-700/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                    >
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Icon & Main Content */}
                        <div className="flex-1 flex items-start gap-5">
                          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${getTabColor(activeTab)} shadow-lg flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6`}>
                            {React.createElement(getTabIcon(activeTab), { className: "w-7 h-7 text-white" })}
                            <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl blur-sm -z-10" />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors duration-300">
                              {item.description}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                              {item.studentName && (
                                <div className="flex items-center gap-2 text-slate-300">
                                  <User2 className="w-4 h-4 text-blue-400" />
                                  <span className="font-medium">{item.studentName}</span>
                                </div>
                              )}
                              {item.institution && (
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Building2 className="w-4 h-4 text-indigo-400" />
                                  <span>{item.institution}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-slate-300">
                                <CalendarDays className="w-4 h-4 text-purple-400" />
                                <span>{dateStr}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          {/* Download Button */}
                          <div className="relative group/btn">
                            <button
                              onClick={() => {
                                generateAchievementPdf({
                                  title: item.description,
                                  type: item.type,
                                  studentName: item.studentName,
                                  institution: item.institution,
                                  approvedBy:
                                    item.reviewedBy || item.approvedBy
                                      ? `${item.reviewedBy || item.approvedBy} (Faculty)`
                                      : "Faculty",
                                  approvedOn:
                                    item.approvedOn ||
                                    item.reviewedOn ||
                                    item.timestamp,
                                  status: item.status,
                                  imageUrl: item.imageUrl || item.certificateUrl,
                                });
                              }}
                              className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110 hover:rotate-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center group"
                            >
                              <Download className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-slate-700">
                              Download PDF
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className={`
                            relative px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all duration-300 transform hover:scale-105
                            ${isApproved 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/40 hover:shadow-green-500/60' 
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/40 hover:shadow-red-500/60'
                            }
                          `}>
                            <div className="flex items-center gap-2">
                              {isApproved ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              <span>{isApproved ? 'Approved' : 'Rejected'}</span>
                            </div>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedByYou;