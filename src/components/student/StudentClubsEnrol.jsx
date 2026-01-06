import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckCircle, FiUsers, FiBookOpen } from "react-icons/fi";
import api from '../../services/api.jsx';
import EnrollmentModal from './EnrollmentModal.jsx';
import JoinedClubs from './JoinedClubs.jsx';
import { fetchClubs } from '../../features/shared/clubsSlice';

// Extract unique categories from clubs
const getCategories = (clubs) => {
  const cats = new Set();
  clubs.forEach(club => {
    // Try to infer category from clubName or use a default
    if (club.clubName) {
      const name = club.clubName.toLowerCase();
      if (name.includes('tech') || name.includes('code') || name.includes('ai') || name.includes('cyber') || name.includes('web')) {
        cats.add('Technology');
      } else if (name.includes('dance') || name.includes('music') || name.includes('drama') || name.includes('photo') || name.includes('literature')) {
        cats.add('Arts');
      } else if (name.includes('football') || name.includes('basketball') || name.includes('badminton') || name.includes('cricket') || name.includes('yoga')) {
        cats.add('Sports');
      } else {
        cats.add('Social');
      }
    }
  });
  return ["All", ...Array.from(cats)];
};

export default function StudentClubsEnrol() {
  const dispatch = useDispatch();
  const { clubs, loading: clubsLoading } = useSelector((state) => state.clubs);
  
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [banner, setBanner] = useState(null);
  const [activeTab, setActiveTab] = useState("explore"); // "explore" or "joined"

  const categories = useMemo(() => getCategories(clubs), [clubs]);

  // Fetch clubs on mount
  useEffect(() => {
    if (clubs.length === 0 && !clubsLoading) {
      dispatch(fetchClubs());
    }
  }, [dispatch, clubs.length, clubsLoading]);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const q = query.trim().toLowerCase();
      const clubName = (c.clubName || '').toLowerCase();
      const description = (c.description || '').toLowerCase();
      const byQ = !q || clubName.includes(q) || description.includes(q);
      // For now, we'll show all clubs if category is "All"
      const byCat = category === "All";
      return byCat && byQ;
    });
  }, [query, category, clubs]);

  // Load existing enrollments
  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const res = await api.get("/api/enrollments/alreadyenrolled");
        if (res.data?.ok && Array.isArray(res.data.clubsJoined)) {
          setEnrolledIds(new Set(res.data.clubsJoined.map((e) => e.clubId)));
        }
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      }
    };
    loadEnrollments();
  }, []);

  const openJoin = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClub(null);
  };

  const handleEnroll = async (role = "member") => {
    if (!selectedClub) return;

    const clubId = selectedClub.clubId || selectedClub.id;
    
    // Optimistically mark as enrolled
    setEnrolledIds((prev) => new Set([...Array.from(prev), clubId]));
    closeModal();
    setLoadingId(clubId);

    try {
      const res = await api.post("/api/enrollments", {
        clubId,
        role,
        amountPaid: 0, // Default amount, can be updated later
      });

      if (res.data?.ok) {
        setBanner({ type: "success", message: `Successfully enrolled in ${selectedClub.clubName || selectedClub.name}!` });
      } else {
        throw new Error(res.data?.message || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      // Revert optimistic update
      setEnrolledIds((prev) => {
        const updated = new Set(prev);
        updated.delete(clubId);
        return updated;
      });
      setBanner({ 
        type: "error", 
        message: err.response?.data?.message || err.message || "Failed to enroll. Please try again." 
      });
    } finally {
      setLoadingId(null);
      setTimeout(() => setBanner(null), 3000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Explore & Join Clubs
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Discover communities to learn, collaborate, and grow!
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("explore")}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "explore"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <FiSearch className="w-4 h-4" />
            Explore Clubs
          </span>
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "joined"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <FiBookOpen className="w-4 h-4" />
            Joined Clubs
          </span>
        </button>
      </div>

      {/* Banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 rounded-lg px-4 py-3 text-sm shadow-md ${
              banner.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {banner.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Content */}
      {activeTab === "joined" ? (
        <JoinedClubs />
      ) : (
        <>
          {/* Search & Category Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clubs by name or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {clubsLoading && clubs.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading clubs...</p>
        </div>
      )}

      {/* Club Cards Grid */}
      {!clubsLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="wait">
            {filtered.map((club, index) => {
              const clubId = club.clubId || club.id;
              const isEnrolled = enrolledIds.has(clubId);
              const isLoading = loadingId === clubId;
            return (
              <motion.div
                key={clubId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Club Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={club.imageUrl || club.img || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"}
                    alt={club.clubName || club.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {club.amounttojoin > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gray-700 shadow-md">
                      ₹{club.amounttojoin}
                    </span>
                  )}
                  {isEnrolled && (
                    <div className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-1 flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">Enrolled</span>
                    </div>
                  )}
                </div>

                {/* Club Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{club.clubName || club.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {club.description || "Join a vibrant community to learn, lead, and grow with peers."}
                  </p>
                  
                  {/* Action Button */}
                  <button
                    disabled={isLoading || isEnrolled}
                    onClick={() => !isEnrolled && openJoin(club)}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      isEnrolled
                        ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                        : isLoading
                        ? "bg-blue-400 text-white cursor-wait"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Processing...
                      </span>
                    ) : isEnrolled ? (
                      <span className="inline-flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" />
                        Enrolled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        Join Club
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No clubs found matching your search.</p>
        </motion.div>
      )}

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={showModal}
        club={selectedClub}
        onClose={closeModal}
        onConfirm={handleEnroll}
        isLoading={loadingId === selectedClub?.id}
      />
        </>
      )}
    </div>
  );
}
