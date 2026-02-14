// Chart color schemes and configurations - Professional Blue Theme
export const CHART_COLORS = {
  primary: '#2563eb',      // Professional blue
  secondary: '#0ea5e9',    // Sky blue
  success: '#059669',      // Emerald green
  warning: '#d97706',      // Amber
  danger: '#dc2626',        // Red
  info: '#0284c7',         // Cyan blue
  gradient: {
    start: '#1e40af',      // Deep blue
    end: '#3b82f6',        // Bright blue
  },
};

export const PIE_CHART_COLORS = [
  '#2563eb', // Professional blue
  '#059669', // Emerald green
  '#0284c7', // Cyan blue
  '#0ea5e9', // Sky blue
  '#0891b2', // Teal
  '#0369a1', // Deep sky
  '#0d9488', // Teal green
  '#1e40af', // Deep blue
  '#1d4ed8', // Royal blue
  '#3b82f6', // Bright blue
];

export const ATTENDANCE_COLORS = {
  excellent: '#059669', // Emerald green
  good: '#0284c7',     // Cyan blue
  average: '#d97706',  // Amber
  poor: '#dc2626',     // Red
};

export const CHART_CONFIG = {
  barChart: {
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
    barSize: 40,
  },
  pieChart: {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    outerRadius: 120,
    innerRadius: 60,
  },
  responsive: {
    mobile: { height: 250 },
    tablet: { height: 300 },
    desktop: { height: 400 },
  },
};

