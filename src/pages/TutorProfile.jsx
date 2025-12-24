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
    Star,
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
  const [reviews, setReviews] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        setLoading(true);
        const [tutorRes, reviewsRes] = await Promise.all([
          api.get(`/api/users/tutors/${id}`),
          api.get(`/api/reviews/tutor/${id}`)
        ]);
        
        setTutor(tutorRes.data.tutor);
        setReviews(reviewsRes.data.reviews || []);
      } catch (error) {
        console.error('Error fetching tutor data:', error);
        toast.error('Failed to load tutor details');
        navigate('/tutors');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTutorData();
    }
  }, [id, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to leave a review');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/api/reviews', {
        tutorId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      setReviews(prev => [data.review, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleMessageTutor = async () => {
    if (!currentUser) {
      toast.error('Please login to message the tutor');
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.post('/api/messages/conversation', {
        participantId: id
      });
      navigate('/dashboard/messages', { state: { activeConversation: data.conversation } });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost gap-2 mb-8 hover:bg-base-200"
        >
          <ArrowLeft size={20} />
          Back to Tutors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-2xl overflow-hidden sticky top-24 border border-base-300">
              <div className="h-32 bg-base-300"></div>
              <div className="card-body -mt-16 items-center text-center">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full border-4 border-base-200 shadow-2xl bg-base-100">
                    {tutor.photoUrl ? (
                      <img src={tutor.photoUrl} alt={tutor.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-base-300 text-base-content">
                        {tutor.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <h1 className="card-title text-2xl mt-4">{tutor.name}</h1>
                <p className="text-base-content/60 flex items-center gap-2">
                  <GraduationCap size={18} />
                  Professional Tutor
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center my-4">
                  {tutor.subjects?.map((subject, idx) => (
                    <span key={idx} className="badge bg-base-300 border-base-300 text-base-content">{subject}</span>
                  ))}
                </div>

                <div className="divider my-2"></div>

                <div className="w-full space-y-3">
                   {userRole === 'student' && (
                     <button 
                       onClick={handleMessageTutor}
                       className="btn bg-base-300 hover:bg-base-100 border-base-300 text-base-content btn-block gap-2"
                     >
                       <MessageSquare size={18} />
                       Message Tutor
                     </button>
                   )}
                   <div className="flex items-center justify-between text-sm p-3 bg-base-100 rounded-xl">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-warning text-warning" />
                        <span className="font-bold">
                          {reviews.length > 0 
                            ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
                            : '5.0'}
                        </span>
                        <span className="text-base-content/50 text-sm">
                          ({reviews.length > 0 ? `${reviews.length} ${reviews.length === 1 ? 'Review' : 'Reviews'}` : 'New'})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm mt-4">
                      {/* Students count placeholder */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg border border-base-300">
                        <Users size={16} className="text-base-content/60" />
                        <span>0 Students</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg border border-base-300">
                        <Award size={16} className="text-base-content/60" />
                        <span>{experience}</span>
                      </div>
                      {tutor.location && (
                         <div className="flex items-center gap-2 px-3 py-2 bg-base-100 rounded-lg border border-base-300">
                           <MapPin size={16} className="text-base-content/60" />
                           <span>{tutor.location}</span>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Main Content Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <FileText size={20} className="text-base-content/60" />
                  About
                </h2>
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">{bio}</p>
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <GraduationCap size={20} className="text-base-content/60" />
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-base-300">
                      <GraduationCap className="text-base-content/60" size={24} />
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
                  <BookOpen size={20} className="text-base-content/60" />
                  Subjects Taught
                </h2>
                <div className="flex flex-wrap gap-2">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <span key={index} className="badge bg-base-300 border-base-300 text-base-content p-4">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-base-content/60 italic">No subjects listed</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                 <div className="flex items-center justify-between mb-4 border-b border-base-300 pb-2">
                   <h2 className="card-title flex items-center gap-2">
                     <MessageSquare size={20} className="text-base-content/60" />
                     Reviews ({reviews.length})
                   </h2>
                 </div>

                 {/* Leave a Review - For Students only */}
                 {userRole === 'student' && (
                   <div className="bg-base-100 p-6 rounded-2xl mb-8 border border-base-300">
                     <h3 className="font-bold mb-4">Leave a Review</h3>
                     <form onSubmit={handleSubmitReview} className="space-y-4">
                       <div className="flex items-center gap-4">
                         <span className="text-sm opacity-60">Rating:</span>
                         <div className="rating rating-md">
                           {[1, 2, 3, 4, 5].map((num) => (
                             <input 
                               key={num}
                               type="radio" 
                               name="rating" 
                               className="mask mask-star-2 bg-warning" 
                               checked={newReview.rating === num}
                               onChange={() => setNewReview({ ...newReview, rating: num })}
                             />
                           ))}
                         </div>
                       </div>
                       <textarea 
                         className="textarea textarea-bordered w-full h-24 bg-base-200" 
                         placeholder="Share your experience with this tutor..."
                         value={newReview.comment}
                         onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                         required
                       ></textarea>
                       <button 
                         type="submit" 
                         className="btn bg-base-300 hover:bg-base-200 border-base-300 text-base-content btn-block"
                         disabled={isSubmitting}
                       >
                         {isSubmitting ? <span className="loading loading-spinner"></span> : 'Submit Review'}
                       </button>
                     </form>
                   </div>
                 )}

                 <div className="space-y-6">
                   {reviews.length > 0 ? (
                     reviews.map((review) => (
                       <div key={review._id} className="border-b border-base-300 last:border-0 pb-6 last:pb-0">
                         <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 rounded-full bg-base-300 text-base-content flex items-center justify-center font-bold overflow-hidden">
                             {review.studentId?.photoUrl ? (
                               <img src={review.studentId.photoUrl} alt={review.studentId.name} className="w-full h-full object-cover" />
                             ) : (
                               review.studentId?.name?.charAt(0) || 'S'
                             )}
                           </div>
                           <div className="flex-1">
                             <p className="font-bold leading-none">{review.studentId?.name || 'Student'}</p>
                             <div className="flex items-center gap-2 mt-1">
                               <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                               <span className="text-xs opacity-40">
                                 {new Date(review.createdAt).toLocaleDateString()}
                               </span>
                             </div>
                           </div>
                         </div>
                         <p className="text-base-content/80 text-sm italic">"{review.comment}"</p>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-10 opacity-60">
                        <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No reviews available yet.</p>
                     </div>
                   )}
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
                     <div className="p-3 bg-base-100 rounded-lg flex items-center gap-3 border border-base-300">
                       <Mail size={18} className="text-base-content/60" />
                       <div className="overflow-hidden">
                         <p className="text-xs text-base-content/60 opacity-60">Email</p>
                         <p className="font-medium truncate">{tutor.email}</p>
                       </div>
                     </div>
                     
                     {tutor.phone && (
                       <div className="p-3 bg-base-100 rounded-lg flex items-center gap-3 border border-base-300">
                         <Phone size={18} className="text-base-content/60" />
                         <div>
                            <p className="text-xs text-base-content/60 opacity-60">Phone</p>
                            <p className="font-medium">{tutor.phone}</p>
                         </div>
                       </div>
                     )}

                     {userRole === 'student' && (
                        <button className="btn bg-base-300 hover:bg-base-100 border-base-300 text-base-content w-full mt-2" onClick={handleMessageTutor}>
                          <MessageSquare size={18} />
                          Send Message
                        </button>
                      )}
                   </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4 text-base-content/70">Please login to view contact details.</p>
                    <Link to="/login" className="btn bg-base-300 hover:bg-base-100 border-base-300 text-base-content btn-block">Login Now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 border-b border-base-300 pb-2">Availability</h2>
                <div className="flex items-start gap-3">
                   <Clock className="text-base-content/60 mt-1" size={20} />
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
