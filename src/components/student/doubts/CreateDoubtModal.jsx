import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Send, Tag, Type, AlignLeft } from "lucide-react";
import { createDoubt } from "../../../features/student/doubtsSlice";

const TAGS = [
  "general",
  "academics",
  "placements",
  "exams",
  "events",
  "hostel",
  "library",
  "sports",
  "technical",
  "other",
];

const TAG_COLORS = {
  general: "bg-gray-100 text-gray-700 border-gray-300",
  academics: "bg-blue-100 text-blue-700 border-blue-300",
  placements: "bg-purple-100 text-purple-700 border-purple-300",
  exams: "bg-red-100 text-red-700 border-red-300",
  events: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hostel: "bg-orange-100 text-orange-700 border-orange-300",
  library: "bg-teal-100 text-teal-700 border-teal-300",
  sports: "bg-green-100 text-green-700 border-green-300",
  technical: "bg-indigo-100 text-indigo-700 border-indigo-300",
  other: "bg-slate-100 text-slate-700 border-slate-300",
};

const CreateDoubtModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading } = useSelector((state) => state.doubts);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("general");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const result = await dispatch(createDoubt({ title, description, tag }));
    if (!result.error) {
      setTitle("");
      setDescription("");
      setTag("general");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900">Ask a Doubt</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
              <Type size={15} />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your doubt about?"
              maxLength={200}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/200</p>
          </div>

          {/* Tag */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={15} />
              Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize
                    ${
                      tag === t
                        ? TAG_COLORS[t] + " ring-2 ring-offset-1 ring-blue-400"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
              <AlignLeft size={15} />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your doubt in detail..."
              maxLength={5000}
              required
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/5000</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createLoading || !title.trim() || !description.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600
                       text-white font-semibold py-3 rounded-xl
                       hover:from-blue-700 hover:to-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       active:scale-[0.98]"
          >
            {createLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
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

