import React, { memo } from "react";
import { MessageCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { getTagClass, DOUBT_COLORS, DOUBT_ANIMATION } from "./doubtTheme";

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
      role="button"
      tabIndex={0}
      onClick={() => onClick(doubt._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(doubt._id);
        }
      }}
      className={`group relative ${DOUBT_COLORS.cardBg} border ${DOUBT_COLORS.border} rounded-2xl p-4 cursor-pointer
        hover:border-[#C4B5A0] hover:shadow-md hover:shadow-[#EDE8E2]/50 ${DOUBT_ANIMATION.cardHover} active:scale-[0.99]`}
    >
      {doubt.isSolved && (
        <div className={`absolute top-3 right-3 flex items-center gap-1 ${DOUBT_COLORS.solved} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          <CheckCircle2 size={13} /> Solved
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EDE8E2]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#8B7355] flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#EDE8E2]">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-sm font-medium ${DOUBT_COLORS.textPrimary} truncate max-w-[140px] sm:max-w-[180px]`}>
              {isMine ? "You" : doubt.createdByName}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${getTagClass(doubt.tag)}`}>
              {doubt.tag}
            </span>
            <span className={`text-[11px] ${DOUBT_COLORS.textMuted} flex items-center gap-1`}>
              <Clock size={11} /> {timeAgo(doubt.createdAt)}
            </span>
          </div>

          <h3 className={`text-[15px] font-semibold ${DOUBT_COLORS.textPrimary} leading-snug mb-1 line-clamp-1 group-hover:text-[#5C564D] transition-colors`}>
            {doubt.title}
          </h3>
          <p className={`text-sm ${DOUBT_COLORS.textSecondary} leading-relaxed line-clamp-2`}>
            {doubt.description}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2.5">
            <div className={`flex items-center gap-1.5 ${DOUBT_COLORS.textMuted} text-xs`}>
              <MessageCircle size={14} strokeWidth={1.8} />
              <span>{doubt.replyCount || 0} {doubt.replyCount === 1 ? "reply" : "replies"}</span>
            </div>
            {isMine && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doubt._id);
                }}
                className={`flex items-center gap-1 text-xs font-medium rounded-lg px-2 py-1.5 opacity-90 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${DOUBT_COLORS.delete}`}
                aria-label="Delete this doubt"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Delete</span>
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
