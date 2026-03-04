import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fetchStudentsByFaculty } from "../../features/faculty/facultySlice";
import { submitAttendance } from "../../features/shared/academicsSlice";
import { fetchFacultyDashboardData } from "../../features/faculty/facultyDashSlice";
import Toast from "../shared/Toast";
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Filter,
  Download,
  BookOpen
} from "lucide-react";
const FacultyAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState(1);
  const [selectedSection, setSelectedSection] = useState("");
  const dispatch = useDispatch();
  const { students, studentsLoading } = useSelector((s) => s.students);
  const { faculty } = useSelector((s) => s.facultyDashboard);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Fetch faculty data to get sectionsAssigned
  useEffect(() => {
    if (!faculty || !faculty.sectionsAssigned) {
      dispatch(fetchFacultyDashboardData());
    }
  }, [dispatch, faculty]);

  // Get available sections from faculty's sectionsAssigned (backend data only)
  const availableSections = useMemo(() => {
    if (!faculty || !faculty.sectionsAssigned) return [];
    return faculty.sectionsAssigned.map(assignment => assignment.section);
  }, [faculty]);

  // Set default section when sections load
  useEffect(() => {
    if (availableSections.length > 0 && !selectedSection) {
      setSelectedSection(availableSections.length === 1 ? availableSections[0] : "all");
    }
  }, [availableSections, selectedSection]);

  // Fetch students by section only (backend returns filtered data - no extra API or client filter)
  useEffect(() => {
    if (availableSections.length === 0) return;
    dispatch(fetchStudentsByFaculty({ 
      section: selectedSection && selectedSection !== "all" ? selectedSection : undefined
    }));
  }, [dispatch, selectedSection, availableSections.length]);

  useEffect(() => {
    // Use students from backend as-is (already filtered by section)
    const normalized = (students || []).map((s) => ({
      id: s.studentid || s.id,
      name: s.fullname || s.name,
      studentId: String(s.studentid ?? s.id ?? ""),
      present: true,
    }));
    setRows(normalized);
  }, [students]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.studentId && r.studentId.toLowerCase().includes(q)) ||
        (r.id && String(r.id).toLowerCase().includes(q))
    );
  }, [rows, query]);

  const setAll = (present) => {
    setRows((r) => r.map((x) => ({ ...x, present })));
  };

  const toggle = (id, present) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, present } : x)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = {
        date,
        period,
        entries: rows.map((r) => ({
          studentId: r.id,
          present: r.present,
        })),
      };
      await dispatch(submitAttendance(body)).unwrap();
      setToast({ type: "success", message: "Attendance submitted successfully!" });
    } catch (e) {
      setToast({ type: "error", message: "Failed to submit attendance. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const total = rows.length;
  const presentCount = rows.filter((r) => r.present).length;
  const absentCount = total - presentCount;
  const attendancePercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F0EFE9]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-full mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: '#2E3B55' }}>
                Faculty Attendance
              </h1>
              <p className="text-[#728396] text-lg">
                Mark attendance for today's session with precision and ease
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#728396] group-focus-within:text-[#D9A441] transition-colors" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 pl-10 pr-4 rounded-xl border-0 bg-white shadow-lg shadow-[#2E3B55]/5 focus:shadow-xl focus:shadow-[#D9A441]/10 focus:ring-2 focus:ring-[#D9A441]/20 transition-all duration-300 text-[#2E3B55] font-medium"
                />
              </div>
              
              <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#728396] group-focus-within:text-[#D9A441] transition-colors" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="h-12 pl-10 pr-8 rounded-xl border-0 bg-white shadow-lg shadow-[#2E3B55]/5 focus:shadow-xl focus:shadow-[#D9A441]/10 focus:ring-2 focus:ring-[#D9A441]/20 transition-all duration-300 text-[#2E3B55] font-medium appearance-none cursor-pointer"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Period {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter - only assigned sections */}
              {availableSections.length > 0 && (
                <div className="relative group">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#728396] group-focus-within:text-[#D9A441] transition-colors" />
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="h-12 pl-10 pr-8 rounded-xl border-0 bg-white shadow-lg shadow-[#2E3B55]/5 focus:shadow-xl focus:shadow-[#D9A441]/10 focus:ring-2 focus:ring-[#D9A441]/20 transition-all duration-300 text-[#2E3B55] font-medium appearance-none cursor-pointer"
                  >
                    <option value="all">All Sections</option>
                    {availableSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setAll(true)}
                  className="h-12 px-4 rounded-xl text-white font-semibold shadow-lg shadow-[#D9A441]/20 hover:shadow-[#D9A441]/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                  style={{ backgroundColor: '#D9A441' }}
                >
                  <UserCheck className="w-4 h-4" />
                  All Present
                </button>
                <button
                  onClick={() => setAll(false)}
                  className="h-12 px-4 rounded-xl text-white font-semibold shadow-lg shadow-[#C58D76]/20 hover:shadow-[#C58D76]/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                  style={{ backgroundColor: '#C58D76' }}
                >
                  <UserX className="w-4 h-4" />
                  All Absent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No sections assigned */}
        {faculty && availableSections.length === 0 && (
          <div className="mb-8 p-8 rounded-2xl bg-[#FEF3C7]/90 border border-[#FDE68A]/50 text-amber-800 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#B45309]" />
            <p className="text-lg font-semibold">There are no sections assigned to you.</p>
            <p className="text-sm mt-1 text-amber-700">Please contact your HOD or admin to get section assignments.</p>
          </div>
        )}

        {/* Stats Dashboard - only when sections exist */}
        {availableSections.length > 0 && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-[#2E3B55]/10 hover:shadow-xl hover:shadow-[#2E3B55]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#2E3B55]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#728396] text-sm font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold text-[#2E3B55]">{total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2E3B55] flex items-center justify-center shadow-lg shadow-[#2E3B55]/20">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-[#D9A441]/10 hover:shadow-xl hover:shadow-[#D9A441]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#D9A441]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#728396] text-sm font-medium mb-1">Present</p>
                <p className="text-3xl font-bold text-[#D9A441]">{presentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#D9A441] flex items-center justify-center shadow-lg shadow-[#D9A441]/20">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-[#C58D76]/10 hover:shadow-xl hover:shadow-[#C58D76]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#C58D76]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#728396] text-sm font-medium mb-1">Absent</p>
                <p className="text-3xl font-bold text-[#C58D76]">{absentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#C58D76] flex items-center justify-center shadow-lg shadow-[#C58D76]/20">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-[#728396]/10 hover:shadow-xl hover:shadow-[#728396]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#728396]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#728396] text-sm font-medium mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-[#728396]">{attendancePercentage}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#728396] flex items-center justify-center shadow-lg shadow-[#728396]/20">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#728396] w-5 h-5" />
            <input
              placeholder="Search by name or Student ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-0 bg-white shadow-lg shadow-[#2E3B55]/5 focus:shadow-xl focus:shadow-[#D9A441]/10 focus:ring-2 focus:ring-[#D9A441]/20 transition-all duration-300 text-[#2E3B55] placeholder:text-[#728396]"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="rounded-2xl bg-white shadow-xl shadow-[#2E3B55]/10 overflow-hidden border border-[#728396]/10">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 bg-[#2E3B55] px-6 py-4 border-b border-[#2E3B55]">
            <div className="col-span-2 text-sm font-semibold text-white/90 uppercase tracking-wide">Student ID</div>
            <div className="col-span-5 text-sm font-semibold text-white/90 uppercase tracking-wide">Student Name</div>
            <div className="col-span-5 text-sm font-semibold text-white/90 uppercase tracking-wide text-right">Attendance Status</div>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-[#728396]/10">
            {(studentsLoading ? Array.from({ length: 8 }) : filtered).map((s, idx) =>
              studentsLoading ? (
                <div key={idx} className="animate-pulse px-6 py-5">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-2">
                      <div className="h-4 bg-[#728396]/20 rounded w-16"></div>
                    </div>
                    <div className="col-span-5">
                      <div className="h-5 bg-[#728396]/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#728396]/20 rounded w-1/2"></div>
                    </div>
                    <div className="col-span-5 flex justify-end gap-3">
                      <div className="h-10 w-24 bg-[#728396]/20 rounded-xl"></div>
                      <div className="h-10 w-24 bg-[#728396]/20 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={s.id}
                  className="group px-6 py-5 hover:bg-[#D9A441]/5 transition-all duration-200"
                >
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-12 lg:col-span-2">
                      <span className="inline-flex items-center justify-center min-w-[4rem] px-3 py-1.5 rounded-lg bg-[#728396]/10 text-[#728396] text-sm font-semibold group-hover:bg-[#2E3B55] group-hover:text-white transition-colors">
                        {s.studentId || s.id}
                      </span>
                    </div>
                    
                    <div className="col-span-12 lg:col-span-5">
                      <div className="font-semibold text-[#2E3B55] text-lg transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[#728396] text-sm lg:hidden mt-1">
                        ID: {s.studentId || s.id}
                      </div>
                    </div>
                    
                    <div className="col-span-12 lg:col-span-5">
                      <div className="flex justify-start lg:justify-end gap-3">
                        <button
                          onClick={() => toggle(s.id, true)}
                          className={`
                            relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                            ${s.present
                              ? 'bg-[#D9A441] text-white shadow-[#D9A441]/30'
                              : 'bg-[#728396]/10 text-[#728396] hover:bg-[#D9A441]/20 hover:text-[#D9A441] shadow-[#728396]/20'
                            }
                          `}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Present
                          {s.present && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => toggle(s.id, false)}
                          className={`
                            relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                            ${!s.present
                              ? 'bg-[#C58D76] text-white shadow-[#C58D76]/30'
                              : 'bg-[#728396]/10 text-[#728396] hover:bg-[#C58D76]/20 hover:text-[#C58D76] shadow-[#728396]/20'
                            }
                          `}
                        >
                          <XCircle className="w-4 h-4" />
                          Absent
                          {!s.present && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            
            {!studentsLoading && filtered.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#728396]/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#728396]" />
                </div>
                <p className="text-[#2E3B55] text-lg font-medium">No students found</p>
                <p className="text-[#728396] text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#728396]/20 shadow-lg shadow-[#2E3B55]/5">
          <div className="text-center sm:text-left">
            <p className="text-[#2E3B55] font-semibold">Ready to submit attendance?</p>
            <p className="text-[#728396] text-sm">
              {presentCount} present, {absentCount} absent out of {total} students
            </p>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || total === 0}
            className="group relative overflow-hidden h-14 px-8 rounded-xl bg-[#2E3B55] text-white font-bold shadow-xl shadow-[#2E3B55]/20 hover:shadow-2xl hover:shadow-[#D9A441]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Send className={`w-5 h-5 transition-transform duration-300 ${loading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
            <span className="relative">
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </span>
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default FacultyAttendance;