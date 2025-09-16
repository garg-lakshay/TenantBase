import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, currentTenant } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TenantBase</h1>
              {currentTenant && (
                <p className="text-sm text-gray-500">{currentTenant.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
