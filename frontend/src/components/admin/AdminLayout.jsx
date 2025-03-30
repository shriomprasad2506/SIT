// AdminLayout.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex text-center" style={{ background: 'linear-gradient(180deg, #D9D9D9 0%, #0E613B 100%)' }}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="w-full">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
