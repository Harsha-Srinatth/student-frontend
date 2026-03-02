/**
 * Filter options for student points/scores (matches studentDetails.js fields).
 * Used in dashboard "View All" to sort/filter students by point type.
 */
export const POINT_FILTER_OPTIONS = [
  { value: "teachingPoints", label: "Teaching Points" },
  { value: "projectsPoints", label: "Projects Points" },
  { value: "problemSolvingRank", label: "Problem Solving" },
  { value: "extraCurricularPoints", label: "Beyond Academics" },
  { value: "coCurricularPoints", label: "Technical Activities" },
  { value: "weightedPoints", label: "Overall Performance" },
];

export default POINT_FILTER_OPTIONS;
