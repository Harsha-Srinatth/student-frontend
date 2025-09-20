import { 
  Home, Upload, Award, Briefcase, ClipboardList, BookOpenCheck, 
  Megaphone, Settings, CheckCircle2, History, Users, FileCheck, 
  GraduationCap, BarChart3 
} from "lucide-react";

// 🎓 Student Sidebar Links
export const StudentSidebarLinks = [
  { icon: <Home size={20} />, label: 'Dashboard', route: '/student/home' },
  { icon: <Upload size={20} />, label: 'Upload Files', route: '/student/upload' },
  { icon: <Award size={20} />, label: 'Achievements', route: '/student/achievements/all/docs' },
  { icon: <Briefcase size={20} />, label: 'Portfolio', route: '/student/generate/digital/port-folio' },
  { icon: <ClipboardList size={20} />, label: 'Pending Tasks', route: '/student/pending/approvels' },
  { icon: <BarChart3 size={20} />, label: 'Results', route: '/student/results' },
  { icon: <Users size={20} />, label: 'Club Enrolment', route: '/student/clubs/enrol' },
  { icon: <Megaphone size={20} />, label: 'Announcements', route: '/student/announcements' },
  { icon: <Settings size={20} />, label: 'Settings', route: '/student/settings' },
];

// 👨‍🏫 Faculty Sidebar Links
export const FacultySidebarLinks = [
  { icon: <Home size={20} />, label: 'Dashboard', route: '/faculty/home' },
  { icon: <CheckCircle2 size={20} />, label: 'Activity Approvals', route: '/faculty/pending-approvals' },
  { icon: <History size={20} />, label: 'Verification History', route: '/faculty/verifications' },
  { icon: <Users size={20} />, label: 'Student Profiles', route: '/faculty/search/student-profiles' },
  { icon: <FileCheck size={20} />, label: 'Approvals Manager', route: '/faculty/Approvels/docs/students' },
  { icon: <ClipboardList size={20} />, label: 'Attendance', route: '/faculty/add/attendance' },
  { icon: <BookOpenCheck size={20} />, label: 'Marks Entry', route: '/faculty/add/marks' },
  { icon: <Megaphone size={20} />, label: 'Announcements', route: '/faculty/announcements' },
  { icon: <Settings size={20} />, label: 'Settings', route: '/faculty/settings' },
];

// 📱 Student Bottom Bar (Mobile)
// 📱 Updated Student Bottom Bar (Mobile)
export const StudentBottombarLinks = [
  { icon: <Home size={20} />, label: 'Home', route: '/student/home' },
  { icon: <Upload size={20} />, label: 'Upload Files', route: '/student/upload' },
  { icon: <ClipboardList size={20} />, label: 'Pending Tasks', route: '/student/pending/approvels' },
  { icon: <Award size={20} />, label: 'Achievements', route: '/student/achievements/all/docs' },
];


// 📱 Faculty Bottom Bar (Mobile)
export const FacultyBottombarLinks = [
  { icon: <Home size={20} />, label: 'Home', route: '/faculty/home' },
  { icon: <CheckCircle2 size={20} />, label: 'Approvals', route: '/faculty/pending-approvals' },
  { icon: <History size={20} />, label: 'Verifications', route: '/faculty/verifications' },
  { icon: <Megaphone size={20} />, label: 'Announcements', route: '/faculty/announcements' },
];
