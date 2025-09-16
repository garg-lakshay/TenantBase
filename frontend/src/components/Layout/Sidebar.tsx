import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Building2, 
  FolderOpen, 
  Plus,
  Users
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { currentTenant, tenants, setCurrentTenant } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tenants', href: '/tenants', icon: Building2 },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/projects/new"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </Link>
            <Link
              to="/tenants"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Manage Tenants</span>
            </Link>
          </div>
        </div>

        {tenants.length > 1 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Switch Tenant</h3>
            <div className="space-y-1">
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => setCurrentTenant(tenant)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentTenant?.id === tenant.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{tenant.name}</span>
                    {tenant.role === 'ADMIN' && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
