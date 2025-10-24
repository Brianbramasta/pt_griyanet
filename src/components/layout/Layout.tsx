import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Layout component props
 */
interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  userRole?: string;
}

/**
 * Main layout component that includes sidebar, header and content area
 * @param children - Content to render in the main area
 * @param title - Page title to display in header
 * @param userRole - Current user's role
 */
const Layout: React.FC<LayoutProps> = ({  title, userRole }) => {
  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const effectiveRole = user?.role ?? userRole ?? 'admin';

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Close sidebar
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar component */}
      <Sidebar userRole={effectiveRole} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex w-full flex-1 flex-col lg:pl-64">
        {/* Header component */}
        <Header onMenuClick={toggleSidebar} title={title} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Render nested route components */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;