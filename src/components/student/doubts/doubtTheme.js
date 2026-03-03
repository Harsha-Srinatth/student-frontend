/**
 * Doubts feature theme — teal/emerald palette (matches student portal).
 * Production-friendly, accessible, works on all devices.
 */

export const DOUBT_COLORS = {
  // Backgrounds
  pageBg: "bg-[#F0FDFA]",
  cardBg: "bg-white",
  cardHover: "hover:bg-[#ECFDF5]",
  inputBg: "bg-[#F0FDFA]",
  messageOther: "bg-[#E6FFFA]",
  messageMine: "bg-[#0D9488]",
  messageMineLight: "bg-[#14B8A6]",

  // Borders
  border: "border-[#CCFBF1]",
  borderFocus: "border-[#0D9488]",
  ring: "ring-[#0D9488]/20",

  // Text
  textPrimary: "text-[#134E4A]",
  textSecondary: "text-[#0F766E]",
  textMuted: "text-[#64748B]",
  textOnBrown: "text-white",

  // Primary actions (teal shades)
  primary: "bg-[#0D9488]",
  primaryHover: "hover:bg-[#0F766E]",
  primaryLight: "bg-[#5EEAD4]",
  primarySubtle: "bg-[#CCFBF1]",

  // Tabs
  tabActive: "bg-[#0D9488] text-white",
  tabInactive: "bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]",

  // Tags (teal/green/slate)
  tag: {
    general: "bg-[#E0F2F1] text-[#115E59]",
    academics: "bg-[#B2DFDB] text-[#0D5C52]",
    placements: "bg-[#80CBC4] text-[#004D40]",
    exams: "bg-[#A7F3D0] text-[#065F46]",
    events: "bg-[#D1FAE5] text-[#047857]",
    hostel: "bg-[#CCFBF1] text-[#0F766E]",
    library: "bg-[#B2F5EA] text-[#0D5C52]",
    sports: "bg-[#A7F3D0] text-[#065F46]",
    technical: "bg-[#C4B5FD] text-[#4C1D95]",
    other: "bg-[#E2E8F0] text-[#475569]",
  },

  // States
  solved: "bg-[#86EFAC] text-[#14532D]",
  delete: "text-[#DC2626] hover:text-[#B91C1C] hover:bg-[#FEE2E2]",
  error: "text-[#DC2626]",
  success: "text-[#059669]",
};

export const DOUBT_ANIMATION = {
  fadeIn: "transition-opacity duration-200 ease-out",
  fadeInUp: "transition-all duration-300 ease-out",
  cardHover: "transition-all duration-200 ease-out",
  buttonPress: "active:scale-[0.98] transition-transform duration-100",
};

export const TAGS = [
  "general",
  "academics",
  "placements",
  "exams",
  "events",
  "hostel",
  "library",
  "sports",
  "technical",
  "other",
];

export function getTagClass(tag) {
  return DOUBT_COLORS.tag[tag] || DOUBT_COLORS.tag.general;
}
