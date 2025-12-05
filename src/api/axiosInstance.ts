import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Tenant-specific API functions
export const tenantApi = {
  // Products
  getProducts: (tenant: string) => api.get(`/${tenant}/products`),
  getProduct: (tenant: string, id: string) => api.get(`/${tenant}/products/${id}`),
  createProduct: (tenant: string, data: any) => api.post(`/${tenant}/products`, data),
  updateProduct: (tenant: string, id: string, data: any) => api.put(`/${tenant}/products/${id}`, data),
  deleteProduct: (tenant: string, id: string) => api.delete(`/${tenant}/products/${id}`),

  // Orders
  getOrders: (tenant: string) => api.get(`/${tenant}/orders`),
  createOrder: (tenant: string, data: any) => api.post(`/${tenant}/orders`, data),
  updateOrderStatus: (tenant: string, id: string, status: string) => 
    api.patch(`/${tenant}/orders/${id}`, { status }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  superAdminLogin: (email: string, password: string) => 
    api.post('/superadmin/login', { email, password }),
};

// Superadmin API
export const superAdminApi = {
  getTenants: () => api.get('/tenants'),
  createTenant: (data: any) => api.post('/tenants', data),
  updateTenant: (id: string, data: any) => api.put(`/tenants/${id}`, data),
  deleteTenant: (id: string) => api.delete(`/tenants/${id}`),
};
