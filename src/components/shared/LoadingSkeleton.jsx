import React from "react";

/**
 * Shared Loading Skeleton Component
 * Reusable loading states for various content types
 * 
 * @param {Object} props
 * @param {string} props.type - Type of skeleton: 'card', 'list', 'grid', 'banner', 'stats'
 * @param {number} props.count - Number of skeleton items to render
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSkeleton = ({ 
  type = "card", 
  count = 1, 
  className = "" 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            {[...Array(count)].map((_, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-3 last:border-none animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        );

      case "grid":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(count)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow animate-pulse"
              >
                <div className="w-7 h-7 bg-gray-200 rounded"></div>
                <div className="w-8 h-6 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        );

      case "banner":
        return (
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
        );

      case "stats":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        );
    }
  };

  return <div className={className}>{renderSkeleton()}</div>;
};

export default LoadingSkeleton;

