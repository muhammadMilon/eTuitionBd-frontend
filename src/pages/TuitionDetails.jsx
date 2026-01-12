import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Send,
    Star,
    User,
    Users,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const TuitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [tuition, setTuition] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
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
      fetchTuitionDetails(); // Refresh list
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error.response?.data?.message || 'Failed to reject application');
    } finally {
      setProcessingId(null);
    }
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

            {/* Application Modal */}
            <AnimatePresence>
              {showApplicationForm && userRole === 'tutor' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowApplicationForm(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  />
                  
                  {/* Modal Content */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-base-100 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden"
                  >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                  
                  <div className="p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                          <Send size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight">Apply for Tuition</h2>
                          <p className="text-sm opacity-60">Complete the form to send your application</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowApplicationForm(false)}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
                      >
                        <AlertCircle className="rotate-45" size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleApplicationSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">My Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                              type="text"
                              className="input input-bordered w-full pl-12 bg-base-200 border-none focus:ring-2 ring-primary/20 pointer-events-none opacity-70"
                              value={currentUser?.displayName || currentUser?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">My Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                              type="email"
                              className="input input-bordered w-full pl-12 bg-base-200 border-none focus:ring-2 ring-primary/20 pointer-events-none opacity-70"
                              value={currentUser?.email || ''}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">Educational Qualifications <span className="text-primary">*</span></label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                          <input
                            type="text"
                            name="qualifications"
                            placeholder="e.g., BSc in Mathematics, MSc in Physics"
                            className="input input-bordered w-full pl-12 bg-base-200 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/10 transition-all font-medium"
                            value={applicationData.qualifications}
                            onChange={handleApplicationChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">Teaching Experience <span className="text-primary">*</span></label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                          <input
                            type="text"
                            name="experience"
                            placeholder="e.g., 5 years of teaching experience"
                            className="input input-bordered w-full pl-12 bg-base-200 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/10 transition-all font-medium"
                            value={applicationData.experience}
                            onChange={handleApplicationChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">Expected Salary (৳) <span className="text-primary">*</span></label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                              type="number"
                              name="expectedSalary"
                              placeholder="e.g., 6000"
                              className="input input-bordered w-full pl-12 bg-base-200 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/10 transition-all font-medium"
                              value={applicationData.expectedSalary}
                              onChange={handleApplicationChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">Weekly Availability <span className="text-primary">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                              type="text"
                              name="availability"
                              placeholder="e.g., 3 days, 4 PM - 6 PM"
                              className="input input-bordered w-full pl-12 bg-base-200 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/10 transition-all font-medium"
                              value={applicationData.availability}
                              onChange={handleApplicationChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest opacity-50 ml-1">Message to Student / Parent</label>
                        <textarea
                          name="message"
                          className="textarea textarea-bordered w-full h-32 bg-base-200 border-transparent focus:border-primary/30 focus:ring-4 ring-primary/10 transition-all font-medium p-4"
                          placeholder="Introduce yourself and explain why you're a good fit..."
                          value={applicationData.message}
                          onChange={handleApplicationChange}
                        ></textarea>
                      </div>

                      <div className="flex gap-4 pt-4 sticky bottom-0 bg-base-100 pb-2">
                        <button
                          type="button"
                          onClick={() => setShowApplicationForm(false)}
                          className="btn btn-ghost flex-1 rounded-2xl"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary flex-[2] rounded-2xl shadow-xl shadow-primary/20" disabled={submitting}>
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
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
                              <button
                                onClick={() => handleApprove(application._id)}
                                className="btn btn-success btn-sm"
                                disabled={processingId === application._id}
                              >
                                {processingId === application._id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <>
                                    <CheckCircle size={16} />
                                    Approve & Pay
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(application._id)}
                                className="btn btn-error btn-sm btn-outline"
                                disabled={processingId === application._id}
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
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

            {/* Verification & Trust Badge */}
            <div className="card bg-base-200 border-l-4 border-success shadow-xl">
              <div className="card-body p-6">
                 <div className="flex gap-4">
                   <div className="bg-success/10 p-3 rounded-full h-fit text-success">
                     <CheckCircle size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">Verified Post</h3>
                     <p className="text-sm opacity-70 mt-1">
                       This tuition post has been verified by our team. You can safely apply and communicate.
                     </p>
                   </div>
                 </div>
              </div>
            </div>

            {/* Related Tuitions (Mock) */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 text-sm tracking-widest uppercase opacity-50">Related Tuitions</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center group cursor-pointer hover:bg-base-300 p-2 rounded-lg transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-base-100 flex items-center justify-center text-primary font-bold">
                        Math
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate group-hover:text-primary transition-colors">Class 8 Math Tutor</h4>
                        <p className="text-xs opacity-60">Dhaka, Dhanmondi</p>
                        <p className="text-xs font-bold text-primary mt-1">৳5,000/mo</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Bottom full width */}
        <div className="mt-12">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-6">Reviews & Rating</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Rating Summary */}
                 <div className="text-center md:text-left">
                   <div className="text-5xl font-black text-primary">4.8</div>
                   <div className="flex gap-1 justify-center md:justify-start text-warning my-2">
                     {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                   </div>
                   <p className="text-sm opacity-60">Based on 12 reviews</p>
                 </div>

                 {/* Reviews List */}
                 <div className="md:col-span-2 space-y-6">
                   {[
                     { user: 'Rahim A.', rating: 5, text: 'Great student, very cooperative family.', date: '2 days ago' },
                     { user: 'Karim U.', rating: 4, text: 'Good environment for teaching.', date: '1 week ago' }
                   ].map((review, idx) => (
                     <div key={idx} className="border-b border-base-content/10 pb-6 last:border-0 last:pb-0">
                       <div className="flex justify-between items-start mb-2">
                         <div className="font-bold">{review.user}</div>
                         <span className="text-xs opacity-50">{review.date}</span>
                       </div>
                       <div className="flex gap-1 text-warning text-xs mb-2">
                         {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                       </div>
                       <p className="text-sm opacity-80">"{review.text}"</p>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TuitionDetails;

