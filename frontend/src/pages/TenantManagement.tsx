import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { tenantAPI } from "../services/api";
import {
  Building2,
  Plus,
  Users,
  Crown,
  User,
  Copy,
} from "lucide-react";
import EmptyState from "../components/EmptyState";

const TenantManagement: React.FC = () => {
  const { tenants = [], refreshTenants, currentTenant, setCurrentTenant } =
    useAuth();
  const { showSuccess, showError } = useToast();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create tenant form state
  const [createForm, setCreateForm] = useState({
    name: "",
    domain: "",
    plan: "FREE" as "FREE" | "PREMIUM" | "ENTERPRISE",
  });

  // Join tenant form state
  const [joinForm, setJoinForm] = useState({
    tenantId: "",
  });

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await tenantAPI.createTenant(createForm);
      showSuccess(
        "Tenant created successfully!",
        `"${createForm.name}" has been created.`
      );
      setCreateForm({ name: "", domain: "", plan: "FREE" });
      setShowCreateForm(false);
      await refreshTenants();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create tenant";
      setError(errorMessage);
      showError("Failed to create tenant", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await tenantAPI.joinTenant(joinForm);
      showSuccess(
        "Successfully joined tenant!",
        "You can now switch to this tenant."
      );
      setJoinForm({ tenantId: "" });
      setShowJoinForm(false);
      await refreshTenants();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to join tenant";
      setError(errorMessage);
      showError("Failed to join tenant", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = (tenant: any) => {
    setCurrentTenant(tenant);
  };

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showSuccess("Copied!", "Invite code copied to clipboard.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tenant Management
          </h1>
          <p className="text-gray-600">
            Manage your organizations and switch between tenants.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowJoinForm(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Join Tenant</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tenant</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Tenant */}
      {currentTenant && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTenant.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentTenant.domain &&
                    `Domain: ${currentTenant.domain}`}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      currentTenant.plan === "FREE"
                        ? "bg-gray-100 text-gray-800"
                        : currentTenant.plan === "PREMIUM"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {currentTenant.plan}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                      currentTenant.role === "ADMIN"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {currentTenant.role === "ADMIN" ? (
                      <Crown className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span>{currentTenant.role}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Currently Active</div>
          </div>
        </div>
      )}

      {/* All Tenants */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Tenants
        </h2>
        {tenants.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No tenants"
            description="Create a new tenant or join an existing one to get started."
            action={{
              label: "Create Tenant",
              onClick: () => setShowCreateForm(true),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentTenant?.id === tenant.id
                    ? "border-primary-200 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => switchTenant(tenant)}
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {tenant.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {tenant.domain || "No domain set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      tenant.plan === "FREE"
                        ? "bg-gray-100 text-gray-800"
                        : tenant.plan === "PREMIUM"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {tenant.plan}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${
                      tenant.role === "ADMIN"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {tenant.role === "ADMIN" ? (
                      <Crown className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span>{tenant.role}</span>
                  </span>
                </div>

                {/* Invite Code */}
                <div
                  className="mt-3 flex items-center justify-between bg-gray-50 px-2 py-1 rounded border text-xs text-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">
                    Invite Code: {tenant.id}
                  </span>
                  <button
                    onClick={() => handleCopyCode(tenant.id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 ml-2"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedId === tenant.id ? "Copied" : ""}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tenant Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Tenant
            </h2>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="input"
                  placeholder="Enter tenant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain (optional)
                </label>
                <input
                  type="text"
                  value={createForm.domain}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, domain: e.target.value })
                  }
                  className="input"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={createForm.plan}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      plan: e.target.value as any,
                    })
                  }
                  className="input"
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner h-4 w-4 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Tenant"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Tenant Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Join Existing Tenant
            </h2>
            <form onSubmit={handleJoinTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant ID *
                </label>
                <input
                  type="text"
                  required
                  value={joinForm.tenantId}
                  onChange={(e) =>
                    setJoinForm({ ...joinForm, tenantId: e.target.value })
                  }
                  className="input"
                  placeholder="Enter tenant ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ask your tenant admin for the tenant ID
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner h-4 w-4 border-white"></div>
                      <span>Joining...</span>
                    </div>
                  ) : (
                    "Join Tenant"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
