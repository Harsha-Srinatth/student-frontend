import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Trophy, Crown, Medal, TrendingUp, Search, Loader2, Calendar } from "lucide-react";
import api from "../../../services/api";
import PageContainer from "../PageContainer";
import { LEADERBOARD_TABS } from "./leaderboardConstants.js";

const RANK_META = [
  { bg: "linear-gradient(135deg, #8B7355, #6B5344)", text: "text-white", ring: "ring-amber-200/50", icon: <Crown className="w-3.5 h-3.5 text-white" /> },
  { bg: "linear-gradient(135deg, #A0826D, #8B7355)", text: "text-white", ring: "ring-amber-200/40", icon: <Medal className="w-3.5 h-3.5 text-white" /> },
  { bg: "linear-gradient(135deg, #B8A090, #8B7355)", text: "text-white", ring: "ring-amber-200/40", icon: <Medal className="w-3.5 h-3.5 text-white" /> },
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
  const userRole = Cookies.get("userRole");
  const currentStudentId = useSelector(
    (state) =>
      state.studentDashboard?.student?.studentid ||
      state.studentDashboard?.student?.studentId
  );
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
  const debounceRef = useRef(null);

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
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3D3A36] tracking-tight">
                Weekly Leaderboard – Top 30
              </h1>
              <p className="text-sm sm:text-base text-[#6B6560] mt-0.5">
                Snapshot for selected week · Select a column to sort · Click a row to view profile
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:flex-shrink-0">
              {/* Week selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B7355]" />
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
                  className="px-3 py-2 bg-[#F8F6F2] border border-[#E8E4DE] rounded-xl text-[#3D3A36] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 min-w-[140px]"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8782]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full pl-9 pr-9 py-2.5 bg-[#F8F6F2] border border-[#E8E4DE] rounded-xl text-sm text-[#3D3A36] placeholder:text-[#8C8782] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355] animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Card – full width and height, inner list scrolls */}
          <section
            className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-[#E8E4DE] shadow-sm flex flex-col bg-[#FAF8F5]"
            style={{ minHeight: "calc(100vh - 10rem)" }}
          >
            {/* Card header */}
            <div className="flex-shrink-0 px-4 sm:px-5 py-4 border-b border-[#E8E4DE] bg-[#8B7355]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <Trophy className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg tracking-tight">
                    Overall Performance
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm">
                    Top {LEADERBOARD_LIMIT} students
                    {weekMeta ? ` · ${weekMeta.year} Week ${weekMeta.weekNumber}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Column tabs */}
            <div className="flex-shrink-0 flex gap-2 px-4 pt-3 pb-3 overflow-x-auto no-scrollbar border-b border-[#E8E4DE] bg-white">
              {LEADERBOARD_TABS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => setActiveCol(col.key)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCol === col.key
                      ? "bg-[#8B7355] text-white shadow-sm"
                      : "bg-[#EDE8E2] text-[#6B6560] hover:bg-[#E0DAD2]"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>

            {/* Column headers */}
            <div className="flex-shrink-0 grid grid-cols-[36px_44px_1fr_72px] gap-2 px-4 py-3 sm:py-3.5 bg-[#EDE8E2]/80 border-b border-[#E8E4DE]">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#5C564D]">#</span>
              <span />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#5C564D]">Student</span>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#5C564D] text-right">Score</span>
            </div>

            {/* Body */}
            {loading || searchLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 sm:w-9 sm:h-9 text-[#8B7355] animate-spin" />
              </div>
            ) : (
              <ul className="px-3 pb-4 overflow-y-auto min-h-0 flex-1 divide-y divide-[#E8E4DE]">
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
                        isMe ? "ring-1 ring-[#8B7355]/40 bg-[#EDE8E2]/70" : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                      onClick={() =>
                        navigate(viewAllPath, {
                          state: { openStudentId: student.studentid },
                        })
                      }
                    >
                      {/* Rank badge */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 text-sm sm:text-base font-bold ${
                          meta ? meta.text : "text-[#5C564D] bg-[#EDE8E2]"
                        }`}
                        style={meta ? { background: meta.bg } : {}}
                      >
                        {meta ? meta.icon : rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                          meta ? `ring-2 ${meta.ring}` : ""
                        } ${isMe ? "ring-2 ring-[#8B7355]/50" : ""}`}
                        style={{ background: "#EDE8E2" }}
                      >
                        {student.image?.url || student.profilePic ? (
                          <img
                            src={student.image?.url || student.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#6B6560]">
                            {(student.fullname || "?")[0].toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Name only (no score bar) */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-base sm:text-lg font-semibold truncate ${
                              isMe ? "text-[#3D3A36]" : "text-[#3D3A36]"
                            }`}
                          >
                            {student.fullname}
                          </p>
                          {isMe && (
                            <span className="text-xs sm:text-sm font-semibold bg-[#8B7355]/20 text-[#5C564D] px-2 py-0.5 rounded-md shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right shrink-0 min-w-[56px]">
                        <span
                          className={`text-base sm:text-lg font-bold ${
                            idx === 0 ? "text-[#6B5344]" : "text-[#5C564D]"
                          }`}
                        >
                          {formatScore(pts, activeCol)}
                        </span>
                        <p className="text-xs sm:text-sm text-[#8C8782] font-medium">pts</p>
                      </div>
                    </li>
                  );
                })}

                {sorted.length === 0 && (
                  <li className="py-12 text-center">
                    <TrendingUp className="w-10 h-10 text-[#C4B5A0] mx-auto mb-2" />
                    <p className="text-base text-[#6B6560]">No data found</p>
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