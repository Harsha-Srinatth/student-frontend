import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Clock,
  MessageCircle,
  Loader2,
  Trash2,
  Tag,
  MoreVertical,
} from "lucide-react";
import {
  fetchDoubtDetail,
  createReply,
  clearSelectedDoubt,
  deleteDoubt,
  deleteReply,
  toggleSolved,
} from "../../../features/student/doubtsSlice";
import socketService from "../../../services/socketService";
import { getTagClass, DOUBT_COLORS, DOUBT_ANIMATION } from "../../../components/student/doubts/doubtTheme";

const REPLY_MAX = 2000;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/** Format time so each message shows a distinct time (WhatsApp-style) */
function formatMessageTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday = (() => {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
  })();
  const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  if (isToday) return timeStr; // e.g. "2:30 PM"
  if (isYesterday) return `Yesterday, ${timeStr}`;
  if (now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return `${d.toLocaleDateString([], { weekday: "short" })}, ${timeStr}`; // e.g. "Mon, 2:30 PM"
  }
  return d.toLocaleDateString([], { day: "numeric", month: "short" }) + ", " + timeStr; // e.g. "2 Mar, 2:30 PM"
}

const DoubtDetail = () => {
  const { doubtId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedDoubt,
    repliesByDoubt,
    detailLoading,
    detailError,
    replyLoading,
    hasMoreReplies,
    repliesPage,
    viewerStudentId,
  } = useSelector((state) => state.doubts);

  const student = useSelector((state) => state.studentDashboard.student);
  const dashboardStudentId = student?.studentid || student?.studentId;
  const currentStudentId = viewerStudentId ?? dashboardStudentId;

  const [replyContent, setReplyContent] = useState("");
  const [replyMenuOpen, setReplyMenuOpen] = useState(null);
  const repliesEndRef = useRef(null);
  const hadDoubt = useRef(false);

  const replies = repliesByDoubt[doubtId] || [];
  const isMine = selectedDoubt?.createdBy === currentStudentId;

  useEffect(() => {
    if (doubtId) {
      dispatch(fetchDoubtDetail({ doubtId, page: 1, limit: 30 }));
    }
    return () => {
      dispatch(clearSelectedDoubt());
    };
  }, [dispatch, doubtId]);

  useEffect(() => {
    if (!doubtId) return;
    socketService.emitWhenReady("doubt:joinDoubt", doubtId);
    return () => socketService.emit("doubt:leaveDoubt", doubtId);
  }, [doubtId]);

  useEffect(() => {
    if (selectedDoubt) hadDoubt.current = true;
    if (hadDoubt.current && !selectedDoubt && !detailLoading) {
      navigate("/student/ask/doubt", { replace: true });
    }
  }, [selectedDoubt, detailLoading, navigate]);

  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length]);

  const handleLoadMore = useCallback(() => {
    const currentPage = repliesPage[doubtId] || 1;
    dispatch(fetchDoubtDetail({ doubtId, page: currentPage + 1, limit: 30 }));
  }, [dispatch, doubtId, repliesPage]);

  const handleSendReply = useCallback(
    async (e) => {
      e.preventDefault();
      if (!replyContent.trim() || replyLoading) return;
      const result = await dispatch(createReply({ doubtId, content: replyContent.trim() }));
      if (!result.error) setReplyContent("");
    },
    [dispatch, doubtId, replyContent, replyLoading]
  );

  const handleDeleteReply = useCallback(
    (replyId) => {
      setReplyMenuOpen(null);
      if (window.confirm("Delete this reply? This cannot be undone.")) {
        dispatch(deleteReply({ doubtId, replyId }));
      }
    },
    [dispatch, doubtId]
  );

  const handleDelete = useCallback(async () => {
    if (window.confirm("Delete this doubt and all its replies? This cannot be undone.")) {
      await dispatch(deleteDoubt({ doubtId }));
      navigate("/student/ask/doubt", { replace: true });
    }
  }, [dispatch, doubtId, navigate]);

  const handleToggleSolved = useCallback(() => {
    dispatch(toggleSolved({ doubtId }));
  }, [dispatch, doubtId]);

  const goBack = useCallback(() => navigate("/student/ask/doubt"), [navigate]);

  if (detailLoading && !selectedDoubt) {
    return (
      <div className={`w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-screen ${DOUBT_COLORS.pageBg} px-3 sm:px-4 py-4`}>
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 mb-4 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-3/4 bg-teal-100 rounded" />
          <div className="h-4 w-1/4 bg-teal-100 rounded-full" />
          <div className="h-20 bg-teal-50 rounded-xl" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100" />
                <div className="flex-1 h-16 bg-teal-50 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className={`w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-screen ${DOUBT_COLORS.pageBg} px-3 sm:px-4 py-4`}>
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 mb-4 text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center py-16 rounded-2xl bg-white border border-teal-200">
          <p className={`${DOUBT_COLORS.error} mb-2`}>{detailError}</p>
          <button
            onClick={() => dispatch(fetchDoubtDetail({ doubtId, page: 1, limit: 30 }))}
            className="text-teal-600 font-medium text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedDoubt) return null;

  return (
    <div className={`w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto flex flex-col min-h-screen ${DOUBT_COLORS.pageBg}`}>
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-3 sm:px-5 py-3 border-b ${DOUBT_COLORS.border} ${DOUBT_COLORS.cardBg} sticky top-0 z-20 shadow-sm`}
      >
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        {isMine && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSolved}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                selectedDoubt.isSolved ? DOUBT_COLORS.solved + " border-emerald-300" : "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200"
              }`}
            >
              <CheckCircle2 size={14} />
              {selectedDoubt.isSolved ? "Solved" : "Mark Solved"}
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border ${DOUBT_COLORS.delete} border-red-200`}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Doubt content */}
      <div className={`px-3 sm:px-5 py-4 border-b ${DOUBT_COLORS.border} ${DOUBT_COLORS.cardBg}`}>
        <div className="flex items-start gap-3 mb-3">
          {selectedDoubt.createdByAvatar ? (
            <img
              src={selectedDoubt.createdByAvatar}
              alt=""
              className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-200"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-teal-200">
              {selectedDoubt.createdByName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${DOUBT_COLORS.textPrimary}`}>
                {isMine ? "You" : selectedDoubt.createdByName}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${getTagClass(selectedDoubt.tag)}`}>
                <Tag size={10} /> {selectedDoubt.tag}
              </span>
              {selectedDoubt.isSolved && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${DOUBT_COLORS.solved}`}>
                  <CheckCircle2 size={10} /> Solved
                </span>
              )}
            </div>
            <span className={`text-[11px] ${DOUBT_COLORS.textMuted} flex items-center gap-1 mt-0.5`}>
              <Clock size={11} /> {timeAgo(selectedDoubt.createdAt)}
            </span>
          </div>
        </div>
        <h1 className={`text-xl font-bold ${DOUBT_COLORS.textPrimary} mb-2`}>{selectedDoubt.title}</h1>
        <p className={`text-sm ${DOUBT_COLORS.textSecondary} leading-relaxed whitespace-pre-wrap`}>
          {selectedDoubt.description}
        </p>
        <div className={`flex items-center gap-1.5 ${DOUBT_COLORS.textMuted} text-xs mt-3`}>
          <MessageCircle size={14} strokeWidth={1.8} />
          <span>{selectedDoubt.replyCount || 0} {selectedDoubt.replyCount === 1 ? "reply" : "replies"}</span>
        </div>
      </div>

      {/* Replies — chat style: others left, mine right */}
      <div className={`flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-2 ${DOUBT_COLORS.inputBg}`}>
        {hasMoreReplies[doubtId] && (
          <div className="text-center mb-3">
            <button
              onClick={handleLoadMore}
              className="text-teal-600 text-xs font-semibold hover:underline"
            >
              Load earlier replies
            </button>
          </div>
        )}

        {replies.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={40} className="mx-auto text-teal-300 mb-3" />
            <p className={`text-sm ${DOUBT_COLORS.textMuted}`}>No replies yet. Be the first to respond!</p>
          </div>
        )}

        {replies.map((reply, index) => {
          const isMyReply = Boolean(currentStudentId && String(reply.createdBy) === String(currentStudentId));
          const showMenu = replyMenuOpen === reply._id;
          const prevReply = index > 0 ? replies[index - 1] : null;
          const isNewSender = !prevReply || String(prevReply.createdBy) !== String(reply.createdBy);
          return (
            /* WhatsApp-style: others left, my messages right — inner wrapper + ml-auto for right alignment */
            <div
              key={reply._id}
              className={`w-full flex ${isNewSender ? "mt-4" : "mt-1"} mb-3 transition-opacity duration-200`}
            >
              <div className={`flex flex-row gap-2.5 max-w-[85%] sm:max-w-[75%] ${isMyReply ? "ml-auto mr-0" : "mr-auto ml-0"}`}>
                <div className="flex-shrink-0 mt-1">
                  {reply.createdByAvatar ? (
                    <img
                      src={reply.createdByAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-200"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-teal-200 ${
                        isMyReply ? "bg-teal-600" : "bg-slate-500"
                      }`}
                    >
                      {reply.createdByName?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 relative">
                <div
                  className={
                    isMyReply
                      ? `${DOUBT_COLORS.messageMine} text-white rounded-2xl rounded-tr-md px-4 py-2.5 shadow-sm`
                      : `bg-white border ${DOUBT_COLORS.border} ${DOUBT_COLORS.textPrimary} rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm`
                  }
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs font-semibold ${isMyReply ? "text-white/95" : DOUBT_COLORS.textSecondary}`}>
                      {isMyReply ? "You" : reply.createdByName}
                    </span>
                    {reply.createdByRole === "faculty" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Faculty
                      </span>
                    )}
                    {isMyReply && (
                      <div className="relative ml-1">
                        <button
                          type="button"
                          onClick={() => setReplyMenuOpen(showMenu ? null : reply._id)}
                          className={`p-0.5 rounded-lg opacity-70 hover:opacity-100 ${isMyReply ? "text-white/90 hover:bg-white/20" : "text-slate-600 hover:bg-slate-100"}`}
                          aria-label="Message options"
                        >
                          <MoreVertical size={14} />
                        </button>
                        {showMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setReplyMenuOpen(null)}
                              aria-hidden="true"
                            />
                            <div className={`absolute right-0 top-6 z-20 bg-white border ${DOUBT_COLORS.border} rounded-lg shadow-lg py-1 min-w-[120px]`}>
                              <button
                                type="button"
                                onClick={() => handleDeleteReply(reply._id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm ${DOUBT_COLORS.delete}`}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-6">{reply.content}</p>
                  <p className={`text-[10px] mt-1.5 ${isMyReply ? "text-white/80" : DOUBT_COLORS.textMuted}`} title={timeAgo(reply.createdAt)}>
                    {formatMessageTime(reply.createdAt)}
                  </p>
                </div>
              </div>
              </div>
            </div>
          );
        })}
        <div ref={repliesEndRef} />
      </div>

      {/* Reply input */}
      <div className={`sticky bottom-0 ${DOUBT_COLORS.cardBg} border-t ${DOUBT_COLORS.border} px-3 sm:px-5 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]`}>
        <form onSubmit={handleSendReply} className="flex items-end gap-2">
          <div className="flex-1 flex flex-col">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value.slice(0, REPLY_MAX))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply(e);
                }
              }}
              placeholder="Type your reply..."
              rows={1}
              maxLength={REPLY_MAX}
              className={`w-full px-4 py-2.5 border ${DOUBT_COLORS.border} rounded-xl text-sm resize-none ${DOUBT_COLORS.inputBg} placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 max-h-32 overflow-y-auto`}
              style={{ minHeight: "44px" }}
            />
            <p className={`text-[10px] ${DOUBT_COLORS.textMuted} text-right mt-0.5`}>
              {replyContent.length}/{REPLY_MAX}
            </p>
          </div>
          <button
            type="submit"
            disabled={!replyContent.trim() || replyLoading}
            className={`flex-shrink-0 p-2.5 rounded-xl ${DOUBT_COLORS.primary} text-white disabled:opacity-40 disabled:cursor-not-allowed ${DOUBT_COLORS.primaryHover} ${DOUBT_ANIMATION.buttonPress}`}
          >
            {replyLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} strokeWidth={2.2} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoubtDetail;
