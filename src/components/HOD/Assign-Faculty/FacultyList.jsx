import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Mail, Phone, BookOpen, Search, CheckCircle2, Calendar } from 'lucide-react';
import { fetchDepartmentFaculty } from '../../../features/HOD/hodAssignmentSlice';
import { getFacultyAssignedSections, getYearLabel } from '../../../utils/sectionUtils';

export default function FacultyList({ onSelectFaculty, selectedFacultyId }) {
  const dispatch = useDispatch();
  const { faculty, facultyLoading, facultyError } = useSelector((state) => state.hodAssignment);
  const { sections } = useSelector((state) => state.hodAssignment);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchDepartmentFaculty());
  }, [dispatch]);

  // Get assigned sections for each faculty with year info
  const getFacultySectionsWithYear = (facultyMember) => {
    if (!facultyMember || !facultyMember.sectionsAssigned) return [];
    
    const assignedSections = facultyMember.sectionsAssigned || [];
    
    // Match with actual sections to get year info
    return assignedSections.map(assignment => {
      const sectionData = sections.find(s => s.section === assignment.section);
      if (sectionData && sectionData.students && sectionData.students.length > 0) {
        const years = new Set();
        sectionData.students.forEach(student => {
          const year = Math.ceil((parseInt(student.semester) || 1) / 2);
          years.add(year);
        });
        return {
          ...assignment,
          years: Array.from(years).sort(),
        };
      }
      // If section not found in current sections, return assignment without year info
      return assignment;
    });
  };

  const filteredFaculty = faculty.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.designation && f.designation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (facultyLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (facultyError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading faculty</p>
          <p className="text-sm mt-1">{facultyError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Faculty Members</h2>
              <p className="text-sm text-gray-600">{faculty.length} members in your department</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty by name, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto">
        {filteredFaculty.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No faculty members found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Add faculty members to get started'}
            </p>
          </div>
        ) : (
          filteredFaculty.map((member) => {
            const isSelected = selectedFacultyId === (member.id || member.facultyid);
            const assignedSections = getFacultySectionsWithYear(member);
            const hasAssignments = assignedSections.length > 0;

            return (
              <div
                key={member.id || member.facultyid}
                onClick={() => onSelectFaculty(member)}
                className={`px-6 py-4 hover:bg-blue-50 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {member.name || member.fullname}
                      </h3>
                      {hasAssignments && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {assignedSections.length} {assignedSections.length === 1 ? 'Section' : 'Sections'}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.designation && (
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">{member.designation}</span>
                        </div>
                      )}
                    </div>

                    {/* Show assigned sections */}
                    {hasAssignments && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-1 mb-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-700">Assigned Sections:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedSections.map((assignment, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                            >
                              <span className="font-bold mr-1">{assignment.section}</span>
                              {assignment.years && assignment.years.length > 0 && (
                                <span className="text-blue-600">
                                  ({assignment.years.map(y => getYearLabel(y)).join(', ')})
                                </span>
                              )}
                              {assignment.assignmentType && (
                                <span className="ml-1 text-blue-500">• {assignment.assignmentType}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </div>
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
