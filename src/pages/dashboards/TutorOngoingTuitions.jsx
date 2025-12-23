import { BookOpen, User, MapPin, DollarSign, Clock, Calendar, Mail, Phone, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const TutorOngoingTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOngoingTuitions();
  }, []);

  const fetchOngoingTuitions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/applications/tutor/ongoing-tuitions');
      setTuitions(data.tuitions || []);
    } catch (error) {
      console.error('Error fetching ongoing tuitions:', error);
      toast.error('Failed to load ongoing tuitions');
    } finally {
      setLoading(false);
    }
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
          Ongoing Tuitions
        </h1>
        <p className="text-base-content/70">All tuitions that have been approved by students</p>
      </div>

      {/* Tuitions List */}
      {tuitions.length === 0 ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center py-12">
            <BookOpen className="mx-auto text-base-content/30 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Ongoing Tuitions</h3>
            <p className="text-base-content/70 mb-6">You don't have any approved tuitions yet</p>
            <Link to="/tuitions" className="btn btn-primary">
              Browse Tuitions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tuitions.map((item) => {
            const tuition = item.tuitionId;
            const student = tuition?.studentId;
            
            return (
              <div key={item._id} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="card-title text-2xl">
                          {tuition?.title || `${tuition?.subject} - Class ${tuition?.class}`}
                        </h2>
                        <span className="badge badge-success">Active</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-base-content/70">Subject</p>
                          <p className="font-semibold">{tuition?.subject || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Class</p>
                          <p className="font-semibold">{tuition?.class || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Location</p>
                          <p className="font-semibold">{tuition?.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Budget</p>
                          <p className="font-semibold text-primary">৳{tuition?.budget || 'N/A'}/month</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Schedule</p>
                          <p className="font-semibold">{tuition?.schedule || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Expected Salary</p>
                          <p className="font-semibold text-primary">৳{item.expectedSalary?.toLocaleString() || 'N/A'}/month</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Approved Date</p>
                          <p className="font-semibold">
                            {item.approvedAt ? new Date(item.approvedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {tuition?.description && (
                        <div className="mt-4">
                          <p className="text-sm text-base-content/70 mb-1">Description</p>
                          <p className="text-sm">{tuition.description.substring(0, 200)}...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Information */}
                  {student && (
                    <div className="mt-6 p-4 bg-base-300 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User size={18} />
                        Student Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-base-content/70">Name</p>
                          <p className="font-semibold">{student.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Email</p>
                          <a
                            href={`mailto:${student.email}`}
                            className="font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <Mail size={14} />
                            {student.email || 'N/A'}
                          </a>
                        </div>
                        {student.phone && (
                          <div>
                            <p className="text-sm text-base-content/70">Phone</p>
                            <a
                              href={`tel:${student.phone}`}
                              className="font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              <Phone size={14} />
                              {student.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="card-actions mt-6">
                    <Link
                      to={`/tuitions/${tuition?._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye size={18} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TutorOngoingTuitions;

