// App.jsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Public Pages
import Landing from './pages/auth/Landing.jsx';
import RoleOfTheUser from './pages/auth/Roleoftheuser.jsx';
import Roleforlogin from './pages/auth/Roleforlogin.jsx';
import OtpPage from "./forms/OtpPage";

// Registration Pages
import StudentRegistration from './pages/auth/StudentRegistration.jsx';
import FacultyRegistration from './pages/auth/FacultyRegistration.jsx';

// Login Pages
import StudentLogin from './pages/auth/StudentLogin.jsx';
import FacultyLogin from './pages/auth/FacultyLogin.jsx';

// Dashboard Layout
import MainDashboard from "./pages/MainDashboard.jsx";

// Student Dashboard Components
import Home from "./pages/student/student_dashboard/Home.jsx";
import ActivitiesList from "./components/shared/ActivitiesList.jsx";
import UploadDocument from './components/student/student_uploads/uploadDocuments/UploadDoc.jsx';
import Announcements from './pages/student/student_dashboard/Announcements.jsx';
import StudentAchievements from './pages/student/student_dashboard/StudentAchievements.jsx';
import StudentDigitalPortfolio from './components/student/student_uploads/DigitalPortfolio.jsx';
import StudentPendingApprovels from './components/student/student_uploads/StudentPendingApprovels.jsx';
import StudentSettings from './components/student/student_uploads/StudentSettings.jsx';
import UpdateStudentProfile from './components/student/student_uploads/UpdateStudentProfile.jsx';
import AddProfile from './components/student/student_uploads/AddProfile.jsx';
import StudentResults from './components/student/StudentResults.jsx';
import StudentClubsEnrol from './components/student/StudentClubsEnrol.jsx';
import LeaveRequestDashboard from './components/student/LeaveRequestDash.jsx';

// Faculty Dashboard Components
import FacultyHome from "./pages/faculty/facultyDashboard/FacultyHome.jsx";
import PendingApprovals from "./pages/faculty/facultyDashboard/PendingApprovals.jsx";
import RecentVerifications from "./pages/faculty/facultyDashboard/RecentVerifications.jsx";
import FacultyAnnouncements from "./pages/faculty/facultyDashboard/Announcements.jsx";
import StudentList from './components/faculty/facultyDashboard/StudentList.jsx';
import ApprovedByYou from './pages/faculty/facultyDashboard/ApprovedByYou.jsx';
import FacultySettings from './components/faculty/facultyDashboard/FacultySettings.jsx';
import EventsAndCom from './components/faculty/facultyDashboard/EventsAndCom.jsx';
import AddProfileF from './components/faculty/facultyDashboard/AddProfileF.jsx';
import FacultyAttendance from './components/faculty/FacultyAttendance.jsx';
import FacultyAddMidMarks from './components/faculty/FacultyAddMid.jsx';
import FacultyDashboard from './components/faculty/LeaveReqDash.jsx';
// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/landing/page" />;
};

// 🎭 Role Protected Route
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  if (!token) return <Navigate to="/landing/page" />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/landing/page" />;
  }
  
  return children;
};

