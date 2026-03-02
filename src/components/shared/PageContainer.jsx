import React from "react";

/**
 * Shared Page Container Component
 * Consistent layout wrapper with subtle background animation and responsive spacing.
 */
const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`relative flex flex-col w-full min-h-0 ${className}`}>
      {/* Subtle animated background gradient */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03] sm:opacity-[0.04]"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, #6366f1, transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, #06b6d4, transparent),
            radial-gradient(ellipse 50% 50% at 50% 50%, #8b5cf6, transparent)
          `,
          animation: "pageBgPulse 12s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes pageBgPulse {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
      <div className="flex flex-col flex-1 min-h-0 gap-4 sm:gap-5 md:gap-6 w-full transition-opacity duration-500 ease-out">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;

