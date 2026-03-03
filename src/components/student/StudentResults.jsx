import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurriculum } from "../../features/shared/academicsSlice";
import { fetchResults } from "../../features/shared/resultsSlice";
import { fetchSDashboardData } from "../../features/student/studentDashSlice";

import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiLock } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/* --------------------------
  Animated circular progress
---------------------------*/
function SmallCircle({ value = 0, max = 100 }) {
  const id = React.useId().replace(/:/g, "");
  const clamped = Math.max(0, Math.min(value, max));
  const pct = Math.round((clamped / max) * 100);
  const radius = 16;
  const stroke = 3;
  const c = 2 * Math.PI * radius;
  const offset = c - (pct / 100) * c;

  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#ccfbf1"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx="25"
          cy="25"
          r={radius}
          stroke={`url(#grad-${id})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="8"
          fill="#0f172a"
          fontWeight="700"
        >
          {pct}%
        </text>
      </svg>
    </div>
  );
}

/* --------------------------
  Skeleton shimmer
---------------------------*/
const Skeleton = () => (
  <div className="rounded-xl p-4 bg-white/70 backdrop-blur animate-pulse shadow border border-teal-100">
    <div className="h-4 bg-teal-100 rounded w-2/3 mb-3" />
    <div className="h-3 bg-teal-100/80 rounded w-1/2 mb-3" />
    <div className="h-6 bg-teal-100/60 rounded w-full" />
  </div>
);

/* --------------------------
  Main Component
---------------------------*/
export default function StudentResults() {
  const dispatch = useDispatch();

  const dashboardStudent = useSelector((s) => s.studentDashboard.student);
  const curriculum = useSelector((s) => s.academics.curriculum);
  const curriculumLoading = useSelector((s) => s.academics.curriculumLoading);
  const resultsBySem = useSelector((s) => s.results.bySemester);
  const resultsLoading = useSelector((s) => s.results.loading);

  const [currentSem, setCurrentSem] = useState(2);
  const [activeSem, setActiveSem] = useState(2);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dashboardStudent || !dashboardStudent.semester) {
      dispatch(fetchSDashboardData()).catch(() => {
        setError("Failed to load profile. Try refreshing.");
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const semFromProfile = Number(dashboardStudent?.semester);
    if (!Number.isNaN(semFromProfile) && semFromProfile > 0) {
      setCurrentSem(semFromProfile);
      setActiveSem(semFromProfile);
    }
  }, [dashboardStudent?.semester]);

  useEffect(() => {
    if (!activeSem) return;
    setError(null);
    try {
      dispatch(fetchCurriculum(activeSem));
      dispatch(fetchResults(activeSem));
    } catch {
      setError("Failed to fetch semester data.");
    }
  }, [dispatch, activeSem]);

  const semesters = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  const subjectsForSem = () => curriculum || [];

  const midDataMap = (midNumber) => {
    const semData = resultsBySem?.[activeSem];
    const arr = midNumber === 2 ? semData?.mid2 || [] : semData?.mid1 || [];
    return (arr || []).reduce((acc, item) => {
      if (item?.subjectCode != null) acc[item.subjectCode] = item.obtained;
      return acc;
    }, {});
  };

  const makeChartData = (mid) => {
    const midMap = midDataMap(mid);
    const subs = subjectsForSem();
    return subs.slice(0, 6).map((s) => ({
      name: s.code,
      label: s.name,
      [`Mid${mid}`]: midMap[s.code] ?? 0,
      Max: s.max ?? 50,
    }));
  };

  const chartData = useMemo(() => {
    const mid1 = makeChartData(1);
    const mid2 = makeChartData(2);
    return mid1.map((s, i) => ({
      name: s.name,
      Mid1: s.Mid1,
      Mid2: mid2[i]?.Mid2 ?? 0,
      Max: s.Max,
    }));
  }, [curriculum, resultsBySem, activeSem]);

  const isFutureSem = activeSem > currentSem;

  return (
    <div className="w-full min-h-screen flex flex-col mx-auto max-w-7xl px-4 py-6 bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100">
      <div className="flex-1 flex flex-col space-y-6">
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-teal-600 to-green-600 bg-clip-text text-transparent">
          My Results
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-700">
          Track your academic progress and achievements
        </p>
      </div>

        <div className="flex flex-wrap gap-2">
          {semesters.map((sem) => {
            const isActive = activeSem === sem;
            const isCurrent = sem === currentSem;
            return (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={sem}
                onClick={() => setActiveSem(sem)}
                className={`h-9 px-4 rounded-lg text-sm font-medium shadow-md transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-green-600 text-white"
                      : isCurrent
                      ? "border-2 border-teal-400 text-teal-700 bg-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Sem {sem}
              </motion.button>
            );
          })}
        </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 shadow-sm"
          >
            <FiAlertCircle size={18} />
            <div className="text-sm">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subjects */}
      <div className="flex-1 min-h-0">
        <h3 className="text-lg font-semibold mb-3 text-teal-800">📘 Subjects</h3>
        {curriculumLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectsForSem().slice(0, 10).map((s, idx) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/90 border border-teal-100 p-4 shadow hover:shadow-lg transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium truncate text-slate-800">{s.name}</div>
                    {isFutureSem ? (
                      <FiLock className="text-slate-400" />
                    ) : (
                      <FiCheckCircle className="text-teal-500" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{s.code}</div>
                </div>
                {isFutureSem ? (
                  <span className="text-xs rounded-full px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    <FiLock size={12} /> Locked
                  </span>
                ) : (
                  <span className="text-xs rounded-full px-2 py-1 bg-teal-50 text-teal-700 border border-teal-200">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mid Results + Graph (only if not future sem) */}
      {!isFutureSem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 min-h-[320px]">
          <MidCard
            mid={1}
            resultsLoading={resultsLoading}
            resultsBySem={resultsBySem}
            activeSem={activeSem}
            subjectsForSem={subjectsForSem}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-white/90 border border-teal-100 p-4 shadow-lg flex flex-col min-h-[280px]"
          >
            <h3 className="text-lg font-semibold mb-3 text-center text-teal-800">
              📊 Mid 1 vs Mid 2 Comparison
            </h3>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#0d9488" />
                  <YAxis stroke="#0d9488" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #ccfbf1" }} />
                  <Legend />
                  <Bar dataKey="Mid1" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Mid 1" />
                  <Bar dataKey="Mid2" fill="#059669" radius={[6, 6, 0, 0]} name="Mid 2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <MidCard
            mid={2}
            resultsLoading={resultsLoading}
            resultsBySem={resultsBySem}
            activeSem={activeSem}
            subjectsForSem={subjectsForSem}
          />
        </div>
      )}
      </div>
    </div>
  );
}

/* --------------------------
  MidCard component
---------------------------*/
function MidCard({ mid, resultsLoading, resultsBySem, activeSem, subjectsForSem }) {
  const midDataMap = (midNumber) => {
    const semData = resultsBySem?.[activeSem];
    const arr = midNumber === 2 ? semData?.mid2 || [] : semData?.mid1 || [];
    return (arr || []).reduce((acc, item) => {
      if (item?.subjectCode != null) acc[item.subjectCode] = item.obtained;
      return acc;
    }, {});
  };

  const midMap = midDataMap(mid);
  const chartData = subjectsForSem().slice(0, 6).map((s) => ({
    name: s.code,
    marks: midMap[s.code] ?? 0,
    max: s.max ?? 50,
  }));

  const noData = chartData.every((d) => d.marks === 0);
  const avgPct = Math.round(
    (chartData.reduce((a, b) => a + b.marks, 0) /
      Math.max(1, chartData.reduce((a, b) => a + b.max, 0))) *
      100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-green-50 border border-teal-100 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg sm:text-xl font-semibold text-teal-800">
          Mid {mid} Performance
        </div>
        {resultsLoading ? (
          <div className="px-3 py-1 rounded-full bg-teal-100 animate-pulse text-sm text-teal-700">
            Loading...
          </div>
        ) : noData ? (
          <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 text-sm">
            <FiAlertCircle /> No marks yet
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold text-sm border border-teal-200">
            {avgPct}% avg
          </div>
        )}
      </div>

      {/* Subject list */}
      <div className="space-y-3 flex-1">
        {resultsLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg p-3 animate-pulse bg-teal-50/80 h-12"
              />
            ))
          : chartData.map((it, idx) => (
              <motion.div
                key={it.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between rounded-lg bg-white border border-teal-50 p-3 shadow-sm hover:shadow-md hover:border-teal-200 transition"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{it.name}</span>
                  <span className="text-xs text-slate-500">
                    {it.marks}/{it.max}
                  </span>
                </div>
                <SmallCircle value={it.marks} max={it.max} />
              </motion.div>
            ))}
      </div>
    </motion.div>
  );
}
