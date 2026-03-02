/**
 * Single source of truth for leaderboard/score columns.
 * Used by: LeaderboardTablePage, topTenSudents, AllStudentsWithScore.
 */
export const LEADERBOARD_TABS = [
  { key: "weightedPoints", label: "Overall Performance" },
  { key: "teachingPoints", label: "Teaching Score" },
  { key: "projectsPoints", label: "Projects Score" },
  { key: "extraCurricularPoints", label: "Beyond Academics Score" },
  { key: "coCurricularPoints", label: "Technical Activities Score" },
  { key: "problemSolvingRank", label: "Problem Solving Score" },
];

export const MEDAL = ["🥇", "🥈", "🥉"];