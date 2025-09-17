import React from "react";
import DownloadPortfolio from "./DownloadPdf";
import BackgroundBlobs from "../BackgroundBlobs";

const StudentDigitalPortfolio = () => {
  const studentid = "24B91A5712"; // test with your DB studentid

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <BackgroundBlobs />
      {/* Content */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-500 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Your Digital Portfolio
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
              A smart, shareable resume generated from your verified activities and academic journey.
            </p>
          </div>

          {/* What is this section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="md:col-span-2">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-transparent to-cyan-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  What is this portfolio?
                </h2>
                <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                  This digital portfolio compiles your latest achievements, verified activities, attendance, credits,
                  and recognitions into a clean, professional resume-like document. You can download it as a PDF and
                  share it with recruiters, mentors, or on social profiles.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FeatureCard icon="📚" title="Academics" desc="Semester credits and performance summary" />
                  <FeatureCard icon="🏅" title="Achievements" desc="Awards, competitions, and certificates" />
                  <FeatureCard icon="🧩" title="Activities" desc="Clubs, events, projects and contributions" />
                  <FeatureCard icon="✅" title="Verified by Faculty" desc="Only approved, trusted entries are shown" />
                </div>
              </div>
            </div>

            {/* Quick meta card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slideInRight">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl" />
              <div className="relative">
                <h3 className="text-sm uppercase tracking-wider text-gray-500">Student ID</h3>
                <p className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 select-all">
                  {studentid}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><span className="text-base">⚡</span> Real-time data from your dashboard</p>
                  <p className="flex items-center gap-2"><span className="text-base">📝</span> Polished layout ready for sharing</p>
                  <p className="flex items-center gap-2"><span className="text-base">🔒</span> Only approved items are included</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview note */}
          <div className="mt-6 sm:mt-8">
            <div className="rounded-xl border border-dashed border-gray-300/80 p-4 sm:p-6 text-gray-600 bg-white/70">
              <p className="text-sm sm:text-base">
                The portfolio will automatically include your most recent activities and approved achievements. Click the button below to generate your latest version.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-gray-700 text-sm sm:text-base">
              Ready to share? Generate your resume-style digital portfolio.
            </div>
            <div className="flex items-center justify-end">
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <DownloadPortfolio studentid={studentid} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="text-xl sm:text-2xl select-none" aria-hidden="true">{icon}</div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{title}</p>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">{desc}</p>
      </div>
    </div>
  </div>
);

export default StudentDigitalPortfolio;
