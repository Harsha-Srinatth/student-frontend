/**
 * Single source of truth for leaderboard/score columns.
 * Used by: LeaderboardTablePage, topTenSudents, AllStudentsWithScore.
 */
export const LEADERBOARD_TABS = [
    { key: "problemSolvingRank", label: "Competitive Exams Score" },
  { key: "teachingPoints", label: "Teaching Score" },
  { key: "projectsPoints", label: "Projects Score" },
  { key: "coCurricularPoints", label: "Technical Activities Score"},
  { key: "extraCurricularPoints", label: "Sports Score" },
  { key: "weightedPoints", label: "Weekly Performances" },
];

export const MEDAL = ["🥇", "🥈", "🥉"];