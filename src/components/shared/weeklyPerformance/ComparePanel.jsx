import React, { useState, useCallback, useEffect } from "react";
import {
  Sparkles, X, Loader2, CheckCircle, AlertCircle, BarChart3,
  TrendingUp, Target, BookOpen, Zap, Award,
} from "lucide-react";
import api from "../../../services/api";
import StatRow from "./StatRow.jsx";
import StudentCard from "./StudentCard.jsx";

const POINTS_KEYS = [
  { label: "Weighted Points", key: "weightedPoints" },
  { label: "Teaching Points", key: "teachingPoints" },
  { label: "Projects Points", key: "projectsPoints" },
  { label: "Extra Curricular", key: "extraCurricularPoints" },
  { label: "Co-Curricular", key: "coCurricularPoints" },
  { label: "Problem Solving", key: "problemSolvingRank" },
];

/* ── Flowing pipeline SVG between the two cards ── */
const PipelineConnector = ({ active }) => (
  <div className="hidden sm:flex flex-col items-center justify-center relative select-none" style={{ minHeight: 220 }}>
    <svg
      width="90"
      height="220"
      viewBox="0 0 90 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute"
      style={{ overflow: "visible" }}
    >
      {/* Background pipe */}
      <path
        d="M45 0 C45 60, 10 80, 10 110 C10 140, 45 160, 45 220"
        stroke="#e2e8f0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M45 0 C45 60, 80 80, 80 110 C80 140, 45 160, 45 220"
        stroke="#e2e8f0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Animated flow — left pipe */}
      <path
        d="M45 0 C45 60, 10 80, 10 110 C10 140, 45 160, 45 220"
        stroke="url(#flowGradLeft)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="40 160"
        className={active ? "animate-pipe-flow-left" : ""}
        style={{
          strokeDashoffset: active ? undefined : 0,
          animation: active ? "pipeFlowLeft 2s linear infinite" : "none",
        }}
      />
      {/* Animated flow — right pipe */}
      <path
        d="M45 0 C45 60, 80 80, 80 110 C80 140, 45 160, 45 220"
        stroke="url(#flowGradRight)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="40 160"
        style={{
          animation: active ? "pipeFlowRight 2s linear infinite 0.6s" : "none",
        }}
      />

      {/* Center junction circle */}
      <circle cx="45" cy="110" r="18" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="45" cy="110" r="10" fill={active ? "url(#centerGrad)" : "#f1f5f9"} />

      {/* Particle dots on left pipe */}
      {active && (
        <>
          <circle r="4" fill="#38bdf8" opacity="0.9">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
              <mpath href="#leftPipePath" />
            </animateMotion>
          </circle>
          <circle r="4" fill="#e879f9" opacity="0.9">
            <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
              <mpath href="#leftPipePath" />
            </animateMotion>
          </circle>
          <circle r="4" fill="#38bdf8" opacity="0.7">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
              <mpath href="#rightPipePath" />
            </animateMotion>
          </circle>
          <circle r="4" fill="#e879f9" opacity="0.7">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s">
              <mpath href="#rightPipePath" />
            </animateMotion>
          </circle>
        </>
      )}

      {/* Hidden paths for animateMotion */}
      <defs>
        <path id="leftPipePath" d="M45 0 C45 60, 10 80, 10 110 C10 140, 45 160, 45 220" />
        <path id="rightPipePath" d="M45 0 C45 60, 80 80, 80 110 C80 140, 45 160, 45 220" />
        <linearGradient id="flowGradLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id="flowGradRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#e879f9" />
        </radialGradient>
      </defs>
    </svg>

    {/* Center button / status */}
    <div className="relative z-10 flex flex-col items-center gap-2 mt-0">
      {/* spacer to align with SVG center */}
    </div>
  </div>
);

/* Mobile connector (horizontal) */
const MobilePipelineConnector = ({ active }) => (
  <div className="sm:hidden flex items-center justify-center py-3">
    <div className="flex items-center gap-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-1.5 rounded-full mx-0.5 transition-all duration-300"
          style={{
            background: active ? `hsl(${190 + i * 10}, 80%, 55%)` : "#e2e8f0",
            animationDelay: `${i * 0.12}s`,
            animation: active ? `pulseDot 1.2s ease-in-out infinite ${i * 0.12}s` : "none",
          }}
        />
      ))}
    </div>
  </div>
);

