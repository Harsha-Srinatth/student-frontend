import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Trophy, Crown, Medal, TrendingUp, Search, Loader2, Calendar } from "lucide-react";
import api from "../../../services/api";
import PageContainer from "../PageContainer";
import ProfileView from "./ProfileView.jsx";
import { LEADERBOARD_TABS } from "./leaderboardConstants.js";

const RANK_META = [
  { bg: "#D39C2F", text: "text-white", ring: "ring-[#D39C2F]/50", icon: <Crown className="w-3.5 h-3.5 text-white" /> },
  { bg: "#5E6B7C", text: "text-white", ring: "ring-[#5E6B7C]/40", icon: <Medal className="w-3.5 h-3.5 text-white" /> },
  { bg: "#C0846A", text: "text-white", ring: "ring-[#C0846A]/40", icon: <Medal className="w-3.5 h-3.5 text-white" /> },
];

const LEADERBOARD_LIMIT = 30;

/** Format score for display: weightedPoints is 0–1, show as percentage; others as number */
function formatScore(pts, key) {
  const num = Number(pts);
  if (key === "weightedPoints") return (num * 100).toFixed(1);
  return Number.isFinite(num) ? num.toLocaleString() : "0";
}

const LeaderboardTablePage = ({ viewAllPath = "/student/students/view-all" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = Cookies.get("userRole");
  const currentUser = useSelector((state) => state.studentDashboard?.student);
  const currentStudentId = currentUser?.studentid || currentUser?.studentId;
  const isStudentView = userRole === "student" && Boolean(currentStudentId);

  const [searchInput, setSearchInput] = useState("");
  const [activeCol, setActiveCol] = useState("weightedPoints");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weekMeta, setWeekMeta] = useState(null);
  const [weeksLoading, setWeeksLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleViewProfile = useCallback(async (studentId) => {
    if (!studentId) return;
    setProfileLoading(true);
    setSelectedProfile(null);
    try {
      const { data } = await api.get(`/api/students/profile/${studentId}`);
      setSelectedProfile(data?.data ?? null);
    } catch {
      setSelectedProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchLeaderboardForWeek = useCallback(async (year, weekNumber) => {
    setLoading(true);
    try {
      const params = year != null && weekNumber != null ? { year, week: weekNumber } : {};
      const { data } = await api.get("/api/students/leaderboard", { params });
      const raw = data?.data;
      const list = Array.isArray(raw) ? raw : (raw && typeof raw === "object" && !Array.isArray(raw) ? [raw] : []);
      setStudents(list);
      setWeekMeta(data?.meta ?? null);
    } catch {
      setStudents([]);
      setWeekMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeeks = useCallback(async () => {
    setWeeksLoading(true);
    try {
      const { data } = await api.get("/api/students/leaderboard/weeks");
      setWeeks(data?.data ?? []);
    } catch {
      setWeeks([]);
    } finally {
      setWeeksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);

  useEffect(() => {
    if (selectedYear != null && selectedWeek != null) {
      fetchLeaderboardForWeek(selectedYear, selectedWeek);
    } else {
      fetchLeaderboardForWeek();
    }
  }, [selectedYear, selectedWeek, fetchLeaderboardForWeek]);

  // Open profile when navigated with state.openStudentId (e.g. from TopTenStudents "View All" → click row)
  useEffect(() => {
    const openId = location.state?.openStudentId;
    if (openId) handleViewProfile(openId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const search = useCallback(
    async (q) => {
      if (!(q && q.trim())) {
        if (selectedYear != null && selectedWeek != null) {
          fetchLeaderboardForWeek(selectedYear, selectedWeek);
        } else {
          fetchLeaderboardForWeek();
        }
        return;
      }
      setSearchLoading(true);
      try {
        const { data } = await api.get("/api/students/search", {
          params: { fullname: q.trim() },
        });
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setStudents(list.slice(0, LEADERBOARD_LIMIT));
      } catch {
        setStudents([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [selectedYear, selectedWeek, fetchLeaderboardForWeek]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = (searchInput || "").trim();
    if (!q) {
      if (selectedYear != null && selectedWeek != null) {
        fetchLeaderboardForWeek(selectedYear, selectedWeek);
      } else {
        fetchLeaderboardForWeek();
      }
      return;
    }
    debounceRef.current = setTimeout(() => search(q), 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]); // eslint-disable-line

  const handleWeekChange = (year, weekNumber) => {
    if (year == null || weekNumber == null) {
      setSelectedYear(null);
      setSelectedWeek(null);
    } else {
      setSelectedYear(year);
      setSelectedWeek(weekNumber);
    }
  };

  const sorted = [...students].sort(
    (a, b) => (b[activeCol] ?? 0) - (a[activeCol] ?? 0)
  );

  if (profileLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#374763] animate-spin" />
          <p className="text-sm text-[#5E6B7C] font-medium">Loading profile…</p>
        </div>
      </PageContainer>
    );
  }

  if (selectedProfile) {
    return (
      <ProfileView
        profile={selectedProfile}
        onBack={() => setSelectedProfile(null)}
        myStudent={currentUser}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes listItemIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lb-item {
          animation: listItemIn 0.25s ease forwards;
          opacity: 0;
        }
      `}</style>

      <PageContainer className="!gap-0 flex-1 min-h-0">
        <div className="flex flex-col flex-1 min-h-0 gap-4 w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          {/* Header: title left, search + week selector right */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2F3E5C] tracking-tight">
                Weekly Leaderboard – Top 30
              </h1>
              <p className="text-sm sm:text-base text-[#5E6B7C] mt-0.5">
                Snapshot for selected week · Select a column to sort · Click a row to view profile
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:flex-shrink-0">
              {/* Week selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#374763]" />
                <select
                  value={selectedYear != null && selectedWeek != null ? `${selectedYear}-W${selectedWeek}` : "current"}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "current") handleWeekChange(null, null);
                    else {
                      const [y, w] = v.split("-W").map(Number);
                      if (!Number.isNaN(y) && !Number.isNaN(w)) handleWeekChange(y, w);
                    }
                  }}
                  className="px-3 py-2 bg-[#E9E6E1] border border-[#D9D6D0] rounded-xl text-[#2F3E5C] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#374763]/30 min-w-[140px]"
                  disabled={weeksLoading}
                >
                  <option value="current">This week</option>
                  {weeks.map((w) => (
                    <option key={`${w.year}-${w.weekNumber}`} value={`${w.year}-W${w.weekNumber}`}>
                      {w.year} – Week {w.weekNumber}
                    </option>
                  ))}
                </select>
              </div>
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#374763]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full pl-9 pr-9 py-2.5 bg-[#E9E6E1] border border-[#D9D6D0] rounded-xl text-sm text-[#2F3E5C] placeholder:text-[#5E6B7C] focus:outline-none focus:ring-2 focus:ring-[#374763]/30"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#374763] animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Card – full width and height, inner list scrolls */}
          <section
            className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-green-200 shadow-sm flex flex-col bg-green-50"
            style={{ minHeight: "calc(100vh - 10rem)" }}
          >
            {/* Card header */}
            <div className="flex-shrink-0 px-4 sm:px-5 py-4 border-b border-green-200 bg-green-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <Trophy className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-green-50 font-bold text-base sm:text-lg tracking-tight">
                    Overall Performance
                  </h3>
                  <p className="text-green-50/80 text-xs sm:text-sm">
                    Top {LEADERBOARD_LIMIT} students
                    {weekMeta ? ` · ${weekMeta.year} Week ${weekMeta.weekNumber}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Column tabs */}
            <div className="flex-shrink-0 flex gap-2 px-4 pt-3 pb-3 overflow-x-auto no-scrollbar border-b border-green-200 bg-green-50">
              {LEADERBOARD_TABS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => setActiveCol(col.key)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCol === col.key
                      ? "bg-green-800 text-green-50 shadow-sm"
                      : "bg-green-50 text-green-800 hover:bg-green-100"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>

            {/* Column headers */}
            <div className="flex-shrink-0 grid grid-cols-[36px_44px_1fr_72px] gap-2 px-4 py-3 sm:py-3.5 bg-green-50 border-b border-green-200">
              <span className="text-sm font-semibold uppercase tracking-wider text-green-800">#</span>
              <span />
              <span className="text-sm font-semibold uppercase tracking-wider text-green-800">Student</span>
              <span className="text-sm font-semibold uppercase tracking-wider text-green-800 text-right">Score</span>
            </div>

            {/* Body */}
            {loading || searchLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 sm:w-9 sm:h-9 text-green-800 animate-spin" />
              </div>
            ) : (
              <ul className="px-3 pb-4 overflow-y-auto min-h-0 flex-1 divide-y divide-green-200">
                {sorted.slice(0, LEADERBOARD_LIMIT).map((student, idx) => {
                  const rank = idx + 1;
                  const meta = RANK_META[idx] ?? null;
                  const pts = student[activeCol] ?? 0;
                  const isMe =
                    isStudentView &&
                    (student.studentid === currentStudentId ||
                      student.studentId === currentStudentId);

                  return (
                    <li
                      key={student.studentid || idx}
                      className={`lb-item flex items-center gap-3 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl cursor-pointer transition-all hover:bg-[#EDE8E2]/50 ${
                        isMe ? "ring-1 ring-green-800/40 bg-green-50/70" : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                      onClick={() => handleViewProfile(student.studentid || student.studentId)}
                    >
                      {/* Rank badge */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 text-sm sm:text-base font-bold ${
                          meta ? meta.text : "text-black bg-green-50"
                        }`}
                        style={meta ? { background: meta.bg } : {}}
                      >
                        {meta ? meta.icon : rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                          meta ? `ring-2 ${meta.ring}` : ""
                        } ${isMe ? "ring-2 ring-green-500/50" : ""}`}
                        style={{ background: "bg-green-50" }}
                      >
                        {student.image?.url || student.profilePic ? (
                          <img
                            src={student.image?.url || student.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-black">
                            {(student.fullname || "?")[0].toUpperCase()}
                          </span>
                        )}
                        <span className="text-sm font-bold text-slate-700">
                          {(student.studentId || "?")[0].toUpperCase()}
                        </span>
                      </div>

                      {/* Name only (no score bar) */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-base sm:text-lg font-semibold truncate ${
                              isMe ? "text-black" : "text-gray-900"
                            }`}
                          >
                            {student.fullname}
                          </p>
                          {isMe && (
                            <span className="text-xs sm:text-sm font-semibold bg-green-500/20 text-green-800 px-2 py-0.5 rounded-md shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right shrink-0 min-w-[56px]">
                        <span
                          className={`text-base sm:text-lg font-bold ${
                            idx === 0 ? "text-amber-500" : idx === 1 ? "text-yellow-500" : idx === 2 ? "text-orange-500" : "text-black"
                          }`}
                        >
                          {formatScore(pts, activeCol)}
                        </span>
                        <p className="text-xs sm:text-sm text-green-800 font-medium">pts</p>
                      </div>
                    </li>
                  );
                })}

                {sorted.length === 0 && (
                  <li className="py-12 text-center">
                    <TrendingUp className="w-10 h-10 text-black mx-auto mb-2" />
                    <p className="text-base text-green-800">No data found</p>
                  </li>
                )}
              </ul>
            )}
          </section>
        </div>
      </PageContainer>
    </>
  );
};

export default LeaderboardTablePage;