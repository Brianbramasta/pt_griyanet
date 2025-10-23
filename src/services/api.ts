/**
 * Base API configuration and utility functions
 */

// API base URL
const API_URL = 'http://localhost:3001';

/**
 * Generic fetch wrapper with error handling
 * @param endpoint - API endpoint to fetch from
 * @param options - Fetch options
 * @returns Promise with the response data
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API utility functions for common HTTP methods
 */
export const api = {
  /**
   * GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Promise with the response data
   */
  get: async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${API_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    return fetchApi<T>(url.pathname + url.search);
  },

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the response data
   */
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    return fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the response data
   */
  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    return fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the response data
   */
  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    return fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @returns Promise with the response data
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    return fetchApi<T>(endpoint, {
      method: 'DELETE',
    });
  },
};