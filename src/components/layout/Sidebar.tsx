import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation item type
 */
interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

/**
 * Sidebar component props
 */
interface SidebarProps {
  userRole?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar component for main navigation
 * @param userRole - Current user's role
 * @param isOpen - Whether the sidebar is open on mobile
 * @param onClose - Function to close the sidebar on mobile
 */
const Sidebar: React.FC<SidebarProps> = ({ userRole = 'admin', isOpen, onClose }) => {
  const location = useLocation();

  // Navigation items with role-based access
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      roles: ['admin', 'cs', 'noc'],
    },
    {
      title: 'Customers',
      path: '/customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      roles: ['admin', 'cs'],
    },
    {
      title: 'Tickets',
      path: '/tickets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['admin', 'cs', 'noc'],
    },
    {
      title: 'Users',
      path: '/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['admin'],
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
      ),
      roles: ['admin'],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b px-4 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary">GriyaNet Helpdesk</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t p-4 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary text-center text-sm font-medium leading-8 text-primary-foreground">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{userRole.toUpperCase()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Role: {userRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;