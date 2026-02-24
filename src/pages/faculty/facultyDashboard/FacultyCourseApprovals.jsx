import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  ChevronRight,
} from "lucide-react";
import api from "../../../services/api";
import toast from "react-hot-toast";

const CourseApprovalCard = ({ course, onApprove, onReject, loading }) => {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {course.coverImage?.url ? (
            <img src={course.coverImage.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              {course.creatorContact}
            </span>
            <span>•</span>
            <span>{course.creatorName}</span>
            <span>•</span>
            <span>{course.category}</span>
            <span>•</span>
            <span>{course.durationDays} days</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {!showReject ? (
              <>
                <button
                  onClick={() => onApprove(course.courseId)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Approve
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle size={14} />
                  Reject
                </button>
              </>
            ) : (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Rejection reason..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => onReject(course.courseId, reason)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : "Submit"}
                </button>
                <button onClick={() => setShowReject(false)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
};

export default function FacultyCourseApprovals() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/faculty/courses/pending");
      setCourses(data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load pending courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleApprove = async (courseId) => {
    setActionLoading(courseId);
    try {
      await api.post(`/faculty/courses/${courseId}/approve`, { action: "approve" });
      toast.success("Course approved");
      setCourses((c) => c.filter((x) => x.courseId !== courseId));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (courseId, reason) => {
    setActionLoading(courseId);
    try {
      await api.post(`/faculty/courses/${courseId}/approve`, { action: "reject", reason});
      toast.success("Course rejected");
      setCourses((c) => c.filter((x) => x.courseId !== courseId));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={26} className="text-indigo-600" />
          Course Approvals
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Approve or reject student-created Skill Exchange courses</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading pending courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={fetchCourses} className="mt-3 text-sm text-red-600 hover:underline">
            Retry
          </button>
        </div>
      ) : !courses.length ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No pending courses</p>
          <p className="text-sm text-gray-500 mt-1">All courses have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseApprovalCard
              key={course._id || course.courseId}
              course={course}
              onApprove={handleApprove}
              onReject={handleReject}
              loading={actionLoading === course.courseId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
