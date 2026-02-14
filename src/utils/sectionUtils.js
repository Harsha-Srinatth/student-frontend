/**
 * Calculate year from semester
 * @param {number|string} semester - Semester number (1-8)
 * @returns {number} Year (1-4)
 */
export const getYearFromSemester = (semester) => {
  const sem = parseInt(semester) || 1;
  return Math.ceil(sem / 2);
};

/**
 * Get year label
 * @param {number} year - Year number (1-4)
 * @returns {string} Year label
 */
export const getYearLabel = (year) => {
  const yearNum = parseInt(year) || 1;
  const labels = {
    1: '1st Year',
    2: '2nd Year',
    3: '3rd Year',
    4: '4th Year'
  };
  return labels[yearNum] || `${yearNum}th Year`;
};

/**
 * Group sections by year
 * @param {Array} sections - Array of section objects
 * @returns {Object} Sections grouped by year
 */
export const groupSectionsByYear = (sections) => {
  const grouped = {};
  
  sections.forEach(section => {
    // Calculate year from students in section
    const years = new Set();
    if (section.students && section.students.length > 0) {
      section.students.forEach(student => {
        const year = getYearFromSemester(student.semester);
        years.add(year);
      });
    }
    
    // If no students, try to infer from section name (e.g., "1" might be 1st year)
    if (years.size === 0) {
      const sectionNum = parseInt(section.section);
      if (!isNaN(sectionNum) && sectionNum <= 8) {
        years.add(getYearFromSemester(sectionNum));
      }
    }
    
    // Add section to all relevant years
    years.forEach(year => {
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push({
        ...section,
        year: year,
        yearLabel: getYearLabel(year)
      });
    });
  });
  
  return grouped;
};

/**
 * Filter sections by year
 * @param {Array} sections - Array of section objects
 * @param {number|null} year - Year to filter by (null for all)
 * @returns {Array} Filtered sections
 */
export const filterSectionsByYear = (sections, year) => {
  if (!year) return sections;
  
  return sections.filter(section => {
    if (section.students && section.students.length > 0) {
      return section.students.some(student => {
        const studentYear = getYearFromSemester(student.semester);
        return studentYear === year;
      });
    }
    
    // Fallback: infer from section name
    const sectionNum = parseInt(section.section);
    if (!isNaN(sectionNum) && sectionNum <= 8) {
      return getYearFromSemester(sectionNum) === year;
    }
    
    return false;
  });
};

/**
 * Get assigned sections for a faculty
 * @param {Object} faculty - Faculty object
 * @returns {Array} Array of assigned section objects with year info
 */
export const getFacultyAssignedSections = (faculty) => {
  if (!faculty || !faculty.sectionsAssigned) return [];
  
  return faculty.sectionsAssigned.map(assignment => ({
    section: assignment.section,
    assignmentType: assignment.assignmentType,
    notes: assignment.notes,
    assignedAt: assignment.assignedAt,
    assignedBy: assignment.assignedBy,
    // Year will be calculated when sections are loaded
  }));
};

