import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, ArrowRight, CheckCircle2, AlertCircle, Info, Users, BookOpen } from 'lucide-react';
import FacultyList from './FacultyList';
import StudentList from './StudentDepartmentList';
import AssignmentModal from './AssignmentModel';
import { fetchDepartmentFaculty, fetchDepartmentStudents, setHODInfo } from '../../../features/HOD/hodAssignmentSlice';
import { getYearLabel } from '../../../utils/sectionUtils';
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
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const isLoading = (facultyLoading && faculty.length === 0) || (studentsLoading && sections.length === 0);
  const hasError = facultyError || studentsError;

  if (isLoading && !hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Loading faculty and students...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalFaculty = faculty.length;
  const totalSections = sections.length;
  const totalStudents = sections.reduce((sum, section) => sum + (section.studentCount || 0), 0);
  const assignedFacultyCount = faculty.filter(f => (f.sectionsAssigned || []).length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Faculty Assignment Portal</h1>
                <p className="text-sm text-gray-600">
                  {hodInfo?.department?.name || hodInfo?.department || 'Department'} Department
                </p>
              </div>
            </div>
            {hodInfo && (
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{hodInfo.name || hodInfo.fullname}</p>
                <p className="text-xs text-gray-600">{hodInfo.email}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Faculty</p>
                <p className="text-2xl font-bold text-blue-600">{totalFaculty}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sections</p>
                <p className="text-2xl font-bold text-green-600">{totalSections}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned Faculty</p>
                <p className="text-2xl font-bold text-orange-600">{assignedFacultyCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-orange-500" />
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

        {/* Info Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2">How to Assign Faculty to Sections</h2>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded font-bold">1</span>
                  <span>Select a faculty member from the left panel (shows their current assignments)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded font-bold">2</span>
                  <span>Filter sections by year if needed, then select a section from the right panel</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded font-bold">3</span>
                  <span>Click "Assign Faculty to Section" to assign the faculty to all students in that section</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Selection</h3>
                <div className="flex items-center space-x-4 flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    {selectedFaculty ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">Selected Faculty</p>
                        <p className="text-base font-semibold text-gray-900 mb-1">{selectedFaculty.name || selectedFaculty.fullname}</p>
                        <p className="text-sm text-gray-600">{selectedFaculty.email}</p>
                        {selectedFaculty.designation && (
                          <p className="text-xs text-gray-500 mt-1">{selectedFaculty.designation}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500">No faculty selected</p>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-[200px]">
                    {selectedSection ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-green-900 mb-2 uppercase tracking-wide">Selected Section</p>
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
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2 whitespace-nowrap transform hover:scale-105"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Assign Faculty to Section</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && faculty.length === 0 && sections.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No faculty or students found in your department.</p>
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
