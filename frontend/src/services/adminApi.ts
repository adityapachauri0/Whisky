import axios from 'axios';
import { buildApiEndpoint } from '../config/api.config';

// Create admin API instance
const adminApi = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// CSRF token management
class CSRFManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  
  async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }
    
    try {
      const response = await adminApi.get(buildApiEndpoint('admin/csrf-token'));
      this.token = response.data.csrfToken;
      // Tokens expire in 1 hour, refresh 5 minutes early
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      return this.token!;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      throw new Error('Failed to get CSRF token');
    }
  }
  
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

const csrfManager = new CSRFManager();

// Request interceptor to add CSRF token
adminApi.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method || '')) {
      try {
        const token = await csrfManager.getToken();
        config.headers['X-CSRF-Token'] = token;
      } catch (error) {
        console.error('Failed to add CSRF token:', error);
        throw error;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    } else if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      // Clear CSRF token on CSRF errors and retry once
      csrfManager.clearToken();
      console.warn('CSRF token error, clearing token cache');
    }
    
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminAPI = {
  // Contact operations
  contacts: {
    getAll: (params?: any) => adminApi.get(buildApiEndpoint('admin/contact-submissions'), { params }),
    
    delete: async (id: string) => {
      try {
        const response = await adminApi.delete(buildApiEndpoint(`admin/contact/${id}`));
        return response;
      } catch (error: any) {
        // If CSRF error, try once more with fresh token
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
          csrfManager.clearToken();
          return await adminApi.delete(buildApiEndpoint(`admin/contact/${id}`));
        }
        throw error;
      }
    },
    
    bulkDelete: async (ids: string[]) => {
      try {
        const response = await adminApi.post(buildApiEndpoint('admin/contact/bulk-delete'), { ids });
        return response;
      } catch (error: any) {
        // If CSRF error, try once more with fresh token
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
          csrfManager.clearToken();
          return await adminApi.post(buildApiEndpoint('admin/contact/bulk-delete'), { ids });
        }
        throw error;
      }
    },
    
    updateStatus: (id: string, data: any) => 
      adminApi.patch(buildApiEndpoint(`admin/contact/${id}/status`), data),
  },
  
  // Sell submissions operations
  sellSubmissions: {
    getAll: (params?: any) => adminApi.get(buildApiEndpoint('admin/sell-submissions'), { params }),
    
    delete: async (id: string) => {
      try {
        const response = await adminApi.delete(buildApiEndpoint(`admin/sell-submissions/${id}`));
        return response;
      } catch (error: any) {
        // If CSRF error, try once more with fresh token
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
          csrfManager.clearToken();
          return await adminApi.delete(buildApiEndpoint(`admin/sell-submissions/${id}`));
        }
        throw error;
      }
    },
    
    bulkDelete: async (ids: string[]) => {
      try {
        const response = await adminApi.post(buildApiEndpoint('admin/sell-submissions/bulk-delete'), { ids });
        return response;
      } catch (error: any) {
        // If CSRF error, try once more with fresh token
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
          csrfManager.clearToken();
          return await adminApi.post(buildApiEndpoint('admin/sell-submissions/bulk-delete'), { ids });
        }
        throw error;
      }
    },
    
    updateStatus: (id: string, data: any) => 
      adminApi.patch(buildApiEndpoint(`admin/sell-submissions/${id}/status`), data),
  },
  
  // Consultation operations
  consultations: {
    getAll: (params?: any) => adminApi.get(buildApiEndpoint('admin/consultation-requests'), { params }),
  },
  
  // Export operations
  export: () => adminApi.get(buildApiEndpoint('admin/export')),
  
  // Password operations
  changePassword: (passwordData: any) => 
    adminApi.post(buildApiEndpoint('admin/change-password'), passwordData),
};

export default adminAPI;