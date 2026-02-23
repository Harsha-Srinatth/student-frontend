import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Fetch faculty members in HOD's department
 */
export const fetchDepartmentFaculty = createAsyncThunk(
  'hodAssignment/fetchDepartmentFaculty',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { faculty, facultyLoading } = state.hodAssignment;
      
      // Return from cache if data exists and not loading
      if (!facultyLoading && Array.isArray(faculty) && faculty.length > 0) {
        return { fromCache: true, data: faculty };
      }
      
      const response = await api.get('/hod/faculty');
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch faculty members');
    }
  }
);

/**
 * Fetch students grouped by sections in HOD's department
 */
export const fetchDepartmentStudents = createAsyncThunk(
  'hodAssignment/fetchDepartmentStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { students, studentsLoading } = state.hodAssignment;
      
      // Return from cache if data exists and not loading
      if (!studentsLoading && Array.isArray(students) && students.length > 0) {
        return { fromCache: true, data: students };
      }
      
      const response = await api.get('/hod/students');
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

/**
 * Fetch existing faculty assignments
 */
export const fetchFacultyAssignments = createAsyncThunk(
  'hodAssignment/fetchFacultyAssignments',
  async (facultyId, { rejectWithValue }) => {
    try {
      if (!facultyId) {
        return [];
      }
      const response = await api.get(`/hod/assignments?facultyId=${facultyId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }
);

/**
 * Assign faculty to a section (all students in that section)
 */
export const assignFacultyToSection = createAsyncThunk(
  'hodAssignment/assignFacultyToSection',
  async ({ facultyId, section, assignmentType, notes }, { rejectWithValue }) => {
    try {
      const response = await api.post('/hod/assign', {
        facultyId,
        section,
        assignmentType: assignmentType || 'Mentor',
        notes: notes || null
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign faculty to section');
    }
  }
);

/**
 * Get sections assigned to a faculty member
 */
export const fetchFacultySections = createAsyncThunk(
  'hodAssignment/fetchFacultySections',
  async (facultyId, { rejectWithValue }) => {
    try {
      if (!facultyId) {
        return [];
      }
      const response = await api.get(`/hod/faculty/${facultyId}/sections`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch faculty sections');
    }
  }
);

/**
 * Remove faculty assignment from a section
 */
export const removeFacultyAssignment = createAsyncThunk(
  'hodAssignment/removeFacultyAssignment',
  async ({ facultyId, section }, { rejectWithValue }) => {
    try {
      const response = await api.delete('/hod/assign', {
        data: { facultyId, section }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove faculty assignment');
    }
  }
);

const hodAssignmentSlice = createSlice({
  name: 'hodAssignment',
  initialState: {
    faculty: [],
    facultyLoading: false,
    facultyError: null,
    
    students: [],
    sections: [], // Grouped sections with students
    studentsLoading: false,
    studentsError: null,
    
    assignments: [], // Current assignments for selected faculty
    assignmentsLoading: false,
    assignmentsError: null,
    
    facultySections: [], // Sections assigned to selected faculty
    facultySectionsLoading: false,
    facultySectionsError: null,
    
    assigning: false,
    assignError: null,
    
    hodInfo: null, // HOD information (department, etc.)
  },
  reducers: {
    clearError: (state) => {
      state.facultyError = null;
      state.studentsError = null;
      state.assignmentsError = null;
      state.assignError = null;
    },
    clearAssignments: (state) => {
      state.assignments = [];
      state.facultySections = [];
    },
    setHODInfo: (state, action) => {
      state.hodInfo = action.payload;
    },
    // Group students by section (programName)
    groupStudentsBySection: (state) => {
      const grouped = {};
      
      state.students.forEach(student => {
        // Use programName as section identifier
        const sectionKey = student.programName || student.section || 'UNASSIGNED';
        if (!grouped[sectionKey]) {
          grouped[sectionKey] = [];
        }
        grouped[sectionKey].push(student);
      });
      
      // Display programName as section
      state.sections = Object.entries(grouped).map(([section, students]) => ({
        name: section, // programName is the section (e.g., "CSBS", "IT-A", "CSE-A")
        section: section, // Actual programName value for assignment
        studentCount: students.length,
        students
      }));
    },
    invalidateCache: (state) => {
      state.faculty = [];
      state.students = [];
      state.sections = [];
      state.assignments = [];
      state.facultySections = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch faculty
      .addCase(fetchDepartmentFaculty.pending, (state) => {
        state.facultyLoading = true;
        state.facultyError = null;
      })
      .addCase(fetchDepartmentFaculty.fulfilled, (state, action) => {
        state.facultyLoading = false;
        if (action.payload && !action.payload.fromCache) {
          // Handle different response structures
          const data = Array.isArray(action.payload) 
            ? action.payload 
            : (action.payload.data || action.payload || []);
          state.faculty = Array.isArray(data) ? data : [];
        }
        state.facultyError = null;
      })
      .addCase(fetchDepartmentFaculty.rejected, (state, action) => {
        state.facultyLoading = false;
        state.facultyError = action.payload;
      })
      // Fetch students
      .addCase(fetchDepartmentStudents.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(fetchDepartmentStudents.fulfilled, (state, action) => {
        state.studentsLoading = false;
        if (action.payload && !action.payload.fromCache) {
          // Handle different response structures
          const data = Array.isArray(action.payload) 
            ? action.payload 
            : (action.payload.data || action.payload || []);
          state.students = Array.isArray(data) ? data : [];
          
          // Auto-group students by section (programName)
          const grouped = {};
          state.students.forEach(student => {
            // Use programName as section identifier
            const sectionKey = student.programName || student.section || 'UNASSIGNED';
            if (!grouped[sectionKey]) {
              grouped[sectionKey] = [];
            }
            grouped[sectionKey].push(student);
          });
          
          // Use department from HOD info or from first student for display context only
          const departmentCode = state.hodInfo?.department?.code || 
                                state.hodInfo?.department?.name?.toUpperCase().substring(0, 3) ||
                                (state.students.length > 0 ? state.students[0].department_id?.toUpperCase().substring(0, 3) : '');
          
          state.sections = Object.entries(grouped).map(([section, students]) => ({
            // Display name with department prefix for clarity, but section value is the actual programName
            name: section, // programName is the section (e.g., "CSBS", "IT-A", "CSE-A")
            section: section, // This is the actual programName used for assignment
            studentCount: students.length,
            students
          }));
        }
        state.studentsError = null;
      })
      .addCase(fetchDepartmentStudents.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      })
      // Fetch assignments
      .addCase(fetchFacultyAssignments.pending, (state) => {
        state.assignmentsLoading = true;
        state.assignmentsError = null;
      })
      .addCase(fetchFacultyAssignments.fulfilled, (state, action) => {
        state.assignmentsLoading = false;
        state.assignments = Array.isArray(action.payload) ? action.payload : [];
        state.assignmentsError = null;
      })
      .addCase(fetchFacultyAssignments.rejected, (state, action) => {
        state.assignmentsLoading = false;
        state.assignmentsError = action.payload;
      })
      // Assign faculty to section
      .addCase(assignFacultyToSection.pending, (state) => {
        state.assigning = true;
        state.assignError = null;
      })
      .addCase(assignFacultyToSection.fulfilled, (state, action) => {
        state.assigning = false;
        // Refresh assignments and sections after successful assignment
        state.assignError = null;
      })
      .addCase(assignFacultyToSection.rejected, (state, action) => {
        state.assigning = false;
        state.assignError = action.payload;
      })
      // Fetch faculty sections
      .addCase(fetchFacultySections.pending, (state) => {
        state.facultySectionsLoading = true;
        state.facultySectionsError = null;
      })
      .addCase(fetchFacultySections.fulfilled, (state, action) => {
        state.facultySectionsLoading = false;
        state.facultySections = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
        state.facultySectionsError = null;
      })
      .addCase(fetchFacultySections.rejected, (state, action) => {
        state.facultySectionsLoading = false;
        state.facultySectionsError = action.payload;
      })
      // Remove assignment
      .addCase(removeFacultyAssignment.pending, (state) => {
        state.assigning = true;
        state.assignError = null;
      })
      .addCase(removeFacultyAssignment.fulfilled, (state, action) => {
        state.assigning = false;
        state.assignError = null;
      })
      .addCase(removeFacultyAssignment.rejected, (state, action) => {
        state.assigning = false;
        state.assignError = action.payload;
      });
  }
});

export const {
  clearError,
  clearAssignments,
  setHODInfo,
  groupStudentsBySection,
  invalidateCache
} = hodAssignmentSlice.actions;

/**
 * Selector: assignment stats derived from faculty and sections.
 * Use in HOD Assignment page and Dashboard to avoid computing twice.
 */
export const selectAssignmentStats = (state) => {
  const faculty = state.hodAssignment?.faculty ?? [];
  const sections = state.hodAssignment?.sections ?? [];
  const totalFaculty = faculty.length;
  const totalSections = sections.length;
  const totalStudents = sections.reduce((sum, s) => sum + (s.studentCount || 0), 0);
  const assignedFacultyCount = faculty.filter((f) => (f.sectionsAssigned || []).length > 0).length;
  return {
    totalFaculty,
    totalSections,
    totalStudents,
    assignedFacultyCount,
  };
};

export default hodAssignmentSlice.reducer;

