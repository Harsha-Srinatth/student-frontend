import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, Award, IndianRupee } from "lucide-react";
import { z } from "zod";
import api from "../../../services/api";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day"),
});

const CATEGORIES = ["Programming", "Design", "Languages", "Marketing", "Finance", "Other"];
const POINTS_REQUIRED = 250;

export default function CreateCourseModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    durationDays: 7,
    isPaid: false,
    joinAmount: "",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [teachingPoints, setTeachingPoints] = useState(null);
  const [canSetPaidCourse, setCanSetPaidCourse] = useState(false);
  const [pointsLoading, setPointsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/student/courses/teaching-points");
        if (!cancelled && data?.data) {
          setTeachingPoints(data.data.teachingPoints ?? 0);
          setCanSetPaidCourse(data.data.canSetPaidCourse === true);
        }
      } catch {
        if (!cancelled) {
          setTeachingPoints(0);
          setCanSetPaidCourse(false);
        }
      } finally {
        if (!cancelled) setPointsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Everyone can create (free) courses; 250+ points required to set join amount
  const canCreate = teachingPoints !== null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const next = type === "checkbox" ? e.target.checked : value;
    setForm((p) => ({ ...p, [name]: next }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    const isPaid = canSetPaidCourse && form.isPaid === true;
    const joinAmount = isPaid ? (parseFloat(form.joinAmount) || 0) : 0;
    if (isPaid && joinAmount <= 0) {
      setErrors((p) => ({ ...p, joinAmount: "Enter a valid amount to join (e.g. ₹99)" }));
      return;
    }
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs = {};
      result.error.errors.forEach((err) => {
        errs[err.path[0]] = err.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("durationDays", String(form.durationDays));
      fd.append("paid", isPaid ? "true" : "false");
      if (isPaid && joinAmount > 0) fd.append("joinAmount", String(joinAmount));
      if (coverFile) fd.append("coverImage", coverFile);

      await api.post("/student/courses", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create course";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-xl my-4">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create Course</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Teaching points eligibility */}
        <div className="px-4 sm:px-6 pt-4">
          {pointsLoading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Checking eligibility...
            </div>
          ) : (
            <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 ${canSetPaidCourse ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
              <Award size={18} className="flex-shrink-0" />
              <span>
                {canSetPaidCourse
                  ? `You have ${teachingPoints} teaching points. You can create free or paid courses.`
                  : `You can create free courses. Complete courses to earn 50 points each; at ${POINTS_REQUIRED} points you can set a join amount.`}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Python Basics"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="What will students learn?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[80px]"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
              <input
                name="durationDays"
                type="number"
                min={1}
                value={form.durationDays}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              {errors.durationDays && <p className="text-red-500 text-sm mt-1">{errors.durationDays}</p>}
            </div>
          </div>

          {/* Paid course & join amount — only when 250+ points */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-4">
            {!canSetPaidCourse && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Earn 250 teaching points (e.g. 50 per completed course) to set a join amount for your courses.
              </p>
            )}
            <label className={`flex items-center gap-3 ${canSetPaidCourse ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}>
              <input
                type="checkbox"
                name="isPaid"
                checked={canSetPaidCourse && form.isPaid}
                onChange={handleChange}
                disabled={!canSetPaidCourse}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <span className="text-sm font-medium text-gray-700">Paid course (students pay to join)</span>
            </label>
            {canSetPaidCourse && form.isPaid && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to join (₹) *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="joinAmount"
                    type="number"
                    min={0}
                    step={1}
                    value={form.joinAmount}
                    onChange={handleChange}
                    placeholder="e.g. 99"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                {errors.joinAmount && <p className="text-red-500 text-sm mt-1">{errors.joinAmount}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm max-w-full"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !canCreate}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              title={!canCreate ? "Loading eligibility..." : undefined}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
