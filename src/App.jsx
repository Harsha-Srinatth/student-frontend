import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
import Landing from './pages/Landing';
import RoleOfTheUser from './pages/RoleOfTheUser';
import Roleforlogin from './pages/Roleforlogin';
import OtpPage from "./forms/OtpPage";
import Dashboars from './components/Dashboars';
import ActivitiesList from "./components/ActivitiesList";
import MainDashboard from "./pages/MainDashboard";
import Dashboard from "./pages/MainDashboard"

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to = '/login' />;
 
};
{/* <Route path="/home" element={user.role === "faculty" ? <FacultyHome /> : <StudentHome />} /> */}


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/roleforlogin" element={<Roleforlogin />} />
        <Route path="/landing/page" element={<Landing />} />
        <Route path= "/roleoftheuser" element={<RoleOfTheUser />} />
        <Route path= "/opt/verification" element={<OtpPage />} />
         {/* <Route path= "/main" element={<Dashboard />} /> */}

        <Route path="*" element={<Navigate to="/landing/page" />} />

        <Route path="/" element={<MainDashboard />}>
             <Route index element={<Dashboars />} />
             <Route path= "/activity" element={<ActivitiesList />} />
             {/* <Route path= "/activity" element={<ActivitiesList />} /> */}
          </Route>
      </Routes>
    </Router>
   
  );
};

export default App;
