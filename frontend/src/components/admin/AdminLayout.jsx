// AdminLayout.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen background">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="w-full">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
