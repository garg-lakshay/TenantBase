export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  plan: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  role?: 'ADMIN' | 'MEMBER';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Membership {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  tenantId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateTenantRequest {
  name: string;
  domain?: string;
  plan?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
}

export interface JoinTenantRequest {
  tenantId: string;
}

export interface CreateProjectRequest {
  name: string;
  tenantId: string;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  assigneeId?: string;
}
