import React, { useState } from "react";
import { X, LogIn, Loader2 } from "lucide-react";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function JoinCourseModal({ onClose, onSuccess }) {
  const [courseIdOrGroupId, setCourseIdOrGroupId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = courseIdOrGroupId.trim();
    if (!value) {
      toast.error("Enter a Course ID or Group ID");
      return;
    }

    setSubmitting(true);
    try {
      const isLikelyGroupId = value.length > 12 || value.includes("-");
      const payload = isLikelyGroupId ? { groupId: value } : { courseId: value.toUpperCase() };
      await api.post("/student/courses/join", payload);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Join Course</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Enter the <strong>Course ID</strong> (e.g. A1B2C3D4) or <strong>Group ID</strong> (the long code shared by the creator) to join. The course must be approved by faculty before others can join.
          </p>
          <input
            type="text"
            value={courseIdOrGroupId}
            onChange={(e) => setCourseIdOrGroupId(e.target.value)}
            placeholder="Course ID or Group ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <><LogIn size={18} /> Join</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
