import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, LoginCredentials } from '../types';
import { authService } from '../services/authService';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCredentials, logout as logoutAction, selectCurrentUser, selectIsAuthenticated } from '../redux/slices/authSlice';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Menggunakan Redux state
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser) as AuthUser | null;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Dispatch ke Redux store
          dispatch(setCredentials({ user: parsedUser, token }));
        } catch (err) {
          console.error('Error parsing stored user:', err);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await authService.login(credentials);

      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Dispatch to Redux store
      dispatch(setCredentials({ user: userData, token }));

      setError(null);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat login');
      }
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Dispatch logout action ke Redux
    dispatch(logoutAction());
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};