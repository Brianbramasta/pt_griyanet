/**
 * Ticket status types
 */
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

/**
 * Ticket priority types
 */
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Ticket category types
 */
export type TicketCategory = 'connection' | 'speed' | 'billing' | 'hardware' | 'other';

/**
 * Ticket status history entry
 */
export interface TicketStatusHistory {
  id: string;
  status: TicketStatus;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

/**
 * Ticket interface representing a support ticket in the system
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  statusHistory: TicketStatusHistory[];
  attachments?: string[];
  notes?: string;
  resolution?: string;
  resolvedAt?: string;
  closedAt?: string;
}

/**
 * TicketFormData interface for creating or updating a ticket
 */
export type TicketFormData = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'> & { id?: string };

/**
 * TicketFilters interface for filtering tickets
 */
export interface TicketFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  createdBy?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}