import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Public Pages
import Landing from './pages/Landing';
import RoleOfTheUser from './pages/RoleOfTheUser';
import Roleforlogin from './pages/Roleforlogin';
import OtpPage from "./forms/OtpPage";

// Registration Pages
import StudentRegistration from './pages/StudentRegistration';
import FacultyRegistration from './pages/FacultyRegistration';

// Login Pages
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';

// Dashboard Layout
import MainDashboard from "./pages/MainDashboard";

// Student Dashboard Components
import Dashboars from './components/Dashboars';
import Home from "./student_dashboard/Home";
import ActivitiesList from "./components/ActivitiesList";
import UploadDocument from './components/student_uploads/UploadDoc';
import Announcements from './student_dashboard/Announcements';

// Faculty Dashboard Components
import FacultyHome from "./facultyDashboard/FacultyHome";
import PendingApprovals from "./facultyDashboard/PendingApprovals";
import RecentVerifications from "./facultyDashboard/RecentVerifications";
import FacultyAnnouncements from "./facultyDashboard/Announcements";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/roleforlogin" />;
};

// Role-based Protected Route
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  if (!token) {
    return <Navigate to="/roleforlogin" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Role-based Home Redirect Component
const RoleBasedHome = () => {
  const userRole = Cookies.get('userRole');
  
  if (userRole === 'faculty') {
    return <Navigate to="/faculty/home" replace />;
  } else if (userRole === 'student') {
    return <Navigate to="/student/home" replace />;
  } else {
    // If no role is set, redirect to login
    return <Navigate to="/roleforlogin" replace />;
  }
};

const App = () => {
  return (
    <Router>
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
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }>
          {/* Role-based Home Redirect */}
          <Route index element={<RoleBasedHome />} />
          
          {/* Student Routes */}
          <Route path="student/home" element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <Home />
            </RoleProtectedRoute>
          } />
          <Route path="student/activities" element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <ActivitiesList />
            </RoleProtectedRoute>
          } />
          <Route path="student/upload" element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <UploadDocument studentid="24b91a5748"/>
            </RoleProtectedRoute>
          } />
          <Route path="student/announcements" element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <Announcements />
            </RoleProtectedRoute>
          } />
          
          {/* Faculty Routes */}
          <Route path="faculty/home" element={
            <RoleProtectedRoute allowedRoles={['faculty']}>
              <FacultyHome />
            </RoleProtectedRoute>
          } />
          <Route path="faculty/pending-approvals" element={
            <RoleProtectedRoute allowedRoles={['faculty']}>
              <PendingApprovals />
            </RoleProtectedRoute>
          } />
          <Route path="faculty/recent-verifications" element={
            <RoleProtectedRoute allowedRoles={['faculty']}>
              <RecentVerifications />
            </RoleProtectedRoute>
          } />
          <Route path="faculty/announcements" element={
            <RoleProtectedRoute allowedRoles={['faculty']}>
              <FacultyAnnouncements />
            </RoleProtectedRoute>
          } />
        </Route>
        
        {/* Legacy Routes - Redirect to new structure */}
        <Route path="/shome" element={<Navigate to="/student/home" replace />} />
        <Route path="/activity" element={<Navigate to="/student/activities" replace />} />
        <Route path="/upload" element={<Navigate to="/student/upload" replace />} />
        <Route path="/f/home" element={<Navigate to="/faculty/home" replace />} />
        
        {/* Fallback Routes */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
              <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        } />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/landing/page" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
