import axios, { InternalAxiosRequestConfig } from 'axios';
import DOMPurify from 'dompurify';
import { API_URL } from '../config/api.config';

const API_BASE_URL = API_URL;

// Token management utilities
const tokenManager = {
  getToken: (): string | null => {
    // Tokens are now stored in httpOnly cookies
    // This method is kept for compatibility but returns null
    return null;
  },
  
  setToken: (token: string): void => {
    // No-op: tokens are now managed by httpOnly cookies
    console.warn('setToken called but tokens are now managed by httpOnly cookies');
  },
  
  removeToken: (): void => {
    // Clear any legacy tokens from sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminUser');
  },
  
  // CSRF token management
  getCsrfToken: (): string | null => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  }
};

// Input sanitization utilities
const sanitizer = {
  // Sanitize string input
  sanitizeString: (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  },
  
  // Sanitize object recursively
  sanitizeObject: <T extends Record<string, any>>(obj: T): T => {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizer.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizer.sanitizeObject(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizer.sanitizeString(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },
  
  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Validate phone format
  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s+()-]+$/;
    return phoneRegex.test(phone);
  }
};

// Create axios instance with security configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable credentials to send httpOnly cookies
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// Request interceptor with security enhancements
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth is now handled via httpOnly cookies, no need to add token header
    
    // Add CSRF token for state-changing requests
    const csrfToken = tokenManager.getCsrfToken();
    if (csrfToken && config.headers && ['post', 'put', 'patch', 'delete'].includes(config.method || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Add security headers
    if (config.headers) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      tokenManager.removeToken();
      // Redirect to login without exposing internal routes
      window.location.href = '/admin/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Access forbidden');
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      console.error('Too many requests. Please try again later.');
    }
    
    // Sanitize error messages before displaying
    if (error.response?.data?.message) {
      error.response.data.message = sanitizer.sanitizeString(error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

// Contact API with input sanitization
export const contactAPI = {
  submit: (data: ContactFormData) => {
    // Validate required fields
    if (!sanitizer.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (data.phone && !sanitizer.validatePhone(data.phone)) {
      throw new Error('Invalid phone format');
    }
    
    // Add missing required backend fields with defaults
    const completeData = {
      ...data,
      preferredContactMethod: 'email' as const // Default to email
    };
    
    // Sanitize input data
    const sanitizedData = sanitizer.sanitizeObject(completeData);
    return api.post('/contact', sanitizedData);
  },
  
  getAll: (params?: any) => api.get('/contact', { params }),
  
  updateStatus: (id: string, data: any) => {
    const sanitizedData = sanitizer.sanitizeObject(data);
    return api.patch(`/contact/${id}/status`, sanitizedData);
  },
};

// Consultation API with input sanitization
export const consultationAPI = {
  book: (data: ConsultationFormData) => {
    // Validate required fields
    if (!sanitizer.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (!sanitizer.validatePhone(data.phone)) {
      throw new Error('Invalid phone format');
    }
    
    // Sanitize input data
    const sanitizedData = sanitizer.sanitizeObject(data);
    return api.post('/consultation', sanitizedData);
  },
  
  getAll: (params?: any) => api.get('/consultation', { params }),
  
  update: (id: string, data: any) => {
    const sanitizedData = sanitizer.sanitizeObject(data);
    return api.patch(`/consultation/${id}`, sanitizedData);
  },
  
  getReminders: () => api.get('/consultation/reminders/upcoming'),
};

// Blog API with input sanitization
export const blogAPI = {
  getPosts: (params?: BlogParams) => api.get('/blog', { params }),
  getPostBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getFeatured: () => api.get('/blog/featured'),
  getCategories: () => api.get('/blog/categories'),
  getTags: () => api.get('/blog/tags'),
  
  create: (data: any) => {
    const sanitizedData = sanitizer.sanitizeObject(data);
    return api.post('/blog', sanitizedData);
  },
  
  update: (id: string, data: any) => {
    const sanitizedData = sanitizer.sanitizeObject(data);
    return api.put(`/blog/${id}`, sanitizedData);
  },
  
  delete: (id: string) => api.delete(`/blog/${id}`),
};

// Auth API with secure token handling
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    // Validate email format
    if (!sanitizer.validateEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    const response = await api.post('/auth/login', credentials);
    
    // Token is now stored in httpOnly cookie by the server
    // No need to handle token in frontend
    
    return response;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout', {});
    tokenManager.removeToken(); // Clear any legacy tokens
    return response;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh', {});
    
    // Token refresh is now handled via httpOnly cookies
    
    return response;
  },
};

// Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  investmentInterest?: 'starter' | 'premium' | 'exclusive' | 'not-sure';
  investmentPurposes?: boolean;
  ownCask?: boolean;
  giftPurpose?: boolean;
  otherInterest?: boolean;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  timezone: string;
  investmentBudget: 'under-10k' | '10k-25k' | '25k-50k' | '50k-100k' | 'above-100k';
  investmentExperience: 'beginner' | 'intermediate' | 'experienced' | 'expert';
  interestedIn: string[];
  additionalInfo?: string;
}

export interface BlogParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  category: string;
  tags: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  readTime: number;
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default api;
export { tokenManager, sanitizer };