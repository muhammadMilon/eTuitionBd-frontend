import { BookOpen, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const TuitionManagement = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchTuitions();
  }, [statusFilter]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await api.get(`/api/admin/tuitions?${params.toString()}`);
      setTuitions(data.tuitions || []);
    } catch (error) {
      console.error('Error fetching tuitions:', error);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTuitions();
  };

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await api.post(`/api/admin/tuitions/${id}/approve`);
      toast.success('Tuition approved successfully');
      fetchTuitions();
    } catch (error) {
      console.error('Error approving tuition:', error);
      toast.error(error.response?.data?.message || 'Failed to approve tuition');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this tuition post?')) {
      return;
    }

    try {
      setProcessingId(id);
      await api.post(`/api/admin/tuitions/${id}/reject`);
      toast.success('Tuition rejected successfully');
      fetchTuitions();
    } catch (error) {
      console.error('Error rejecting tuition:', error);
      toast.error(error.response?.data?.message || 'Failed to reject tuition');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { className: 'badge-warning', label: 'Pending' },
      approved: { className: 'badge-success', label: 'Approved' },
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
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="text-primary" size={40} />
          Tuition Management
        </h1>
        <p className="text-base-content/70">Review and approve/reject tuition posts</p>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              <input
                type="text"
                placeholder="Search tuitions..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
            </select>
            <button onClick={handleSearch} className="btn btn-primary">
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Tuitions List */}
      {tuitions.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Tuitions Found</h3>
            <p className="text-base-content/70">No tuitions match your search criteria</p>
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
                      <h2 className="card-title text-2xl">
                        {tuition.title || `${tuition.subject} - Class ${tuition.class}`}
                      </h2>
                      {getStatusBadge(tuition.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-base-content/70">Subject</p>
                        <p className="font-semibold">{tuition.subject || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Class</p>
                        <p className="font-semibold">{tuition.class || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Location</p>
                        <p className="font-semibold">{tuition.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Budget</p>
                        <p className="font-semibold text-primary">৳{tuition.budget || 'N/A'}/month</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Student</p>
                        <p className="font-semibold">{tuition.studentId?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Applications</p>
                        <p className="font-semibold">{tuition.applicationsCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Posted Date</p>
                        <p className="font-semibold">
                          {tuition.createdAt ? new Date(tuition.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {tuition.description && (
                      <div className="mt-4">
                        <p className="text-sm text-base-content/70 mb-1">Description</p>
                        <p className="text-sm">{tuition.description.substring(0, 200)}...</p>
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
                  {tuition.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(tuition._id)}
                        className="btn btn-success btn-sm"
                        disabled={processingId === tuition._id}
                      >
                        {processingId === tuition._id ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(tuition._id)}
                        className="btn btn-error btn-sm"
                        disabled={processingId === tuition._id}
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </>
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

export default TuitionManagement;

