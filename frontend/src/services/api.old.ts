import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Contact API
export const contactAPI = {
  submit: (data: ContactFormData) => api.post('/contact', data),
  getAll: (params?: any) => api.get('/contact', { params }),
  updateStatus: (id: string, data: any) => api.patch(`/contact/${id}/status`, data),
};

// Consultation API
export const consultationAPI = {
  book: (data: ConsultationFormData) => api.post('/consultation', data),
  getAll: (params?: any) => api.get('/consultation', { params }),
  update: (id: string, data: any) => api.patch(`/consultation/${id}`, data),
  getReminders: () => api.get('/consultation/reminders/upcoming'),
};

// Blog API
export const blogAPI = {
  getPosts: (params?: BlogParams) => api.get('/blog', { params }),
  getPostBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getFeatured: () => api.get('/blog/featured'),
  getCategories: () => api.get('/blog/categories'),
  getTags: () => api.get('/blog/tags'),
  create: (data: any) => api.post('/blog', data),
  update: (id: string, data: any) => api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
};

// Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  investmentInterest?: 'starter' | 'premium' | 'exclusive' | 'not-sure';
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