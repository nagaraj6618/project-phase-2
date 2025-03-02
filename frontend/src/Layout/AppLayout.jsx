import React, { useState } from 'react';
import NavbarComponent from '../Components/Navbar/NavbarComponent';
import AppRouter from '../Route/AppRouter';
import { CgMenuLeft } from "react-icons/cg";
import './AppLayout.css';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar for larger screens with glass effect */}
      <div className={`absolute top-0 left-0 w-48 md:w-1/4 h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 bg-gray-800 bg-opacity-60 backdrop-blur-lg text-white p-4 transition-transform duration-300 ease-in-out z-50 shadow-lg`}>
              <NavbarComponent closeSidebar={closeSidebar} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:w-4/5 bg-gray-850 text-gray-200 p-4">
        {/* Toggle button for mobile view */}
        <button 
          className="md:hidden  text-white p-2 rounded mb-4 focus:outline-none" 
          onClick={toggleSidebar}
        >
          <CgMenuLeft size={24} />
        </button>

        <AppRouter />
      </div>
    </div>
  );
};

export default AppLayout;
