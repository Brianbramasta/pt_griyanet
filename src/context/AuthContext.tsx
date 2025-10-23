import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, LoginCredentials } from '../types';

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Error parsing stored user:', err);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate an API call
      const response = await fetch('http://localhost:3001/users?email=' + credentials.email);
      const users = await response.json();
      
      // Find user with matching credentials
      // Note: In a real app, password would be hashed and compared on the server
      const user = users.find((u: any) => u.email === credentials.email);
      
      if (user) {
        // Simulate password check (in a real app, this would be done securely on the server)
        // For demo, we'll compare with the stored user password from db.json
        if (credentials.password === user.password) {
          // Update user's last login
          const updatedUser = {
            ...user,
            lastLogin: new Date().toISOString()
          };
          
          await fetch(`http://localhost:3001/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
          });
          
          // Store auth data
          localStorage.setItem('auth_token', 'demo_token_' + user.id);
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }));
          
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          });
          
          setError(null);
          setIsLoading(false);
          return true;
        }
      }
      
      setError('Email atau password salah');
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};