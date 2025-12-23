import { BookOpen, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

import { useAuth } from '../../context/AuthContext';

const MyTuitions = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/dashboard/tuition-management');
      return;
    }
    fetchTuitions();
  }, [userRole, navigate]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tuitions/student/my-tuitions');
      setTuitions(data.tuitions || []);
    } catch (error) {
      console.error('Error fetching tuitions:', error);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tuition post?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/tuitions/${id}`);
      toast.success('Tuition deleted successfully');
      fetchTuitions();
    } catch (error) {
      console.error('Error deleting tuition:', error);
      toast.error(error.response?.data?.message || 'Failed to delete tuition');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { className: 'badge-success', label: 'Approved' },
      pending: { className: 'badge-warning', label: 'Pending' },
      rejected: { className: 'badge-error', label: 'Rejected' },
      active: { className: 'badge-success', label: 'Active' },
      closed: { className: 'badge-neutral', label: 'Closed' },
    };
    const badge = badges[status] || { className: 'badge-neutral', label: status };
    return (
      <span className={`badge ${badge.className}`}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={40} />
            My Tuitions
          </h1>
          <p className="text-base-content/70">View and manage your tuition posts</p>
        </div>
        <Link to="/dashboard/post-tuition" className="btn btn-primary">
          <Plus size={20} />
          Post New Tuition
        </Link>
      </div>

      {/* Tuitions List */}
      {tuitions.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Tuitions Posted</h3>
            <p className="text-base-content/70 mb-6">Start by posting your first tuition requirement</p>
            <Link to="/dashboard/post-tuition" className="btn btn-primary">
              <Plus size={20} />
              Post New Tuition
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tuitions.map((tuition) => (
            <div key={tuition._id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="card-title text-2xl">{tuition.title || `${tuition.subject} - Class ${tuition.class}`}</h2>
                      {getStatusBadge(tuition.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-base-content/70">Subject</p>
                        <p className="font-semibold">{tuition.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Class</p>
                        <p className="font-semibold">{tuition.class}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Location</p>
                        <p className="font-semibold">{tuition.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Budget</p>
                        <p className="font-semibold text-primary">{tuition.budget}/month</p>
                      </div>
                      {tuition.approvedTutorId && (
                        <div>
                          <p className="text-sm text-base-content/70">Approved Tutor</p>
                          <p className="font-semibold">{tuition.approvedTutorId.name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-base-content/70">Applications</p>
                        <p className="font-semibold">{tuition.applicationsCount || 0}</p>
                      </div>
                    </div>
                    {tuition.description && (
                      <div className="mt-4">
                        <p className="text-sm text-base-content/70 mb-1">Description</p>
                        <p className="text-sm">{tuition.description.substring(0, 150)}...</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-actions mt-6 flex-wrap gap-2">
                  <Link
                    to={`/tuitions/${tuition._id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    <Eye size={18} />
                    View Details
                  </Link>
                  {tuition.status === 'pending' || tuition.status === 'rejected' ? (
                    <Link
                      to={`/dashboard/tuitions/${tuition._id}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      <Edit size={18} />
                      Edit
                    </Link>
                  ) : null}
                  {tuition.status !== 'active' && (
                    <button
                      onClick={() => handleDelete(tuition._id)}
                      className="btn btn-error btn-sm"
                      disabled={deletingId === tuition._id}
                    >
                      {deletingId === tuition._id ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Trash2 size={18} />
                          Delete
                        </>
                      )}
                    </button>
                  )}
                  {tuition.status === 'approved' && (
                    <Link
                      to={`/dashboard/applications?tuitionId=${tuition._id}`}
                      className="btn btn-info btn-sm"
                    >
                      <Eye size={18} />
                      View Applications
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTuitions;

