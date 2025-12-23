import { Edit, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';

const UserManagement = ({ initialRole = '' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    photoUrl: '',
    role: '',
    isActive: true,
    isVerified: false,
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await api.get(`/api/admin/users?${params.toString()}`);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      photoUrl: user.photoUrl || '',
      role: user.role || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      isVerified: user.isVerified !== undefined ? user.isVerified : false,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      photoUrl: '',
      role: '',
      isActive: true,
      isVerified: false,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}`, editForm);
      toast.success('User updated successfully');
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Users className="text-primary" size={40} />
          User Management
        </h1>
        <p className="text-base-content/70">Manage all user accounts on the platform</p>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full pl-10 bg-base-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <select
              className="select select-bordered bg-base-100"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleSearch} className="btn btn-primary">
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            {user.photoUrl ? (
                              <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.name || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-error' :
                        user.role === 'tutor' ? 'badge-info' : 'badge-primary'
                      }`}>
                        {user.role || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`badge badge-sm ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.role === 'tutor' && (
                          <span className={`badge badge-sm ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {editingId === user._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(user._id)}
                            className="btn btn-success btn-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn btn-ghost btn-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn btn-primary btn-xs"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="btn btn-error btn-xs"
                              disabled={deletingId === user._id}
                            >
                              {deletingId === user._id ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto mb-4 text-base-content/30" size={64} />
                <p className="text-lg text-base-content/70">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-100"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-base-100"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full bg-base-100"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full bg-base-100"
                  value={editForm.photoUrl}
                  onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered w-full bg-base-100"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Active</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text">Verified</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={editForm.isVerified}
                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  />
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button onClick={handleCancelEdit} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={() => handleUpdate(editingId)} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

