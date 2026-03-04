import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { fetchHODDashboardStats, fetchAllDepartments } from "../../features/HOD/hodDashSlice";
import { fetchDepartmentFaculty, fetchDepartmentStudents, selectAssignmentStats, setHODInfo } from "../../features/HOD/hodAssignmentSlice";
import {
  Users, GraduationCap, Megaphone, Building2, Award,
  BarChart3, Briefcase, ChevronRight, Trophy, CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import WelcomeBanner from "../../components/shared/WelcomeBanner";
import FetchTopTenStudents from "../../components/shared/weeklyPerformance/FetchTopTenStudents.jsx";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export default function HODDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading, error, allDepartments } = useSelector((s) => s.hodDashboard);
  const { hodInfo } = useSelector((s) => s.hodAssignment);
  const assignmentStats = useSelector(selectAssignmentStats);

  useEffect(() => {
    dispatch(fetchHODDashboardStats());
    dispatch(fetchAllDepartments());
    dispatch(fetchDepartmentFaculty());
    dispatch(fetchDepartmentStudents());
  }, [dispatch]);

  useEffect(() => {
    const fetchHODInfo = async () => {
      if (!hodInfo) {
        try {
          const response = await api.get("/hod/info");
          const raw = response.data?.data?.hod ?? response.data?.hod ?? response.data?.data;
          if (raw && (raw.hodId || raw.fullname || raw.email)) {
            dispatch(setHODInfo({
              ...raw,
              mobile: raw.mobile ?? raw.mobileno ?? raw.phone ?? raw.contactNumber ?? raw.mobileNo,
            }));
          }
        } catch (e) {
          console.error("Error fetching HOD info:", e);
        }
      }
    };
    fetchHODInfo();
  }, [dispatch, hodInfo]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="text-center p-6 bg-white rounded-xl border border-red-200 shadow max-w-sm">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button onClick={() => dispatch(fetchHODDashboardStats())} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const ov = stats?.overview || {};
  const statCards = [
    { title: "Total Students", value: assignmentStats.totalStudents, icon: Users, color: "teal" },
    { title: "Total Faculty", value: assignmentStats.totalFaculty, icon: GraduationCap, color: "teal" },
    { title: "Announcements", value: ov.activeAnnouncements || 0, icon: Megaphone, color: "teal" },
    { title: "Sections", value: assignmentStats.totalSections, icon: Building2, color: "teal" },
    { title: "Assigned Faculty", value: assignmentStats.assignedFacultyCount, icon: CheckCircle2, color: "teal" },
    { title: "Clubs", value: ov.totalClubs || 0, icon: Briefcase, color: "teal" },
  ];

  const colorMap = {
    teal: { bg: "bg-teal-50", icon: "bg-teal-500", text: "text-teal-700" },
  };

  // Chart data for all departments
  const deptChartData = (allDepartments || []).map((d) => ({
    name: d.department || "N/A",
    students: d.totalStudents,
    faculty: d.totalFaculty,
    score: d.performanceScore,
  }));

  return (
    <div className="w-full p-3 sm:p-5 lg:p-6 space-y-6">
      <WelcomeBanner
        name={hodInfo?.fullname || hodInfo?.name || stats?.hodName || "HOD"}
        loading={false}
        greeting="Welcome"
        description="Overview of your department management."
        emoji="👔"
        gradient="bg-gradient-to-r from-teal-700 to-teal-800"
        announcementsRoute="/hod/announcements"
      />

      {/* Leaderboard: top 10 students — shown at top below header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
        <FetchTopTenStudents leaderboardPath="/hod/students/leaderboard" profilePath="/hod/students/view-all" />
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((s, i) => {
          const c = colorMap[s.color];
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`${c.bg} rounded-xl p-4 border border-white/60 hover:shadow-md`}
            >
              <div className={`w-9 h-9 ${c.icon} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-1">{s.title}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
            </motion.div>
          );
        })}
      </div>

      {/* All Departments Performance Chart */}
      {deptChartData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-teal-700" />
              <h2 className="text-lg font-bold text-gray-900">All Departments — Student Count</h2>
            </div>
            <button onClick={() => navigate("/hod/analytics")} className="text-xs text-teal-700 font-medium flex items-center gap-1 hover:underline">
              View Analytics <ChevronRight size={14} />
            </button>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Bar dataKey="students" radius={[6, 6, 0, 0]} name="Students">
                  {deptChartData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Comparison Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium text-center">Students</th>
                  <th className="pb-2 font-medium text-center">Faculty</th>
                  <th className="pb-2 font-medium text-center">Certs</th>
                  <th className="pb-2 font-medium text-center">Projects</th>
                  <th className="pb-2 font-medium text-center hidden sm:table-cell">Score</th>
                </tr>
              </thead>
              <tbody>
                {allDepartments.map((d, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {d.department}
                    </td>
                    <td className="py-2.5 text-center text-gray-700">{d.totalStudents}</td>
                    <td className="py-2.5 text-center text-gray-700">{d.totalFaculty}</td>
                    <td className="py-2.5 text-center text-gray-700">{d.totalCertifications}</td>
                    <td className="py-2.5 text-center text-gray-700">{d.totalProjects}</td>
                    <td className="py-2.5 text-center hidden sm:table-cell">
                      <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">{d.performanceScore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Performers */}
        {stats?.topPerformers?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-yellow-500" />
              <h2 className="text-base font-bold text-gray-900">Top Performers</h2>
            </div>
            <div className="space-y-3">
              {stats.topPerformers.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-teal-700 flex-shrink-0">
                    {idx + 1}
                  </div>
                  {s.avatar ? (
                    <img src={s.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {s.fullname?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.fullname}</p>
                    <p className="text-xs text-gray-500">{s.programName || s.studentid}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full">
                    <Award size={12} /> {s.achievementCount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Faculty Workload */}
        {stats?.facultyWorkload?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-teal-700" />
              <h2 className="text-base font-bold text-gray-900">Faculty Workload</h2>
            </div>
            <div className="space-y-3">
              {stats.facultyWorkload.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                  {f.avatar ? (
                    <img src={f.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                      {f.fullname?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{f.fullname}</p>
                    <p className="text-xs text-gray-500">{f.facultyid}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Users size={12} /> {f.studentCount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sections Grid */}
      {stats?.sectionStats?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-teal-700" />
            <h2 className="text-base font-bold text-gray-900">Students by Section</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {stats.sectionStats.map((s, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-br from-teal-50 to-teal-50 rounded-xl border border-teal-100 hover:shadow-sm">
                <p className="font-bold text-gray-900 text-sm truncate">{s.section}</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">{s.studentCount}</p>
                <p className="text-[11px] text-gray-500">students</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Announcements */}
      {stats?.recentAnnouncements?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-teal-700" />
              <h2 className="text-base font-bold text-gray-900">Recent Announcements</h2>
            </div>
            <button onClick={() => navigate("/hod/announcements")} className="text-xs text-teal-700 font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {stats.recentAnnouncements.map((a, idx) => (
              <div key={idx} className="p-3 rounded-lg border-l-4 border-teal-400 bg-gray-50/50 hover:bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {a.clubId && a.participationOrRegistrationLink && (
                    <a
                      href={a.participationOrRegistrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200"
                    >
                      Registration / Participation link
                    </a>
                  )}
                  <span className="text-[11px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