const SUGGESTION_THEMES = [
  { icon: TrendingUp, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-200/80" },
  { icon: Target, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-200/80" },
  { icon: BookOpen, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-200/80" },
  { icon: Zap, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-200/80" },
  { icon: Award, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-200/80" },
];

const ComparePanel = ({ myStudent, otherStudent, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const { data } = await api.post("/api/students/compare", {
        studentId: myStudent?.studentid || myStudent?.studentId,
        targetStudentId: otherStudent?.studentid || otherStudent?.studentId,
      });
      setSuggestions(data?.data ?? data);
    } catch {
      setError("Could not load comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [myStudent, otherStudent]);

  const pipelineActive = loading || !!suggestions;

  return (
    <>
      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes pipeFlowLeft {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pipeFlowRight {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 200; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .suggestion-card {
          animation: fadeSlideUp 0.4s ease forwards;
        }
      `}</style>

      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 transition-all duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(2, 6, 23, 0.75)", backdropFilter: "blur(8px)" }}
      >
        <div
          className={`bg-white w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            visible ? "translate-y-0 sm:scale-100" : "translate-y-8 sm:scale-95"
          }`}
          style={{ maxHeight: "92vh", overflowY: "auto" }}
        >
          {/* Header — professional slate */}
          <div className="sticky top-0 z-20 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-slate-700 shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-200" />
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-bold text-base sm:text-lg tracking-tight">Profile Comparison</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Compare scores and get improvement tips</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-all shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-7">
            {/* Two cards + pipeline connector */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px_1fr] gap-0 items-center mb-8">
              <StudentCard student={myStudent} label="You" color="indigo" />

              {/* Pipeline connector */}
              <div className="relative">
                <PipelineConnector active={pipelineActive} />
                <MobilePipelineConnector active={pipelineActive} />

                {/* Center action overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto flex flex-col items-center gap-2">
                    {!suggestions && !loading && (
                      <button
                        onClick={handleAnalyze}
                        className="flex flex-col items-center gap-2 px-4 py-3.5 rounded-xl text-white bg-slate-700 hover:bg-slate-600 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 min-w-[72px] sm:min-w-[80px]"
                      >
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                          Analyze
                        </span>
                      </button>
                    )}
                    {loading && (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Analyzing</span>
                      </div>
                    )}
                    {suggestions && !loading && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <CheckCircle className="w-5 h-5 text-slate-600" />
                        </div>
                        <button
                          onClick={handleAnalyze}
                          className="text-xs text-slate-500 hover:text-slate-700 underline mt-0.5 transition-colors"
                        >
                          Re-run
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <StudentCard student={otherStudent} label="Peer" color="violet" />
            </div>

            {/* Score comparison table */}
            <div className="rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden mb-5 sm:mb-6 bg-slate-50">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Score Comparison</h3>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span className="text-slate-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                    You
                  </span>
                  <span>Diff</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    Peer
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                  </span>
                </div>
              </div>
              <div className="px-4 sm:px-5 py-2 sm:py-3">
                {POINTS_KEYS.map(({ label, key }) => (
                  <StatRow
                    key={key}
                    label={label}
                    myVal={myStudent?.[key]}
                    otherVal={otherStudent?.[key]}
                    isCompare={true}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100 mb-5">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            )}

            {/* Suggestions */}
            {suggestions && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Improvement Insights</h3>
                </div>

                {suggestions.summary && (
                  <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 bg-slate-100 text-slate-700 text-sm sm:text-base leading-relaxed">
                    {suggestions.summary}
                  </div>
                )}

                {Array.isArray(suggestions.suggestions) && suggestions.suggestions.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.suggestions.map((s, i) => {
                      const theme = SUGGESTION_THEMES[i % SUGGESTION_THEMES.length];
                      const Icon = theme.icon;
                      return (
                        <div
                          key={i}
                          className={`suggestion-card rounded-xl sm:rounded-2xl p-4 border ${theme.border} ${theme.bg}`}
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-lg ${theme.iconBg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.text}`} />
                            </div>
                            <div className="min-w-0">
                              {s.area && (
                                <p className={`text-sm font-bold ${theme.text} mb-1 tracking-wide`}>{s.area}</p>
                              )}
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {s.suggestion || s.text || String(s)}
                              </p>
                              {s.targetDelta != null && (
                                <span className="mt-2 inline-block text-xs font-semibold bg-slate-200/80 px-2.5 py-1 rounded-full text-slate-600">
                                  Gap: {s.targetDelta > 0 ? "+" : ""}{s.targetDelta} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Empty CTA */}
            {!suggestions && !loading && (
              <div className="text-center py-6 sm:py-8 rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto mb-3 flex items-center justify-center bg-slate-200">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-slate-500" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-600">Ready to analyze</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Click the Analyze button to get suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparePanel;