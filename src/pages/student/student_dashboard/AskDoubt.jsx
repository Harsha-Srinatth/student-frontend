import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, MessageCircle, Search, Loader2, Inbox, RefreshCw } from "lucide-react";
import { fetchDoubts, deleteDoubt } from "../../../features/student/doubtsSlice";
import socketService from "../../../services/socketService";
import DoubtCard from "../../../components/student/doubts/DoubtCard";
import CreateDoubtModal from "../../../components/student/doubts/CreateDoubtModal";

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef(null);
  const hasFetched = useRef(false);

  // Fetch once on mount
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchDoubts({ page: 1, limit: 20 }));
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Join/leave college socket room for real-time events
  // Uses emitWhenReady so the join is queued if socket hasn't connected yet
  useEffect(() => {
    if (!collegeId) return;
    socketService.emitWhenReady("doubt:joinCollege", collegeId);
    return () => {
      socketService.emit("doubt:leaveCollege", collegeId);
    };
  }, [collegeId]);

  // Infinite scroll
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
      if (window.confirm("Are you sure you want to delete this doubt?")) {
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

  // Filter by search (memoized)
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

  const hasMore = hasMoreMy || hasMoreCollege;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={26} className="text-blue-600" />
            Ask Doubt
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Post doubts &amp; get answers from your college peers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600"
            title="Refresh"
          >
            <RefreshCw size={18} className={feedLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600
                       text-white font-semibold px-4 py-2.5 rounded-xl
                       hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-lg shadow-blue-200"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Ask Doubt</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doubts by title, description, or tag..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent
                     placeholder:text-gray-400"
        />
      </div>

      {/* Error */}
      {feedError && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{feedError}</p>
          <button onClick={handleRefresh} className="text-blue-600 font-medium text-sm hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Skeleton */}
      {feedLoading && !feedError && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Feed */}
      {!feedLoading && !feedError && (
        <div className="space-y-6">
          {/* My Doubts */}
          {filteredMy.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                My Doubts ({filteredMy.length})
              </h2>
              <div className="space-y-3">
                {filteredMy.map((doubt) => (
                  <DoubtCard key={doubt._id} doubt={doubt} onClick={handleDoubtClick} onDelete={handleDeleteDoubt} isMine />
                ))}
              </div>
            </section>
          )}

          {/* College Doubts */}
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              College Doubts ({filteredCollege.length})
            </h2>
            {filteredCollege.length === 0 && filteredMy.length === 0 ? (
              <div className="text-center py-16">
                <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-1">No doubts yet</h3>
                <p className="text-sm text-gray-400 mb-4">Be the first to ask a doubt in your college!</p>
                <button onClick={() => setShowCreateModal(true)} className="text-blue-600 font-semibold text-sm hover:underline">
                  + Ask a Doubt
                </button>
              </div>
            ) : filteredCollege.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No college doubts match your search.</p>
            ) : (
              <div className="space-y-3">
                {filteredCollege.map((doubt) => (
                  <DoubtCard key={doubt._id} doubt={doubt} onClick={handleDoubtClick} isMine={false} />
                ))}
              </div>
            )}
          </section>

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              {feedLoadingMore && <Loader2 size={24} className="animate-spin text-blue-500" />}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <CreateDoubtModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default AskDoubt;
