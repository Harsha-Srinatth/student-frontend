import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Star,
  MessageSquare,
  Calendar,
  User,
  Award,
} from "lucide-react";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function FacultyCourseCompletions() {
  const [courses, setCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // { "courseId-studentId": true }

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/faculty/courses/for-completion");
      setCourses(data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompletedCourses = useCallback(async () => {
    setCompletedLoading(true);
    try {
      const { data } = await api.get("/faculty/courses/completed");
      setCompletedCourses(data?.data || []);
    } catch (e) {
      setCompletedCourses([]);
    } finally {
      setCompletedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCompletedCourses();
  }, [fetchCourses, fetchCompletedCourses]);

  const handleComplete = async (courseId, studentId, points, feedback) => {
    const key = `${courseId}-${studentId}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await api.post(`/faculty/courses/${courseId}/complete/${studentId}`, {
        points: points != null && points !== "" ? Math.min(50, Math.max(0, Number(points))) : 50,
        feedback: feedback || undefined,
      });
      toast.success("Points awarded. Student marked complete.");
      setCourses((prev) =>
        prev
          .map((c) => {
            if (c.courseId !== courseId) return c;
            const pending = (c.pendingCompletions || []).filter((p) => p.studentId !== studentId);
            return pending.length === 0 ? null : { ...c, pendingCompletions: pending };
          })
          .filter(Boolean)
      );
      fetchCompletedCourses(); // refresh completed list (course may now appear there)
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to complete");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={26} className="text-indigo-600" />
          Course completions (award points)
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Courses whose duration has ended (from approval date + duration days). Review student feedback and award teaching points (0–50).
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading courses...</p>
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
          <p className="text-gray-600 font-medium">No courses pending completion</p>
          <p className="text-sm text-gray-500 mt-1">When a course’s duration ends and students have joined, they appear here for you to award points.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.courseId || course._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                  <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                    <span>{course.creatorName}</span>
                    <span>·</span>
                    <span>{course.category}</span>
                    <span>·</span>
                    <span>{course.durationDays} days</span>
                    {course.endDate && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar size={12} />
                          Ended {new Date(course.endDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <p className="text-sm font-medium text-gray-700">Students to complete (review feedback and award points)</p>
                {(course.pendingCompletions || []).map((pending) => (
                  <PendingCompletionRow
                    key={pending.studentId}
                    pending={pending}
                    courseId={course.courseId}
                    onComplete={handleComplete}
                    loading={actionLoading?.[`${course.courseId}-${pending.studentId}`]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed courses (duration ended, all students completed) */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Award size={22} className="text-green-600" />
          Completed courses
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Courses whose duration ended and all joined students have been awarded points.
        </p>
        {completedLoading ? (
          <div className="flex items-center gap-2 py-6 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading completed courses...</span>
          </div>
        ) : !completedCourses.length ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No completed courses yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedCourses.map((course) => (
              <div key={course.courseId || course._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {course.coverImage?.url ? (
                      <img src={course.coverImage.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      <span>{course.creatorName}</span>
                      <span>·</span>
                      <span>{course.category}</span>
                      <span>·</span>
                      <span>{course.durationDays} days</span>
                      {course.endDate && (
                        <span className="flex items-center gap-0.5">
                          <Calendar size={12} />
                          Ended {new Date(course.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {(course.completedBy || []).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-600 mb-1">Students completed ({course.completedBy.length})</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {course.completedBy.map((c) => (
                            <li key={c.studentId} className="flex items-center gap-2">
                              <User size={12} />
                              {c.studentId}
                              {c.pointsAwarded != null && (
                                <span className="text-green-600 font-medium">{c.pointsAwarded} pts</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingCompletionRow({ pending, courseId, onComplete, loading }) {
  const [points, setPoints] = useState("50");
  const [feedback, setFeedback] = useState("");

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} />
          <span className="font-medium">{pending.studentId}</span>
          {pending.joinedAt && (
            <span className="text-gray-500 text-xs">Joined {new Date(pending.joinedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      {(pending.rating != null || pending.reviewText) && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
            <MessageSquare size={14} />
            Student feedback
          </p>
          {pending.rating != null && (
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={pending.rating >= star ? "text-amber-500 fill-amber-500" : "text-gray-200"}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">{pending.rating}/5</span>
            </div>
          )}
          {pending.reviewText && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{pending.reviewText}</p>
          )}
        </div>
      )}
      {pending.rating == null && !pending.reviewText && (
        <p className="text-xs text-amber-700 mt-2">No feedback submitted yet.</p>
      )}
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Points (0–50)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Your feedback (optional)</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional remarks for the student"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <button
          onClick={() => onComplete(courseId, pending.studentId, points, feedback)}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Award points & complete
        </button>
      </div>
    </div>
  );
}
