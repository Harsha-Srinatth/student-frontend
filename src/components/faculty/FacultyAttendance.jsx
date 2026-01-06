import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fetchStudentsByFaculty } from "../../features/faculty/facultySlice";
import { submitAttendance } from "../../features/shared/academicsSlice";
import { toast } from "react-hot-toast";
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
  Download
} from "lucide-react";

const FacultyAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState(1);
  const dispatch = useDispatch();
  const { students, studentsLoading } = useSelector((s) => s.students);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Only fetch if students not already in Redux or data is stale
    if (!students || students.length === 0) {
      dispatch(fetchStudentsByFaculty());
    }
  }, [dispatch, students]);

  useEffect(() => {
    // Students are already sorted by studentid from the backend
    const normalized = (students || []).map((s) => ({
      id: s.studentid || s.id,
      name: s.fullname || s.name,
      regno: s.username || s.regno,
      present: true,
    }));
  
    setRows(normalized);
  }, [students]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.regno.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
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
      toast.success("Attendance submitted successfully! 🎉", {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    } catch (e) {
      toast.error("Failed to submit attendance. Please try again.", {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const total = rows.length;
  const presentCount = rows.filter((r) => r.present).length;
  const absentCount = total - presentCount;
  const attendancePercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="w-full mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Faculty Attendance
              </h1>
              <p className="text-slate-600 text-lg">
                Mark attendance for today's session with precision and ease
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 pl-10 pr-4 rounded-xl border-0 bg-white shadow-lg shadow-slate-200/50 focus:shadow-xl focus:shadow-blue-200/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-slate-700 font-medium"
                />
              </div>
              
              <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="h-12 pl-10 pr-8 rounded-xl border-0 bg-white shadow-lg shadow-slate-200/50 focus:shadow-xl focus:shadow-blue-200/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-slate-700 font-medium appearance-none cursor-pointer"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Period {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setAll(true)}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  All Present
                </button>
                <button
                  onClick={() => setAll(false)}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  All Absent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold text-slate-800">{total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Present</p>
                <p className="text-3xl font-bold text-emerald-600">{presentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200/50">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-600">{attendancePercentage}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
                <Filter className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              placeholder="Search students by name, ID, or registration number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 focus:shadow-xl focus:shadow-blue-200/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="col-span-1 text-sm font-semibold text-slate-600 uppercase tracking-wide">ID</div>
            <div className="col-span-4 text-sm font-semibold text-slate-600 uppercase tracking-wide">Student Name</div>
            <div className="col-span-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">Registration</div>
            <div className="col-span-4 text-sm font-semibold text-slate-600 uppercase tracking-wide text-right">Attendance Status</div>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-slate-100">
            {(studentsLoading ? Array.from({ length: 8 }) : filtered).map((s, idx) =>
              studentsLoading ? (
                <div key={idx} className="animate-pulse px-6 py-5">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1">
                      <div className="h-4 bg-slate-200 rounded w-8"></div>
                    </div>
                    <div className="col-span-4">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="col-span-3">
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    <div className="col-span-4 flex justify-end gap-3">
                      <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                      <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={s.id}
                  className="group px-6 py-5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200"
                >
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-12 lg:col-span-1">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        {s.id}
                      </span>
                    </div>
                    
                    <div className="col-span-12 lg:col-span-4">
                      <div className="font-semibold text-slate-800 text-lg group-hover:text-blue-800 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-slate-500 text-sm lg:hidden mt-1">
                        Reg: {s.regno}
                      </div>
                    </div>
                    
                    <div className="hidden lg:block col-span-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        {s.regno}
                      </span>
                    </div>
                    
                    <div className="col-span-12 lg:col-span-4">
                      <div className="flex justify-start lg:justify-end gap-3">
                        <button
                          onClick={() => toggle(s.id, true)}
                          className={`
                            relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                            ${s.present
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-200/50 hover:shadow-emerald-300/60'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-slate-200/50'
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
                              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-200/50 hover:shadow-red-300/60'
                              : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700 shadow-slate-200/50'
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-medium">No students found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="text-center sm:text-left">
            <p className="text-slate-700 font-semibold">Ready to submit attendance?</p>
            <p className="text-slate-600 text-sm">
              {presentCount} present, {absentCount} absent out of {total} students
            </p>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || total === 0}
            className="group relative overflow-hidden h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Send className={`w-5 h-5 transition-transform duration-300 ${loading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
            <span className="relative">
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;