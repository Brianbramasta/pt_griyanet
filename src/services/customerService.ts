import { api } from './api';
import type { Customer, CustomerFormData, CustomerFilters } from '../types/customer';

const ENDPOINT = '/customers';

/**
 * Service for handling customer-related API operations
 */
export const customerService = {
  /**
   * Get all customers with optional filters
   * @param filters - Optional filters for customers
   * @returns Promise with array of customers
   */
  getAll: async (filters?: CustomerFilters): Promise<Customer[]> => {
    const params: Record<string, string> = {};
    
    if (filters) {
      if (filters.search) params['q'] = filters.search;
      if (filters.status && filters.status !== 'all') params['status'] = filters.status;
      if (filters.serviceType) params['serviceType'] = filters.serviceType;
      if (filters.city) params['city'] = filters.city;
    }
    
    return api.get<Customer[]>(ENDPOINT, params); 
    // http://localhost:3001/customers?status=active&serviceType=internet
  },

  /**
   * Get a customer by ID
   * @param id - Customer ID
   * @returns Promise with customer data
   */
  getById: async (id: string): Promise<Customer> => {
    return api.get<Customer>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new customer
   * @param data - Customer data
   * @returns Promise with created customer
   */
  create: async (data: CustomerFormData): Promise<Customer> => {
    return api.post<Customer>(ENDPOINT, data);
  },

  /**
   * Update an existing customer
   * @param id - Customer ID
   * @param data - Updated customer data
   * @returns Promise with updated customer
   */
  update: async (id: string, data: CustomerFormData): Promise<Customer> => {
    return api.put<Customer>(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a customer
   * @param id - Customer ID
   * @returns Promise with deleted customer
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`${ENDPOINT}/${id}`);
  },

  /**
   * Get tickets associated with a customer
   * @param customerId - Customer ID
   * @returns Promise with array of tickets
   */
  getTickets: async (customerId: string): Promise<any[]> => {
    return api.get<any[]>(`/tickets?customerId=${customerId}`);
  }
};