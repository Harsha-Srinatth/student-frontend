import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, MessageCircle, Search, Loader2, Inbox, RefreshCw, User, Users } from "lucide-react";
import { fetchDoubts, deleteDoubt } from "../../../features/student/doubtsSlice";
import socketService from "../../../services/socketService";
import DoubtCard from "../../../components/student/doubts/DoubtCard";
import CreateDoubtModal from "../../../components/student/doubts/CreateDoubtModal";
import { DOUBT_COLORS, DOUBT_ANIMATION } from "../../../components/student/doubts/doubtTheme";

const SkeletonCard = () => (
  <div className={`${DOUBT_COLORS.cardBg} border ${DOUBT_COLORS.border} rounded-2xl p-4 animate-pulse`}>
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-[#E8E4DE]" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-[#E8E4DE] rounded" />
          <div className="h-4 w-14 bg-[#E8E4DE] rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-[#E8E4DE] rounded" />
        <div className="h-4 w-full bg-[#EDE8E2] rounded" />
        <div className="h-4 w-2/3 bg-[#EDE8E2] rounded" />
      </div>
    </div>
  </div>
);

const TAB_MY = "my";
const TAB_COLLEGE = "college";

const AskDoubt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    myDoubts,
    collegeDoubts,
    feedLoading,
    feedLoadingMore,
    feedError,
    hasMoreMy,
    hasMoreCollege,
    myDoubtsPage,
  } = useSelector((state) => state.doubts);

  const collegeId = useSelector((state) => state.studentDashboard.student?.collegeId);

  const [activeTab, setActiveTab] = useState(TAB_MY);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchDoubts({ page: 1, limit: 20 }));
      hasFetched.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!collegeId) return;
    socketService.emitWhenReady("doubt:joinCollege", collegeId);
    return () => {
      socketService.emit("doubt:leaveCollege", collegeId);
    };
  }, [collegeId]);

  const pageRef = useRef(myDoubtsPage);
  pageRef.current = myDoubtsPage;
  const loadingRef = useRef(false);
  loadingRef.current = feedLoadingMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          dispatch(fetchDoubts({ page: pageRef.current + 1, limit: 20 }));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  const handleDoubtClick = useCallback(
    (doubtId) => navigate(`/student/ask/doubt/${doubtId}`),
    [navigate]
  );

  const handleDeleteDoubt = useCallback(
    (doubtId) => {
      if (window.confirm("Are you sure you want to delete this doubt? This cannot be undone.")) {
        dispatch(deleteDoubt({ doubtId }));
      }
    },
    [dispatch]
  );

  const handleRefresh = useCallback(() => {
    hasFetched.current = false;
    dispatch(fetchDoubts({ page: 1, limit: 20 }));
    hasFetched.current = true;
  }, [dispatch]);

  const filteredMy = useMemo(() => {
    if (!searchQuery.trim()) return myDoubts;
    const q = searchQuery.toLowerCase();
    return myDoubts.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
    );
  }, [myDoubts, searchQuery]);

  const filteredCollege = useMemo(() => {
    if (!searchQuery.trim()) return collegeDoubts;
    const q = searchQuery.toLowerCase();
    return collegeDoubts.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
    );
  }, [collegeDoubts, searchQuery]);

  const hasMore = activeTab === TAB_MY ? hasMoreMy : hasMoreCollege;
  const displayList = activeTab === TAB_MY ? filteredMy : filteredCollege;

  return (
    <div className={`w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-screen ${DOUBT_COLORS.pageBg} px-3 sm:px-4 py-4 md:py-6 bg-green-50`}>
      {/* Header */}
      <header className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${DOUBT_COLORS.textPrimary} flex items-center gap-2`}>
              <span className={`p-1.5 rounded-xl ${DOUBT_COLORS.primarySubtle}`}>
                <MessageCircle size={24} className="text-[#8B7355]" strokeWidth={1.8} />
              </span>
              Ask Doubt
            </h1>
            <p className={`text-sm ${DOUBT_COLORS.textMuted} mt-1`}>
              Post doubts and get answers from your college peers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2.5 ${DOUBT_COLORS.primarySubtle} rounded-xl ${DOUBT_COLORS.textSecondary} hover:bg-[#E0DAD2] transition-colors duration-200`}
              title="Refresh"
              aria-label="Refresh doubts"
            >
              <RefreshCw size={18} className={feedLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 ${DOUBT_COLORS.primary} ${DOUBT_COLORS.textOnBrown} font-semibold px-4 py-2.5 rounded-xl shadow-md ${DOUBT_COLORS.primaryHover} ${DOUBT_ANIMATION.buttonPress}`}
            >
              <Plus size={18} strokeWidth={2.2} />
              <span className="hidden sm:inline">Ask Doubt</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8782]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, description or tag..."
          className={`w-full pl-10 pr-4 py-2.5 border ${DOUBT_COLORS.border} rounded-xl text-sm ${DOUBT_COLORS.inputBg} placeholder:text-[#8C8782] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all duration-200`}
          aria-label="Search doubts"
        />
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl p-1 bg-[#EDE8E2] mb-5 overflow-hidden">
        <button
          type="button"
          onClick={() => setActiveTab(TAB_MY)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === TAB_MY ? DOUBT_COLORS.tabActive : DOUBT_COLORS.tabInactive
          }`}
        >
          <User size={18} />
          <span>My Doubts</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === TAB_MY ? "bg-white/20" : "bg-[#E0DAD2] text-[#5C564D]"}`}>
            {filteredMy.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_COLLEGE)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === TAB_COLLEGE ? DOUBT_COLORS.tabActive : DOUBT_COLORS.tabInactive
          }`}
        >
          <Users size={18} />
          <span>College</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === TAB_COLLEGE ? "bg-white/20" : "bg-[#E0DAD2] text-[#5C564D]"}`}>
            {filteredCollege.length}
          </span>
        </button>
      </div>

      {/* Error */}
      {feedError && (
        <div className="text-center py-8 rounded-xl bg-white border border-[#E8E4DE] px-4">
          <p className={DOUBT_COLORS.error + " mb-2"}>{feedError}</p>
          <button onClick={handleRefresh} className="text-[#8B7355] font-medium text-sm hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Skeleton */}
      {feedLoading && !feedError && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Feed */}
      {!feedLoading && !feedError && (
        <div className="space-y-3">
          {displayList.length === 0 ? (
            <div className={`text-center py-12 sm:py-16 rounded-2xl ${DOUBT_COLORS.cardBg} border ${DOUBT_COLORS.border}`}>
              <Inbox size={48} className="mx-auto text-[#C4B5A0] mb-4" />
              <h3 className={`text-lg font-semibold ${DOUBT_COLORS.textSecondary} mb-1`}>
                {activeTab === TAB_MY ? "No doubts from you yet" : "No college doubts yet"}
              </h3>
              <p className={`text-sm ${DOUBT_COLORS.textMuted} mb-4`}>
                {activeTab === TAB_MY
                  ? "Ask a doubt to get help from your peers."
                  : "Be the first to ask a doubt in your college!"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`${DOUBT_COLORS.primary} ${DOUBT_COLORS.textOnBrown} font-semibold text-sm px-4 py-2 rounded-xl ${DOUBT_COLORS.primaryHover} ${DOUBT_ANIMATION.buttonPress}`}
              >
                + Ask a Doubt
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayList.map((doubt) => (
                  <DoubtCard
                      doubt={doubt}
                      onClick={handleDoubtClick}
                      onDelete={activeTab === TAB_MY ? handleDeleteDoubt : undefined}
                      isMine={activeTab === TAB_MY}
                    />
                ))}
              </div>
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                  {feedLoadingMore && (
                    <Loader2 size={24} className="animate-spin text-[#8B7355]" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <CreateDoubtModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default AskDoubt;
