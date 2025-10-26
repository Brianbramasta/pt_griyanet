/**
 * User role types
 */
export type UserRole = 'admin' | 'cs' | 'noc';

/**
 * User interface representing a user in the system
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

/**
 * UserFormData interface for creating or updating a user
 */
export type UserFormData = Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { 
  id?: string;
  password?: string;
  confirmPassword?: string;
};

/**
 * AuthUser interface for authenticated user
 */
export interface AuthUser {
  id: string;
  username?: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

/**
 * LoginCredentials interface for user login
 */
export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface userFilter {
  search?: string
  role?: string,
  isActive?:boolean,
}