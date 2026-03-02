/**
 * Doubts feature theme — warm brown/cream palette (no AI-style blues).
 * Production-friendly, accessible, works on all devices.
 */

export const DOUBT_COLORS = {
  // Backgrounds
  pageBg: "bg-[#FAF8F5]",
  cardBg: "bg-white",
  cardHover: "hover:bg-[#FDFCFA]",
  inputBg: "bg-[#F8F6F2]",
  messageOther: "bg-[#F0EDE8]",
  messageMine: "bg-[#8B7355]", // warm brown
  messageMineLight: "bg-[#A0826D]",

  // Borders
  border: "border-[#E8E4DE]",
  borderFocus: "border-[#8B7355]",
  ring: "ring-[#8B7355]/20",

  // Text
  textPrimary: "text-[#3D3A36]",
  textSecondary: "text-[#6B6560]",
  textMuted: "text-[#8C8782]",
  textOnBrown: "text-white",

  // Primary actions (brown shades)
  primary: "bg-[#8B7355]",
  primaryHover: "hover:bg-[#7A6549]",
  primaryLight: "bg-[#C4B5A0]",
  primarySubtle: "bg-[#EDE8E2]",

  // Tabs
  tabActive: "bg-[#8B7355] text-white",
  tabInactive: "bg-[#EDE8E2] text-[#6B6560] hover:bg-[#E0DAD2]",

  // Tags (warm, muted)
  tag: {
    general: "bg-[#E8E4DE] text-[#5C564D]",
    academics: "bg-[#D4C4B0] text-[#5C4A3A]",
    placements: "bg-[#C9B8A8] text-[#4A3D32]",
    exams: "bg-[#D4B5A5] text-[#5C4030]",
    events: "bg-[#E8DCC8] text-[#5C5040]",
    hostel: "bg-[#D9C9B8] text-[#4A4035]",
    library: "bg-[#C4B8A8] text-[#4A453D]",
    sports: "bg-[#B8C4A8] text-[#3D4A35]",
    technical: "bg-[#B8A8C4] text-[#3D354A]",
    other: "bg-[#D0D0CC] text-[#4A4A45]",
  },

  // States
  solved: "bg-[#9CAF82] text-[#2D3A20]", // soft green
  delete: "text-[#A65D4A] hover:text-[#8B4A3A] hover:bg-[#F5E8E5]",
  error: "text-[#A65D4A]",
  success: "text-[#5A7A4A]",
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
