import { api } from './api';
import type { AuthUser, LoginCredentials } from '../types/user';

const ENDPOINT = '/auth';

/**
 * Service for handling authentication-related API operations
 */
export const authService = {
  /**
   * Login user with credentials
   * @param credentials - Login credentials
   * @returns Promise with authenticated user data
   */
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
    try {
      // For JSON Server implementation, we need to find the user first
      const users = await api.get<any[]>(`/users?email=${credentials.email}`);
      
      if (users.length === 0) {
        throw new Error('Email atau password salah');
      }
      
      const user = users[0];
      
      // In a real app, password would be hashed and compared on the server
      // For demo, we'll just check if password is 'password'
      if (credentials.password !== 'password') {
        throw new Error('Email atau password salah');
      }
      
      // Update user's last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      await api.put(`/users/${user.id}`, updatedUser);
      
      // Create auth token (in a real app, this would be done by the server)
      const token = `demo_token_${user.id}`;
      
      // Return user data and token
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Terjadi kesalahan saat login');
    }
  },

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with registered user data
   */
  register: async (userData: { name: string; email: string; password: string; role?: string }): Promise<AuthUser> => {
    // In a real app, this would be a direct API call
    // For JSON Server, we need to create a user first
    const newUser = {
      name: userData.name,
      email: userData.email,
      username: userData.email.split('@')[0],
      role: userData.role || 'cs',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    const createdUser = await api.post<any>('/users', newUser);
    
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role
    };
  },

  /**
   * Get current authenticated user
   * @returns Promise with authenticated user data
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (!storedUser || !token) {
      return null;
    }
    
    try {
      return JSON.parse(storedUser);
    } catch (err) {
      console.error('Error parsing stored user:', err);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Logout current user
   */
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise with success message
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    // In a real app, this would send a reset link to the user's email
    // For demo, we'll just return a success message
    return { message: 'Link reset password telah dikirim ke email Anda' };
  },

  /**
   * Reset password with token
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Promise with success message
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    // In a real app, this would verify the token and update the password
    // For demo, we'll just return a success message
    return { message: 'Password berhasil diubah' };
  }
};