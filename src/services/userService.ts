import { api } from './api';
import type { User, UserFormData, UserRole } from '../types/user';

const ENDPOINT = '/users';

/**
 * Service for handling user-related API operations
 */
export const userService = {
  /**
   * Get all users with optional filters
   * @param filters - Optional filters for users
   * @returns Promise with array of users
   */
  getAll: async (filters?: { role?: UserRole; search?: string; isActive?: boolean }): Promise<User[]> => {
    const params: Record<string, string> = {};
    
    if (filters) {
      if (filters.search) params['q'] = filters.search;
      if (filters.role) params['role'] = filters.role;
      if (filters.isActive !== undefined) params['isActive'] = String(filters.isActive);
    }
    
    return api.get<User[]>(ENDPOINT, params);
  },

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns Promise with user data
   */
  getById: async (id: string): Promise<User> => {
    return api.get<User>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new user
   * @param data - User data
   * @returns Promise with created user
   */
  create: async (data: UserFormData): Promise<User> => {
    return api.post<User>(ENDPOINT, data);
  },

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - Updated user data
   * @returns Promise with updated user
   */
  update: async (id: string, data: UserFormData): Promise<User> => {
    return api.put<User>(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a user
   * @param id - User ID
   * @returns Promise with deleted user
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`${ENDPOINT}/${id}`);
  },

  /**
   * Update user password
   * @param id - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with success message
   */
  updatePassword: async (id: string, currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`${ENDPOINT}/${id}/password`, { 
      currentPassword, 
      newPassword 
    });
  },

  /**
   * Toggle user active status
   * @param id - User ID
   * @param isActive - Active status
   * @returns Promise with updated user
   */
  toggleActiveStatus: async (id: string, isActive: boolean): Promise<User> => {
    return api.patch<User>(`${ENDPOINT}/${id}/status`, { isActive });
  }
};