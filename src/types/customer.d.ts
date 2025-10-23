/**
 * Customer interface representing a customer in the system
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending' | 'all';
  serviceType: string;
  serviceDetails?: {
    packageName: string;
    bandwidth: string;
    monthlyFee: number;
    installationDate: string;
  };
  notes?: string;
}

/**
 * CustomerFormData interface for creating or updating a customer
 */
export type CustomerFormData = Omit<Customer, 'id'> & { id?: string };

/**
 * CustomerFilters interface for filtering customers
 */
export interface CustomerFilters {
  search?: string;
  status?: Customer['status'];
  serviceType?: string;
  city?: string;
}