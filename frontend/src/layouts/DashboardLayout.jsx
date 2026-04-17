import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // <div className="flex h-screen bg-bg text-text">
    //   <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    //   <div className="grow flex flex-col min-w-0">
    //     <Header setIsOpen={setIsSidebarOpen} />
    //     <main className="p-4 md:p-6 overflow-auto grow text-left">
    //       <div className="max-w-7xl mx-auto h-auto">
    //         <Outlet />
    //       </div>
    //     </main>
    //   </div>
    // </div>

    <div className="flex h-screen bg-bg text-text overflow-hidden">
  <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    <Header setIsOpen={setIsSidebarOpen} />

    <main className="flex-1 overflow-y-auto px-4 py-8 sm:p-4 md:p-6 text-left">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
</div>
  );
};

export default DashboardLayout;
