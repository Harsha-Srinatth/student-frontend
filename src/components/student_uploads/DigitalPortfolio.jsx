import React from "react";
import DownloadPortfolio from "./DownloadPdf";
import BackgroundBlobs from "../BackgroundBlobs";

const StudentDigitalPortfolio = () => {
  const studentid = "24B91A5712";

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-indigo-50 via-cyan-50 to-white overflow-hidden">
      <BackgroundBlobs />
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-900">
              Your Digital Portfolio
            </h1>
            <p className="mt-3 text-base sm:text-lg md:text-xl text-indigo-700/80">
              A smart, shareable resume generated from your verified activities and academic journey.
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2">
              <div className="group relative overflow-hidden rounded-3xl border border-indigo-200/50 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-slideInLeft">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-cyan-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h2 className="text-lg sm:text-xl font-bold text-indigo-900">What is this portfolio?</h2>
                <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                  This digital portfolio compiles your latest achievements, verified activities, attendance, credits,
                  and recognitions into a clean, professional resume-like document.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FeatureCard icon="📚" title="Academics" desc="Semester credits and performance summary" />
                  <FeatureCard icon="🏅" title="Achievements" desc="Awards, competitions, and certificates" />
                  <FeatureCard icon="🧩" title="Activities" desc="Clubs, events, projects and contributions" />
                  <FeatureCard icon="✅" title="Verified by Faculty" desc="Only approved, trusted entries are shown" />
                </div>
              </div>
            </div>

            {/* Quick meta card */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-200/50 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-slideInRight">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-200/50 to-cyan-200/50 blur-3xl" />
              <div className="relative">
                <h3 className="text-sm uppercase tracking-wider text-indigo-500">Student ID</h3>
                <p className="mt-1 text-lg sm:text-xl font-semibold text-indigo-900 select-all">{studentid}</p>
                <div className="mt-4 space-y-2 text-sm text-indigo-700/80">
                  <p className="flex items-center gap-2"><span className="text-base">⚡</span> Real-time data from your dashboard</p>
                  <p className="flex items-center gap-2"><span className="text-base">📝</span> Polished layout ready for sharing</p>
                  <p className="flex items-center gap-2"><span className="text-base">🔒</span> Only approved items are included</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview note */}
          <div className="mt-8">
            <div className="rounded-2xl border border-dashed border-indigo-200/50 p-5 text-indigo-700/80 bg-white/60 backdrop-blur-sm">
              <p className="text-sm sm:text-base">
                The portfolio will automatically include your most recent activities and approved achievements. Click the button below to generate your latest version.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 z-10 border-t border-indigo-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-indigo-700 text-sm sm:text-base">
            Ready to share? Generate your resume-style digital portfolio.
          </div>
          <div className="flex items-center justify-end">
            <div className="transform transition-all duration-300 hover:scale-[1.05]">
              <DownloadPortfolio studentid={studentid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-indigo-200/50 bg-white/70 backdrop-blur-sm p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-cyan-50/60 animate-fadeIn">
    <div className="flex items-start gap-3">
      <div className="text-2xl sm:text-3xl select-none animate-pulse">{icon}</div>
      <div>
        <p className="font-semibold text-indigo-900 text-sm sm:text-base">{title}</p>
        <p className="mt-1 text-xs sm:text-sm text-indigo-700/80">{desc}</p>
      </div>
    </div>
  </div>
);

export default StudentDigitalPortfolio;
