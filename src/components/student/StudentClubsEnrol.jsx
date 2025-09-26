import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import api from '../../services/api';

const CLUBS = [
  { id: "tech-coders", name: "Tech Coders", category: "Technology", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" },
  { id: "ai-ml", name: "AI & ML Society", category: "Technology", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
  { id: "robotics", name: "Robotics Club", category: "Technology", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80" },
  { id: "cybersec", name: "Cybersecurity", category: "Technology", img: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80" },
  { id: "web-dev", name: "Web Dev Guild", category: "Technology", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" },

  { id: "dance", name: "Dance Crew", category: "Arts", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80" },
  { id: "music", name: "Music Society", category: "Arts", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80" },
  { id: "drama", name: "Drama Club", category: "Arts", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80" }, // 🎭 fixed
  { id: "photography", name: "Photography", category: "Arts", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80" },
  { id: "literature", name: "Literature", category: "Arts", img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=80" },

  { id: "football", name: "Football", category: "Sports", img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80" },
  { id: "basketball", name: "Basketball", category: "Sports", img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80" },
  { id: "badminton", name: "Badminton", category: "Sports", img: "https://images.unsplash.com/photo-1599058917212-d750089bc07c?auto=format&fit=crop&w=1200&q=80" }, // 🏸 fixed
  { id: "cricket", name: "Cricket", category: "Sports", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80" },
  { id: "yoga", name: "Yoga & Wellness", category: "Sports", img: "https://images.unsplash.com/photo-1593810450967-f9c42742e326?auto=format&fit=crop&w=1200&q=80" },

  { id: "eco", name: "Eco & Sustainability", category: "Social", img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80" },
  { id: "community", name: "Community Service", category: "Social", img: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=1200&q=80" },
  { id: "entrepreneur", name: "Entrepreneurship", category: "Social", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" },
  { id: "debate", name: "Debate Society", category: "Social", img: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=80" },
  { id: "language", name: "Language Exchange", category: "Social", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80" },
];


const categories = ["All", "Technology", "Arts", "Sports", "Social"];

const initialForm = {
  name: "",
  regno: "",
  branch: "",
  section: "",
  dept: "",
  phone: "",
  email: "",
};

export default function StudentClubsEnrol() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [banner, setBanner] = useState(null);

  const filtered = useMemo(() => {
    return CLUBS.filter((c) => {
      const q = query.trim().toLowerCase();
      const byCat = category === "All" || c.category === category;
      const byQ = !q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      return byCat && byQ;
    });
  }, [query, category]);

  // Load existing enrollments
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;
    (async () => {
      try {
        const res = await api.get("/api/enrollments/alreadyenrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.data;
        if (data?.ok && Array.isArray(data.enrollments)) {
          setEnrolledIds(new Set(data.enrollments.map((e) => e.clubId)));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const openJoin = (club) => {
    setSelectedClub(club);
    setForm(initialForm);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClub(null);
    setForm(initialForm);
    setFormError("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const required = ["name", "regno", "branch", "section", "dept", "phone", "email"];
    for (const k of required) {
      if (!form[k]?.trim()) {
        setFormError(`Please fill ${k.toUpperCase()}.`);
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError("Please enter a valid email.");
      return false;
    }
    if (!/^[0-9+\-()\s]{7,}$/.test(form.phone)) {
      setFormError("Please enter a valid phone number.");
      return false;
    }
    setFormError("");
    return true;
  };

  // Optimistic submit: close modal immediately
  const submitJoin = async () => {
    if (!selectedClub) return;
    if (!validate()) return;

    const token = Cookies.get("token");
    if (!token) {
      setFormError("Missing token cookie. Please sign in or set token.");
      return;
    }

    // Optimistically mark as enrolled and close modal
    setEnrolledIds((prev) => new Set([...Array.from(prev), selectedClub.id]));
    closeModal();
    setLoadingId(selectedClub.id);

    try {
      const res = await api.post("/api/enrollments", {
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, clubId: selectedClub.id, clubName: selectedClub.name }),
      });
      const data = await res.data;
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Failed to enroll");

      // Success banner
      setBanner({ type: "success", message: `Enrolled in ${selectedClub.name}` });
    } catch (err) {
      console.error(err);
      // Revert if API fails
      setEnrolledIds((prev) => {
        const updated = new Set(prev);
        updated.delete(selectedClub.id);
        return updated;
      });
      setBanner({ type: "error", message: err.message || "Enrollment failed" });
    } finally {
      setLoadingId(null);
      setTimeout(() => setBanner(null), 2500);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Explore & Join Clubs</h1>
        <p className="mt-2 text-gray-600">Discover communities to learn, collaborate, and grow!</p>
      </div>

      {banner && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm shadow transition-all ${
            banner.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {banner.message}
        </div>
      )}

      {/* Search & Category */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clubs..."
          className="flex-1 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-gray-300 focus:shadow-md transition"
        />
        <div className="flex gap-2 overflow-x-auto mt-2 sm:mt-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-sm transition ${
                category === c ? "bg-black text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Club Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((club) => {
          const isEnrolled = enrolledIds.has(club.id);
          const isLoading = loadingId === club.id;
          return (
            <div
              key={club.id}
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={club.img}
                  alt={club.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-70" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow">
                  {club.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{club.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  Join a vibrant community to learn, lead, and grow with peers.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    disabled={isLoading || isEnrolled}
                    onClick={() => openJoin(club)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                      isEnrolled
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                        : "bg-black text-white hover:bg-black/90 shadow-md"
                    } ${isLoading ? "opacity-80" : ""}`}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Processing...
                      </span>
                    ) : isEnrolled ? (
                      "Enrolled"
                    ) : (
                      "Join"
                    )}
                  </button>
                  {isEnrolled && <span className="text-xs text-emerald-600">You’re in</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="relative h-28 w-full">
              <img
                src={selectedClub.img}
                alt={selectedClub.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl font-semibold text-white">{selectedClub.name}</h3>
                <p className="text-xs text-white/80">Fill your details to join</p>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {formError && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="name" label="Full Name" value={form.name} onChange={onChange} />
                <Input name="regno" label="Reg No" value={form.regno} onChange={onChange} />
                <Input name="branch" label="Branch" value={form.branch} onChange={onChange} />
                <Input name="section" label="Section" value={form.section} onChange={onChange} />
                <Input name="dept" label="Department" value={form.dept} onChange={onChange} />
                <Input name="phone" label="Phone" value={form.phone} onChange={onChange} />
                <Input name="email" label="Email" type="email" value={form.email} onChange={onChange} />
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitJoin}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-300 focus:shadow-md"
        placeholder={label}
        autoComplete="off"
      />
    </label>
  );
}
