import React from "react";
import { Star, Zap } from "lucide-react";
import StatRow from "./StatRow.jsx";

const themes = {
  indigo: {
    outer: "border-slate-200",
    headerBg: "bg-slate-800",
    badgeBg: "bg-slate-600/80 text-slate-100 border border-slate-500/50",
    ringColor: "ring-slate-400",
    avatarBg: "bg-slate-700",
    avatarText: "text-slate-200",
    namePill: "bg-slate-600",
    accent: "#475569",
    glowColor: "shadow-slate-200",
    dotColor: "bg-slate-400",
    statAccent: "text-slate-600",
  },
  violet: {
    outer: "border-slate-200",
    headerBg: "bg-slate-700",
    badgeBg: "bg-slate-600/80 text-slate-100 border border-slate-500/50",
    ringColor: "ring-slate-400",
    avatarBg: "bg-slate-600",
    avatarText: "text-slate-200",
    namePill: "bg-slate-500",
    accent: "#64748b",
    glowColor: "shadow-slate-200",
    dotColor: "bg-slate-400",
    statAccent: "text-slate-600",
  },
};

const StudentCard = ({ student, label, color }) => {
  const t = themes[color] || themes.indigo;
  const stars = student?.stars ?? 0;

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${t.outer} shadow-lg ${t.glowColor} transition-transform duration-300 hover:scale-[1.02] bg-white`}
      style={{ boxShadow: `0 4px 32px 0 ${t.accent}22` }}
    >
      {/* Header */}
      <div className={`relative ${t.headerBg} px-5 pt-5 pb-12 overflow-hidden`}>
        {/* Geometric background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${t.accent} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${t.accent} 0%, transparent 40%)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08))",
          }}
        />

        {/* Label badge */}
        <span className={`relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg ${t.badgeBg} mb-3`}>
          <span className={`w-1.5 h-1.5 rounded-full ${t.dotColor} animate-pulse`} />
          {label}
        </span>

        {/* Avatar */}
        <div className="relative z-10 flex flex-col items-start gap-2">
          <div className={`w-16 h-16 rounded-2xl ${t.avatarBg} overflow-hidden ring-2 ${t.ringColor} ring-offset-1 shadow-xl flex items-center justify-center`}>
            {student?.profilePic || student?.image?.url ? (
              <img
                src={student.profilePic || student.image?.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`text-2xl font-black ${t.avatarText}`}>
                {(student?.fullname || "?")[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Name section — overlapping */}
      <div className="relative -mt-6 mx-4 bg-white rounded-xl shadow-md px-4 py-3 border border-slate-100 z-10">
        <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">{student?.fullname || "—"}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{student?.studentid || student?.studentId}</p>
        {student?.programName && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{student.programName}</p>
        )}
        {typeof stars === "number" && (
          <div className="flex items-center gap-0.5 mt-2">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 transition-colors ${
                  i < Math.round(stars)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
            <span className="text-xs font-semibold text-slate-500 ml-1">
              {Number(stars).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className={`w-3.5 h-3.5 ${t.statAccent}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Performance</span>
        </div>
        <div className="space-y-0">
          <StatRow label="Weighted Points" myVal={student?.weightedPoints} isCompare={false} />
          <StatRow label="Teaching" myVal={student?.teachingPoints} isCompare={false} />
          <StatRow label="Projects" myVal={student?.projectsPoints} isCompare={false} />
          <StatRow label="Extra Curricular" myVal={student?.extraCurricularPoints} isCompare={false} />
          <StatRow label="Co-Curricular" myVal={student?.coCurricularPoints} isCompare={false} />
          <StatRow label="Problem Solving" myVal={student?.problemSolvingRank} isCompare={false} />
        </div>
      </div>
    </div>
  );
};

export default StudentCard;