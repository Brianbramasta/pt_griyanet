import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectUserRole, selectIsAuthenticated } from '../redux/slices/authSlice';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

/**
 * Komponen untuk membatasi akses ke route berdasarkan role pengguna
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = '/'
}) => {
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // console.log('RoleBasedRoute - userRole:', userRole);
  // console.log('RoleBasedRoute - isAuthenticated:', isAuthenticated);
  
  // // Jika user belum login, redirect ke login
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  // Jika role user tidak ada dalam daftar role yang diizinkan, redirect
  if (!allowedRoles.includes(userRole as string)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Jika role user diizinkan, tampilkan konten
  return <>{children}</>;
};

export default RoleBasedRoute;