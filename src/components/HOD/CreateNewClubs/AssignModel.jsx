import React, { useState, useEffect } from 'react';
import { X, User, Crown, Search, Loader2 } from 'lucide-react';
import api from '@/services/api';

const AssignModal = ({ isOpen, onClose, club, onAssign }) => {
  const [facultyCoordinator, setFacultyCoordinator] = useState(club?.facultyCoordinator || '');
  const [studentHead, setStudentHead] = useState(club?.studentHead || '');
  const [facultySearch, setFacultySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [facultyResults, setFacultyResults] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchingFaculty, setSearchingFaculty] = useState(false);
  const [searchingStudent, setSearchingStudent] = useState(false);

  // Load existing assignments when club changes
  useEffect(() => {
    if (club) {
      setFacultyCoordinator(club.facultyCoordinator || '');
      setStudentHead(club.studentHead || '');
      if (club.facultyCoordinatorDetails) {
        setFacultySearch(`${club.facultyCoordinatorDetails.facultyid} - ${club.facultyCoordinatorDetails.fullname}`);
      }
      if (club.studentHeadDetails) {
        setStudentSearch(`${club.studentHeadDetails.studentid} - ${club.studentHeadDetails.fullname}`);
      }
    }
  }, [club]);

  // Search faculty by facultyId
  useEffect(() => {
    const searchFaculty = async () => {
      if (facultySearch.trim().length < 2) {
        setFacultyResults([]);
        return;
      }

      setSearchingFaculty(true);
      try {
        const res = await api.get('/hod/clubs/search/faculty', {
          params: { facultyId: facultySearch },
        });
        if (res.data?.ok) {
          setFacultyResults(res.data.faculty || []);
        }
      } catch (error) {
        console.error('Error searching faculty:', error);
        setFacultyResults([]);
      } finally {
        setSearchingFaculty(false);
      }
    };

    const timeoutId = setTimeout(searchFaculty, 300);
    return () => clearTimeout(timeoutId);
  }, [facultySearch]);

  // Search students by studentId
  useEffect(() => {
    const searchStudents = async () => {
      if (studentSearch.trim().length < 2) {
        setStudentResults([]);
        return;
      }

      setSearchingStudent(true);
      try {
        const res = await api.get('/hod/clubs/search/students', {
          params: { studentId: studentSearch },
        });
        if (res.data?.ok) {
          setStudentResults(res.data.students || []);
        }
      } catch (error) {
        console.error('Error searching students:', error);
        setStudentResults([]);
      } finally {
        setSearchingStudent(false);
      }
    };

    const timeoutId = setTimeout(searchStudents, 300);
    return () => clearTimeout(timeoutId);
  }, [studentSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!club) return;

    setLoading(true);
    try {
      const res = await api.put(`/hod/clubs/${club.clubId}/assign`, {
        facultyCoordinator: facultyCoordinator || null,
        studentHead: studentHead || null,
      });

      if (res.data?.ok) {
        onAssign(club.clubId, res.data.club);
        onClose();
      } else {
        alert(res.data?.message || 'Failed to update assignments');
      }
    } catch (error) {
      console.error('Error updating assignments:', error);
      alert(error.response?.data?.message || 'Failed to update assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFaculty = () => {
    setFacultyCoordinator('');
    setFacultySearch('');
    setFacultyResults([]);
  };

  const handleClearStudent = () => {
    setStudentHead('');
    setStudentSearch('');
    setStudentResults([]);
  };

  if (!isOpen || !club) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assign Members</h2>
            <p className="text-sm text-gray-600 mt-1">{club.clubName}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="h-4 w-4 text-blue-600" />
              Faculty Coordinator
            </label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Faculty ID..."
                  value={facultySearch}
                  onChange={(e) => {
                    setFacultySearch(e.target.value);
                    if (!e.target.value) {
                      setFacultyCoordinator('');
                    }
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {facultyCoordinator && (
                  <button
                    type="button"
                    onClick={handleClearFaculty}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {searchingFaculty && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {facultyResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {facultyResults.map((faculty) => (
                    <button
                      key={faculty.facultyid}
                      type="button"
                      onClick={() => {
                        setFacultyCoordinator(faculty.facultyid);
                        setFacultySearch(`${faculty.facultyid} - ${faculty.fullname}`);
                        setFacultyResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{faculty.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {faculty.facultyid} • {faculty.designation}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {facultyCoordinator && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {facultyResults.find(f => f.facultyid === facultyCoordinator)?.fullname || facultyCoordinator}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Crown className="h-4 w-4 text-yellow-600" />
              Student Club Head
            </label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Student ID..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    if (!e.target.value) {
                      setStudentHead('');
                    }
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {studentHead && (
                  <button
                    type="button"
                    onClick={handleClearStudent}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {searchingStudent && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {studentResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {studentResults.map((student) => (
                    <button
                      key={student.studentid}
                      type="button"
                      onClick={() => {
                        setStudentHead(student.studentid);
                        setStudentSearch(`${student.studentid} - ${student.fullname}`);
                        setStudentResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{student.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.studentid} • {student.programName} • {student.semester}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {studentHead && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {studentResults.find(s => s.studentid === studentHead)?.fullname || studentHead}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
