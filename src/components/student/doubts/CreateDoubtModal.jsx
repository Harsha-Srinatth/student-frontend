import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Send, Tag, Type, AlignLeft } from "lucide-react";
import { createDoubt } from "../../../features/student/doubtsSlice";
import { TAGS, getTagClass, DOUBT_COLORS, DOUBT_ANIMATION } from "./doubtTheme";

const TITLE_MAX = 200;
const DESC_MAX = 5000;

const CreateDoubtModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading } = useSelector((state) => state.doubts);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("general");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const result = await dispatch(createDoubt({ title: title.trim(), description: description.trim(), tag }));
    if (!result.error) {
      setTitle("");
      setDescription("");
      setTag("general");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-800 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className={`relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col ${DOUBT_COLORS.cardBg} rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 ease-out`}
        role="dialog"
        aria-labelledby="create-doubt-title"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b ${DOUBT_COLORS.border} ${DOUBT_COLORS.primarySubtle}`}>
          <h2 id="create-doubt-title" className={`text-lg font-bold ${DOUBT_COLORS.textPrimary}`}>
            Ask a Doubt
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl ${DOUBT_COLORS.textMuted} hover:bg-teal-100 transition-colors ${DOUBT_ANIMATION.buttonPress}`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label htmlFor="doubt-title" className={`flex items-center gap-2 text-sm font-semibold ${DOUBT_COLORS.textPrimary} mb-1.5`}>
              <Type size={15} strokeWidth={2} />
              Title
            </label>
            <input
              id="doubt-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="What's your doubt about?"
              maxLength={TITLE_MAX}
              required
              className={`w-full px-4 py-2.5 border ${DOUBT_COLORS.border} rounded-xl text-sm ${DOUBT_COLORS.inputBg} placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-200 transition-all duration-200`}
            />
            <p className={`text-xs ${DOUBT_COLORS.textMuted} mt-1 text-right`}>
              {title.length}/{TITLE_MAX}
            </p>
          </div>

          {/* Tag */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-semibold ${DOUBT_COLORS.textPrimary} mb-2`}>
              <Tag size={15} strokeWidth={2} />
              Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-all duration-200 ${
                    tag === t
                      ? `${getTagClass(t)} ring-2 ring-offset-1 ring-teal-200 border-teal-200`
                      : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="doubt-desc" className={`flex items-center gap-2 text-sm font-semibold ${DOUBT_COLORS.textPrimary} mb-1.5`}>
              <AlignLeft size={15} strokeWidth={2} />
              Description
            </label>
            <textarea
              id="doubt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              placeholder="Describe your doubt in detail so others can help..."
              maxLength={DESC_MAX}
              required
              rows={5}
              className={`w-full px-4 py-2.5 border ${DOUBT_COLORS.border} rounded-xl text-sm resize-none ${DOUBT_COLORS.inputBg} placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-200 transition-all duration-200`}
            />
            <p className={`text-xs ${DOUBT_COLORS.textMuted} mt-1 text-right`}>
              {description.length}/{DESC_MAX}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createLoading || !title.trim() || !description.trim()}
            className={`w-full flex items-center justify-center gap-2 ${DOUBT_COLORS.primary} ${DOUBT_COLORS.textOnBrown} font-semibold py-3 rounded-xl ${DOUBT_COLORS.primaryHover} disabled:opacity-50 disabled:cursor-not-allowed ${DOUBT_ANIMATION.buttonPress}`}
          >
            {createLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} strokeWidth={2.2} />
                Post Doubt
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDoubtModal;
