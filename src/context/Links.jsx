import { 
    Home, Upload, Trophy, IdCard, Hourglass, Megaphone, Settings, 
    CheckCircle, History, Users, School, Medal, ListChecks 
  } from "lucide-react";
  
  
  // Student Sidebar Links
  export const StudentSidebarLinks = [
    { icon: <Home size={20} />, label: 'Home', route: '/student/home' },
    { icon: <Upload size={20} />, label: 'Upload Documents', route: '/student/upload' },
    { icon: <Trophy size={20} />, label: 'My Achievements', route: '/student/achievements/all/docs' },
    { icon: <IdCard size={20} />, label: 'Digital Portfolio', route: '/student/generate/digital/port-folio' },
    { icon: <Hourglass size={20} />, label: 'Pending Approvals', route: '/student/pending/approvels' },
    { icon: <Megaphone size={20} />, label: 'Announcements', route: '/student/announcements' },
    { icon: <Settings size={20} />, label: 'Settings', route: '/student/settings' },
  ];
  
  // Faculty Sidebar Links
  export const FacultySidebarLinks = [
    { icon: <Home size={20} />, label: 'Home', route: '/faculty/home' },
    { icon: <CheckCircle size={20} />, label: 'Student Activity Validation', route: '/faculty/pending-approvals' },
    { icon: <History size={20} />, label: 'Recent Verifications', route: '/faculty/verifications' },
    { icon: <Users size={20} />, label: 'Student Profiles', route: '/faculty/search/student-profiles' },
    { icon: <School size={20} />, label: 'Approvels Manager', route: '/faculty/Approvels/docs/students' },
    { icon: <Medal size={20} />, label: 'Events & Competitions', route: '/faculty/events/competitions' },
    { icon: <Megaphone size={20} />, label: 'Announcements', route: '/faculty/announcements' },
    { icon: <Settings size={20} />, label: 'Settings', route: '/faculty/settings' },
  ];
  
  // Student Bottom Bar Links (Mobile)
  export const StudentBottombarLinks = [
    { icon: <Home size={20} />, label: 'Home', route: '/student/home' },
    { icon: <ListChecks size={20} />, label: 'Activities', route: '/student/activities' },
    { icon: <Upload size={20} />, label: 'Upload', route: '/student/upload' },
    { icon: <Megaphone size={20} />, label: 'Announcements', route: '/student/announcements' },
  ];
  
  // Faculty Bottom Bar Links (Mobile)
  export const FacultyBottombarLinks = [
    { icon: <Home size={20} />, label: 'Home', route: '/faculty/home' },
    { icon: <CheckCircle size={20} />, label: 'Approvals', route: '/faculty/pending-approvals' },
    { icon: <History size={20} />, label: 'Verifications', route: '/faculty/verifications' },
    { icon: <Megaphone size={20} />, label: 'Announcements', route: '/faculty/announcements' },
  ];
  