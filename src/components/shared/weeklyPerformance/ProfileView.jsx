import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  ArrowLeft, Award, Briefcase, Loader2, Sparkles, Star,
  ChevronDown, ChevronUp, MapPin,
} from "lucide-react";
import api from "../../../services/api";
import PageContainer from "../PageContainer";
import ComparePanel from "./ComparePanel.jsx";

const ProfileView = ({ profile, onBack, myStudent }) => {
  const p = profile;
  const userRole = Cookies.get("userRole");
  const isStudentViewer = userRole === "student";
  const isOtherStudent = isStudentViewer && Boolean(
    myStudent &&
      p.studentid !== (myStudent?.studentid || myStudent?.studentId)
  );
  const [showCompare, setShowCompare] = useState(false);
  const [myFullProfile, setMyFullProfile] = useState(null);
  const [loadingMyProfile, setLoadingMyProfile] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [extraOpen, setExtraOpen] = useState(true);

  const handleOpenCompare = async () => {
    const myId = myStudent?.studentid || myStudent?.studentId;
    if (!myId) return;
    setLoadingMyProfile(true);
    try {
      const { data } = await api.get(`/api/students/profile/${myId}`);
      setMyFullProfile(data?.data ?? null);
    } catch {
      setMyFullProfile(myStudent);
    } finally {
      setLoadingMyProfile(false);
      setShowCompare(true);
    }
  };

  const STATS = [
    { label: "Weighted", val: p.weightedPoints, color: "#f59e0b" },
    { label: "Teaching", val: p.teachingPoints, color: "#38bdf8" },
    { label: "Projects", val: p.projectsPoints, color: "#34d399" },
    { label: "Extra Curr.", val: p.extraCurricularPoints, color: "#a78bfa" },
    { label: "Co-Curr.", val: p.coCurricularPoints, color: "#fb7185" },
    { label: "Prob. Solv.", val: p.problemSolvingRank, color: "#fbbf24" },
  ];

  return (
    <>
      <style>{`
        @keyframes profileSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-animate {
          animation: profileSlideIn 0.35s ease forwards;
        }
        @keyframes badgePop {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .badge-pop {
          animation: badgePop 0.4s ease forwards;
        }
      `}</style>

      <PageContainer>
        <div className="profile-animate">
          {/* Back + Compare button */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-500 hover:text-slate-800 transition-colors group py-2"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            {isOtherStudent && (
              <button
                type="button"
                onClick={handleOpenCompare}
                disabled={loadingMyProfile}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-white text-sm sm:text-base font-semibold bg-slate-700 hover:bg-slate-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loadingMyProfile ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                Compare & Analyze
              </button>
            )}
          </div>

          {/* Main card */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            {/* Hero header */}
            <div
              className="relative px-6 py-8 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
              />

              <div className="relative flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 ring-2 ring-white/20 shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #1e293b, #334155)" }}
                >
                  {p.profilePic ? (
                    <img src={p.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-slate-300">
                      {(p.fullname || "?")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white tracking-tight">{p.fullname}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {p.programName && (
                      <span className="text-xs sm:text-sm font-medium text-slate-200 bg-slate-600/60 border border-slate-500/40 px-2.5 py-1 rounded-lg">
                        {p.programName}
                      </span>
                    )}
                    {p.dept && (
                      <span className="text-xs text-slate-400">{p.dept}</span>
                    )}
                    {p.country && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {p.country}
                      </span>
                    )}
                  </div>
                  {p.email && (
                    <p className="text-slate-400 text-sm mt-1">{p.email}</p>
                  )}
                  {typeof p.stars === "number" && (
                    <div className="flex items-center gap-1 mt-2.5">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 transition-colors ${
                            i < Math.round(p.stars)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-black text-white ml-1.5">
                        {Number(p.stars).toFixed(1)}
                        <span className="text-slate-400 font-normal">/10</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-slate-100 bg-white">
              {STATS.map(({ label, val, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-4 px-2 border-r border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors"
                >
                  <span
                    className="text-lg font-black"
                    style={{ color }}
                  >
                    {val ?? 0}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 text-center leading-tight mt-0.5 uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Content: skills + compare CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-white">
              {/* Left: sections */}
              <div className="p-5 space-y-4">
                {/* Skills */}
                {p.skillsSection && (
                  <div>
                    <button
                      className="w-full flex items-center justify-between gap-2 mb-2 group"
                      onClick={() => setSkillsOpen((v) => !v)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">Skills</span>
                      </div>
                      {skillsOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      )}
                    </button>

                    {skillsOpen && (
                      <div className="space-y-3 pl-2">
                        {p.skillsSection.certifications?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                              Certifications
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {p.skillsSection.certifications.map((c, i) => (
                                <span
                                  key={i}
                                  className="badge-pop text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium"
                                >
                                  {c.title}{c.type && ` · ${c.type}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.skillsSection.workshops?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                              Workshops
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {p.skillsSection.workshops.map((w, i) => (
                                <span
                                  key={i}
                                  className="badge-pop text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium"
                                >
                                  {w.title}{w.type && ` · ${w.type}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.skillsSection.projects?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                              Projects
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {p.skillsSection.projects.map((pr, i) => (
                                <span
                                  key={i}
                                  className="badge-pop text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium"
                                >
                                  {pr.title}{pr.type && ` · ${pr.type}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {!p.skillsSection.certifications?.length &&
                          !p.skillsSection.workshops?.length &&
                          !p.skillsSection.projects?.length && (
                            <p className="text-sm text-slate-500">No skills listed</p>
                          )}
                      </div>
                    )}
                  </div>
                )}

                {/* Extra Curricular */}
                {p.extraCurricularSection && (
                  <div>
                    <button
                      className="w-full flex items-center justify-between gap-2 mb-2 group"
                      onClick={() => setExtraOpen((v) => !v)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                          Extra Curricular
                        </span>
                      </div>
                      {extraOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      )}
                    </button>

                    {extraOpen && (
                      <div className="space-y-3 pl-2">
                        {p.extraCurricularSection.clubs?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Clubs</p>
                            <div className="flex flex-wrap gap-2">
                              {p.extraCurricularSection.clubs.map((c, i) => (
                                <span key={i} className="text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium">
                                  {c.clubName}{c.title && ` – ${c.title}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.extraCurricularSection.internships?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Internships</p>
                            <div className="flex flex-wrap gap-2">
                              {p.extraCurricularSection.internships.map((item, i) => (
                                <span key={i} className="text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium">
                                  {item.organization} – {item.role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.extraCurricularSection.others?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Others</p>
                            <div className="flex flex-wrap gap-2">
                              {p.extraCurricularSection.others.map((o, i) => (
                                <span key={i} className="text-xs sm:text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium">
                                  {o.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {!p.extraCurricularSection.clubs?.length &&
                          !p.extraCurricularSection.internships?.length &&
                          !p.extraCurricularSection.others?.length && (
                            <p className="text-sm text-slate-500">No extra curricular entries</p>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Compare CTA */}
              <div className="p-5 flex items-center justify-center">
                {isOtherStudent ? (
                  <div className="w-full rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-4 border border-slate-200 bg-slate-50">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-slate-700">
                      <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-slate-800">
                        Compare with your profile
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        See where you stand and get tips to improve your score
                      </p>
                    </div>
                    <button
                      onClick={handleOpenCompare}
                      disabled={loadingMyProfile}
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white text-sm sm:text-base font-semibold bg-slate-700 hover:bg-slate-600 shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                      {loadingMyProfile ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      Analyze & Compare
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-slate-500">This is your profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showCompare && (
          <ComparePanel
            myStudent={myFullProfile || myStudent}
            otherStudent={p}
            onClose={() => setShowCompare(false)}
          />
        )}
      </PageContainer>
    </>
  );
};

export default ProfileView;