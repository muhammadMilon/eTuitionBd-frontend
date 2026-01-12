import { ArrowRight, ChevronLeft, ChevronRight, Clock, GraduationCap, Heart, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Tuitions = () => {
  const { currentUser } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const [queryParams, setQueryParams] = useState({
    search: '',
    subject: '',
    class: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
  });

  useEffect(() => {
    fetchTuitions();
    if (currentUser) {
      fetchUserBookmarks();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [queryParams.page, queryParams.sortBy, queryParams.sortOrder, queryParams.subject, queryParams.class, currentUser]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (queryParams.search) params.append('search', queryParams.search);
      if (queryParams.subject) params.append('subject', queryParams.subject);
      if (queryParams.class) params.append('class', queryParams.class);
      if (queryParams.location) params.append('location', queryParams.location);
      params.append('sortBy', queryParams.sortBy);
      params.append('sortOrder', queryParams.sortOrder);
      params.append('page', queryParams.page);
      params.append('limit', pagination.limit);
      params.append('status', 'approved');

      const { data } = await api.get(`/api/tuitions?${params.toString()}`);
      setTuitions(data.tuitions || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching tuitions:', error);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data?.user) {
        setBookmarkedIds(data.user.bookmarkedTuitions || []);
      }
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
    }
  };

  const handleToggleBookmark = async (e, tuitionId) => {
    e.preventDefault(); // Prevent navigating to details if button is clicked
    if (!currentUser) {
      toast.error('Please login to bookmark tuitions');
      return;
    }

    try {
      const { data } = await api.post('/api/users/bookmarks/toggle', {
        targetId: tuitionId,
        targetType: 'tuition'
      });

      if (data.isBookmarked) {
        setBookmarkedIds(prev => [...prev, tuitionId]);
        toast.success('Tuition bookmarked');
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== tuitionId));
        toast.success('Bookmark removed');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryParams(prev => ({ ...prev, page: 1 }));
    fetchTuitions();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setQueryParams(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-base-100 font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Available Tuitions
          </h1>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
            Find the perfect teaching opportunity. Filter by subject, class, or location to get started.
          </p>
        </div>

        {/* Search & Advanced Filters */}
        <div className="card bg-base-200 shadow-2xl mb-12 border border-base-300">
          <div className="card-body p-6 md:p-8">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={24} />
                <input
                  type="text"
                  placeholder="Search by subject, title or location..."
                  className="input input-bordered w-full pl-14 h-16 bg-base-100 focus:border-primary transition-all text-lg shadow-inner"
                  value={queryParams.search}
                  onChange={(e) => setQueryParams({ ...queryParams, search: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary h-16 px-12 rounded-2xl text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Search Now
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="form-control">
                <label className="label pt-0 pb-1">
                  <span className="label-text flex items-center gap-2 opacity-60 uppercase text-[10px] tracking-widest font-bold">
                    <SlidersHorizontal size={12} /> Subject
                  </span>
                </label>
                <select
                  className="select select-bordered select-md bg-base-100 h-12"
                  value={queryParams.subject}
                  onChange={(e) => setQueryParams({ ...queryParams, subject: e.target.value, page: 1 })}
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label pt-0 pb-1">
                  <span className="label-text opacity-60 uppercase text-[10px] tracking-widest font-bold">Class Level</span>
                </label>
                <select
                  className="select select-bordered select-md bg-base-100 h-12"
                  value={queryParams.class}
                  onChange={(e) => setQueryParams({ ...queryParams, class: e.target.value, page: 1 })}
                >
                  <option value="">All Classes</option>
                  <option value="Primary">Primary (1-5)</option>
                  <option value="Secondary">Secondary (6-10)</option>
                  <option value="HSC">HSC (11-12)</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label pt-0 pb-1">
                  <span className="label-text opacity-60 uppercase text-[10px] tracking-widest font-bold">Sort Results</span>
                </label>
                <select
                  className="select select-bordered select-md bg-base-100 h-12"
                  value={queryParams.sortBy}
                  onChange={(e) => setQueryParams({ ...queryParams, sortBy: e.target.value, page: 1 })}
                >
                  <option value="createdAt">Date Posted</option>
                  <option value="budget">Salary (Budget)</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label pt-0 pb-1">
                  <span className="label-text opacity-60 uppercase text-[10px] tracking-widest font-bold">Sort Order</span>
                </label>
                <select
                  className="select select-bordered select-md bg-base-100 h-12"
                  value={queryParams.sortOrder}
                  onChange={(e) => setQueryParams({ ...queryParams, sortOrder: e.target.value, page: 1 })}
                >
                  <option value="desc">Newest/Highest First</option>
                  <option value="asc">Oldest/Lowest First</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label pt-0 pb-1">
                  <span className="label-text opacity-60 uppercase text-[10px] tracking-widest font-bold">Location</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong"
                  className="input input-bordered input-md bg-base-100 h-12"
                  value={queryParams.location}
                  onChange={(e) => setQueryParams({ ...queryParams, location: e.target.value, page: 1 })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card bg-base-200 h-[360px] animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <>
            {tuitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tuitions.map((tuition) => (
                  <div key={tuition._id} className="card bg-base-200 border border-base-300 hover:border-primary transition-all duration-500 group shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden translate-y-0 hover:-translate-y-2 flex flex-col h-full">
                    <figure className="h-48 relative overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/800x600/?education,${tuition.subject}`} 
                        alt={tuition.subject}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div className="badge badge-primary border-none text-white font-bold backdrop-blur-md bg-primary/80">{tuition.subject}</div>
                         {currentUser && (
                            <button 
                              onClick={(e) => handleToggleBookmark(e, tuition._id)}
                              className="btn btn-circle btn-xs bg-base-100/20 border-none hover:bg-white text-white hover:text-error backdrop-blur-md"
                            >
                              <Heart 
                                size={14} 
                                className={`${bookmarkedIds.includes(tuition._id) ? 'fill-error text-error' : ''} transition-colors`} 
                              />
                            </button>
                          )}
                      </div>
                    </figure>
                    <div className="card-body p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs opacity-50 font-medium mb-2">
                        <Clock size={12} />
                        {getTimeAgo(tuition.createdAt)}
                      </div>
                      
                      <h2 className="card-title text-lg font-bold mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2 min-h-[3rem]">
                        {tuition.title || `${tuition.subject} for Class ${tuition.class}`}
                      </h2>

                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="text-primary opacity-70"><GraduationCap size={16} /></div>
                          <span className="font-medium opacity-80">Class: {tuition.class}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="text-primary opacity-70"><MapPin size={16} /></div>
                          <span className="font-medium opacity-80 truncate">{tuition.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-base-content/10 mt-auto">
                        <div>
                          <p className="text-[10px] uppercase font-bold opacity-40 leading-none mb-1">Budget</p>
                          <span className="text-xl font-black text-primary">৳{tuition.budget}</span>
                        </div>
                        <Link to={`/tuitions/${tuition._id}`} className="btn btn-circle btn-sm btn-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-base-200 rounded-[40px] border-2 border-dashed border-base-300">
                <Search className="mx-auto text-base-content/10 mb-8" size={120} />
                <h3 className="text-3xl font-black mb-3">No Results Found</h3>
                <p className="text-base-content/60 max-w-sm mx-auto">We couldn't find any tuition posts matching those exact filters. Try broadening your criteria!</p>
                <button 
                  onClick={() => setQueryParams({ search: '', subject: '', class: '', location: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1 })}
                  className="btn btn-primary btn-lg mt-10 rounded-full px-12 shadow-xl shadow-primary/30"
                >
                  Reset Everything
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-20">
                <div className="join bg-base-300 p-1.5 rounded-3xl shadow-xl border border-base-300">
                  <button 
                    className="join-item btn btn-ghost rounded-2xl w-14 h-14"
                    disabled={queryParams.page === 1}
                    onClick={() => handlePageChange(queryParams.page - 1)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      className={`join-item btn rounded-2xl w-14 h-14 font-black transition-all ${queryParams.page === i + 1 ? 'btn-primary shadow-lg shadow-primary/20 scale-105' : 'btn-ghost'}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    className="join-item btn btn-ghost rounded-2xl w-14 h-14"
                    disabled={queryParams.page === pagination.pages}
                    onClick={() => handlePageChange(queryParams.page + 1)}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tuitions;

