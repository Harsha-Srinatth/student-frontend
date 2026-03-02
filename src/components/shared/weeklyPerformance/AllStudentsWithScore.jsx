import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Search, Loader2, Trophy } from "lucide-react";
import api from "../../../services/api";
import PageContainer from "../PageContainer";
import ProfileView from "./ProfileView.jsx";
import { LEADERBOARD_TABS, MEDAL } from "./leaderboardConstants.js";

const AllStudentsWithScore = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.studentDashboard?.student);
  const currentStudentId = currentUser?.studentid || currentUser?.studentId;
  const isStudentView = Boolean(currentStudentId);

  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("weightedPoints");
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchTop30 = async () => {
      setInitialLoading(true);
      try {
        const { data } = await api.get("/api/students/top-ten", { params: { limit: 30 } });
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setAllStudents(list);
        setStudents(list);
      } catch {
        setAllStudents([]);
        setStudents([]);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTop30();
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      const q = (query ?? searchInput).trim();
      if (!q) {
        setStudents(allStudents);
        return;
      }
      setSearchLoading(true);
      try {
        const { data } = await api.get("/api/students/search", { params: { fullname: q } });
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setStudents(list);
      } catch {
        setStudents([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [searchInput, allStudents]
  );

  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = searchInput.trim();
    if (!q) {
      setStudents(allStudents);
      return;
    }
    debounceRef.current = setTimeout(() => handleSearch(q), 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]); // eslint-disable-line

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

  useEffect(() => {
    const openId = location.state?.openStudentId;
    if (openId) handleViewProfile(openId);
  }, []); // eslint-disable-line

  const sorted = [...students].sort(
    (a, b) => (b[activeTab] ?? 0) - (a[activeTab] ?? 0)
  );

  if (profileLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 sm:py-24 gap-3">
          <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 animate-spin" />
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Loading profile…</p>
        </div>
      </PageContainer>
    );
  }

  if (selectedProfile !== null) {
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
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .student-row {
          animation: rowIn 0.28s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <PageContainer>
        {/* Title – responsive */}
        <div className="mb-3 sm:mb-4 md:mb-5">
          <div className="flex items-center gap-2 sm:gap-2.5 mb-0.5 sm:mb-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md transition-transform duration-200 hover:scale-105">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              Students Leaderboard
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 ml-0 sm:ml-1">
            Top 30 students · click a row to view full profile
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3 sm:mb-4">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or student ID…"
            className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 md:py-3.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm text-xs sm:text-sm md:text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 transition-all duration-200"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
          )}
        </div>

        {/* Table card – responsive card with transitions */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md overflow-hidden bg-gradient-to-b from-white to-slate-50/40 transition-all duration-300 hover:shadow-lg">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-white">
            {LEADERBOARD_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {initialLoading ? (
            <div className="flex justify-center py-12 sm:py-16">
              <Loader2 className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-500 animate-spin" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center py-12 sm:py-14 gap-2">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />
              <p className="text-xs sm:text-sm md:text-base text-slate-500">No students found</p>
            </div>
          ) : (
            <table className="w-full text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="pl-3 sm:pl-4 pr-2 py-2 sm:py-2.5 md:py-3 w-8 text-left text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    #
                  </th>
                  <th className="pr-2 py-2 w-9 sm:w-10" />
                  <th className="py-2 sm:py-2.5 md:py-3 pr-3 sm:pr-4 text-left text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 sm:py-2.5 md:py-3 pr-3 sm:pr-4 text-right text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {LEADERBOARD_TABS.find((t) => t.key === activeTab)?.label}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 30).map((student, idx) => {
                  const rank = idx + 1;
                  const isMe =
                    isStudentView &&
                    (student.studentid === currentStudentId ||
                      student.studentId === currentStudentId);
                  const val = student[activeTab] ?? 0;

                  return (
                    <tr
                      key={student.studentid || idx}
                      onClick={() => handleViewProfile(student.studentid)}
                      className={`student-row cursor-pointer border-b border-slate-50 last:border-none transition-all duration-200 hover:bg-indigo-50/40 active:bg-indigo-50/60 ${
                        isMe ? "bg-indigo-50/30" : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="pl-3 sm:pl-4 pr-2 py-2.5 sm:py-3 md:py-3.5 w-8 text-center">
                        {rank <= 3 ? (
                          <span className="text-sm sm:text-base leading-none">{MEDAL[rank - 1]}</span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">{rank}</span>
                        )}
                      </td>
                      <td className="pr-2 py-2 sm:py-2.5 w-9 sm:w-10">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 transition-transform duration-200">
                          {student.image?.url || student.profilePic ? (
                            <img
                              src={student.image?.url || student.profilePic}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              {(student.fullname || "?")[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-2.5 md:py-3 pr-3 sm:pr-4">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span
                            className={`text-[11px] sm:text-xs md:text-sm font-semibold truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px] ${
                              isMe ? "text-slate-700" : "text-slate-800"
                            }`}
                          >
                            {student.fullname}
                          </span>
                          {isMe && (
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold bg-indigo-200/80 text-indigo-800 px-1.5 py-0.5 rounded-md shrink-0">
                              you
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{student.studentid}</p>
                      </td>
                      <td className="pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-right">
                        <span
                          className={`text-[11px] sm:text-xs md:text-sm font-bold ${
                            rank === 1
                              ? "text-amber-600"
                              : "text-slate-600"
                          }`}
                        >
                          {val.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default AllStudentsWithScore;