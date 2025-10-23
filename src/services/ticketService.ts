import { api } from './api';
import type { Ticket, TicketFormData, TicketFilters, TicketStatus } from '../types/ticket';

const ENDPOINT = '/tickets';

/**
 * Service for handling ticket-related API operations
 */
export const ticketService = {
  /**
   * Get all tickets with optional filters
   * @param filters - Optional filters for tickets
   * @returns Promise with array of tickets
   */
  getAll: async (filters?: TicketFilters): Promise<Ticket[]> => {
    const params: Record<string, string> = {};
    
    if (filters) {
      if (filters.search) params['q'] = filters.search;
      if (filters.status) params['status'] = filters.status;
      if (filters.priority) params['priority'] = filters.priority;
      if (filters.category) params['category'] = filters.category;
      if (filters.assignedTo) params['assignedTo'] = filters.assignedTo;
      if (filters.createdBy) params['createdBy'] = filters.createdBy;
      if (filters.customerId) params['customerId'] = filters.customerId;
      if (filters.dateFrom) params['dateFrom'] = filters.dateFrom;
      if (filters.dateTo) params['dateTo'] = filters.dateTo;
    }
    
    return api.get<Ticket[]>(ENDPOINT, params);
  },

  /**
   * Get a ticket by ID
   * @param id - Ticket ID
   * @returns Promise with ticket data
   */
  getById: async (id: string): Promise<Ticket> => {
    return api.get<Ticket>(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new ticket
   * @param data - Ticket data
   * @returns Promise with created ticket
   */
  create: async (data: TicketFormData): Promise<Ticket> => {
    return api.post<Ticket>(ENDPOINT, data);
  },

  /**
   * Update an existing ticket
   * @param id - Ticket ID
   * @param data - Updated ticket data
   * @returns Promise with updated ticket
   */
  update: async (id: string, data: TicketFormData): Promise<Ticket> => {
    return api.put<Ticket>(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a ticket
   * @param id - Ticket ID
   * @returns Promise with deleted ticket
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`${ENDPOINT}/${id}`);
  },

  /**
   * Update ticket status
   * @param id - Ticket ID
   * @param status - New status
   * @param notes - Optional notes about status change
   * @returns Promise with updated ticket
   */
  updateStatus: async (id: string, status: TicketStatus, notes?: string): Promise<Ticket> => {
    return api.patch<Ticket>(`${ENDPOINT}/${id}/status`, { status, notes });
  },

  /**
   * Add comment to ticket
   * @param id - Ticket ID
   * @param comment - Comment text
   * @param userId - User ID who made the comment
   * @returns Promise with updated ticket
   */
  addComment: async (id: string, comment: string, userId: string): Promise<Ticket> => {
    return api.post<Ticket>(`${ENDPOINT}/${id}/comments`, { comment, userId });
  },

  /**
   * Assign ticket to user
   * @param id - Ticket ID
   * @param userId - User ID to assign ticket to
   * @returns Promise with updated ticket
   */
  assignToUser: async (id: string, userId: string): Promise<Ticket> => {
    return api.patch<Ticket>(`${ENDPOINT}/${id}/assign`, { userId });
  }
};