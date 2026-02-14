import React from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';

export default function Filters({
  selectedDepartment,
  selectedSemester,
  selectedSection,
  departments,
  availableSections,
  sectionsLoading,
  onDepartmentChange,
  onSemesterChange,
  onSectionChange,
  onClear,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        {(selectedDepartment || selectedSemester || selectedSection) && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiX className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm font-medium shadow-sm hover:shadow-md"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.department} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
        </div>

        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Semester (Optional)
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => onSemesterChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm font-medium shadow-sm hover:shadow-md"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Section (Optional)
            </label>
            <select
              value={selectedSection}
              onChange={(e) => onSectionChange(e.target.value)}
              disabled={sectionsLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Sections</option>
              {sectionsLoading ? (
                <option value="" disabled>Loading sections...</option>
              ) : (
                availableSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))
              )}
            </select>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

