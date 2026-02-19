import React, { memo } from "react";
import { MessageCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";

const TAG_COLORS = {
  general: "bg-gray-100 text-gray-700",
  academics: "bg-blue-100 text-blue-700",
  placements: "bg-purple-100 text-purple-700",
  exams: "bg-red-100 text-red-700",
  events: "bg-yellow-100 text-yellow-700",
  hostel: "bg-orange-100 text-orange-700",
  library: "bg-teal-100 text-teal-700",
  sports: "bg-green-100 text-green-700",
  technical: "bg-indigo-100 text-indigo-700",
  other: "bg-slate-100 text-slate-700",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const DoubtCard = memo(({ doubt, onClick, onDelete, isMine = false }) => {
  const avatarUrl = doubt.createdByAvatar || null;
  const initials = doubt.createdByName ? doubt.createdByName.charAt(0).toUpperCase() : "?";

  return (
    <div
      onClick={() => onClick(doubt._id)}
      className="group relative bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer
                 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 active:scale-[0.99]"
    >
      {doubt.isSolved && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <CheckCircle2 size={13} /> Solved
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
              {isMine ? "You" : doubt.createdByName}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[doubt.tag] || TAG_COLORS.general}`}>
              {doubt.tag}
            </span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock size={11} /> {timeAgo(doubt.createdAt)}
            </span>
          </div>

          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-1 line-clamp-1 group-hover:text-blue-700">
            {doubt.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{doubt.description}</p>

          <div className="flex items-center gap-4 mt-2.5">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <MessageCircle size={14} />
              <span>{doubt.replyCount || 0} {doubt.replyCount === 1 ? "reply" : "replies"}</span>
            </div>
            {isMine && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(doubt._id); }}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

DoubtCard.displayName = "DoubtCard";

export default DoubtCard;
