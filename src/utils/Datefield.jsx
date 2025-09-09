import React, { useState } from 'react';

export default function DateInputField() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    
    // Basic validation - check if date is valid
    const dateObj = new Date(date);
    const isValidDate = date && !isNaN(dateObj.getTime());
    setIsValid(isValidDate);
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Date Input Field</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
              isValid 
                ? 'border-gray-300 hover:border-gray-400' 
                : 'border-red-300 bg-red-50'
            }`}
          />
          {!isValid && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid date</p>
          )}
        </div>
      </div>
    </div>
  );
}