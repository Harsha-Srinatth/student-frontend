import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Users, Search, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import { fetchDepartmentStudents, fetchFacultyAssignments } from '../../../features/HOD/hodAssignmentSlice';
import { filterSectionsByYear, getYearFromSemester, getYearLabel } from '../../../utils/sectionUtils';
import YearFilter from './YearFilter';

export default function StudentList({
  onSelectSection,
  selectedSection,
  selectedFacultyId
}) {
  const dispatch = useDispatch();
  const { sections, studentsLoading, studentsError, assignments } = useSelector((state) => state.hodAssignment);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);

  // Parent HodAssignment already fetches students on mount; avoid duplicate requests (prevents ERR_INSUFFICIENT_RESOURCES)
  useEffect(() => {
    if (selectedFacultyId) {
      dispatch(fetchFacultyAssignments(selectedFacultyId));
    }
  }, [dispatch, selectedFacultyId]);

  // Get year for a section
  const getSectionYear = (section) => {
    if (section.students && section.students.length > 0) {
      const years = new Set();
      section.students.forEach(student => {
        const year = getYearFromSemester(student.semester);
        years.add(year);
      });
      return Array.from(years).sort();
    }
    
    // Fallback: infer from section name
    const sectionNum = parseInt(section.section);
    if (!isNaN(sectionNum) && sectionNum <= 8) {
      return [getYearFromSemester(sectionNum)];
    }
    
    return [];
  };

  const getAssignedStudentCount = (section) => {
    if (!selectedFacultyId || !assignments || assignments.length === 0) {
      return 0;
    }
    return section.students.filter(s =>
      assignments.some(a => 
        (a.student_id === s.id || a.student_id === s.studentid) &&
        (a.faculty_id === selectedFacultyId || a.facultyid === selectedFacultyId)
      )
    ).length;
  };

  const isAnyAssigned = (section) => {
    return getAssignedStudentCount(section) > 0;
  };

  // Filter sections by search and year
  let filteredSections = sections.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.section?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply year filter
  if (selectedYear) {
    filteredSections = filterSectionsByYear(filteredSections, selectedYear);
  }

  // Sort sections by year and section name
  filteredSections.sort((a, b) => {
    const aYears = getSectionYear(a);
    const bYears = getSectionYear(b);
    if (aYears.length > 0 && bYears.length > 0) {
      if (aYears[0] !== bYears[0]) {
        return aYears[0] - bYears[0];
      }
    }
    return a.section.localeCompare(b.section);
  });

  if (studentsLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading students</p>
          <p className="text-sm mt-1">{studentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Sections</h2>
              <p className="text-sm text-gray-600">
                {filteredSections.length} of {sections.length} sections
                {selectedYear && ` • ${getYearLabel(selectedYear)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-4">
          <YearFilter selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections (e.g., 1, A, B)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto">
        {filteredSections.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{searchQuery || selectedYear ? 'No sections found' : 'No students available'}</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery || selectedYear 
                ? 'Try adjusting your filters' 
                : 'There are no students in your department yet.'}
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const isPartiallyAssigned = isAnyAssigned(section);
            const assignedCount = getAssignedStudentCount(section);
            const sectionYears = getSectionYear(section);
            const isSelected = selectedSection === section.section;

            return (
              <div
                key={section.section}
                onClick={() => onSelectSection(section)}
                className={`px-6 py-4 transition-all cursor-pointer ${
                  isPartiallyAssigned && selectedFacultyId
                    ? 'hover:bg-yellow-50'
                    : 'hover:bg-green-50'
                } ${
                  isSelected
                    ? 'bg-green-50 border-l-4 border-green-600'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm min-w-fit">
                        Section {section.name}
                      </div>
                      
                      {/* Year badges */}
                      {sectionYears.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {sectionYears.map((year, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                            >
                              {getYearLabel(year)}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {isPartiallyAssigned && selectedFacultyId && (
                        <span className="flex items-center text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {assignedCount} assigned
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>
                        <span className="font-semibold text-gray-900">{section.studentCount}</span>
                        <span> total students</span>
                        {selectedFacultyId && (
                          <span className="text-gray-500">
                            {' • '}
                            <span className="font-medium text-green-600">
                              {section.studentCount - assignedCount}
                            </span>
                            {' available'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isSelected
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${
                        isSelected
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
