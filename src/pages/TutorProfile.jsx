import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  MapPin,
  Star,
  Clock,
  DollarSign,
  ArrowLeft,
  Mail,
  Phone,
  Award,
  Users,
  CheckCircle,
  Calendar,
  MessageSquare,
  BookOpen,
  TrendingUp,
  FileText,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate fetching tutor details by ID
    const mockTutor = {
      id: parseInt(id),
      name: 'Dr. Ahmed Hasan',
      subject: 'Mathematics',
      subjects: ['Mathematics', 'Statistics', 'Calculus'],
      education: 'PhD in Mathematics',
      university: 'University of Dhaka',
      experience: '10 years',
      location: 'Dhanmondi, Dhaka',
      rating: 4.8,
      totalReviews: 127,
      students: 150,
      verified: true,
      bio: 'Experienced mathematics tutor with a PhD degree and over 10 years of teaching experience. Specialized in helping students excel in algebra, geometry, trigonometry, and calculus. Patient, understanding, and dedicated to student success.',
      teachingMethod: 'I believe in a student-centered approach, focusing on understanding concepts rather than rote memorization. I use practical examples and real-world applications to make mathematics engaging and comprehensible.',
      hourlyRate: '৳500-700',
      availability: 'Monday to Friday: 4 PM - 8 PM, Saturday & Sunday: 10 AM - 6 PM',
      contact: {
        email: 'ahmed.hasan@example.com',
        phone: '+880 1712 345678',
      },
      achievements: [
        'Award for Excellence in Teaching - 2020',
        'Published 5 research papers in Mathematics',
        '100% student satisfaction rate',
      ],
      specialties: [
        'Algebra',
        'Geometry',
        'Trigonometry',
        'Calculus',
        'Statistics',
        'Mathematics Olympiad Preparation',
      ],
      languages: ['Bengali', 'English'],
      joinedDate: '2014-01-15',
    };

    const mockReviews = [
      {
        id: 1,
        studentName: 'Student A',
        rating: 5,
        comment: 'Excellent teacher! Helped me improve my grades significantly. Very patient and explains concepts clearly.',
        date: '2024-12-10',
        subject: 'Class 9 Mathematics',
      },
      {
        id: 2,
        studentName: 'Student B',
        rating: 5,
        comment: 'Best math tutor I\'ve ever had. Makes difficult concepts easy to understand.',
        date: '2024-12-05',
        subject: 'Class 10 Mathematics',
      },
      {
        id: 3,
        studentName: 'Student C',
        rating: 4,
        comment: 'Great teaching style and very knowledgeable. Highly recommended!',
        date: '2024-11-28',
        subject: 'SSC Preparation',
      },
      {
        id: 4,
        studentName: 'Student D',
        rating: 5,
        comment: 'My child\'s grades improved from C to A+ after joining his classes. Thank you!',
        date: '2024-11-20',
        subject: 'Class 8 Mathematics',
      },
    ];

    setTutor(mockTutor);
    setReviews(mockReviews);
  }, [id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(rating) ? 'fill-warning text-warning' : 'text-base-content/30'}
      />
    ));
  };

  if (!tutor) {
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
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold">
                    {tutor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{tutor.name}</h1>
                      {tutor.verified && (
                        <span className="badge badge-success badge-lg">
                          <Shield size={14} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-primary mb-2">{tutor.subject} Tutor</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(tutor.rating)}
                        <span className="ml-2 font-semibold">{tutor.rating}</span>
                        <span className="text-base-content/50">({tutor.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-base-content/50" />
                        <span>{tutor.students} Students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-base-content/50" />
                        <span>{tutor.experience} Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-base-content/50" />
                        <span>{tutor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  About
                </h2>
                <p className="text-base-content/80 leading-relaxed mb-4">{tutor.bio}</p>
                <div>
                  <h3 className="font-semibold mb-2">Teaching Method</h3>
                  <p className="text-base-content/80 leading-relaxed">{tutor.teachingMethod}</p>
                </div>
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <GraduationCap className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">{tutor.education}</p>
                      <p className="text-sm text-base-content/70">{tutor.university}</p>
                    </div>
                  </div>
                  <div className="divider my-2"></div>
                  <div>
                    <h3 className="font-semibold mb-2">Achievements</h3>
                    <ul className="space-y-2">
                      {tutor.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="text-success mt-1" size={16} />
                          <span className="text-base-content/80">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties & Subjects */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <BookOpen size={20} />
                  Specialties & Subjects
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Subjects Taught</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject, index) => (
                        <span key={index} className="badge badge-primary badge-lg">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Specialized Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.specialties.map((specialty, index) => (
                        <span key={index} className="badge badge-outline badge-lg">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.languages.map((lang, index) => (
                        <span key={index} className="badge badge-ghost badge-lg">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title flex items-center gap-2">
                    <MessageSquare size={20} />
                    Reviews ({reviews.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg bg-base-300 border border-base-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{review.studentName}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-base-content/70">{review.subject}</p>
                        </div>
                        <span className="text-xs text-base-content/50">{review.date}</span>
                      </div>
                      <p className="text-base-content/80">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto mb-2 text-base-content/30" size={48} />
                      <p className="text-base-content/70">No reviews yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Contact</h2>
                <div className="space-y-3">
                  <a
                    href={`mailto:${tutor.contact.email}`}
                    className="btn btn-outline w-full justify-start"
                  >
                    <Mail size={18} />
                    {tutor.contact.email}
                  </a>
                  <a
                    href={`tel:${tutor.contact.phone}`}
                    className="btn btn-outline w-full justify-start"
                  >
                    <Phone size={18} />
                    {tutor.contact.phone}
                  </a>
                  {userRole === 'student' && (
                    <button className="btn btn-primary w-full">
                      <MessageSquare size={18} />
                      Send Message
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Pricing</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Hourly Rate</span>
                    <span className="text-2xl font-bold text-primary">{tutor.hourlyRate}</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Availability
                    </h3>
                    <p className="text-sm text-base-content/80">{tutor.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Total Students</span>
                    <span className="font-bold">{tutor.students}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Total Reviews</span>
                    <span className="font-bold">{tutor.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Rating</span>
                    <div className="flex items-center gap-1">
                      {renderStars(tutor.rating)}
                      <span className="font-bold ml-1">{tutor.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Experience</span>
                    <span className="font-bold">{tutor.experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Member Since</span>
                    <span className="font-semibold">{tutor.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {userRole === 'student' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Actions</h2>
                  <div className="space-y-2">
                    <button className="btn btn-primary w-full">
                      <MessageSquare size={18} />
                      Contact Tutor
                    </button>
                    <Link
                      to="/tuitions"
                      className="btn btn-outline w-full"
                    >
                      <BookOpen size={18} />
                      View Tuitions
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Quick Info</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    <span>Verified Tutor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    <span>Background Checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    <span>Response Rate: 98%</span>
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

