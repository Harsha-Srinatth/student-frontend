import { Check } from 'lucide-react';

/**
 * Year Filter Component
 * @param {Object} props
 * @param {number|null} selectedYear - Currently selected year
 * @param {Function} onYearChange - Callback when year changes
 */
export default function YearFilter({ selectedYear, onYearChange }) {
  const years = [
    { value: null, label: 'All Years' },
    { value: 1, label: '1st Year' },
    { value: 2, label: '2nd Year' },
    { value: 3, label: '3rd Year' },
    { value: 4, label: '4th Year' },
  ];

  return (
    <div className="flex items-center space-x-2 flex-wrap gap-2">
      <span className="text-sm font-semibold text-gray-700">Filter by Year:</span>
      {years.map((year) => (
        <button
          key={year.value || 'all'}
          onClick={() => onYearChange(year.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedYear === year.value
              ? 'bg-teal-800 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedYear === year.value && (
            <Check className="inline-block w-4 h-4 mr-1.5" />
          )}
          {year.label}
        </button>
      ))}
    </div>
  );
}

