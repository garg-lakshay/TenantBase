import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Tenant,
  CreateTenantRequest,
  JoinTenantRequest,
  Project,
  CreateProjectRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Tenant API
export const tenantAPI = {
  getMyTenants: async (): Promise<{ message: string; tenants: Tenant[] }> => {
    const response = await api.get('/tenant/my');
    return response.data;
  },

  createTenant: async (data: CreateTenantRequest): Promise<{ message: string; tenantId: string; tenant: Tenant }> => {
    const response = await api.post('/tenant/', data);
    return response.data;
  },

  joinTenant: async (data: JoinTenantRequest): Promise<{ message: string; tenantId: string; membership: any }> => {
    const response = await api.post('/tenant/join', data);
    return response.data;
  },
};

// Project API
export const projectAPI = {
  createProject: async (data: CreateProjectRequest): Promise<{ message: string; project: Project }> => {
    const response = await api.post('/project/', data);
    return response.data;
  },

  getProjectsByTenant: async (tenantId: string): Promise<Project[]> => {
    const response = await api.get(`/project/list/${tenantId}`);
    return response.data;
  },
};

// Task API
export const taskAPI = {
  createTask: async (data: CreateTaskRequest): Promise<{ message: string; task: Task }> => {
    const response = await api.post('/task/', data);
    return response.data;
  },

  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/task/${projectId}`);
    return response.data;
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest): Promise<{ message: string; updatedTask: Task }> => {
    const response = await api.put(`/task/${taskId}`, data);
    return response.data;
  },
};

export default api;
