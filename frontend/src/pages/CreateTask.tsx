import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { taskAPI } from '../services/api';
import { ArrowLeft, CheckSquare } from 'lucide-react';

const CreateTask: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentTenant } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!projectId) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    try {
      await taskAPI.createTask({
        projectId,
        title: formData.title,
        description: formData.description || undefined,
        assigneeId: formData.assigneeId || undefined,
      });
      showSuccess('Task created successfully!', `"${formData.title}" has been created.`);
      navigate(`/projects/${projectId}/tasks`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      showError('Failed to create task', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/projects/${projectId}/tasks`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600">
            Add a new task to this project.
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">
              Assignee ID (optional)
            </label>
            <input
              type="text"
              id="assigneeId"
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="input"
              placeholder="Enter user ID to assign this task"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to create an unassigned task.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Task Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Project ID:</strong> {projectId}</p>
              <p><strong>Status:</strong> Will be set to "todo" by default</p>
              <p><strong>Tenant:</strong> {currentTenant?.name}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="btn btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="loading-spinner h-4 w-4 border-white"></div>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
