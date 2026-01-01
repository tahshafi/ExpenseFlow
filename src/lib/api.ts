import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (userData: any) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
};

export const expenses = {
  getAll: () => api.get('/expenses'),
  create: (data: any) => api.post('/expenses', data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

export const income = {
  getAll: () => api.get('/income'),
  create: (data: any) => api.post('/income', data),
  delete: (id: string) => api.delete(`/income/${id}`),
};

export const budgets = {
  getAll: () => api.get('/budgets'),
  createOrUpdate: (data: any) => api.post('/budgets', data),
  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export default api;
