import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Calendar, TrendingUp, Users, Award } from 'lucide-react';

const AttendencePer = () => {
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Generate random attendance percentage between 75-100%
  useEffect(() => {
    const randomPercentage = Math.floor(Math.random() * 26) + 75; // 75-100%
    setAttendancePercentage(randomPercentage);

    // Animate the progress bar
    const timer = setTimeout(() => {
      setAnimatedPercentage(randomPercentage);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Determine color based on attendance percentage
  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return '#10B981'; // Green
    if (percentage >= 85) return '#3B82F6'; // Blue
    if (percentage >= 75) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Get attendance status
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 95) return 'Excellent';
    if (percentage >= 85) return 'Good';
    if (percentage >= 75) return 'Satisfactory';
    return 'Needs Improvement';
  };

  // Get attendance icon
  const getAttendanceIcon = (percentage) => {
    if (percentage >= 95) return <Award className="w-5 h-5" />;
    if (percentage >= 85) return <TrendingUp className="w-5 h-5" />;
    if (percentage >= 75) return <Calendar className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  const attendanceColor = getAttendanceColor(attendancePercentage);
  const attendanceStatus = getAttendanceStatus(attendancePercentage);
  const attendanceIcon = getAttendanceIcon(attendancePercentage);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Attendance</h3>
            <p className="text-sm text-gray-500">Current Semester</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
             style={{ backgroundColor: `${attendanceColor}15`, color: attendanceColor }}>
          {attendanceIcon}
          {attendanceStatus}
        </div>
      </div>

      {/* Circular Progress Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-36 lg:h-36">
            <CircularProgressbar
              value={animatedPercentage}
              text={`${animatedPercentage}%`}
              styles={buildStyles({
                pathColor: attendanceColor,
                textColor: attendanceColor,
                trailColor: '#E5E7EB',
                textSize: '1.2rem',
                fontWeight: 'bold',
              })}
              strokeWidth={8}
            />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-100 scale-110"></div>
          <div className="absolute inset-0 rounded-full border border-gray-50 scale-125"></div>
        </div>

        {/* Stats Cards */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Present Days */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Present</span>
              </div>
              <p className="text-2xl font-bold text-green-800">
                {Math.floor((attendancePercentage / 100) * 90)}
              </p>
              <p className="text-xs text-green-600">days</p>
            </div>

            {/* Absent Days */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">Absent</span>
              </div>
              <p className="text-2xl font-bold text-red-800">
                {Math.floor(((100 - attendancePercentage) / 100) * 90)}
              </p>
              <p className="text-xs text-red-600">days</p>
            </div>

            {/* Total Days */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Classes</p>
                  <p className="text-xl font-bold text-blue-800">90</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Visual Appeal */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Monthly Progress</span>
          <span className="text-sm font-bold" style={{ color: attendanceColor }}>
            {attendancePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${animatedPercentage}%`,
              backgroundColor: attendanceColor 
            }}
          ></div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100">
        <p className="text-sm text-gray-600 text-center">
          {attendancePercentage >= 95 
            ? "🎉 Outstanding attendance! Keep up the excellent work!"
            : attendancePercentage >= 85
            ? "👍 Great attendance! You're doing well!"
            : attendancePercentage >= 75
            ? "📈 Good attendance! A little more effort will make it excellent!"
            : "💪 Let's work on improving your attendance!"
          }
        </p>
      </div>
    </div>
  );
};

export default AttendencePer;
