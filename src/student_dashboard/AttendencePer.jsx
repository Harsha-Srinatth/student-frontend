import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Calendar, TrendingUp, Users, Award } from 'lucide-react';
import api from '../services/api.jsx';

const AttendencePer = () => {
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [presentClasses, setPresentClasses] = useState(0);
  const [absentClasses, setAbsentClasses] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);

  // Fetch real attendance stats
  useEffect(() => {
    let isMounted = true;
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/student/attendance');
        const data = res?.data?.data;
        if (!isMounted || !data) return;
        setAttendancePercentage(data.attendancePercentage || 0);
        setPresentClasses(data.presentClasses || 0);
        setAbsentClasses(data.absentClasses || 0);
        setTotalClasses(data.totalClasses || 0);
        const timer = setTimeout(() => {
          if (isMounted) setAnimatedPercentage(data.attendancePercentage || 0);
        }, 500);
        return () => clearTimeout(timer);
      } catch (e) {
        // fallback to 0s on error
        if (!isMounted) return;
        setAttendancePercentage(0);
        setPresentClasses(0);
        setAbsentClasses(0);
        setTotalClasses(0);
        setAnimatedPercentage(0);
      }
    };
    fetchAttendance();
    return () => { isMounted = false; };
  }, []);

  // Determine color based on attendance percentage - softer, more attractive colors
  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return '#059669'; // Soft emerald
    if (percentage >= 85) return '#2563EB'; // Soft blue
    if (percentage >= 75) return '#D97706'; // Soft amber
    return '#DC2626'; // Soft red
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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl text-white shadow-lg">
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
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-sm"></div>
                <span className="text-sm font-medium text-emerald-700">Present</span>
              </div>
              <p className="text-2xl font-bold text-emerald-800">{presentClasses}</p>
              <p className="text-xs text-emerald-600">days</p>
            </div>

            {/* Absent Days */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full shadow-sm"></div>
                <span className="text-sm font-medium text-rose-700">Absent</span>
              </div>
              <p className="text-2xl font-bold text-rose-800">{absentClasses}</p>
              <p className="text-xs text-rose-600">days</p>
            </div>

            {/* Total Days */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border border-slate-200 col-span-2 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Total Classes</p>
                  <p className="text-xl font-bold text-slate-800">{totalClasses}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-slate-600" />
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
        <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ 
              width: `${animatedPercentage}%`,
              backgroundColor: attendanceColor,
              boxShadow: `0 0 8px ${attendanceColor}40`
            }}
          ></div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-700 text-center font-medium">
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
