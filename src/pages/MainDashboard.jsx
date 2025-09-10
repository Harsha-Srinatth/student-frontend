import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/MainHeader';
import Sidebar from '../components/Sidebar';
import Bottombar from '../components/Bottombar.jsx';

const MainDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-white text-black">
      {/* Sidebar - fixed width like Instagram (64px on large screens) */}
      <aside className="hidden lg:block lg:w-64 h-full bg-gray-100">
        <Sidebar /> 
      </aside>
      
      {/* Main Content Container */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile Header - only visible on mobile/tablet */}
        <div className="lg:hidden p-2 bg-white">
          <Header />
        </div>
        
        {/* Main Content Area */}
        <section className="flex flex-1 overflow-y-auto p-2 bg-white">
          <Outlet />
        </section>
        
        {/* Mobile Footer - only visible on mobile */}
        <footer className="md:hidden w-full h-19 bg-white">
          <Bottombar />
        </footer>
      </div>
    </div>
  );
};

export default MainDashboard;