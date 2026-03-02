import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Phone,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Send,
  Star,
  MessageSquare,
  MoreVertical,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socketService";
import toast from "react-hot-toast";

function formatMessageTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function CourseDetailView({ course: initialCourse, currentStudentId, onBack, onUpdate }) {
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingVideoUrl, setPendingVideoUrl] = useState("");
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [openingFeedbackDismissed, setOpeningFeedbackDismissed] = useState(false);
  const [hoveredContentId, setHoveredContentId] = useState(null);
  const [menuContentId, setMenuContentId] = useState(null);
  const fileInputRef = useRef(null);
  const contentEndRef = useRef(null);

  const isCreator = course?.creatorId === currentStudentId;
  const courseId = course?.courseId || initialCourse?.courseId;

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const approvedAt = course?.approvalDetails?.approvedAt ? new Date(course.approvalDetails.approvedAt).getTime() : null;
  const endTime = approvedAt && course?.durationDays ? approvedAt + course.durationDays * MS_PER_DAY : null;
  const durationEnded = endTime != null && Date.now() >= endTime;
  const hasReviewed = (course?.studentReviews || []).some((r) => r.studentId === currentStudentId);
  const isJoined = (course?.joinedStudents || []).some((s) => s.studentId === currentStudentId);
  const showFeedbackForm = !isCreator && isJoined && durationEnded && !hasReviewed;

  // Fetch course
  useEffect(() => {
    if (!initialCourse?.courseId) return;
    setLoading(true);
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/student/courses/${initialCourse.courseId}`);
        setCourse(data?.data || initialCourse);
      } catch (e) {
        toast.error("Failed to load course");
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [initialCourse?.courseId, refreshKey]);

  // Join/leave course socket room for real-time content (like doubt room)
  useEffect(() => {
    if (!courseId) return;
    socketService.emitWhenReady("course:joinCourse", courseId);
    return () => socketService.emit("course:leaveCourse", courseId);
  }, [courseId]);

  // Real-time: new content
  useEffect(() => {
    const onNew = (payload) => {
      setCourse((prev) => {
        if (!prev || !payload) return prev;
        const list = Array.isArray(prev.content) ? [...prev.content] : [];
        if (payload._id && list.some((c) => (c._id || c.id) === (payload._id || payload.id))) return prev;
        return { ...prev, content: [...list, payload] };
      });
    };
    socketService.on("course:content:new", onNew);
    return () => socketService.off("course:content:new", onNew);
  }, []);

  // Real-time: content deleted
  useEffect(() => {
    const onDeleted = ({ contentId }) => {
      if (!contentId) return;
      setCourse((prev) => {
        if (!prev?.content) return prev;
        return { ...prev, content: prev.content.filter((c) => (c._id || c.id)?.toString() !== contentId) };
      });
    };
    socketService.on("course:content:deleted", onDeleted);
    return () => socketService.off("course:content:deleted", onDeleted);
  }, []);

  useEffect(() => {
    contentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [course?.content?.length]);

  // Close message menu on click outside
  useEffect(() => {
    if (!menuContentId) return;
    const close = () => setMenuContentId(null);
    const t = setTimeout(() => {
      document.addEventListener("click", close);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", close);
    };
  }, [menuContentId]);

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!course?.courseId) return;
      // Creator can send any; joined students can only send text (ask doubt)
      if (!isCreator && !isJoined) return;

      const hasText = messageText.trim().length > 0;
      const hasImage = !!pendingImageFile;
      const hasVideo = !!pendingVideoUrl.trim();

      if (!hasText && !hasImage && !hasVideo) return;
      if (submitting) return;
      if (!isCreator && (hasImage || hasVideo)) return;

      setSubmitting(true);
      try {
        if (hasImage && isCreator) {
          const fd = new FormData();
          fd.append("type", "image");
          fd.append("file", pendingImageFile);
          fd.append("caption", messageText.trim());
          await api.post(`/student/courses/${course.courseId}/content`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setPendingImageFile(null);
        } else if (hasVideo && isCreator) {
          await api.post(`/student/courses/${course.courseId}/content`, {
            type: "video",
            url: pendingVideoUrl.trim(),
            caption: messageText.trim() || undefined,
          });
          setPendingVideoUrl("");
          setShowVideoUrlInput(false);
        } else {
          await api.post(`/student/courses/${course.courseId}/content`, {
            type: "text",
            caption: messageText.trim(),
          });
        }
        setMessageText("");
        if (onUpdate) onUpdate();
        toast.success(isCreator ? "Sent" : "Doubt sent");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send");
      } finally {
        setSubmitting(false);
      }
    },
    [course?.courseId, isCreator, isJoined, messageText, pendingImageFile, pendingVideoUrl, submitting, onUpdate]
  );

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setPendingImageFile(file);
    e.target.value = "";
  }, []);

  const canDeleteContent = (item) => {
    if (!item) return false;
    return isCreator || (item.createdBy && item.createdBy.toString() === currentStudentId);
  };

  const handleDeleteContent = async (contentId) => {
    setMenuContentId(null);
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/student/courses/${course.courseId}/content/${contentId}`);
      setCourse((prev) => (prev?.content ? { ...prev, content: prev.content.filter((c) => (c._id || c.id)?.toString() !== contentId) } : prev));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e?.preventDefault();
    if (!courseId || feedbackSubmitting) return;
    setFeedbackSubmitting(true);
    try {
      await api.post(`/student/courses/${courseId}/feedback`, {
        rating: feedbackRating,
        reviewText: feedbackText.trim() || undefined,
      });
      toast.success("Feedback submitted. Faculty will review and award points.");
      setFeedbackText("");
      setRefreshKey((k) => k + 1);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const contentList = course.content || [];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-3 border-b border-teal-200/60 bg-white">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-2 transition-colors text-sm sm:text-base">
          <ArrowLeft size={18} />
          Back
        </button>
        {!isCreator && (course.creatorName || course.creatorContact) && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 sm:p-4 flex flex-wrap items-center gap-2">
            <Phone size={18} className="text-teal-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              {course.creatorName && <span className="text-sm text-teal-900 block truncate">{course.creatorName}</span>}
              {course.creatorContact ? (
                <a href={`tel:${course.creatorContact}`} className="text-teal-700 font-semibold hover:underline text-sm sm:text-base break-all">
                  {course.creatorContact}
                </a>
              ) : (
                <span className="text-sm text-teal-700">Contact not shared</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Course header compact - status icons, better Group ID */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-3 sm:px-4 py-3">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{course.title}</h1>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{course.description}</p>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">{course.category}</span>
          <span className="px-2.5 py-1 bg-pink-100 text-pink-800 rounded-lg text-xs font-medium">{course.durationDays} days</span>
          {(course.groupStatus === "on-going" || course.groupStatus === "completed") && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${course.groupStatus === "completed" ? "bg-teal-100 text-teal-800" : "bg-green-200/80 text-green-800"}`}>
              {course.groupStatus === "completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
              {course.groupStatus === "completed" ? "Completed" : "On-going"}
            </span>
          )}
          {course.isPaid && course.joinAmount > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">₹{course.joinAmount} to join</span>
          )}
        </div>
        {isCreator && course.groupId && (
          <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-teal-600 flex-shrink-0" />
              <span className="text-sm text-teal-800 font-medium">Group ID – share so others can join</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 bg-white/80 rounded-lg px-3 py-2 border border-teal-200">
              <code className="text-sm font-mono text-teal-800 truncate flex-1" title={course.groupId}>{course.groupId}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(course.groupId);
                  toast.success("Group ID copied!");
                }}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Opening feedback prompt - optional, dismissible */}
      {!openingFeedbackDismissed && isJoined && !durationEnded && (
        <div className="flex-shrink-0 bg-pink-50 border-b border-pink-200 px-3 sm:px-4 py-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare size={18} className="text-pink-600 flex-shrink-0" />
            <p className="text-sm text-pink-800">How is the course going? You can submit full feedback after the course ends.</p>
          </div>
          <button type="button" onClick={() => setOpeningFeedbackDismissed(true)} className="p-1 text-pink-600 hover:bg-pink-100 rounded flex-shrink-0" aria-label="Dismiss">
            <X size={18} />
          </button>
        </div>
      )}

      {/* End-of-course feedback – below course content area */}
      {showFeedbackForm && (
        <div className="flex-shrink-0 bg-amber-50/90 border-b border-amber-200 px-3 sm:px-4 py-4">
          <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <MessageSquare size={18} />
            Course ended – Submit your feedback
          </h3>
          <p className="text-xs text-amber-800 mt-1">Your review helps the faculty award points. Submit once.</p>
          <form onSubmit={handleSubmitFeedback} className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rating (1–5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <Star size={24} className={feedbackRating >= star ? "text-amber-500 fill-amber-500" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Review (optional)</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="How was the course? Share your experience..."
                rows={2}
                maxLength={1000}
                className="w-full px-3 py-2 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={feedbackSubmitting}
              className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {feedbackSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              Submit feedback
            </button>
          </form>
        </div>
      )}

      {/* Already submitted feedback message */}
      {!isCreator && isJoined && durationEnded && hasReviewed && (
        <div className="flex-shrink-0 bg-green-200/50 border-b border-green-200 px-3 sm:px-4 py-3">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <MessageSquare size={18} />
            You have submitted your feedback. Faculty will review and award points.
          </p>
        </div>
      )}

      {/* Content list - WhatsApp-style bubbles with time, three-dots on hover */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2 bg-[#e5ddd5]/40">
        {contentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-teal-300 mb-2" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            {(isCreator || isJoined) && (
              <p className="text-gray-400 text-xs mt-1">
                {isCreator ? "Send content or let students ask doubts below" : "Ask a doubt using the box below"}
              </p>
            )}
          </div>
        ) : (
          contentList.map((item) => {
            const contentId = item._id || item.id;
            const isOwn = item.createdBy && item.createdBy.toString() === currentStudentId;
            const showMenu = menuContentId === contentId;
            const showDots = hoveredContentId === contentId || showMenu;
            const canDelete = canDeleteContent(item);

            return (
              <div
                key={contentId}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                onMouseEnter={() => setHoveredContentId(contentId)}
                onMouseLeave={() => { if (!showMenu) setHoveredContentId(null); }}
              >
                <div className={`relative group max-w-[85%] sm:max-w-[75%] ${isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-3 py-2 shadow-sm ${
                      isOwn
                        ? "bg-green-200/90 text-gray-900 rounded-br-md"
                        : "bg-white text-gray-900 border border-teal-200/60 rounded-bl-md"
                    }`}
                  >
                    {item.type === "text" && <p className="text-sm whitespace-pre-wrap break-words">{item.url || item.caption}</p>}
                    {item.type === "image" && (
                      <div>
                        <img src={item.url} alt={item.caption} className="max-w-full rounded-lg max-h-64 object-contain" />
                        {item.caption && <p className="text-sm text-gray-600 mt-2">{item.caption}</p>}
                      </div>
                    )}
                    {item.type === "pdf" && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline">
                        View PDF {item.caption && `– ${item.caption}`}
                      </a>
                    )}
                    {item.type === "video" && (
                      <div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm hover:underline">
                          Watch Video
                        </a>
                        {item.caption && <p className="text-sm text-gray-600 mt-1">{item.caption}</p>}
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className={`text-[10px] ${isOwn ? "text-gray-600" : "text-gray-500"}`}>
                        {formatMessageTime(item.createdAt)}
                      </p>
                      {/* Three dots - show on hover; click opens delete menu */}
                      {canDelete && showDots && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMenuContentId(showMenu ? null : contentId); }}
                          className="p-0.5 rounded-full hover:bg-black/10 text-gray-500 flex-shrink-0"
                          aria-label="Message options"
                        >
                          <MoreVertical size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  {canDelete && showMenu && (
                    <div className="absolute top-0 right-0 mt-8 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px]" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDeleteContent(contentId)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={contentEndRef} />
      </div>

      {/* Bottom bar: creator = full (photo, video, text); joined = text only (Ask doubt) */}
      {(isCreator || isJoined) && (
        <div className="flex-shrink-0 bg-white border-t border-teal-200/60 px-2 sm:px-4 py-3">
          {isCreator && showVideoUrlInput && (
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={pendingVideoUrl}
                onChange={(e) => setPendingVideoUrl(e.target.value)}
                placeholder="Paste video URL..."
                className="flex-1 px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              />
              <button
                type="button"
                onClick={() => { setShowVideoUrlInput(false); setPendingVideoUrl(""); }}
                className="px-3 py-2 border border-teal-200 rounded-xl text-sm text-teal-700 hover:bg-teal-50"
              >
                Cancel
              </button>
            </div>
          )}
          {isCreator && pendingImageFile && (
            <div className="flex items-center gap-2 mb-2 text-sm text-teal-700">
              <ImageIcon size={16} />
              <span className="truncate">{pendingImageFile.name}</span>
              <button type="button" onClick={() => setPendingImageFile(null)} className="text-red-600 hover:underline">
                Remove
              </button>
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-end gap-2">
            {isCreator && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 p-2.5 text-teal-600 hover:bg-teal-50 rounded-xl"
                  title="Photo"
                >
                  <ImageIcon size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoUrlInput((v) => !v)}
                  className={`flex-shrink-0 p-2.5 rounded-xl ${showVideoUrlInput ? "bg-teal-100 text-teal-600" : "text-teal-600 hover:bg-teal-50"}`}
                  title="Video (URL)"
                >
                  <Video size={22} />
                </button>
              </>
            )}
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder={isCreator ? "Type a message..." : "Ask a doubt..."}
              rows={1}
              maxLength={2000}
              className="flex-1 px-4 py-2.5 border border-teal-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 placeholder:text-gray-500 min-h-[42px] max-h-32 overflow-y-auto bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={submitting || (!messageText.trim() && !pendingImageFile && !pendingVideoUrl.trim())}
              className="flex-shrink-0 p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
              title={isCreator ? "Send" : "Send doubt"}
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
