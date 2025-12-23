import { Users, CheckCircle, XCircle, Eye, DollarSign, GraduationCap, Clock, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const AppliedTutors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tuitionId = searchParams.get('tuitionId');
  
  const [tuitions, setTuitions] = useState([]);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchTuitions();
  }, []);

  useEffect(() => {
    if (tuitionId && tuitions.length > 0) {
      const tuition = tuitions.find(t => t._id === tuitionId);
      if (tuition) {
        setSelectedTuition(tuition);
        fetchApplications(tuition._id);
      }
    }
  }, [tuitionId, tuitions]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/tuitions/student/my-tuitions');
      const approvedTuitions = (data.tuitions || []).filter(t => t.status === 'approved' || t.status === 'active');
      setTuitions(approvedTuitions);
      
      if (approvedTuitions.length > 0 && !tuitionId) {
        setSelectedTuition(approvedTuitions[0]);
        fetchApplications(approvedTuitions[0]._id);
      }
    } catch (error) {
      console.error('Error fetching tuitions:', error);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (id) => {
    try {
      const { data } = await api.get(`/api/applications/tuition/${id}`);
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      setProcessingId(applicationId);
      // Get application details for payment
      const { data } = await api.post(`/api/applications/${applicationId}/approve`);
      
      // Redirect to checkout page with application details
      navigate('/dashboard/checkout', {
        state: {
          application: data.application,
          applicationId: applicationId,
        },
      });
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error(error.response?.data?.message || 'Failed to approve application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      setProcessingId(applicationId);
      await api.post(`/api/applications/${applicationId}/reject`);
      toast.success('Application rejected');
      if (selectedTuition) {
        fetchApplications(selectedTuition._id);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error.response?.data?.message || 'Failed to reject application');
    } finally {
      setProcessingId(null);
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
          <Users className="text-primary" size={40} />
          Applied Tutors
        </h1>
        <p className="text-base-content/70">View and manage tutor applications for your tuitions</p>
      </div>

      {/* Tuition Selector */}
      {tuitions.length > 0 && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <label className="label">
              <span className="label-text font-semibold">Select Tuition</span>
            </label>
            <select
              className="select select-bordered w-full bg-base-100"
              value={selectedTuition?._id || ''}
              onChange={(e) => {
                const tuition = tuitions.find(t => t._id === e.target.value);
                setSelectedTuition(tuition);
                if (tuition) {
                  fetchApplications(tuition._id);
                }
              }}
            >
              <option value="">Select a tuition...</option>
              {tuitions.map((tuition) => (
                <option key={tuition._id} value={tuition._id}>
                  {tuition.title || `${tuition.subject} - Class ${tuition.class}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Applications List */}
      {tuitions.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Approved Tuitions</h3>
            <p className="text-base-content/70">You need to have approved tuitions to receive applications</p>
          </div>
        </div>
      ) : !selectedTuition ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <Users className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">Select a Tuition</h3>
            <p className="text-base-content/70">Choose a tuition to view applications</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <Users className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Applications Yet</h3>
            <p className="text-base-content/70">No tutors have applied to this tuition yet</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <div key={application._id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  {/* Tutor Avatar */}
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
                      {application.tutorId?.photoUrl ? (
                        <img src={application.tutorId.photoUrl} alt={application.tutorId.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        application.tutorId?.name?.charAt(0)?.toUpperCase() || 'T'
                      )}
                    </div>
                  </div>

                  {/* Tutor Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="card-title text-xl">{application.tutorId?.name || 'Tutor'}</h2>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                          <GraduationCap size={16} />
                          Qualifications
                        </p>
                        <p className="font-semibold">{application.qualifications || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Experience</p>
                        <p className="font-semibold">{application.experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                          <DollarSign size={16} />
                          Expected Salary
                        </p>
                        <p className="font-semibold text-primary">৳{application.expectedSalary?.toLocaleString()}/month</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                          <Clock size={16} />
                          Availability
                        </p>
                        <p className="font-semibold">{application.availability || 'N/A'}</p>
                      </div>
                    </div>

                    {application.message && (
                      <div className="mt-4 p-3 bg-base-300 rounded-lg">
                        <p className="text-sm text-base-content/70 mb-1">Message</p>
                        <p className="text-sm">{application.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {application.status === 'pending' && (
                      <div className="card-actions mt-6 gap-2">
                        <button
                          onClick={() => handleApprove(application._id)}
                          className="btn btn-success btn-sm"
                          disabled={processingId === application._id}
                        >
                          {processingId === application._id ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Approve & Pay
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(application._id)}
                          className="btn btn-error btn-sm"
                          disabled={processingId === application._id}
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;

