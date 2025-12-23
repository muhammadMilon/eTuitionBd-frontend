import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, GraduationCap, MapPin, Search } from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/users/tutors');
      setTutors(data.tutors || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast.error('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) =>
    !searchTerm ||
    tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.qualifications?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.experience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Users className="text-primary" size={40} />
            Verified Tutors
          </h1>
          <p className="text-base-content/70 text-lg">
            Browse our verified and experienced tutors
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 bg-base-200 p-6 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
            <input
              type="text"
              placeholder="Search by name, subject, or location..."
              className="input input-bordered w-full pl-10 bg-base-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Tutors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <div key={tutor._id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold overflow-hidden">
                          {tutor.photoUrl ? (
                            <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-full object-cover" />
                          ) : (
                            tutor.name?.charAt(0)?.toUpperCase() || 'T'
                          )}
                        </div>
                        <div>
                          <h2 className="card-title text-lg">{tutor.name || 'Tutor'}</h2>
                          {tutor.isVerified && (
                            <span className="badge badge-success badge-sm">Verified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tutor.qualifications && (
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap size={16} className="text-base-content/50" />
                          <span>{tutor.qualifications}</span>
                        </div>
                      )}
                      {tutor.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">Experience:</span>
                          <span>{tutor.experience}</span>
                        </div>
                      )}
                      {tutor.bio && (
                        <p className="text-sm text-base-content/70 line-clamp-2">{tutor.bio}</p>
                      )}
                    </div>

                    <div className="card-actions mt-4">
                      <Link
                        to={`/tutors/${tutor._id}`}
                        className="btn btn-primary btn-sm w-full"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTutors.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto mb-4 text-base-content/30" size={64} />
                <p className="text-lg text-base-content/70">No tutors found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tutors;

