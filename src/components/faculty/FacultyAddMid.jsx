import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsByFaculty } from "../../features/studentSlice";
import { fetchCurriculum, saveMidMarks } from "../../features/academicsSlice";

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

  // Sort students by ID
  const sortedStudents = useMemo(() => {
    return [...(students || [])].sort((a, b) =>
      a.studentid.toString().localeCompare(b.studentid.toString(), undefined, {
        numeric: true,
      })
    );
  }, [students]);

  // First student as default
  useEffect(() => {
    if (!studentId && sortedStudents.length > 0) {
      setStudentId(sortedStudents[0].studentid);
    }
  }, [sortedStudents, studentId]);

  // Load faculty students
  useEffect(() => {
    dispatch(fetchStudentsByFaculty());
  }, [dispatch]);

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
        setNotice("Marks saved successfully ✅");

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

  return (
    <div className="relative w-full min-h-[80vh]">
      {/* Toast */}
      {notice && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg text-sm animate-fade-in ${
            noticeType === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : noticeType === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-amber-50 text-amber-900 border border-amber-200"
          }`}
        >
          {notice}
        </div>
      )}

      <div className="w-full mx-auto max-w-6xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-sky-600 animate-fade-in">
              Add Mid Marks (Subject-wise)
            </h2>
            <p className="text-sm text-muted-foreground">
              Select student, semester & mid exam before entering marks.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Search Student</label>
            <input
              type="text"
              placeholder="Search by name, ID or RegNo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-xl border border-indigo-100/70 px-3 bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 animate-fade-in mb-6">
          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Select Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-11 rounded-xl border border-indigo-100/70 px-3 bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400/30"
            >
              {filteredStudents.map((s) => (
                <option key={s.studentid} value={s.studentid}>
                  {s.fullname} - Regno: {s.studentid}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="h-11 rounded-xl border border-indigo-100/70 px-3 bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400/30"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Sem {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Mid Exam</label>
            <select
              value={midNumber}
              onChange={(e) => setMidNumber(Number(e.target.value))}
              className="h-11 rounded-xl border border-indigo-100/70 px-3 bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400/30"
            >
              <option value={1}>Mid 1</option>
              <option value={2}>Mid 2</option>
            </select>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleSubjects.map((s, idx) => (
            <div
              key={s.code}
              className="group relative rounded-2xl border border-indigo-100/70 p-4 bg-white/80 shadow-sm hover:shadow-xl transition-all duration-300"
              style={{ animation: `fadeInUp 0.35s ease ${idx * 0.05}s both` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.code}</div>
                </div>
                <span className="text-xs rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-700 border">
                  Max {s.max}
                </span>
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  min={0}
                  max={s.max}
                  value={marks[s.code] ?? ""}
                  onChange={(e) => handleChange(s.code, e.target.value, s.max)}
                  placeholder={`Enter marks (0-${s.max})`}
                  className="w-full h-11 rounded-xl border px-3 shadow-inner focus:border-indigo-300 focus:ring-4 focus:ring-indigo-400/20"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Total entered:{" "}
            <span className="font-medium text-foreground">{totalEntered}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || marksSaving}
            className="h-11 px-6 rounded-xl text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 hover:from-indigo-500 hover:via-violet-500 hover:to-sky-500"
          >
            {saving || marksSaving ? "Saving..." : "Save Mid Marks"}
          </button>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeInUp 0.4s ease both }
        `}</style>
      </div>
    </div>
  );
}