// 🏠 Role-based Home Redirect
const RoleBasedHome = () => {
  const userRole = Cookies.get('userRole');
  
  if (userRole === 'faculty') return <Navigate to="/faculty/home" replace />;
  if (userRole === 'student') return <Navigate to="/student/home" replace />;
  
  return <Navigate to="/landing/page" replace />;
};

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing/page" element={<Landing />} />
      <Route path="/roleoftheuser" element={<RoleOfTheUser />} />
      <Route path="/roleforlogin" element={<Roleforlogin />} />
      <Route path="/otp/verification" element={<OtpPage />} />
      
      {/* Registration Routes */}
      <Route path="/register/student" element={<StudentRegistration />} />
      <Route path="/register/faculty" element={<FacultyRegistration />} />
      
      {/* Login Routes */}
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/faculty" element={<FacultyLogin />} />

      {/* Profile Upload */}
      <Route path="/student/profile-img/upload" element={<AddProfile />} />
      <Route path="/faculty/profile-img/upload" element={<AddProfileF />} /> 
      
      {/* Dashboard Protected */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      }>
        {/* Default Role Redirect */}
        <Route index element={<RoleBasedHome />} />
        
        {/* Student Routes */}
        <Route path="student/home" element={<RoleProtectedRoute allowedRoles={['student']}><Home /></RoleProtectedRoute>} />
        <Route path="student/achievements/all/docs" element={<RoleProtectedRoute allowedRoles={['student']}><StudentAchievements /></RoleProtectedRoute>} />
        <Route path="student/activities" element={<RoleProtectedRoute allowedRoles={['student']}><ActivitiesList /></RoleProtectedRoute>} />
        <Route path="student/results" element={<RoleProtectedRoute allowedRoles={['student']}><StudentResults /></RoleProtectedRoute>} />
        <Route path="student/clubs/enrol" element={<RoleProtectedRoute allowedRoles={['student']}><StudentClubsEnrol /></RoleProtectedRoute>} />
        <Route path="student/upload" element={<RoleProtectedRoute allowedRoles={['student']}><UploadDocument /></RoleProtectedRoute>} />
        <Route path="student/generate/digital/port-folio" element={<RoleProtectedRoute allowedRoles={['student']}><StudentDigitalPortfolio /></RoleProtectedRoute>} />
        <Route path="student/announcements" element={<RoleProtectedRoute allowedRoles={['student']}><Announcements /></RoleProtectedRoute>} />
        <Route path="student/pending/approvels" element={<RoleProtectedRoute allowedRoles={['student']}><StudentPendingApprovels /></RoleProtectedRoute>} />
        <Route path="student/settings" element={<RoleProtectedRoute allowedRoles={['student']}><StudentSettings /></RoleProtectedRoute>} />
        <Route path="student/profile/update" element={<RoleProtectedRoute allowedRoles={['student']}><UpdateStudentProfile /></RoleProtectedRoute>} />
        <Route path="/student/leaveRequests" element={<RoleProtectedRoute allowedRoles={['student']}><LeaveRequestDashboard /></RoleProtectedRoute>} />
        
        {/* Faculty Routes */}
        <Route path="faculty/home" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultyHome /></RoleProtectedRoute>} />
        <Route path="faculty/pending-approvals" element={<RoleProtectedRoute allowedRoles={['faculty']}><PendingApprovals /></RoleProtectedRoute>} />
        <Route path="faculty/search/student-profiles" element={<RoleProtectedRoute allowedRoles={['faculty']}><StudentList /></RoleProtectedRoute>} />
        <Route path="faculty/add/attendance" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultyAttendance /></RoleProtectedRoute>} />
        <Route path="faculty/Approvels/docs/students" element={<RoleProtectedRoute allowedRoles={['faculty']}><ApprovedByYou /></RoleProtectedRoute>} />
        <Route path="faculty/verifications" element={<RoleProtectedRoute allowedRoles={['faculty']}><RecentVerifications fullHeight /></RoleProtectedRoute>} />
        <Route path="faculty/add/marks" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultyAddMidMarks /></RoleProtectedRoute>} />
        <Route path="faculty/announcements" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultyAnnouncements /></RoleProtectedRoute>} />
        <Route path="faculty/events/competitions" element={<RoleProtectedRoute allowedRoles={['faculty']}><EventsAndCom /></RoleProtectedRoute>} />
        <Route path="faculty/settings" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultySettings /></RoleProtectedRoute>} />
        <Route path="/faculty/leave-requests" element={<RoleProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></RoleProtectedRoute>} />
      </Route>
      
      {/* Legacy Redirects */}
      <Route path="/shome" element={<Navigate to="/student/home" replace />} />
      <Route path="/activity" element={<Navigate to="/student/activities" replace />} />
      <Route path="/upload" element={<Navigate to="/student/upload" replace />} />
      <Route path="/f/home" element={<Navigate to="/faculty/home" replace />} />
      
      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      } />
      
      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/landing/page" replace />} />
    </Routes>
  );
};

export default App;