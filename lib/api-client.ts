/**
 * API Client Helper
 * Provides utility functions for making authenticated API requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  user?: T;
  token?: string;
  message?: string;
  [key: string]: any;
}

class ApiError extends Error {
  status?: number;
  response?: any;

  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Get token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

/**
 * Set token in localStorage
 */
function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('auth_token', token);
  } catch {
    // Handle storage errors silently
  }
}

/**
 * Clear token from localStorage
 */
function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('auth_token');
  } catch {
    // Handle storage errors silently
  }
}

/**
 * Make API request with automatic token inclusion
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: headers as HeadersInit,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new ApiError(data.error || 'API request failed', response.status, data);
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', undefined, error);
  }
}

/**
 * Auth API methods
 */
export const authAPI = {
  /**
   * Register new user
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
  }): Promise<ApiResponse> {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    clearToken();
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse> {
    return apiRequest('/users/me');
  },
};

/**
 * User API methods
 */
export const userAPI = {
  /**
   * Get all users (admin only)
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    return apiRequest(`/users?page=${page}&limit=${limit}`);
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<ApiResponse> {
    return apiRequest('/users/me');
  },
};

/**
 * Admin API methods
 */
export const adminAPI = {
  /**
   * Get admin dashboard stats
   */
  async getStats(): Promise<ApiResponse> {
    return apiRequest('/admin/stats');
  },

  /**
   * Perform action on vendor (approve, reject, activate, deactivate)
   */
  async vendorAction(vendorId: string, action: string): Promise<ApiResponse> {
    return apiRequest(`/admin/vendors/${vendorId}`, {
      method: 'POST',
      body: JSON.stringify({ vendorId, action }),
    });
  },

  /**
   * Perform action on product (approve, reject, delete, feature)
   */
  async productAction(productId: string, action: string): Promise<ApiResponse> {
    return apiRequest(`/admin/products/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ productId, action }),
    });
  },

  /**
   * Perform action on user (approve-kyc, reject-kyc, activate, deactivate, delete)
   */
  async userAction(userId: string, action: string): Promise<ApiResponse> {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ userId, action }),
    });
  },
};

/**
 * Vendor API methods
 */
export const vendorAPI = {
  /**
   * Perform action on vendor's product (toggle-active, delete, feature)
   */
  async productAction(productId: string, action: string): Promise<ApiResponse> {
    return apiRequest(`/vendor/products/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ productId, action }),
    });
  },
};

/**
 * Order API methods
 */
export const orderAPI = {
  /**
   * Perform action on order (accept, decline, cancel, ship, deliver)
   */
  async performAction(orderId: string, action: string): Promise<ApiResponse> {
    return apiRequest(`/orders/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Get stored token
 */
export function getStoredToken(): string | null {
  return getToken();
}

/**
 * Check error status
 */
export function isUnauthorizedError(error: any): boolean {
  return error?.status === 401;
}

/**
 * Check forbidden error
 */
export function isForbiddenError(error: any): boolean {
  return error?.status === 403;
}

/**
 * Export for use in components
 */
export default {
  auth: authAPI,
  user: userAPI,
  admin: adminAPI,
  vendor: vendorAPI,
  order: orderAPI,
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  getStoredToken,
  apiRequest,
  healthCheck,
  isUnauthorizedError,
  isForbiddenError,
};
