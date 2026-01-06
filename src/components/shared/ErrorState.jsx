import React from "react";
import { XCircle, RefreshCw } from "lucide-react";

/**
 * Shared Error State Component
 * Reusable error display with retry functionality
 * 
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Retry callback function
 * @param {string} props.title - Custom error title (optional)
 * @param {string} props.className - Additional CSS classes
 */
const ErrorState = ({ 
  message, 
  onRetry, 
  title = "Error",
  className = "" 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-2xl p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;

