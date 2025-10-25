import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import RoleBasedRoute from '../components/RoleBasedRoute';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Customers = React.lazy(() => import('../pages/Customers'));
const CustomerDetail = React.lazy(() => import('../pages/CustomerDetail'));
const CustomerNew = React.lazy(() => import('../pages/CustomerNew'));
const CustomerEdit = React.lazy(() => import('../pages/CustomerEdit'));
const Tickets = React.lazy(() => import('../pages/Tickets'));
const TicketNew = React.lazy(() => import('../pages/TicketNew'));
const TicketDetail = React.lazy(() => import('../pages/TicketDetail'));
const TicketEdit = React.lazy(() => import('../pages/TicketEdit'));
const Users = React.lazy(() => import('../pages/Users'));
const UserDetail = React.lazy(() => import('../pages/UserDetail'));
const AdminReports = React.lazy(() => import('../pages/AdminReports'));
const Login = React.lazy(() => import('../pages/Login'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <RoleBasedRoute allowedRoles={['admin', 'cs', 'noc']}>
              <Dashboard />
            </RoleBasedRoute>
          } />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={
            <RoleBasedRoute allowedRoles={['admin', 'cs']}>
              <CustomerNew />
            </RoleBasedRoute>
          } />
          <Route path="customers/edit/:id" element={
            <RoleBasedRoute allowedRoles={['admin', 'cs']}>
              <CustomerEdit />
            </RoleBasedRoute>
          } />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/new" element={
            <RoleBasedRoute allowedRoles={['admin', 'cs']}>
              <TicketNew />
            </RoleBasedRoute>
          } />
          <Route path="tickets/edit/:id" element={
            <RoleBasedRoute allowedRoles={['admin', 'cs']}>
              <TicketEdit />
            </RoleBasedRoute>
          } />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="users" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Users />
            </RoleBasedRoute>
          } />
          <Route path="users/:id" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <UserDetail />
            </RoleBasedRoute>
          } />
          <Route path="reports" element={
             <RoleBasedRoute allowedRoles={['admin']}>
               <AdminReports />
             </RoleBasedRoute>
           } />
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;