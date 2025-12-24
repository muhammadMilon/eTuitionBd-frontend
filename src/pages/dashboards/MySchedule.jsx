import { Calendar as CalendarIcon, CheckCircle, Clock, MapPin, Video, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useAuth } from '../../context/AuthContext';

const MySchedule = () => {
  const { userRole, currentUser } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/schedules/user/all');
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/schedules/${id}/status`, { status });
      setSchedules(prev => prev.map(s => s._id === id ? { ...s, status } : s));
      toast.success(`Session marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled': return <span className="badge badge-primary">Scheduled</span>;
      case 'completed': return <span className="badge badge-success">Completed</span>;
      case 'cancelled': return <span className="badge badge-error">Cancelled</span>;
      default: return <span className="badge badge-ghost capitalize">{status}</span>;
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="text-primary" size={32} />
            My Schedule
          </h1>
          <p className="text-base-content/60 mt-2">Manage your tuition sessions and timings.</p>
        </div>
        {/* Placeholder for future "Sync to Google Calendar" or "Add Session" */}
        {/* <button className="btn btn-primary gap-2">
          <Plus size={20} />
          New Session
        </button> */}
      </div>

      <div className="grid gap-6">
        {schedules.length > 0 ? (
          schedules.map((session) => (
            <div key={session._id} className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden group hover:border-primary/50 transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Date Side */}
                <div className="bg-base-200 md:w-32 p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase font-bold tracking-widest opacity-40">
                    {new Date(session.startTime).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-4xl font-black text-primary">
                    {new Date(session.startTime).getDate()}
                  </span>
                  <span className="text-xs opacity-60">
                    {new Date(session.startTime).getFullYear()}
                  </span>
                </div>

                {/* Content Side */}
                <div className="card-body p-6 flex-1">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="card-title text-xl">{session.title}</h2>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <Clock size={16} className="text-primary" />
                          <span>
                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' - '}
                            {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          {session.meetingLink ? (
                            <>
                              <Video size={16} className="text-blue-500" />
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="link link-primary">Join Meeting</a>
                            </>
                          ) : (
                            <>
                              <MapPin size={16} className="text-error" />
                              <span>In-person Session</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                           <CalendarIcon size={16} className="text-primary" />
                           <span>{session.tuitionId?.subject} Tuition</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                           <div className="w-5 h-5 rounded-full bg-base-300 overflow-hidden">
                              {userRole === 'tutor' ? (
                                <img src={session.studentId?.photoUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <img src={session.tutorId?.photoUrl} alt="" className="w-full h-full object-cover" />
                              )}
                           </div>
                           <span className="font-medium">
                              {userRole === 'tutor' ? session.studentId?.name : session.tutorId?.name}
                           </span>
                        </div>
                      </div>

                      {session.description && (
                        <p className="mt-4 text-sm bg-base-200 p-3 rounded-xl italic">
                          {session.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {session.status === 'scheduled' && (
                      <div className="flex flex-row md:flex-col gap-2 justify-end">
                        <button 
                          onClick={() => updateStatus(session._id, 'completed')}
                          className="btn btn-success btn-sm gap-2"
                        >
                          <CheckCircle size={16} />
                          Complete
                        </button>
                        <button 
                          onClick={() => updateStatus(session._id, 'cancelled')}
                          className="btn btn-ghost btn-sm text-error gap-2"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-base-200 rounded-[3rem] border-2 border-dashed border-base-300">
            <CalendarIcon size={64} className="mx-auto opacity-10 mb-4" />
            <p className="text-2xl font-bold opacity-30">No sessions scheduled</p>
            <p className="opacity-40 max-w-xs mx-auto mt-2">Upcoming tuition sessions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySchedule;
