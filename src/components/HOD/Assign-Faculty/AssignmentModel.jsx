import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, UserCheck, AlertCircle, Loader2, Calendar, Users, BookOpen } from 'lucide-react';
import { assignFacultyToSection } from '../../../features/HOD/hodAssignmentSlice';
import { getYearFromSemester, getYearLabel } from '../../../utils/sectionUtils';

const ASSIGNMENT_TYPES = [
  'Mentor',
  'Academic Advisor',
  'Project Guide',
  'Research Supervisor',
  'Course Coordinator'
];  

export default function AssignmentModal({
  faculty,
  section,
  onClose,
  onSuccess
}) {
  const dispatch = useDispatch();
  const { assigning, assignError } = useSelector((state) => state.hodAssignment);
  const [assignmentType, setAssignmentType] = useState('Mentor');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  // Get year information for the section
  const getSectionYears = () => {
    if (section.students && section.students.length > 0) {
      const years = new Set();
      section.students.forEach(student => {
        const year = getYearFromSemester(student.semester);
        years.add(year);
      });
      return Array.from(years).sort();
    }
    return [];
  };

  const sectionYears = getSectionYears();
  const isAlreadyAssigned = faculty?.sectionsAssigned?.some(
    assignment => assignment.section === section.section
  );

  const handleAssignSection = async () => {
    const facultyId = faculty?.id || faculty?.facultyid;
    if (!facultyId || !section?.section) return;

    setError(null);

    try {
      const result = await dispatch(assignFacultyToSection({
        facultyId: facultyId,
        section: section.section,
        assignmentType,
        notes: notes.trim() || null
      })).unwrap();

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error assigning faculty to section:', err);
      setError(err || 'Failed to assign faculty to section. Please try again.');
    }
  };

  const displayError = assignError || error;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Assign Faculty to Section</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {displayError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{displayError}</p>
              </div>
            </div>
          )}

          {/* Already Assigned Warning */}
          {isAlreadyAssigned && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  This faculty is already assigned to Section {section.section}. 
                  Assigning again will update the assignment.
                </p>
              </div>
            </div>
          )}

          {/* Faculty Information */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <UserCheck className="h-5 w-5 text-teal-700" />
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Faculty Member</h3>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">{faculty.name || faculty.fullname}</p>
              <p className="text-sm text-gray-600">{faculty.email}</p>
              {faculty.designation && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Designation:</span> {faculty.designation}
                </p>
              )}
              {faculty.sectionsAssigned && faculty.sectionsAssigned.length > 0 && (
                <div className="mt-3 pt-3 border-t border-teal-200">
                  <p className="text-xs font-semibold text-teal-700 mb-2">Currently Assigned To:</p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.sectionsAssigned.map((assignment, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200"
                      >
                        Section {assignment.section}
                        {assignment.assignmentType && ` • ${assignment.assignmentType}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Information */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5 text-teal-700" />
              <h3 className="text-sm font-semibold text-green-900 uppercase tracking-wide">Student Section</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-teal-700 to-teal-800 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  Section {section.name}
                </div>
                {sectionYears.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {sectionYears.map((year, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200"
                      >
                        {getYearLabel(year)}  
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>
                    <span className="font-semibold text-gray-900">{section.studentCount}</span> total students
                  </span>
                </div>
                {sectionYears.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{sectionYears.map(y => getYearLabel(y)).join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-teal-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Impact:</span> This assignment will be applied to all{' '}
                  <span className="font-bold text-teal-700">{section.studentCount}</span> students in Section {section.name}.
                  {sectionYears.length > 0 && (
                    <span> These students are in {sectionYears.map(y => getYearLabel(y)).join(' and ')}.</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
            >
              {ASSIGNMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this assignment..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">These notes will be stored with the assignment record.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            disabled={assigning}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignSection}
            disabled={assigning}
            className="px-6 py-2.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
          >
            {assigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>{isAlreadyAssigned ? 'Update Assignment' : 'Assign to Section'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
