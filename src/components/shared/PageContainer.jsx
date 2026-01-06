import React from "react";

/**
 * Shared Page Container Component
 * Consistent layout wrapper for dashboard pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.className - Additional CSS classes
 */
const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col gap-6 w-full transition-opacity duration-500 ease-out animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;

