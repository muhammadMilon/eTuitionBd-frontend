import { User, BookOpen, Users, DollarSign, Clock, Calendar, Plus, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTuitions: 0,
    totalApplications: 0,
    totalSpent: 0,
    pendingApplications: 0,
  });
  const [myTuitions, setMyTuitions] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tuitions
      const tuitionsRes = await api.get('/api/tuitions/student/my-tuitions');
      const tuitions = tuitionsRes.data.tuitions || [];
      setMyTuitions(tuitions.slice(0, 3)); // Show only 3 recent

      // Fetch payments
      const paymentsRes = await api.get('/api/payments/history');
      const payments = paymentsRes.data.payments || [];
      setRecentPayments(payments.slice(0, 3));

      // Calculate stats
      const activeTuitions = tuitions.filter(t => t.status === 'approved' || t.status === 'active').length;
      
      // Fetch all applications for student's tuitions
      let totalApplications = 0;
      let pendingApplications = 0;
      
      for (const tuition of tuitions) {
        try {
          const appsRes = await api.get(`/api/applications/tuition/${tuition._id}`);
          const applications = appsRes.data.applications || [];
          totalApplications += applications.length;
          pendingApplications += applications.filter(app => app.status === 'pending').length;
        } catch (err) {
          console.error(`Error fetching applications for tuition ${tuition._id}:`, err);
        }
      }

      const totalSpent = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        activeTuitions,
        totalApplications,
        totalSpent,
        pendingApplications,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Active Tuitions',
      value: stats.activeTuitions.toString(),
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications.toString(),
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/20',
    },
    {
      title: 'Total Spent',
      value: `৳${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications.toString(),
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="text-primary" size={40} />
            Student Dashboard
          </h1>
          <p className="text-base-content/70">Manage your tuition posts and classes</p>
        </div>
        <Link to="/dashboard/post-tuition" className="btn btn-primary">
          <Plus size={20} />
          Post New Tuition
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Tuitions & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tuitions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              My Tuitions
            </h2>
            <div className="space-y-4">
              {myTuitions.length === 0 ? (
                <p className="text-base-content/70 text-center py-4">No tuitions posted yet</p>
              ) : (
                myTuitions.map((tuition) => (
                  <div key={tuition._id} className="flex items-start justify-between gap-3 pb-4 border-b border-base-300 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{tuition.subject}</p>
                        <span className={`badge badge-sm ${
                          tuition.status === 'active' || tuition.status === 'approved' 
                            ? 'badge-success' 
                            : tuition.status === 'pending' 
                            ? 'badge-warning' 
                            : 'badge-error'
                        }`}>
                          {tuition.status}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/70">Class: {tuition.class}</p>
                      {tuition.approvedTutorId && (
                        <p className="text-sm text-base-content/70">
                          Tutor: {tuition.approvedTutorId.name || 'N/A'}
                        </p>
                      )}
                      <p className="text-sm text-primary font-semibold mt-1">Budget: {tuition.budget}/month</p>
                    </div>
                    <Link to={`/dashboard/tuitions/${tuition._id}`} className="btn btn-ghost btn-xs">
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="card-actions mt-4">
              <Link to="/dashboard/tuitions" className="btn btn-primary btn-sm w-full">
                View All Tuitions
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <DollarSign className="text-primary" size={20} />
              Recent Payments
            </h2>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <p className="text-base-content/70 text-center py-4">No payments yet</p>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment._id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-lg font-bold text-primary">
                        ৳{payment.amount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {new Date(payment.transactionDate || payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {payment.tutorId?.name || 'Tutor'}
                      </p>
                      <p className="text-sm text-base-content/70">
                        {payment.tuitionId?.subject || 'Tuition'}
                      </p>
                      <span className={`badge badge-xs mt-1 ${
                        payment.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="card-actions mt-4">
              <Link to="/dashboard/payments" className="btn btn-primary btn-sm w-full">
                View Payment History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/post-tuition" className="btn btn-primary btn-outline justify-start">
              <Plus size={20} />
              Post New Tuition
            </Link>
            <Link to="/tutors" className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              Find Tutors
            </Link>
            <Link to="/dashboard/applications" className="btn btn-primary btn-outline justify-start">
              <CheckCircle size={20} />
              View Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

