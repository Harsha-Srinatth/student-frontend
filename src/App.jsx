import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
import Landing from './pages/Landing';
import RoleOfTheUser from './pages/RoleOfTheUser';
import Roleforlogin from './pages/Roleforlogin';
import OtpPage from "./forms/OtpPage";
import Dashboars from './components/Dashboars';
import ActivitiesList from "./components/ActivitiesList";
import MainDashboard from "./pages/MainDashboard"


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/roleforlogin" element={<Roleforlogin />} />
        <Route path="/landing/page" element={<Landing />} />
        <Route path= "/roleoftheuser" element={<RoleOfTheUser />} />
        <Route path= "/opt/verification" element={<OtpPage />} />
         <Route path= "/dashboard" element={<Dashboars />} />
         <Route path= "/activity" element={<ActivitiesList />} />
         <Route path= "/main" element={<MainDashboard />} />

        <Route path="*" element={<Navigate to="/landing/page" />} />
      </Routes>
    </Router>
   
  );
};

export default App;
