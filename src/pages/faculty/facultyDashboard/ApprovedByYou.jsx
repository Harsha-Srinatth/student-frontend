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
  { key: "certifications", label: "Certifications", icon: Award, color: "from-[#162b61] to-[#2F4A5D]" },
  { key: "workshops", label: "Workshops", icon: BookOpen, color: "from-[#162b61] to-[#2F4A5D]" },
  { key: "clubs", label: "Clubs & Others", icon: Users, color: "from-[#162b61] to-[#2F4A5D]" },
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
    return tab ? tab.color : "from-[#162b61] to-[#2F4A5D]";
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Container */}
      <div className="bg-[#E9E6E1] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[#D9D6D0]">
        
        {/* Header Section */}
        <div className="relative p-8 pb-6 bg-[#E9E6E1]">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#374763] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2F3E5C] leading-tight">
                Approved by You
              </h1>
              <p className="text-[#5E6B7C] mt-2 text-lg">
                Track and export student achievements you've reviewed
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="px-4 py-2 bg-[#D9D6D0] text-[#2F3E5C] rounded-full text-sm font-medium">
                  {tabContent.length} Records
                </div>
                <div className="px-4 py-2 bg-[#D9D6D0] text-[#2F3E5C] rounded-full text-sm font-medium">
                  Faculty Review
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 pb-8">
          <div className="flex flex-wrap gap-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                    ${isActive 
                      ? 'bg-[#374763] text-white shadow' 
                      : 'bg-[#D9D6D0] text-[#2F3E5C] hover:bg-[#D9D6D0] hover:opacity-80'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8">
          <div className="min-h-[400px]">
            {activitiesLoading ? (
              <div className="text-center text-[#5E6B7C] py-8">Loading...</div>
            ) : error ? (
              <div className="bg-[#FDECEC] border border-[#C0846A] rounded-xl p-6 text-center">
                <XCircle className="w-10 h-10 text-[#C0846A] mx-auto mb-2" />
                <p className="text-[#C0846A]">{error}</p>
              </div>
            ) : tabContent.length === 0 ? (
              <div className="bg-[#D9D6D0] rounded-xl p-10 text-center">
                <FileText className="w-10 h-10 text-[#5E6B7C] mx-auto mb-2" />
                <p className="text-[#2F3E5C] font-medium">
                  No records found in this category
                </p>
                <p className="text-[#5E6B7C] text-sm mt-2">
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
                      className="bg-[#E9E6E1] hover:bg-[#D9D6D0]/40 rounded-2xl shadow border border-[#D9D6D0] p-6 flex flex-col lg:flex-row lg:items-center gap-6 transition-all duration-300"
                    >
                      {/* Icon & Main Content */}
                      <div className="flex-1 flex items-start gap-5">
                          <div className="w-14 h-14 rounded-xl bg-[#374763] flex items-center justify-center">
                            {React.createElement(getTabIcon(activeTab), { className: "w-7 h-7 text-white" })}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-bold text-[#2F3E5C]">
                              {item.description}
                            </h3>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[#5E6B7C] text-sm">
                              {item.studentName && (
                                <div className="flex items-center gap-1">
                                  <User2 className="w-4 h-4" />
                                  <span>{item.studentName}</span>
                                </div>
                              )}
                              {item.institution && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  <span>{item.institution}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                <span>{dateStr}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          {/* Download Button */}
                          <button
                            onClick={() => {
                              // Pass full item so pdfUtil can use backend field names (institutionName, facultyName, etc.)
                              generateAchievementPdf({
                                ...item,
                                title: item.title ?? item.description,
                                studentName: item.studentName ?? item.student_name,
                                institution: item.institution ?? item.institutionName ?? item.institution_name,
                                approvedBy: item.reviewedBy ?? item.approvedBy ?? item.facultyName ?? item.faculty_name,
                                approvedOn: item.approvedOn ?? item.reviewedOn ?? item.timestamp,
                                status: item.status,
                                imageUrl: item.imageUrl ?? item.certificateUrl,
                              });
                            }}
                            className="w-12 h-12 bg-[#374763] text-white rounded-xl shadow hover:scale-105 transition flex items-center justify-center"
                          >
                            <Download className="w-5 h-5" />
                          </button>

                          {/* Status Badge */}
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold
                            ${isApproved 
                              ? 'bg-[#D9D6D0] text-[#2F3E5C]' 
                              : 'bg-[#D9D6D0] text-[#C0846A]'
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