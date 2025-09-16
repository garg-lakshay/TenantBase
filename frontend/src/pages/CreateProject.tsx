import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { projectAPI } from '../services/api';
import { ArrowLeft, FolderPlus } from 'lucide-react';

const CreateProject: React.FC = () => {
  const { currentTenant } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!currentTenant) {
      setError('No tenant selected');
      setLoading(false);
      return;
    }

    try {
      await projectAPI.createProject({
        name: formData.name,
        tenantId: currentTenant.id,
      });
      showSuccess('Project created successfully!', `"${formData.name}" has been created.`);
      navigate('/projects');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create project';
      setError(errorMessage);
      showError('Failed to create project', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600">
            Create a new project in {currentTenant?.name}.
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter project name"
            />
            <p className="text-sm text-gray-500 mt-1">
              Choose a descriptive name for your project.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Project Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Tenant:</strong> {currentTenant?.name}</p>
              <p><strong>Plan:</strong> {currentTenant?.plan}</p>
              <p><strong>Your Role:</strong> {currentTenant?.role}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="btn btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="loading-spinner h-4 w-4 border-white"></div>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
