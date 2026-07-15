import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Trophy,
  Lightbulb,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { fetchPlacementPrediction } from "../../../features/student/studentDashSlice";

// ─── Tier config ────────────────────────────────────────────────
const TIER_CONFIG = {
  1: {
    label:        "Tier 1",
    sub:          "Top MNCs",
    ring:         "ring-2 ring-emerald-400",
    badge:        "bg-emerald-100 text-emerald-800 border border-emerald-300",
    bar:          "bg-emerald-500",
    headerFrom:   "from-emerald-600",
    headerTo:     "to-teal-500",
    glow:         "shadow-emerald-200",
    icon:         "text-emerald-600 bg-emerald-100",
    progressRing: "text-emerald-500",
  },
  2: {
    label:        "Tier 2",
    sub:          "Product Companies",
    ring:         "ring-2 ring-blue-400",
    badge:        "bg-blue-100 text-blue-800 border border-blue-300",
    bar:          "bg-blue-500",
    headerFrom:   "from-blue-600",
    headerTo:     "to-indigo-500",
    glow:         "shadow-blue-200",
    icon:         "text-blue-600 bg-blue-100",
    progressRing: "text-blue-500",
  },
  3: {
    label:        "Tier 3",
    sub:          "Startup / Service",
    ring:         "ring-2 ring-amber-400",
    badge:        "bg-amber-100 text-amber-800 border border-amber-300",
    bar:          "bg-amber-500",
    headerFrom:   "from-amber-500",
    headerTo:     "to-orange-500",
    glow:         "shadow-amber-200",
    icon:         "text-amber-600 bg-amber-100",
    progressRing: "text-amber-500",
  },
};

const TIER_BAR_COLORS = {
  "1": "bg-emerald-500",
  "2": "bg-blue-500",
  "3": "bg-amber-500",
};

// ─── Sub-components ───────────────────────────────────────────────

function ProbabilityBar({ tierNum, probability }) {
  const labels = { "1": "Tier 1", "2": "Tier 2", "3": "Tier 3" };
  const color  = TIER_BAR_COLORS[String(tierNum)] || "bg-slate-400";
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-600">{labels[String(tierNum)]}</span>
        <span className="text-xs font-bold text-slate-700">{probability.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(probability, 100)}%` }}
        />
      </div>
    </div>
  );
}


function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 animate-pulse">
      <div className="h-16 bg-slate-200" />
      <div className="p-5 space-y-4">
        <div className="h-5 w-1/3 bg-slate-100 rounded-lg" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="space-y-2">
          {[80, 40, 20].map((w, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="h-2.5 bg-slate-100 rounded-full" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
        <div className="h-12 bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
const PlacementPrediction = () => {
  const dispatch = useDispatch();
  const { placement, placementLoading, placementError } = useSelector(
    (state) => state.studentDashboard
  );

  useEffect(() => {
    dispatch(fetchPlacementPrediction());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPlacementPrediction());
  };

  if (placementLoading && !placement) return <SkeletonCard />;

  if (placementError && !placement) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3 shadow-sm">
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700 mb-1">Prediction unavailable</p>
          <p className="text-xs text-red-500">{placementError}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex-shrink-0 mt-0.5"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  if (!placement) return null;

  const cfg  = TIER_CONFIG[placement.tier] || TIER_CONFIG[3];
  const probs = placement.probabilities || {};

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden shadow-lg ${cfg.glow} bg-white border border-slate-100`}
    >
      {/* ── Gradient header ── */}
      <div className={`bg-gradient-to-r ${cfg.headerFrom} ${cfg.headerTo} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-[11px] font-semibold uppercase tracking-wider">
              AI Placement Prediction
            </p>
            <p className="text-white text-base font-bold leading-tight">
              {placement.title}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          title="Refresh prediction"
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <RefreshCw size={14} className="text-white" />
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Predicted tier badge ── */}
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${cfg.badge} flex items-center gap-1.5`}>
            <ChevronRight size={14} />
            {cfg.label} — {cfg.sub}
          </span>
        </div>

        {/* ── Summary message ── */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
          <p className="text-sm text-slate-700 leading-relaxed">{placement.message}</p>
        </div>

        {/* ── Probability bars ── */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Tier Probabilities
          </p>
          <div className="space-y-2.5">
            {["1", "2", "3"].map((t) => (
              <ProbabilityBar
                key={t}
                tierNum={t}
                probability={probs[t] ?? 0}
              />
            ))}
          </div>
        </div>

        {/* ── Improvement tip ── */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-700 mb-0.5">Tip to improve</p>
            <p className="text-xs text-amber-800 leading-relaxed">{placement.improve}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementPrediction;
