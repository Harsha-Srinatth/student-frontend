import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fetchStudentsByFaculty } from "../../features/studentSlice";
import { submitAttendance } from "../../features/academicsSlice";
import { toast } from "react-hot-toast"; // ✅ using react-hot-toast for notifications
import { Search } from "lucide-react"; // search icon

const FacultyAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState(1);
  const dispatch = useDispatch();
  const { students, studentsLoading } = useSelector((s) => s.students);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchStudentsByFaculty());
  }, [dispatch]);

  useEffect(() => {
    const normalized = (students || []).map((s) => ({
      id: s.studentid || s.id,
      name: s.fullname || s.name,
      regno: s.username || s.regno,
      present: true,
    }));
  
    // ✅ sort by ID (numeric if possible, otherwise string compare)
    const sorted = [...normalized].sort((a, b) => {
      const aId = a.id.toString();
      const bId = b.id.toString();
      return aId.localeCompare(bId, undefined, { numeric: true });
    });
  
    setRows(sorted);
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
      toast.success("Attendance submitted successfully 🎉");
    } catch (e) {
      toast.error("Failed to submit attendance. Please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  const total = rows.length;
  const presentCount = rows.filter((r) => r.present).length;
  const absentCount = total - presentCount;

  return (
    <div className="w-full mx-auto max-w-6xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Mark attendance for today’s period with ease.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 rounded-md border px-3 bg-white/80 shadow-sm hover:shadow transition"
          />
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="h-10 rounded-md border px-3 bg-white/80 shadow-sm hover:shadow transition"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Period {i + 1}
              </option>
            ))}
          </select>
          <button
            onClick={() => setAll(true)}
            className="h-10 px-3 rounded-md bg-green-500 text-white hover:bg-green-600 active:scale-95 transition"
          >
            Mark all Present
          </button>
          <button
            onClick={() => setAll(false)}
            className="h-10 px-3 rounded-md bg-red-500 text-white hover:bg-red-600 active:scale-95 transition"
          >
            Mark all Absent
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-xl shadow bg-white/80 backdrop-blur-sm text-center hover:scale-[1.02] transition">
          <div className="text-lg font-semibold">{total}</div>
          <div className="text-sm text-muted-foreground">Total Students</div>
        </div>
        <div className="p-4 rounded-xl shadow bg-green-50 text-center hover:scale-[1.02] transition">
          <div className="text-lg font-semibold text-green-600">{presentCount}</div>
          <div className="text-sm text-muted-foreground">Marked Present</div>
        </div>
        <div className="p-4 rounded-xl shadow bg-red-50 text-center hover:scale-[1.02] transition">
          <div className="text-lg font-semibold text-red-600">{absentCount}</div>
          <div className="text-sm text-muted-foreground">Marked Absent</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          placeholder="Search by name / regno / id..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-10 rounded-xl shadow px-4 bg-white/90 focus:ring-2 focus:ring-blue-300 transition"
        />
      </div>

      {/* Student List */}
      <div className="rounded-2xl shadow bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 bg-gray-100 px-4 py-2 text-sm font-medium">
          <div className="col-span-5">Student</div>
          <div className="col-span-3">Reg No</div>
          <div className="col-span-4 text-right">Status</div>
        </div>
        <ul className="divide-y">
          {(studentsLoading ? Array.from({ length: 5 }) : filtered).map((s, idx) =>
            studentsLoading ? (
              <li
                key={idx}
                className="animate-pulse grid grid-cols-12 items-center px-4 py-4"
              >
                <div className="col-span-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="col-span-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="col-span-4 flex justify-end gap-2">
                  <div className="h-9 w-20 bg-gray-200 rounded"></div>
                  <div className="h-9 w-20 bg-gray-200 rounded"></div>
                </div>
              </li>
            ) : (
              <li
                key={s.id}
                className="grid grid-cols-12 items-center px-4 py-4 hover:bg-gray-50 transition duration-200"
              >
                <div className="col-span-12 sm:col-span-5">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.regno}</div>
                </div>
                <div className="col-span-6 sm:col-span-3 text-sm sm:text-base mt-2 sm:mt-0">
                 {s.id}
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggle(s.id, true)}
                      className={`h-9 px-4 rounded-lg shadow-sm transition ${
                        s.present
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 hover:bg-green-50"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => toggle(s.id, false)}
                      className={`h-9 px-4 rounded-lg shadow-sm transition ${
                        !s.present
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 hover:bg-red-50"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </li>
            )
          )}
          {!studentsLoading && filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              No students found.
            </li>
          )}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-12 px-6 rounded-xl shadow bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition"
        >
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default FacultyAttendance;


