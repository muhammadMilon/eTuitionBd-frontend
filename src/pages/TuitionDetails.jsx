import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  MapPin,
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  GraduationCap,
  CheckCircle,
  Send,
  Users,
  FileText,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

const TuitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [tuition, setTuition] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState({
    qualifications: '',
    experience: '',
    expectedSalary: '',
    availability: '',
    message: '',
  });

  useEffect(() => {
    fetchTuitionDetails();
  }, [id, currentUser]);

  const fetchTuitionDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/tuitions/${id}`);
      setTuition(data.tuition);

      // If student, fetch applications
      if (userRole === 'student' && data.tuition?.studentId?._id?.toString() === currentUser?._id?.toString()) {
        try {
          const appsRes = await api.get(`/api/applications/tuition/${id}`);
          setApplications(appsRes.data.applications || []);
        } catch (err) {
          console.error('Error fetching applications:', err);
        }
      }

      // If tutor, check if already applied
      if (userRole === 'tutor' && currentUser) {
        try {
          const appsRes = await api.get('/api/applications/tutor/my-applications');
          const myApps = appsRes.data.applications || [];
          const applied = myApps.some(app => app.tuitionId?._id?.toString() === id);
          setHasApplied(applied);
        } catch (err) {
          console.error('Error checking application:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching tuition:', error);
      toast.error('Failed to load tuition details');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!applicationData.qualifications || !applicationData.experience || !applicationData.expectedSalary || !applicationData.availability) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/api/applications/apply/${id}`, applicationData);
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setHasApplied(true);
      setApplicationData({
        qualifications: '',
        experience: '',
        expectedSalary: '',
        availability: '',
        message: '',
      });
      // Refresh tuition to update applications count
      fetchTuitionDetails();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tuition Not Found</h2>
          <Link to="/tuitions" className="btn btn-primary">
            Back to Tuitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          to="/tuitions"
          className="btn btn-ghost mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Tuitions
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{tuition.title || `${tuition.subject} - Class ${tuition.class}`}</h1>
                    <span className={`badge ${
                      tuition.status === 'active' || tuition.status === 'approved' ? 'badge-success' : 
                      tuition.status === 'pending' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {tuition.status}
                    </span>
                  </div>
                  {userRole === 'tutor' && (tuition.status === 'approved' || tuition.status === 'active') && !hasApplied && (
                    <button
                      onClick={() => setShowApplicationForm(!showApplicationForm)}
                      className="btn btn-primary"
                    >
                      <Send size={20} />
                      {showApplicationForm ? 'Cancel' : 'Apply Now'}
                    </button>
                  )}
                  {userRole === 'tutor' && hasApplied && (
                    <span className="badge badge-success">Already Applied</span>
                  )}
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <BookOpen className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Subject</p>
                      <p className="font-semibold">{tuition.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <GraduationCap className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Class</p>
                      <p className="font-semibold">{tuition.class}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Location</p>
                      <p className="font-semibold">{tuition.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <DollarSign className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Budget</p>
                      <p className="font-semibold">৳{tuition.budget || 'N/A'}/month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Clock className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Schedule</p>
                      <p className="font-semibold">{tuition.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50">Posted</p>
                      <p className="font-semibold">
                        {tuition.createdAt ? new Date(tuition.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationForm && userRole === 'tutor' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Apply for This Tuition</h2>
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">Name <span className="text-error">*</span></span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={currentUser?.displayName || currentUser?.name || ''}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Email <span className="text-error">*</span></span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered w-full bg-base-100"
                          value={currentUser?.email || ''}
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Qualifications <span className="text-error">*</span></span>
                      </label>
                      <input
                        type="text"
                        name="qualifications"
                        placeholder="e.g., BSc in Mathematics, MSc in Physics"
                        className="input input-bordered w-full bg-base-100"
                        value={applicationData.qualifications}
                        onChange={handleApplicationChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Experience <span className="text-error">*</span></span>
                      </label>
                      <input
                        type="text"
                        name="experience"
                        placeholder="e.g., 5 years of teaching experience"
                        className="input input-bordered w-full bg-base-100"
                        value={applicationData.experience}
                        onChange={handleApplicationChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Expected Salary (৳/month) <span className="text-error">*</span></span>
                      </label>
                      <input
                        type="number"
                        name="expectedSalary"
                        placeholder="e.g., 6000"
                        className="input input-bordered w-full bg-base-100"
                        value={applicationData.expectedSalary}
                        onChange={handleApplicationChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Availability <span className="text-error">*</span></span>
                      </label>
                      <input
                        type="text"
                        name="availability"
                        placeholder="e.g., Saturday & Sunday, 4 PM - 6 PM"
                        className="input input-bordered w-full bg-base-100"
                        value={applicationData.availability}
                        onChange={handleApplicationChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Message to Student (Optional)</span>
                      </label>
                      <textarea
                        name="message"
                        className="textarea textarea-bordered w-full h-32 bg-base-100"
                        placeholder="Introduce yourself and explain why you're a good fit..."
                        value={applicationData.message}
                        onChange={handleApplicationChange}
                      ></textarea>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <Send size={20} />
                            Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Description
                </h2>
                <p className="text-base-content/80 leading-relaxed">{tuition.description || 'No description provided'}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Requirements
                </h2>
                {tuition.requirements && tuition.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {tuition.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-success mt-1" size={16} />
                        <span className="text-base-content/80">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base-content/70">No specific requirements listed</p>
                )}
              </div>
            </div>

            {/* Applications List (for Student/Owner) */}
            {userRole === 'student' && tuition.studentId?._id?.toString() === currentUser?._id?.toString() && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title flex items-center gap-2">
                      <Users size={20} />
                      Applications ({applications.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application._id}
                        className="p-4 rounded-lg bg-base-300 border border-base-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{application.tutorId?.name || 'Tutor'}</h3>
                              <span className={`badge badge-sm ${
                                application.status === 'pending' ? 'badge-warning' : 
                                application.status === 'approved' ? 'badge-success' : 'badge-error'
                              }`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-sm text-base-content/70 mb-1">
                              Qualifications: {application.qualifications || 'N/A'}
                            </p>
                            <p className="text-sm text-base-content/70 mb-1">
                              Experience: {application.experience || 'N/A'}
                            </p>
                            <p className="text-sm text-primary font-semibold">
                              Expected Salary: ৳{application.expectedSalary?.toLocaleString() || 'N/A'}/month
                            </p>
                            {application.message && (
                              <p className="text-sm text-base-content/70 mt-2 italic">
                                "{application.message}"
                              </p>
                            )}
                            <p className="text-xs text-base-content/50 mt-2">
                              Applied on: {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {application.status === 'pending' && (
                            <div className="flex gap-2">
                              <Link
                                to={`/dashboard/applications?tuitionId=${tuition._id}`}
                                className="btn btn-success btn-sm"
                              >
                                View
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto mb-2 text-base-content/30" size={48} />
                        <p className="text-base-content/70">No applications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Student Information */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <User size={20} />
                  Posted By
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-base-content/50">Name</p>
                    <p className="font-semibold">{tuition.studentId?.name || 'N/A'}</p>
                  </div>
                  {tuition.studentId?.address && (
                    <div>
                      <p className="text-sm text-base-content/50">Location</p>
                      <p className="font-semibold">{tuition.studentId.address}</p>
                    </div>
                  )}
                  <div className="divider my-2"></div>
                  <div>
                    <p className="text-sm text-base-content/50 mb-2">Contact</p>
                    <div className="flex flex-col gap-2">
                      {tuition.studentId?.email && (
                        <a
                          href={`mailto:${tuition.studentId.email}`}
                          className="btn btn-outline btn-sm justify-start"
                        >
                          <Mail size={16} />
                          {tuition.studentId.email}
                        </a>
                      )}
                      {tuition.studentId?.phone && (
                        <a
                          href={`tel:${tuition.studentId.phone}`}
                          className="btn btn-outline btn-sm justify-start"
                        >
                          <Phone size={16} />
                          {tuition.studentId.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Applications</span>
                    <span className="font-bold">{tuition.applicationsCount || applications.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Status</span>
                    <span className={`badge ${
                      tuition.status === 'active' || tuition.status === 'approved' ? 'badge-success' : 
                      tuition.status === 'pending' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {tuition.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Posted</span>
                    <span className="font-semibold">
                      {tuition.createdAt ? new Date(tuition.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (for Students) */}
            {userRole === 'student' && tuition.studentId?._id?.toString() === currentUser?._id?.toString() && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Actions</h2>
                  <div className="space-y-2">
                    {(tuition.status === 'pending' || tuition.status === 'rejected') && (
                      <Link
                        to={`/dashboard/tuitions/${tuition._id}/edit`}
                        className="btn btn-primary w-full"
                      >
                        Edit Post
                      </Link>
                    )}
                    <Link
                      to={`/dashboard/applications?tuitionId=${tuition._id}`}
                      className="btn btn-info w-full"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionDetails;

