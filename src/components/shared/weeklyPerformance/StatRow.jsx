import React from "react";

const StatRow = ({ label, myVal, otherVal, isCompare }) => {
  const my = Number(myVal ?? 0);
  const other = Number(otherVal ?? 0);
  const diff = my - other;
  const ahead = diff >= 0;
  const maxVal = Math.max(my, other, 1);

  return (
    <div className="group py-2.5 sm:py-3 border-b border-slate-100 last:border-none transition-colors hover:bg-slate-50/60 rounded-lg px-1 sm:px-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide">{label}</span>
        {isCompare && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
              diff === 0
                ? "bg-slate-100 text-slate-500"
                : ahead
                ? "bg-slate-200 text-slate-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {ahead && diff > 0 ? "+" : ""}
            {diff}
          </span>
        )}
      </div>
      {isCompare ? (
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-700 w-8 text-right shrink-0">{my}</span>
          <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="absolute left-0 top-0 h-full bg-slate-500 rounded-full transition-all duration-700"
              style={{ width: `${(my / maxVal) * 50}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-slate-400 rounded-full transition-all duration-700"
              style={{ width: `${(other / maxVal) * 50}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-600 w-8 shrink-0">{other}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min((my / 1000) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-700 w-8 text-right shrink-0">{my}</span>
        </div>
      )}
    </div>
  );
};

export default StatRow;