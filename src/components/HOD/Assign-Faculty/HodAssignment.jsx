import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, ArrowRight, CheckCircle2, AlertCircle, Users, BookOpen } from 'lucide-react';
import FacultyList from './FacultyList';
import StudentList from './StudentDepartmentList';
import AssignmentModal from './AssignmentModel';
import { fetchDepartmentFaculty, fetchDepartmentStudents, setHODInfo, selectAssignmentStats } from '../../../features/HOD/hodAssignmentSlice';
import api from '../../../services/api';

export default function HODPortal() {
  const dispatch = useDispatch();
  const { 
    hodInfo, 
    faculty, 
    sections,
    facultyLoading, 
    studentsLoading,
    facultyError,
    studentsError
  } = useSelector((state) => state.hodAssignment);
  const stats = useSelector(selectAssignmentStats);
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  // Stop showing full-page loading after short timeout so user sees layout and can retry.
  // Only update state when value actually changes to avoid "Maximum update depth" loop.
  const loading = facultyLoading || studentsLoading;
  useEffect(() => {
    if (loading) {
      setLoadTimedOut((prev) => (prev ? false : prev));
      const t = setTimeout(() => setLoadTimedOut(true), 5000);
      return () => clearTimeout(t);
    }
    setLoadTimedOut((prev) => (prev ? false : prev));
  }, [loading]);

  // Fetch HOD information on mount (non-blocking)
  useEffect(() => {
    const fetchHODInfo = async () => {
      try {
        const response = await api.get('/hod/info');
        const hodData = response.data?.data?.hod || response.data?.hod;
        if (hodData) {
          dispatch(setHODInfo(hodData));
        }
      } catch (error) {
        console.error('Error fetching HOD info:', error);
      }
    };

    fetchHODInfo();
  }, [dispatch]);

  // Fetch faculty and students immediately
  useEffect(() => {
    dispatch(fetchDepartmentFaculty());
    dispatch(fetchDepartmentStudents());
  }, [dispatch]);

  const handleAssignClick = () => {
    if (selectedFaculty && selectedSection) {
      setShowModal(true);
    }
  };

  const handleAssignmentSuccess = () => {
    dispatch(fetchDepartmentFaculty());
    dispatch(fetchDepartmentStudents());
    setSelectedSection(null);
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
  };

  // Only show full-page loading when BOTH requests still pending; stop after 5s so user sees layout
  const isLoading = facultyLoading && studentsLoading && !loadTimedOut;
  const hasError = facultyError || studentsError;
  const hasNoData = !facultyLoading && !studentsLoading && faculty.length === 0 && sections.length === 0;

  if (isLoading && !hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Loading...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  const { totalFaculty, totalSections, totalStudents, assignedFacultyCount } = stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-teal-700 to-teal-800 p-3 rounded-xl shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 bg-clip-text text-transparent">
                  Faculty Assignment Portal
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {hodInfo?.collegeName || hodInfo?.institution ? (
                    <span>{hodInfo.collegeName || hodInfo.institution} · {hodInfo?.department?.name || hodInfo?.department || 'Department'} Department</span>
                  ) : (
                    <span>{hodInfo?.department?.name || hodInfo?.department || 'Department'} Department</span>
                  )}
                </p>
              </div>
            </div>
            {hodInfo && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{hodInfo.name || hodInfo.fullname}</p>
                <p className="text-xs text-gray-600">{hodInfo.email}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-5 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">Total Faculty</p>
                <p className="text-2xl sm:text-3xl font-bold text-teal-700">{totalFaculty}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg shadow-md">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-lg border border-emerald-200 p-5 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">Total Sections</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{totalSections}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg shadow-md">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-5 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-teal-700">{totalStudents}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg shadow-md">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-5 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">Assigned Faculty</p>
                <p className="text-2xl sm:text-3xl font-bold text-teal-700">{assignedFacultyCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg shadow-md">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {hasError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  {facultyError && `Faculty Error: ${facultyError}`}
                  {facultyError && studentsError && ' • '}
                  {studentsError && `Students Error: ${studentsError}`}
                </p>
                <button
                  onClick={() => {
                    dispatch(fetchDepartmentFaculty());
                    dispatch(fetchDepartmentStudents());
                  }}
                  className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No data / slow load: show message and Retry when both requests finished and we have no data */}
        {hasNoData && !hasError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">No faculty or sections found for your department.</p>
            <p className="text-sm text-amber-700 mt-1">If you expected data, check that faculty and students are added, then retry.</p>
            <button
              type="button"
              onClick={() => {
                dispatch(fetchDepartmentFaculty());
                dispatch(fetchDepartmentStudents());
              }}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content Grid – always show both columns; each shows loading, data, or empty state */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FacultyList
            key={`faculty-${refreshKey}`}
            onSelectFaculty={setSelectedFaculty}
            selectedFacultyId={selectedFaculty?.id || selectedFaculty?.facultyid}
          />
          <StudentList
            key={`student-${refreshKey}`}
            onSelectSection={setSelectedSection}
            selectedSection={selectedSection?.section}
            selectedFacultyId={selectedFaculty?.id || selectedFaculty?.facultyid}
          />
        </div>

            {/* Selection Summary & Action */}
            {(selectedFaculty || selectedSection) && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1 w-full lg:w-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Selection</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 gap-4">
                  <div className="flex-1 min-w-[200px]">
                    {selectedFaculty ? (
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">Selected Faculty</p>
                        <p className="text-base font-semibold text-gray-900 mb-1">{selectedFaculty.name || selectedFaculty.fullname}</p>
                        <p className="text-sm text-gray-600">{selectedFaculty.email}</p>
                        {selectedFaculty.subjects && selectedFaculty.subjects.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs text-blue-700 font-medium mb-1">Subjects:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedFaculty.subjects.slice(0, 3).map((subject, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded">
                                  {subject}
                                </span>
                              ))}
                              {selectedFaculty.subjects.length > 3 && (
                                <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded">
                                  +{selectedFaculty.subjects.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500">No faculty selected</p>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0 hidden sm:block" />
                  <div className="flex-1 min-w-[200px]">
                    {selectedSection ? (
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-900 mb-2 uppercase tracking-wide">Selected Section</p>
                        <p className="text-base font-semibold text-gray-900 mb-1">Section {selectedSection.name}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{selectedSection.studentCount}</span> students
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500">No section selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAssignClick}
                disabled={!selectedFaculty || !selectedSection}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white font-semibold rounded-lg hover:from-teal-800 hover:via-teal-900 hover:to-teal-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap transform hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Assign Faculty to Section</span>
              </button>
            </div>
          </div>
            )}
      </main>

      {showModal && selectedFaculty && selectedSection && (
        <AssignmentModal
          faculty={selectedFaculty}
          section={selectedSection}
          onClose={() => setShowModal(false)}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
}
