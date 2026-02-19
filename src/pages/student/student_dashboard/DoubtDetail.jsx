import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Send, CheckCircle2, Clock,
  MessageCircle, Loader2, Trash2, Tag,
} from "lucide-react";
import {
  fetchDoubtDetail, createReply, clearSelectedDoubt,
  deleteDoubt, toggleSolved,
} from "../../../features/student/doubtsSlice";
import socketService from "../../../services/socketService";

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

const DoubtDetail = () => {
  const { doubtId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedDoubt, repliesByDoubt, detailLoading,
    detailError, replyLoading, hasMoreReplies, repliesPage,
  } = useSelector((state) => state.doubts);

  const currentStudentId = useSelector((state) => state.studentDashboard.student?.studentid);

  const [replyContent, setReplyContent] = useState("");
  const repliesEndRef = useRef(null);
  const hadDoubt = useRef(false);

  const replies = repliesByDoubt[doubtId] || [];
  const isMine = selectedDoubt?.createdBy === currentStudentId;

  // Fetch detail once
  useEffect(() => {
    if (doubtId) {
      dispatch(fetchDoubtDetail({ doubtId, page: 1, limit: 30 }));
    }
    return () => { dispatch(clearSelectedDoubt()); };
  }, [dispatch, doubtId]);

  // Join/leave doubt socket room (for real-time replies)
  // Uses emitWhenReady so the join is queued if socket hasn't connected yet
  useEffect(() => {
    if (!doubtId) return;
    socketService.emitWhenReady("doubt:joinDoubt", doubtId);
    return () => { socketService.emit("doubt:leaveDoubt", doubtId); };
  }, [doubtId]);

  // Navigate back if doubt was deleted via socket (middleware sets selectedDoubt to null)
  useEffect(() => {
    if (selectedDoubt) { hadDoubt.current = true; }
    if (hadDoubt.current && !selectedDoubt && !detailLoading) {
      navigate("/student/ask/doubt", { replace: true });
    }
  }, [selectedDoubt, detailLoading, navigate]);

  // Auto-scroll to latest reply
  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length]);

  // Load more replies
  const handleLoadMore = useCallback(() => {
    const currentPage = repliesPage[doubtId] || 1;
    dispatch(fetchDoubtDetail({ doubtId, page: currentPage + 1, limit: 30 }));
  }, [dispatch, doubtId, repliesPage]);

  // Send reply
  const handleSendReply = useCallback(async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || replyLoading) return;
    const result = await dispatch(createReply({ doubtId, content: replyContent }));
    if (!result.error) setReplyContent("");
  }, [dispatch, doubtId, replyContent, replyLoading]);

  // Delete doubt
  const handleDelete = useCallback(async () => {
    if (window.confirm("Delete this doubt and all its replies?")) {
      await dispatch(deleteDoubt({ doubtId }));
      navigate("/student/ask/doubt", { replace: true });
    }
  }, [dispatch, doubtId, navigate]);

  // Toggle solved
  const handleToggleSolved = useCallback(() => {
    dispatch(toggleSolved({ doubtId }));
  }, [dispatch, doubtId]);

  const goBack = useCallback(() => navigate("/student/ask/doubt"), [navigate]);

  // Loading skeleton
  if (detailLoading && !selectedDoubt) {
    return (
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4">
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-4 text-sm font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded-full" />
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1 h-16 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (detailError) {
    return (
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4">
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-4 text-sm font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">{detailError}</p>
          <button onClick={() => dispatch(fetchDoubtDetail({ doubtId, page: 1, limit: 30 }))} className="text-blue-600 font-medium text-sm hover:underline">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedDoubt) return null;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        {isMine && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSolved}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border
                ${selectedDoubt.isSolved
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
            >
              <CheckCircle2 size={14} />
              {selectedDoubt.isSolved ? "Solved" : "Mark Solved"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Doubt content */}
      <div className="px-3 sm:px-5 py-4 border-b border-gray-100">
        <div className="flex items-start gap-3 mb-3">
          {selectedDoubt.createdByAvatar ? (
            <img src={selectedDoubt.createdByAvatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
              {selectedDoubt.createdByName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                {isMine ? "You" : selectedDoubt.createdByName}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${TAG_COLORS[selectedDoubt.tag] || TAG_COLORS.general}`}>
                <Tag size={10} /> {selectedDoubt.tag}
              </span>
              {selectedDoubt.isSolved && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Solved
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
              <Clock size={11} /> {timeAgo(selectedDoubt.createdAt)}
            </span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{selectedDoubt.title}</h1>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedDoubt.description}</p>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-3">
          <MessageCircle size={14} />
          <span>{selectedDoubt.replyCount || 0} {selectedDoubt.replyCount === 1 ? "reply" : "replies"}</span>
        </div>
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-1 bg-gray-50/50">
        {hasMoreReplies[doubtId] && (
          <div className="text-center mb-3">
            <button onClick={handleLoadMore} className="text-blue-600 text-xs font-semibold hover:underline">
              Load earlier replies
            </button>
          </div>
        )}

        {replies.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No replies yet. Be the first to respond!</p>
          </div>
        )}

        {replies.map((reply) => {
          const isMyReply = reply.createdBy === currentStudentId;
          return (
            <div key={reply._id} className={`flex gap-2.5 mb-3 ${isMyReply ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 mt-1">
                {reply.createdByAvatar ? (
                  <img src={reply.createdByAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isMyReply ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-gray-400 to-gray-500"}`}>
                    {reply.createdByName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className={`max-w-[75%] sm:max-w-[70%] ${isMyReply ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-tr-md" : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-md"} px-4 py-2.5 shadow-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${isMyReply ? "text-blue-100" : "text-gray-600"}`}>
                    {isMyReply ? "You" : reply.createdByName}
                  </span>
                  {reply.createdByRole === "faculty" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Faculty</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{reply.content}</p>
                <p className={`text-[10px] mt-1.5 ${isMyReply ? "text-blue-200" : "text-gray-400"}`}>{timeAgo(reply.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={repliesEndRef} />
      </div>

      {/* Sticky reply input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 sm:px-5 py-3">
        <form onSubmit={handleSendReply} className="flex items-end gap-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendReply(e); } }}
            placeholder="Type your reply..."
            rows={1}
            maxLength={2000}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-gray-400 max-h-32 overflow-y-auto"
            style={{ minHeight: "42px" }}
          />
          <button
            type="submit"
            disabled={!replyContent.trim() || replyLoading}
            className="flex-shrink-0 p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl
                       hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            {replyLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoubtDetail;
