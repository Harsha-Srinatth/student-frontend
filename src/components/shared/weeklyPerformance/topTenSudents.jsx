import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowRight, TrendingUp } from "lucide-react";
import { LEADERBOARD_TABS, MEDAL } from "./leaderboardConstants.js";

const RANK_COLORS = [
  { bar: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  { bar: "#94a3b8", glow: "rgba(148,163,184,0.2)" },
  { bar: "#cd7c3e", glow: "rgba(205,124,62,0.2)" },
];

const TopTenStudents = ({
  students: studentsProp,
  viewAllPath = "/student/students/leaderboard",
  profilePath = "/student/students/view-all",
}) => {
  const navigate = useNavigate();
  const studentDashboard = useSelector((state) => state.studentDashboard);
  const fromRedux = studentDashboard?.topTenStudents || [];
  const students = studentsProp != null ? studentsProp : fromRedux;
  const currentStudentId =
    studentDashboard?.student?.studentid || studentDashboard?.student?.studentId;
  const isStudentView = Boolean(currentStudentId);

  const [activeTab, setActiveTab] = useState("weightedPoints");

  const sorted = [...students]
    .sort((a, b) => (b[activeTab] ?? 0) - (a[activeTab] ?? 0))
    .slice(0, 10);

  const maxVal = sorted[0]?.[activeTab] ?? 1;

  return (
    <>
      <style>{`
        @keyframes rowEnter {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .lb-row {
          animation: rowEnter 0.3s ease forwards;
        }
        .tab-underline {
          position: relative;
        }
        .tab-underline::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          border-radius: 2px;
          background: #0f172a;
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }
        .tab-underline.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <section
        className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-slate-700 shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">Leaderboard</span>
              <p className="text-slate-400 text-sm sm:text-base">Top performers</p>
            </div>
          </div>
          <button
            onClick={() => navigate(viewAllPath)}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-base sm:text-lg font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors group shrink-0"
          >
            View All
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-white">
          {LEADERBOARD_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-underline flex-shrink-0 px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "active text-slate-900 bg-slate-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <div className="py-12 text-center">
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-base sm:text-lg text-slate-500">No data yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {sorted.map((student, idx) => {
              const rank = idx + 1;
              const isMe =
                isStudentView &&
                (student.studentid === currentStudentId ||
                  student.studentId === currentStudentId);
              const val = student[activeTab] ?? 0;
              const barWidth = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
              const rankStyle = RANK_COLORS[idx];

              return (
                <div
                  key={student.studentid || idx}
                  onClick={() =>
                    navigate(profilePath, {
                      state: { openStudentId: student.studentid || student.studentId },
                    })
                  }
                  className={`lb-row flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 cursor-pointer transition-all hover:bg-slate-50 group`}
                  style={{
                    animationDelay: `${idx * 0.04}s`,
                    background: isMe ? "rgba(51,65,85,0.08)" : undefined,
                  }}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center">
                    {rank <= 3 ? (
                      <span className="text-xl leading-none">{MEDAL[rank - 1]}</span>
                    ) : (
                      <span className="text-sm sm:text-base font-semibold text-slate-500">{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{
                      background:
                        rankStyle
                          ? `radial-gradient(circle, ${rankStyle.glow}, transparent)`
                          : "#f1f5f9",
                      boxShadow: rankStyle ? `0 0 12px ${rankStyle.glow}` : undefined,
                    }}
                  >
                    {student.image?.url || student.profilePic ? (
                      <img
                        src={student.image?.url || student.profilePic}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-500">
                        {(student.fullname || "?")[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-sm sm:text-base font-semibold truncate max-w-[120px] sm:max-w-[160px] ${
                          isMe ? "text-slate-700" : "text-slate-800"
                        }`}
                      >
                        {student.fullname}
                      </span>
                      {isMe && (
                        <span className="text-xs sm:text-sm font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md shrink-0">
                          you
                        </span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${barWidth}%`,
                          background: rankStyle
                            ? rankStyle.bar
                            : isMe
                            ? "#64748b"
                            : "#cbd5e1",
                        }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right min-w-[44px]">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        rank === 1
                          ? "text-amber-500"
                          : rank === 2
                          ? "text-slate-500"
                          : rank === 3
                          ? "text-orange-500"
                          : "text-slate-600"
                      }`}
                    >
                      {val.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default TopTenStudents;