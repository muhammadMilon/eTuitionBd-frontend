import { BookOpen, Edit, Trash2, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({
    qualifications: '',
    experience: '',
    expectedSalary: '',
    availability: '',
    message: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/applications/tutor/my-applications');
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (application) => {
    setEditingId(application._id);
    setEditForm({
      qualifications: application.qualifications || '',
      experience: application.experience || '',
      expectedSalary: application.expectedSalary?.toString() || '',
      availability: application.availability || '',
      message: application.message || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      qualifications: '',
      experience: '',
      expectedSalary: '',
      availability: '',
      message: '',
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/applications/${id}`, editForm);
      toast.success('Application updated successfully');
      setEditingId(null);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error(error.response?.data?.message || 'Failed to update application');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/applications/${id}`);
      toast.success('Application deleted successfully');
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error(error.response?.data?.message || 'Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { className: 'badge-warning', label: 'Pending', icon: Clock },
      approved: { className: 'badge-success', label: 'Approved', icon: CheckCircle },
      rejected: { className: 'badge-error', label: 'Rejected', icon: XCircle },
      closed: { className: 'badge-neutral', label: 'Closed', icon: XCircle },
    };
    const badge = badges[status] || { className: 'badge-neutral', label: status, icon: Clock };
    return (
      <span className={`badge ${badge.className} gap-1`}>
        <badge.icon size={14} />
        {badge.label}
      </span>
    );
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
          <BookOpen className="text-primary" size={40} />
          My Applications
        </h1>
        <p className="text-base-content/70">Track and manage your tuition applications</p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Applications Yet</h3>
            <p className="text-base-content/70 mb-6">Start applying to tuitions to see them here</p>
            <Link to="/tuitions" className="btn btn-primary">
              Browse Tuitions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <div key={application._id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="card-title text-xl">
                        {application.tuitionId?.title || `${application.tuitionId?.subject} - Class ${application.tuitionId?.class}`}
                      </h2>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-base-content/70">Student</p>
                        <p className="font-semibold">{application.tuitionId?.studentId?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Location</p>
                        <p className="font-semibold">{application.tuitionId?.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Budget</p>
                        <p className="font-semibold text-primary">৳{application.tuitionId?.budget || 'N/A'}/month</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Expected Salary</p>
                        <p className="font-semibold text-primary">৳{application.expectedSalary?.toLocaleString() || 'N/A'}/month</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Qualifications</p>
                        <p className="font-semibold">{application.qualifications || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Experience</p>
                        <p className="font-semibold">{application.experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Availability</p>
                        <p className="font-semibold">{application.availability || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Applied Date</p>
                        <p className="font-semibold">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {application.message && (
                      <div className="mt-4 p-3 bg-base-300 rounded-lg">
                        <p className="text-sm text-base-content/70 mb-1">Message</p>
                        <p className="text-sm">{application.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {editingId === application._id && application.status === 'pending' ? (
                  <div className="mt-4 p-4 bg-base-300 rounded-lg space-y-4">
                    <h3 className="font-semibold">Edit Application</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">Qualifications</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={editForm.qualifications}
                          onChange={(e) => setEditForm({ ...editForm, qualifications: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Experience</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={editForm.experience}
                          onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Expected Salary</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full bg-base-100"
                          value={editForm.expectedSalary}
                          onChange={(e) => setEditForm({ ...editForm, expectedSalary: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Availability</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={editForm.availability}
                          onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Message</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full bg-base-100"
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(application._id)}
                        className="btn btn-primary btn-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card-actions mt-6 flex-wrap gap-2">
                    <Link
                      to={`/tuitions/${application.tuitionId?._id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      <Eye size={18} />
                      View Tuition
                    </Link>
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleEdit(application)}
                          className="btn btn-primary btn-sm"
                        >
                          <Edit size={18} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="btn btn-error btn-sm"
                          disabled={deletingId === application._id}
                        >
                          {deletingId === application._id ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            <>
                              <Trash2 size={18} />
                              Delete
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

