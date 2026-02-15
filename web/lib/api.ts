import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: any) => apiClient.post('/auth/signup', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/me'),
};

// Applications API
export const applicationsApi = {
  create: (data: any) => apiClient.post('/applications', data),
  getAll: (filters?: any) => apiClient.get('/applications', { params: filters }),
  getOne: (id: string) => apiClient.get(`/applications/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/applications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/applications/${id}`),
  getStats: () => apiClient.get('/applications/stats'),
};

// Users API
export const usersApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.patch('/users/profile', data),
  updateNotifications: (data: any) => apiClient.patch('/users/notifications', data),
};