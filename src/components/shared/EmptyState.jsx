import React from "react";
import { FileText, Inbox } from "lucide-react";

/**
 * Shared Empty State Component
 * Reusable empty state display
 * 
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {string} props.message - Description message
 * @param {React.ReactNode} props.icon - Custom icon component (optional)
 * @param {React.ReactNode} props.action - Action button/component (optional)
 * @param {string} props.className - Additional CSS classes
 */
const EmptyState = ({ 
  title = "No Data", 
  message = "No items found at the moment.",
  icon,
  action,
  className = "" 
}) => {
  const DefaultIcon = icon || FileText;

  return (
    <div className={`bg-white rounded-2xl shadow p-12 text-center ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {typeof DefaultIcon === "function" ? (
          <DefaultIcon className="w-10 h-10 text-gray-400" />
        ) : (
          DefaultIcon
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;

