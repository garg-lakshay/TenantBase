import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Tenant } from '../types';
import { authAPI, tenantAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  refreshTenants: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Initializing auth:', { hasToken: !!token, hasUserData: !!userData });
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          console.log('User set from localStorage, refreshing tenants...');
          await refreshTenants();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('No token or user data found in localStorage');
      }
      setLoading(false);
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    initAuth().finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      await refreshTenants();
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authAPI.register({ name, email, password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
  };

  const refreshTenants = async () => {
    try {
      console.log('Fetching tenants...');
      const response = await tenantAPI.getMyTenants();
      console.log('Tenants fetched:', response);
      setTenants(response.tenants);
      if (response.tenants.length > 0 && !currentTenant) {
        console.log('Setting current tenant to:', response.tenants[0]);
        setCurrentTenant(response.tenants[0]);
      }
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  const value: AuthContextType = {
    user,
    tenants,
    currentTenant,
    login,
    register,
    logout,
    setCurrentTenant,
    refreshTenants,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
