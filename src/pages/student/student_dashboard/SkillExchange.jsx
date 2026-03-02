import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSDashboardData } from "../../../features/student/studentDashSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  LogIn,
  Loader2,
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import api from "../../../services/api";
import CreateCourseModal from "../../../components/student/skillExchange/CreateCourseModal";
import JoinCourseModal from "../../../components/student/skillExchange/JoinCourseModal";
import CourseDetailView from "../../../components/student/skillExchange/CourseDetailView";
import toast from "react-hot-toast";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const isCourseDurationEnded = (course) => {
  const approvedAt = course?.approvalDetails?.approvedAt ? new Date(course.approvalDetails.approvedAt).getTime() : null;
  if (!approvedAt || !course?.durationDays) return false;
  const endTime = approvedAt + course.durationDays * MS_PER_DAY;
  return Date.now() >= endTime;
};
const hasReviewedCourse = (course, studentId) =>
  (course?.studentReviews || []).some((r) => r.studentId === studentId);

const STATUS_BADGES = {
  pending: { label: "Pending", class: "bg-amber-100 text-amber-800", Icon: Clock },
  approved: { label: "Approved", class: "bg-green-200/80 text-green-800", Icon: CheckCircle2 },
  rejected: { label: "Rejected", class: "bg-red-100 text-red-800", Icon: XCircle },
};

const GROUP_STATUS_BADGES = {
  "on-going": { label: "On-going", class: "bg-teal-200/80 text-teal-800", Icon: Clock },
  "completed": { label: "Completed", class: "bg-teal-300/80 text-teal-900", Icon: CheckCircle2 },
};

