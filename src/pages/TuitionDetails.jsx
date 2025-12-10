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

const TuitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [tuition, setTuition] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: '',
    expectedSalary: '',
    availability: '',
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate fetching tuition details by ID
    const mockTuition = {
      id: parseInt(id),
      title: 'Class 9-10 Mathematics Tuition',
      subject: 'Mathematics',
      class: '9-10',
      location: 'Dhanmondi, Dhaka',
      budget: '5000-7000',
      schedule: 'Saturday & Sunday, 4 PM - 6 PM',
      postedDate: '2024-12-13',
      description: 'Looking for an experienced Mathematics tutor for Class 9-10. The student needs help with algebra, geometry, and trigonometry. Prefer someone who can teach in Bengali and English.',
      requirements: [
        'Minimum 3 years of teaching experience',
        'Bachelor degree in Mathematics or related field',
        'Ability to teach in both Bengali and English',
        'Patient and understanding teaching style',
      ],
      student: {
        name: 'Student ABC',
        email: 'student@example.com',
        phone: '+880 1234 567890',
        address: 'Dhanmondi, Dhaka',
      },
      status: 'active',
      applicationsCount: 5,
    };

    const mockApplications = [
      {
        id: 1,
        tutorName: 'Dr. Ahmed Hasan',
        tutorEmail: 'ahmed@example.com',
        experience: '10 years',
        education: 'PhD in Mathematics',
        expectedSalary: '৳6,000',
        status: 'pending',
        appliedDate: '2024-12-14',
      },
      {
        id: 2,
        tutorName: 'Fatima Rahman',
        tutorEmail: 'fatima@example.com',
        experience: '7 years',
        education: 'MSc in Mathematics',
        expectedSalary: '৳5,500',
        status: 'pending',
        appliedDate: '2024-12-14',
      },
    ];

    setTuition(mockTuition);
    setApplications(mockApplications);
  }, [id]);

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    // Handle application submission
    toast.success('Application submitted successfully!');
    setShowApplicationForm(false);
    setApplicationData({
      message: '',
      expectedSalary: '',
      availability: '',
    });
  };

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  if (!tuition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
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
                    <h1 className="text-3xl font-bold mb-2">{tuition.title}</h1>
                    <span className={`badge ${
                      tuition.status === 'active' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {tuition.status}
                    </span>
                  </div>
                  {userRole === 'tutor' && tuition.status === 'active' && (
                    <button
                      onClick={() => setShowApplicationForm(!showApplicationForm)}
                      className="btn btn-primary"
                    >
                      <Send size={20} />
                      {showApplicationForm ? 'Cancel' : 'Apply Now'}
                    </button>
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
                      <p className="font-semibold">৳{tuition.budget}/month</p>
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
                      <p className="font-semibold">{tuition.postedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            {showApplicationForm && userRole === 'tutor' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Apply for This Tuition</h2>
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Expected Salary (৳/month)</span>
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
                        <span className="label-text">Availability</span>
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
                        <span className="label-text">Message to Student</span>
                      </label>
                      <textarea
                        name="message"
                        className="textarea textarea-bordered w-full h-32 bg-base-100"
                        placeholder="Introduce yourself and explain why you're a good fit..."
                        value={applicationData.message}
                        onChange={handleApplicationChange}
                        required
                      ></textarea>
                    </div>

                    <div className="card-actions">
                      <button type="submit" className="btn btn-primary w-full">
                        <Send size={20} />
                        Submit Application
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
                <p className="text-base-content/80 leading-relaxed">{tuition.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {tuition.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-success mt-1" size={16} />
                      <span className="text-base-content/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Applications List (for Student/Owner) */}
            {userRole === 'student' && (
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
                        key={application.id}
                        className="p-4 rounded-lg bg-base-300 border border-base-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{application.tutorName}</h3>
                              <span className={`badge badge-sm ${
                                application.status === 'pending' ? 'badge-warning' : 'badge-success'
                              }`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-sm text-base-content/70 mb-1">
                              Education: {application.education}
                            </p>
                            <p className="text-sm text-base-content/70 mb-1">
                              Experience: {application.experience}
                            </p>
                            <p className="text-sm text-primary font-semibold">
                              Expected Salary: {application.expectedSalary}/month
                            </p>
                            <p className="text-xs text-base-content/50 mt-2">
                              Applied on: {application.appliedDate}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn btn-success btn-sm">
                              Accept
                            </button>
                            <button className="btn btn-error btn-sm">
                              Decline
                            </button>
                          </div>
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
                    <p className="font-semibold">{tuition.student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/50">Location</p>
                    <p className="font-semibold">{tuition.student.address}</p>
                  </div>
                  <div className="divider my-2"></div>
                  <div>
                    <p className="text-sm text-base-content/50 mb-2">Contact</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`mailto:${tuition.student.email}`}
                        className="btn btn-outline btn-sm justify-start"
                      >
                        <Mail size={16} />
                        {tuition.student.email}
                      </a>
                      <a
                        href={`tel:${tuition.student.phone}`}
                        className="btn btn-outline btn-sm justify-start"
                      >
                        <Phone size={16} />
                        {tuition.student.phone}
                      </a>
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
                    <span className="font-bold">{tuition.applicationsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Status</span>
                    <span className={`badge ${
                      tuition.status === 'active' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {tuition.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Posted</span>
                    <span className="font-semibold">{tuition.postedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (for Students) */}
            {userRole === 'student' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Actions</h2>
                  <div className="space-y-2">
                    <button className="btn btn-primary w-full">Edit Post</button>
                    <button className="btn btn-error btn-outline w-full">Close Post</button>
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

