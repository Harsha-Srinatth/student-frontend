import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Bottombar from '../components/Bottombar.jsx';

const MainDashboard = () => {
  return (
    <div className="flex h-screen w-full dark bg-black text-white">
      {/* Sidebar - fixed width like Instagram (64px on large screens) */}
      <aside className="hidden lg:block lg:w-64 h-full dark bg-gray-800">
        <Sidebar />
      </aside>
      
      {/* Main Content Container */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile Header - only visible on mobile/tablet */}
        <div className="lg:hidden p-2 dark bg-black">
          <Header />
        </div>
        
        {/* Main Content Area */}
        <section className="flex flex-1 overflow-y-auto p-2 bg-black">
          <Outlet />
        </section>
        
        {/* Mobile Footer - only visible on mobile */}
        <footer className="md:hidden w-full h-19">
          <Bottombar />
        </footer>
      </div>
    </div>
  );
};

export default MainDashboard;