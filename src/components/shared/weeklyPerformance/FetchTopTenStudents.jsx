import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import TopTenStudents from "./topTenSudents.jsx";

/**
 * Fetches top 10 students from GET /api/students/top-ten and renders TopTenStudents.
 * Use on Faculty and HOD dashboards where Redux studentDashboard is not populated.
 */
const FetchTopTenStudents = ({ leaderboardPath, profilePath }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const { data } = await api.get("/api/students/top-ten");
        if (!cancelled) setStudents(data?.data ?? []);
      } catch {
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section
        className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
        style={{ background: "linear-gradient(180deg, #ffffff, #f8fafc)" }}
      >
        <div
          className="px-5 py-4 border-b border-slate-700"
          style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
        >
          <h3 className="text-white font-black text-base tracking-tight">Leaderboard</h3>
          <p className="text-slate-400 text-xs">Top performers</p>
        </div>
        <div className="p-8 flex justify-center items-center gap-3">
          <div className="w-7 h-7 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Loading…</span>
        </div>
      </section>
    );
  }

  return (
    <TopTenStudents
      students={students}
      viewAllPath={leaderboardPath}
      profilePath={profilePath}
    />
  );
};

export default FetchTopTenStudents;