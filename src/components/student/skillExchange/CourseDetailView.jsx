import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Phone,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Trash2,
  Send,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socketService";
import toast from "react-hot-toast";

export default function CourseDetailView({ course: initialCourse, currentStudentId, onBack, onUpdate }) {
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingVideoUrl, setPendingVideoUrl] = useState("");
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const contentEndRef = useRef(null);

  const isCreator = course?.creatorId === currentStudentId;
  const courseId = course?.courseId || initialCourse?.courseId;

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

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!course?.courseId || !isCreator) return;

      const hasText = messageText.trim().length > 0;
      const hasImage = !!pendingImageFile;
      const hasVideo = !!pendingVideoUrl.trim();

      if (!hasText && !hasImage && !hasVideo) return;
      if (submitting) return;

      setSubmitting(true);
      try {
        if (hasImage) {
          const fd = new FormData();
          fd.append("type", "image");
          fd.append("file", pendingImageFile);
          fd.append("caption", messageText.trim());
          await api.post(`/student/courses/${course.courseId}/content`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setPendingImageFile(null);
        } else if (hasVideo) {
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
        toast.success("Sent");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send");
      } finally {
        setSubmitting(false);
      }
    },
    [course?.courseId, isCreator, messageText, pendingImageFile, pendingVideoUrl, submitting, onUpdate]
  );

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setPendingImageFile(file);
    e.target.value = "";
  }, []);

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm("Delete this content?")) return;
    try {
      await api.delete(`/student/courses/${course.courseId}/content/${contentId}`);
      setCourse((prev) => (prev?.content ? { ...prev, content: prev.content.filter((c) => (c._id || c.id)?.toString() !== contentId) } : prev));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const contentList = course.content || [];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-2 transition-colors text-sm sm:text-base">
          <ArrowLeft size={18} />
          Back
        </button>
        {!isCreator && (course.creatorName || course.creatorContact) && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 sm:p-4 flex flex-wrap items-center gap-2">
            <Phone size={18} className="text-indigo-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              {course.creatorName && <span className="text-sm text-indigo-900 block truncate">{course.creatorName}</span>}
              {course.creatorContact ? (
                <a href={`tel:${course.creatorContact}`} className="text-indigo-700 font-semibold hover:underline text-sm sm:text-base break-all">
                  {course.creatorContact}
                </a>
              ) : (
                <span className="text-sm text-indigo-700">Contact not shared</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Course header compact */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-3 sm:px-4 py-3">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{course.title}</h1>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{course.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs">{course.category}</span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs">{course.durationDays} days</span>
          {course.isPaid && course.joinAmount > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">₹{course.joinAmount} to join</span>
          )}
        </div>
      </div>

      {/* Content list - scrollable */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 bg-gray-50/50">
        {contentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No content yet</p>
            {isCreator && <p className="text-gray-400 text-xs mt-1">Use the bar below to send text, photo or video</p>}
          </div>
        ) : (
          contentList.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                {item.type === "text" && <FileText className="w-4 h-4 text-indigo-600" />}
                {item.type === "image" && <ImageIcon className="w-4 h-4 text-indigo-600" />}
                {item.type === "pdf" && <FileText className="w-4 h-4 text-indigo-600" />}
                {item.type === "video" && <Video className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="flex-1 min-w-0">
                {item.type === "text" && <p className="text-gray-800 text-sm whitespace-pre-wrap">{item.url || item.caption}</p>}
                {item.type === "image" && (
                  <div>
                    <img src={item.url} alt={item.caption} className="max-w-full rounded-lg max-h-64 object-contain" />
                    {item.caption && <p className="text-sm text-gray-600 mt-2">{item.caption}</p>}
                  </div>
                )}
                {item.type === "pdf" && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">
                    View PDF {item.caption && `– ${item.caption}`}
                  </a>
                )}
                {item.type === "video" && (
                  <div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">
                      Watch Video
                    </a>
                    {item.caption && <p className="text-sm text-gray-600 mt-1">{item.caption}</p>}
                  </div>
                )}
              </div>
              {isCreator && (
                <button
                  onClick={() => handleDeleteContent(item._id || item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={contentEndRef} />
      </div>

      {/* WhatsApp-style bottom bar: [ Photo ] [ Video ] [ Text field ] [ Send ] - creator only */}
      {isCreator && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-3">
          {showVideoUrlInput && (
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={pendingVideoUrl}
                onChange={(e) => setPendingVideoUrl(e.target.value)}
                placeholder="Paste video URL..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => { setShowVideoUrlInput(false); setPendingVideoUrl(""); }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          )}
          {pendingImageFile && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <ImageIcon size={16} />
              <span className="truncate">{pendingImageFile.name}</span>
              <button type="button" onClick={() => setPendingImageFile(null)} className="text-red-600 hover:underline">
                Remove
              </button>
            </div>
          )}
          <form onSubmit={handleSend} className="flex items-end gap-2">
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
              className="flex-shrink-0 p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl"
              title="Photo"
            >
              <ImageIcon size={22} />
            </button>
            <button
              type="button"
              onClick={() => setShowVideoUrlInput((v) => !v)}
              className={`flex-shrink-0 p-2.5 rounded-xl ${showVideoUrlInput ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Video (URL)"
            >
              <Video size={22} />
            </button>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              maxLength={2000}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 min-h-[42px] max-h-32 overflow-y-auto"
            />
            <button
              type="submit"
              disabled={submitting || (!messageText.trim() && !pendingImageFile && !pendingVideoUrl.trim())}
              className="flex-shrink-0 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
