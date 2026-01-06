import React from "react";

/**
 * Shared Welcome Banner Component
 * Used across student and faculty dashboards
 * 
 * @param {Object} props
 * @param {string} props.name - User's name to display
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {string} props.greeting - Custom greeting text (optional)
 * @param {string} props.description - Description text below greeting
 * @param {string} props.emoji - Emoji to display (default: 👋)
 * @param {string} props.gradient - Custom gradient classes (optional)
 */
const WelcomeBanner = ({
  name,
  loading = false,
  error = null,
  greeting = "Welcome back",
  description = "Here's a quick overview of your activity.",
  emoji = "👋",
  gradient = "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600",
}) => {
  const loadingGradient =
    "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500";

  if (loading) {
    return (
      <section
        className={`${loadingGradient} p-6 text-white rounded-2xl shadow-lg transition-all animate-pulse`}
      >
        <div className="h-8 bg-white/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`${loadingGradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
      >
        <h2 className="text-2xl font-bold text-red-200">
          Error: {error}
        </h2>
      </section>
    );
  }

  return (
    <section
      className={`${gradient} p-6 text-white rounded-2xl shadow-lg transition-all`}
    >
      <h2 className="text-2xl font-bold">
        {greeting}, {name || "User"} {emoji}
      </h2>
      <p className="mt-2 opacity-90">
        {description}
      </p>
    </section>
  );
};

export default WelcomeBanner;