const CourseCard = ({ course, onClick, isJoined, isDiscover, onJoin, joinLoading, isCreator, currentStudentId }) => {
  const durationEnded = isCourseDurationEnded(course);
  const needsFeedback = isJoined && durationEnded && !hasReviewedCourse(course, currentStudentId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-teal-200/60 bg-white shadow-sm overflow-hidden"
    >
      <div
        onClick={!isDiscover ? () => onClick(course) : undefined}
        className={`p-4 sm:p-5 group ${!isDiscover ? "cursor-pointer hover:bg-teal-50/30 transition-colors" : ""}`}
      >
        <div className="flex gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-pink-100 flex-shrink-0 ring-1 ring-pink-200/50">
            {course.coverImage?.url ? (
              <img src={course.coverImage.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-gray-900 truncate text-sm sm:text-base ${!isDiscover ? "group-hover:text-teal-700" : ""}`}>{course.title}</h3>
              {!isDiscover && (
                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                  {(() => {
                    const status = STATUS_BADGES[course.status];
                    const StatusIcon = status?.Icon;
                    return (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg ${status?.class || "bg-gray-100 text-gray-700"}`}>
                        {StatusIcon && <StatusIcon size={12} />}
                        {status?.label || course.status}
                      </span>
                    );
                  })()}
                  {(course.groupStatus === "on-going" || course.groupStatus === "completed") && (() => {
                    const gs = GROUP_STATUS_BADGES[course.groupStatus];
                    const GsIcon = gs?.Icon;
                    return (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg ${gs?.class || "bg-gray-100 text-gray-700"}`}>
                        {GsIcon && <GsIcon size={12} />}
                        {gs?.label || course.groupStatus}
                      </span>
                    );
                  })()}
                </div>
              )}
              {isDiscover && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-lg flex-shrink-0 bg-green-200/80 text-green-800">Open to join</span>
              )}
            </div>
            {(course.creatorName || course.creatorContact) && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {course.creatorName}
                {course.creatorContact ? ` · ${course.creatorContact}` : ""}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs text-gray-500 flex-wrap">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">{course.category}</span>
              <span>{course.durationDays} days</span>
              {course.isPaid && course.joinAmount > 0 && (
                <>
                  <span>·</span>
                  <span className="font-medium text-amber-700">₹{course.joinAmount} to join</span>
                </>
              )}
              {isJoined && <span className="text-teal-600 font-medium">Joined</span>}
              {isCreator && course.groupId && (
                <div className="w-full mt-2 p-2 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between gap-2" title="Share this Group ID so others can join">
                  <span className="text-xs text-teal-800 font-medium">Group ID</span>
                  <code className="text-xs font-mono text-teal-700 truncate flex-1 text-center">{course.groupId}</code>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(course.groupId); toast.success("Group ID copied!"); }}
                    className="flex-shrink-0 px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 rounded"
                  >
                    Copy
                  </button>
                </div>
              )}
              {isDiscover && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onJoin?.(course); }}
                  disabled={joinLoading === course.courseId}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded-xl text-xs font-medium hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                  {joinLoading === course.courseId ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
                  Join
                </button>
              )}
            </div>
          </div>
          {!isDiscover && <ChevronRight className="w-5 h-5 text-teal-500 group-hover:text-teal-600 flex-shrink-0 hidden sm:block" />}
        </div>
      </div>
      {/* Give feedback CTA below course when completed and not yet reviewed */}
      {needsFeedback && (
        <div
          className="px-4 py-3 bg-pink-100/80 border-t border-pink-200 flex items-center justify-between gap-2"
          onClick={(e) => { e.stopPropagation(); onClick(course); }}
        >
          <span className="text-sm text-pink-800 flex items-center gap-2">
            <MessageSquare size={16} />
            Course ended – share your feedback
          </span>
          <span className="text-sm font-medium text-pink-700">Give feedback →</span>
        </div>
      )}
    </motion.div>
  );
};

const SkillExchange = () => {
  const dispatch = useDispatch();
  const student = useSelector((s) => s.studentDashboard?.student);
  const currentStudentId = student?.studentid || student?.studentId;

  useEffect(() => {
    if (!student) dispatch(fetchSDashboardData());
  }, [dispatch, student]);
  const [activeTab, setActiveTab] = useState("my");
  const [myCourses, setMyCourses] = useState([]);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [discoverCourses, setDiscoverCourses] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchMyCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/student/courses/my");
      setMyCourses(data?.data || []);
    } catch (e) {
      setMyCourses([]);
    }
  }, []);

  const fetchJoinedCourses = useCallback(async () => {
    try {
      const { data } = await api.get("/student/courses/joined");
      setJoinedCourses(data?.data || []);
    } catch (e) {
      setJoinedCourses([]);
    }
  }, []);

  const fetchDiscoverCourses = useCallback(async () => {
    setDiscoverLoading(true);
    try {
      const { data } = await api.get("/student/courses/discover");
      setDiscoverCourses(data?.data || []);
    } catch (e) {
      setDiscoverCourses([]);
    } finally {
      setDiscoverLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchMyCourses(), fetchJoinedCourses()]);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [fetchMyCourses, fetchJoinedCourses]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (activeTab === "discover") fetchDiscoverCourses();
  }, [activeTab, fetchDiscoverCourses]);

  const handleCreateSuccess = (createdCourse) => {
    setShowCreateModal(false);
    fetchMyCourses();
    if (createdCourse?.groupId) {
      toast.success("Course created! Share your Group ID with others so they can join.", { duration: 5000 });
    } else {
      toast.success("Course created! Pending faculty approval.");
    }
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    fetchJoinedCourses();
    toast.success("Successfully joined the course!");
  };

  const handleJoinFromDiscover = useCallback(async (course) => {
    if (!course?.courseId) return;
    setJoinLoading(course.courseId);
    try {
      await api.post("/student/courses/join", { courseId: course.courseId });
      toast.success("Successfully joined the course!");
      fetchJoinedCourses();
      fetchDiscoverCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join course");
    } finally {
      setJoinLoading(null);
    }
  }, [fetchJoinedCourses, fetchDiscoverCourses]);

  const handleCourseUpdate = () => {
    fetchMyCourses();
    fetchJoinedCourses();
  };

  if (selectedCourse) {
    return (
      <CourseDetailView
        course={selectedCourse}
        currentStudentId={currentStudentId}
        onBack={() => setSelectedCourse(null)}
        onUpdate={handleCourseUpdate}
      />
    );
  }

  const tabs = [
    { id: "my", label: "My Courses", data: myCourses, isCreator: true },
    { id: "joined", label: "Joined Courses", data: joinedCourses, isCreator: false },
    { id: "discover", label: "Browse Courses", data: discoverCourses, isDiscover: true },
  ];
  const currentTab = tabs.find((t) => t.id === activeTab);
  const isDiscoverTab = activeTab === "discover";
  const tabLoading = isDiscoverTab ? discoverLoading : loading;
  const tabData = isDiscoverTab ? discoverCourses : currentTab?.data ?? [];
  const tabEmptyMessage = isDiscoverTab
    ? "No approved courses open for joining right now. New courses appear here for 5 days after faculty approval."
    : activeTab === "my"
      ? "No courses created yet"
      : "No joined courses yet";
  const tabEmptyHint = isDiscoverTab
    ? "Check back later or join using a Course ID shared by a creator"
    : activeTab === "my"
      ? "Create a course to share your skills"
      : "Join a course from Browse Courses or using the Join Course button";

  return (
    <div className="w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 min-h-[60vh] overflow-y-auto bg-green-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-200/80 text-teal-700">
              <BookOpen size={24} className="sm:w-7 sm:h-7" />
            </span>
            Skill Exchange
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create & join peer-led courses</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-3 py-2.5 sm:px-4 bg-white border border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50 transition-colors text-sm sm:text-base shadow-sm"
          >
            <LogIn size={18} className="flex-shrink-0" />
            <span>Join</span>
            <span className="hidden sm:inline"> Course</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2.5 sm:px-4 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors text-sm sm:text-base shadow-md shadow-teal-200/50"
          >
            <Plus size={18} className="flex-shrink-0" />
            <span>Create</span>
            <span className="hidden sm:inline"> Course</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-teal-200/60 overflow-x-auto pb-px -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2.5 font-medium text-sm rounded-t-xl transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-teal-100 text-teal-800 border-b-2 border-teal-500 -mb-px"
                : "text-gray-500 hover:text-teal-700 hover:bg-pink-50/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isDiscoverTab && loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading courses...</p>
        </div>
      ) : isDiscoverTab && discoverLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading courses...</p>
        </div>
      ) : !isDiscoverTab && error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={fetchAll} className="mt-3 text-sm text-red-600 hover:underline">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="wait">
            {!tabData?.length ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-teal-50/50 to-pink-50/30 rounded-2xl border border-teal-200/60 p-8 sm:p-12 text-center"
              >
                <BookOpen className="w-14 h-14 sm:w-16 sm:h-16 text-teal-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">{tabEmptyMessage}</p>
                <p className="text-sm text-gray-500 mt-1">{tabEmptyHint}</p>
              </motion.div>
            ) : (
              tabData.map((course) => (
                <CourseCard
                  key={course._id || course.courseId}
                  course={course}
                  onClick={setSelectedCourse}
                  isJoined={activeTab === "joined"}
                  isDiscover={isDiscoverTab}
                  onJoin={isDiscoverTab ? handleJoinFromDiscover : undefined}
                  joinLoading={joinLoading}
                  isCreator={course.creatorId === currentStudentId}
                  currentStudentId={currentStudentId}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {showJoinModal && (
        <JoinCourseModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default SkillExchange;
