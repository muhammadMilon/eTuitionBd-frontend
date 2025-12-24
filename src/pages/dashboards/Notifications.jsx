import { Bell, CheckCircle, Clock, CreditCard, FileText, Info, Mail, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import LoadingOverlay from '../../components/LoadingOverlay';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/notifications');
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application': return <FileText className="text-blue-500" />;
      case 'payment': return <CreditCard className="text-green-500" />;
      case 'review': return <Star className="text-yellow-500" />;
      case 'message': return <Mail className="text-purple-500" />;
      case 'tuition_status': return <Info className="text-info" />;
      default: return <Bell className="text-primary" />;
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            Notifications
          </h1>
          <p className="text-base-content/60 mt-2">Stay updated with your latest activity.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="btn btn-ghost btn-sm text-primary gap-2"
          >
            <CheckCircle size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`card bg-base-100 shadow-md border-l-4 transition-all hover:translate-x-1 ${
                notification.isRead ? 'border-l-transparent opacity-80' : 'border-l-primary bg-primary/5'
              }`}
            >
              <div className="card-body p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl bg-base-200`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold ${notification.isRead ? '' : 'text-primary'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification._id)}
                          className="btn btn-ghost btn-circle btn-xs tooltip tooltip-left"
                          data-tip="Mark as read"
                        >
                          <CheckCircle size={14} className="opacity-40" />
                        </button>
                      )}
                    </div>
                    <p className="text-base-content/70 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs opacity-50">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
            <Bell size={64} className="mx-auto opacity-10 mb-4" />
            <p className="text-xl font-bold opacity-30">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
