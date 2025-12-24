import { BookOpen, Clock, Eye, GraduationCap, Heart, MapPin, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import LoadingOverlay from '../../components/LoadingOverlay';

const MyBookmarks = () => {
  const [bookmarks, setBookmarks] = useState({ tutors: [], tuitions: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tutors');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/users/bookmarks/all');
      setBookmarks(data || { tutors: [], tuitions: [] });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id, type) => {
    try {
      await api.post('/api/users/bookmarks/toggle', {
        targetId: id,
        targetType: type
      });
      
      if (type === 'tutor') {
        setBookmarks(prev => ({
          ...prev,
          tutors: prev.tutors.filter(t => t._id !== id)
        }));
      } else {
        setBookmarks(prev => ({
          ...prev,
          tuitions: prev.tuitions.filter(t => t._id !== id)
        }));
      }
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Heart className="text-error fill-error" size={32} />
          My Bookmarks
        </h1>
        <p className="text-base-content/60 mt-2">Manage your saved tutors and tuition opportunities.</p>
      </div>

      <div className="tabs tabs-boxed mb-8 bg-base-200 p-2 rounded-2xl w-fit">
        <button 
          className={`tab tab-lg px-8 rounded-xl font-bold transition-all ${activeTab === 'tutors' ? 'tab-active btn-primary shadow-lg text-primary-content' : ''}`}
          onClick={() => setActiveTab('tutors')}
        >
          <Users size={20} className="mr-2" />
          Tutors ({bookmarks.tutors.length})
        </button>
        <button 
          className={`tab tab-lg px-8 rounded-xl font-bold transition-all ${activeTab === 'tuitions' ? 'tab-active btn-primary shadow-lg text-primary-content' : ''}`}
          onClick={() => setActiveTab('tuitions')}
        >
          <BookOpen size={20} className="mr-2" />
          Tuitions ({bookmarks.tuitions.length})
        </button>
      </div>

      {activeTab === 'tutors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.tutors.length > 0 ? (
            bookmarks.tutors.map(tutor => (
              <div key={tutor._id} className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all group overflow-hidden">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-base-200">
                      {tutor.photoUrl ? (
                        <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content text-xl font-bold">
                          {tutor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{tutor.name}</h3>
                      <p className="text-sm opacity-60 truncate">{tutor.email}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveBookmark(tutor._id, 'tutor')}
                      className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <GraduationCap size={16} />
                      <span className="truncate">{tutor.qualifications || 'No qualifications listed'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tutor.subjects?.map((sub, i) => (
                        <span key={i} className="badge badge-sm badge-outline">{sub}</span>
                      ))}
                    </div>
                  </div>

                  <div className="card-actions mt-auto">
                    <Link to={`/tutors/${tutor._id}`} className="btn btn-primary btn-sm btn-block">
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
              <Users size={64} className="mx-auto opacity-20 mb-4" />
              <p className="text-xl font-bold opacity-50">No bookmarked tutors yet</p>
              <Link to="/tutors" className="btn btn-primary mt-4">Find Tutors</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.tuitions.length > 0 ? (
            bookmarks.tuitions.map(tuition => (
              <div key={tuition._id} className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all group overflow-hidden">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <span className="badge badge-primary font-bold">{tuition.subject}</span>
                    <button 
                      onClick={() => handleRemoveBookmark(tuition._id, 'tuition')}
                      className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{tuition.title || `${tuition.subject} Tuition`}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <MapPin size={16} />
                      <span>{tuition.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <Clock size={16} />
                      <span>Class {tuition.class}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-base-200 mt-auto">
                    <span className="text-xl font-black text-primary">৳{tuition.budget}</span>
                    <Link to={`/tuitions/${tuition._id}`} className="btn btn-primary btn-sm btn-circle">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
              <BookOpen size={64} className="mx-auto opacity-20 mb-4" />
              <p className="text-xl font-bold opacity-50">No bookmarked tuitions yet</p>
              <Link to="/tuitions" className="btn btn-primary mt-4">Find Tuitions</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;
