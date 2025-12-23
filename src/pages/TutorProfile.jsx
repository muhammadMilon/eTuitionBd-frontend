import {
    ArrowLeft,
    Award,
    BookOpen,
    Clock,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Shield,
    Star,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews are not yet implemented in backend, keeping empty for now
  const [reviews, setReviews] = useState([]); 

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const url = `/api/users/tutors/${id}`;
        console.log('Fetching tutor details from:', url);
        const { data } = await api.get(url);
        setTutor(data.tutor);
      } catch (error) {
        console.error('Error fetching tutor:', error);
        toast.error('Failed to load tutor details');
        navigate('/tutors');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTutor();
    }
  }, [id, navigate]);

  const renderStars = (rating) => {
    // Default to 0 if rating is undefined
    const validRating = rating || 0;
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(validRating) ? 'fill-warning text-warning' : 'text-base-content/30'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Tutor not found</h2>
        <Link to="/tutors" className="btn btn-primary">Back to Tutors</Link>
      </div>
    );
  }

  // Helper to safely access nested properties or arrays
  const subjects = tutor.subjects || [];
  const education = tutor.qualifications || 'Not specified'; 
  const experience = tutor.experience || 'Not specified';
  const bio = tutor.bio || 'No bio available.';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          to="/tutors"
          className="btn btn-ghost mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Tutors
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-base-300 ring-4 ring-primary/20">
                     {tutor.photoUrl ? (
                       <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content text-4xl font-bold">
                         {tutor.name?.charAt(0) || <User />}
                       </div>
                     )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{tutor.name}</h1>
                       <span className="badge badge-success badge-lg gap-1">
                          <Shield size={14} /> Verified
                        </span>
                    </div>
                    
                    {/* Display primary subject if available, or generic */}
                    <p className="text-xl text-primary mb-2 font-medium">
                      {subjects.length > 0 ? `${subjects[0]} Tutor` : 'Tutor'}
                    </p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                      {/* Rating placeholder until implemented */}
                      <div className="flex items-center gap-1 bg-base-100 px-3 py-1 rounded-full">
                        <Star size={16} className="fill-warning text-warning" />
                        <span className="font-bold">5.0</span>
                        <span className="text-base-content/50 text-sm">(New)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm mt-4">
                      {/* Students count placeholder */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg">
                        <Users size={16} className="text-primary" />
                        <span>0 Students</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg">
                        <Award size={16} className="text-primary" />
                        <span>{experience}</span>
                      </div>
                      {tutor.location && (
                         <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg">
                           <MapPin size={16} className="text-primary" />
                           <span>{tutor.location}</span>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <FileText size={20} className="text-primary" />
                  About
                </h2>
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">{bio}</p>
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <GraduationCap size={20} className="text-primary" />
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <GraduationCap className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Qualifications</h3>
                      <p className="text-base-content/70">{education}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <BookOpen size={20} className="text-primary" />
                  Subjects Taught
                </h2>
                <div className="flex flex-wrap gap-2">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <span key={index} className="badge badge-primary badge-lg p-3">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-base-content/60 italic">No subjects listed</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section - Placeholder till backend ready */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                 <div className="flex items-center justify-between mb-4 border-b border-base-300 pb-2">
                   <h2 className="card-title flex items-center gap-2">
                     <MessageSquare size={20} className="text-primary" />
                     Reviews
                   </h2>
                 </div>
                 <div className="text-center py-10 opacity-60">
                    <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No reviews available yet.</p>
                 </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card bg-base-200 shadow-xl sticky top-24">
              <div className="card-body">
                <h2 className="card-title mb-4 border-b border-base-300 pb-2">Contact Info</h2>
                
                {currentUser ? (
                   <div className="space-y-4">
                     <div className="p-3 bg-base-100 rounded-lg flex items-center gap-3">
                       <Mail size={18} className="text-primary" />
                       <div className="overflow-hidden">
                         <p className="text-xs text-base-content/60">Email</p>
                         <p className="font-medium truncate">{tutor.email}</p>
                       </div>
                     </div>
                     
                     {tutor.phone && (
                       <div className="p-3 bg-base-100 rounded-lg flex items-center gap-3">
                         <Phone size={18} className="text-primary" />
                         <div>
                            <p className="text-xs text-base-content/60">Phone</p>
                            <p className="font-medium">{tutor.phone}</p>
                         </div>
                       </div>
                     )}

                     {userRole === 'student' && (
                        <button className="btn btn-primary w-full mt-2" onClick={() => toast.success('Message feature coming soon!')}>
                          <MessageSquare size={18} />
                          Send Message
                        </button>
                      )}
                   </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4 text-base-content/70">Please login to view contact details.</p>
                    <Link to="/login" className="btn btn-primary btn-block">Login Now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 border-b border-base-300 pb-2">Availability</h2>
                <div className="flex items-start gap-3">
                   <Clock className="text-primary mt-1" size={20} />
                   <div>
                     <p className="font-medium">Available for Hiring</p>
                     <p className="text-sm text-base-content/60 mt-1">Contact the tutor to discuss schedule.</p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
