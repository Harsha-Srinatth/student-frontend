/**
 * Helper functions to merge real-time data with existing Redux state
 */

/**
 * Merge real-time counts with existing counts
 * Real-time values take precedence if they exist
 */
export const mergeCounts = (existingCounts, realtimeCounts) => {
  if (!realtimeCounts || Object.keys(realtimeCounts).length === 0) {
    return existingCounts;
  }

  const merged = { ...existingCounts };
  
  Object.keys(realtimeCounts).forEach((key) => {
    if (realtimeCounts[key] !== null && realtimeCounts[key] !== undefined) {
      merged[key] = realtimeCounts[key];
    }
  });

  return merged;
};

/**
 * Merge real-time arrays with existing arrays
 * Real-time arrays take precedence if they exist (even if empty)
 */
export const mergeArrays = (existingArray, realtimeArray) => {
  // If realtimeArray is explicitly provided (not null/undefined), use it
  // This allows real-time updates to clear arrays (empty array) or update them
  if (realtimeArray !== null && realtimeArray !== undefined) {
    return realtimeArray;
  }
  // Otherwise, use existing array
  return existingArray || [];
};

/**
 * Get merged student dashboard data
 */
export const getMergedStudentData = (studentState, realtimeState) => {
  const realtime = realtimeState?.student || {};
  
  return {
    counts: mergeCounts(studentState.counts || {}, realtime.counts || {}),
    pendingApprovals: mergeArrays(
      studentState.pendingApprovals || [],
      realtime.pendingApprovals
    ),
    rejectedApprovals: mergeArrays(
      studentState.rejectedApprovals || [],
      realtime.rejectedApprovals
    ),
    approvedApprovals: mergeArrays(
      studentState.approvedApprovals || [],
      realtime.approvedApprovals
    ),
    announcements: mergeArrays(
      studentState.announcements || [],
      realtime.announcements
    ),
  };
};

/**
 * Get merged faculty dashboard data
 */
export const getMergedFacultyData = (facultyState, realtimeState) => {
  const realtime = realtimeState?.faculty || {};
  
  return {
    stats: mergeCounts(facultyState.stats || {}, realtime.stats || {}),
    pendingApprovals: mergeArrays(
      facultyState.pendingApprovals || [],
      realtime.pendingApprovals
    ),
    activities: realtime.activities || facultyState.activities || {},
    metrics: realtime.metrics || facultyState.metrics || {},
  };
};

/**
 * Selector helper to get real-time enabled data
 * Use this in components to get data that includes real-time updates
 */
export const createRealtimeSelector = (baseSelector, mergeFn) => {
  return (state) => {
    const baseData = baseSelector(state);
    const realtimeData = state.realtime;
    return mergeFn(baseData, realtimeData);
  };
};

