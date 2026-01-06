import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsByFaculty } from "../../features/faculty/facultySlice";
import { fetchCurriculum, saveMidMarks } from "../../features/shared/academicsSlice";
import { 
  Search, 
  Users, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Loader2,
  GraduationCap,
  FileText,
  Star,
  Target
} from "lucide-react";

export default function FacultyAddMidMarks() {
  const dispatch = useDispatch();
  const { students } = useSelector((s) => s.students);
  const { curriculum, curriculumLoading, marksSaving } = useSelector((s) => s.academics);

  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState(1);
  const [midNumber, setMidNumber] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [search, setSearch] = useState("");
  const [focusedInput, setFocusedInput] = useState("");

  // Students are already sorted by studentid from the backend
  const sortedStudents = students || [];

  // First student as default
  useEffect(() => {
    if (!studentId && sortedStudents.length > 0) {
      setStudentId(sortedStudents[0].studentid);
    }
  }, [sortedStudents, studentId]);

  // Load faculty students - only if not already in Redux
  useEffect(() => {
    if (!students || students.length === 0) {
      dispatch(fetchStudentsByFaculty());
    }
  }, [dispatch, students]);

  // Fetch curriculum
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const subs = await dispatch(fetchCurriculum(semester)).unwrap();
        if (active) setSubjects(subs);
      } catch {
        if (active) setSubjects([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [studentId, semester]);

  // Reset marks on change
  useEffect(() => {
    setMarks({});
  }, [subjects, midNumber, studentId]);

  const visibleSubjects = useMemo(() => {
    const list = Array.isArray(subjects) ? subjects : [];
    const seen = new Set();
    const out = [];
    for (const s of list) {
      if (!s?.code || seen.has(s.code)) continue;
      seen.add(s.code);
      out.push(s);
      if (out.length === 6) break;
    }
    return out;
  }, [subjects]);

  const totalEntered = useMemo(() => {
    const picked = Object.fromEntries(
      Object.entries(marks).filter(([code]) =>
        visibleSubjects.some((s) => s.code === code)
      )
    );
    return Object.values(picked).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [marks, visibleSubjects]);

  const totalPossible = useMemo(() => {
    return visibleSubjects.reduce((sum, s) => sum + (Number(s.max) || 30), 0);
  }, [visibleSubjects]);

  const handleChange = (code, value, max) => {
    const n = Math.max(0, Math.min(Number(value || 0), max));
    setMarks((m) => ({ ...m, [code]: n }));
  };

  const handleSave = async () => {
    if (!studentId) {
      setNoticeType("warning");
      setNotice("Please select a student before saving.");
      setTimeout(() => setNotice(""), 2500);
      return;
    }
    if (!visibleSubjects || visibleSubjects.length < 6) {
      setNoticeType("warning");
      setNotice("Exactly 6 subjects are required.");
      setTimeout(() => setNotice(""), 3000);
      return;
    }
    const hasAnyValue = Object.keys(marks).some((k) => marks[k] !== "");
    if (!hasAnyValue) {
      setNoticeType("warning");
      setNotice("Enter at least one subject mark.");
      setTimeout(() => setNotice(""), 2500);
      return;
    }

    setSaving(true);
    try {
      const raw = visibleSubjects.map((s) => ({
        studentId,
        semester,
        midNumber,
        subjectCode: s.code.toString().trim(),
        subjectName: s.name,
        max: Number(s.max || 30),
        marks: Number(marks[s.code] ?? 0),
      }));

      const result = await dispatch(saveMidMarks(raw)).unwrap();

      if (result?.count === 6) {
        setNoticeType("success");
        setNotice("Marks saved successfully!");

        // Clear marks
        setMarks({});

        // Auto switch to next student
        const idx = sortedStudents.findIndex((s) => s.studentid === studentId);
        if (idx >= 0 && idx < sortedStudents.length - 1) {
          setTimeout(() => {
            setStudentId(sortedStudents[idx + 1].studentid);
          }, 1200);
        }
      } else {
        setNoticeType("warning");
        setNotice("Some marks not saved properly, please retry.");
      }

      setTimeout(() => setNotice(""), 2500);
    } catch (e) {
      setNoticeType("error");
      setNotice(e?.message || "Failed to save marks.");
      setTimeout(() => setNotice(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Search filter
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return sortedStudents;
    return sortedStudents.filter(
      (s) =>
        s.fullname.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase()) ||
        s.studentid.toString().includes(search)
    );
  }, [sortedStudents, search]);

  const getNoticeIcon = () => {
    switch (noticeType) {
      case "success":
        return <CheckCircle2 className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getCurrentStudent = () => {
    return sortedStudents.find(s => s.studentid === studentId);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Animated Toast Notifications */}
      {notice && (
        <div className={`top-6 right-6 z-50 transform transition-all duration-500 ease-out ${
          notice ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        }`}>
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            noticeType === "success"
              ? "bg-emerald-50/90 border-emerald-200/50 text-emerald-800"
              : noticeType === "error"
              ? "bg-rose-50/90 border-rose-200/50 text-rose-800"
              : "bg-amber-50/90 border-amber-200/50 text-amber-800"
          }`}>
            <div className={`p-1 rounded-lg ${
              noticeType === "success"
                ? "bg-emerald-100 text-emerald-600"
                : noticeType === "error"
                ? "bg-rose-100 text-rose-600"
                : "bg-amber-100 text-amber-600"
            }`}>
              {getNoticeIcon()}
            </div>
            <span className="font-medium">{notice}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sticky Header Section */}
        <div className="mb-8 pb-6 backdrop-blur-lg bg-white/70 border border-slate-200/50 rounded-3xl shadow-md">
          <div className="p-6">
            {/* Header Title */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                      Add Mid Exam Marks
                    </h1>
                    <p className="text-slate-600 mt-1">Manage student assessments with precision and ease</p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full lg:w-80 pl-12 pr-4 py-3.5 bg-white/70 border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-300/50 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Select Student
                </label>
                <div className="relative">
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/80 border border-white/40 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-300/50 transition-all duration-300 appearance-none cursor-pointer backdrop-blur-sm"
                  >
                    {filteredStudents.map((s) => (
                      <option key={s.studentid} value={s.studentid}>
                        {s.fullname} - {s.studentid}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Semester Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Semester
                </label>
                <div className="relative">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-4 py-3.5 bg-white/80 border border-white/40 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-300/50 transition-all duration-300 appearance-none cursor-pointer backdrop-blur-sm"
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mid Exam Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Mid Exam
                </label>
                <div className="relative">
                  <select
                    value={midNumber}
                    onChange={(e) => setMidNumber(Number(e.target.value))}
                    className="w-full px-4 py-3.5 bg-white/80 border border-white/40 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-300/50 transition-all duration-300 appearance-none cursor-pointer backdrop-blur-sm"
                  >
                    <option value={1}>Mid Exam 1</option>
                    <option value={2}>Mid Exam 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Info Card */}
            {getCurrentStudent() && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {getCurrentStudent()?.fullname?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{getCurrentStudent()?.fullname}</h3>
                    <p className="text-slate-600 text-sm">Student ID: {getCurrentStudent()?.studentid} | Username: {getCurrentStudent()?.username}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Subject Marks Entry</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/50 rounded-2xl p-6 h-40 border border-white/30"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleSubjects.map((subject, index) => (
                <div
                  key={subject.code}
                  className="group relative bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInUp 0.6s ease-out both'
                  }}
                >
                  {/* Subject Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors duration-200">
                        {subject.name}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">Code: {subject.code}</p>
                    </div>
                    <div className="ml-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg">
                        <Target className="w-3 h-3" />
                        {subject.max || 30}
                      </span>
                    </div>
                  </div>

                  {/* Marks Input */}
                  <div className="relative">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={subject.max || 30}
                        value={marks[subject.code] ?? ""}
                        onChange={(e) => handleChange(subject.code, e.target.value, subject.max || 30)}
                        onFocus={() => setFocusedInput(subject.code)}
                        onBlur={() => setFocusedInput("")}
                        placeholder="0"
                        className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200/50 rounded-xl text-lg font-semibold text-center focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-400/50 focus:bg-white transition-all duration-300 placeholder-slate-400"
                      />
                      <div className={`absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ${
                        focusedInput === subject.code ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Min: 0</span>
                      <span>Max: {subject.max || 30}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(((marks[subject.code] || 0) / (subject.max || 30)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(((marks[subject.code] || 0) / (subject.max || 30)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary & Save Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Score Summary */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-slate-600">Total Entered</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {totalEntered}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-600">Total Possible</span>
                </div>
                <div className="text-3xl font-bold text-slate-700">
                  {totalPossible}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-600">Percentage</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {totalPossible > 0 ? Math.round((totalEntered / totalPossible) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || marksSaving}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                {saving || marksSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                )}
                <span className="text-lg">
                  {saving || marksSaving ? "Saving..." : "Save Mid Marks"}
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
}