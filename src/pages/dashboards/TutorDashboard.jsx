import { BookOpen, Clock, DollarSign, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

const TutorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTuitions: 0,
    totalStudents: 0,
    monthlyEarnings: 0,
    pendingApplications: 0,
  });
  const [pendingApplications, setPendingApplications] = useState([]);
  const [ongoingTuitions, setOngoingTuitions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch applications
      const appsRes = await api.get('/api/applications/tutor/my-applications');
      const allApplications = appsRes.data.applications || [];
      const pending = allApplications.filter(app => app.status === 'pending');
      setPendingApplications(pending.slice(0, 3));

      // Fetch ongoing tuitions (approved applications)
      const ongoingRes = await api.get('/api/applications/tutor/ongoing-tuitions');
      const ongoing = ongoingRes.data.tuitions || [];
      setOngoingTuitions(ongoing.slice(0, 3));

      // Fetch revenue
      const revenueRes = await api.get('/api/payments/tutor/revenue');
      const payments = revenueRes.data.payments || [];
      
      // Calculate monthly earnings (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = payments
        .filter(p => {
          const paymentDate = new Date(p.transactionDate || p.createdAt);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      // Get unique students from ongoing tuitions
      const uniqueStudents = new Set(ongoing.map(t => t.tuitionId?.studentId?._id?.toString()).filter(Boolean));

      setStats({
        activeTuitions: ongoing.length,
        totalStudents: uniqueStudents.size,
        monthlyEarnings,
        pendingApplications: pending.length,
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
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/20',
    },
    {
      title: 'Monthly Earnings',
      value: `৳${stats.monthlyEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications.toString(),
      icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info/20',
    },
  ];

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="text-primary" size={40} />
            Tutor Dashboard
          </h1>
          <p className="text-base-content/70">Manage your tutoring activities</p>
        </div>
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
                  <p className="text-xs text-success mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Applications & Ongoing Tuitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Applications */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Clock className="text-warning" size={20} />
              Pending Applications
            </h2>
            <div className="space-y-4">
              {pendingApplications.length === 0 ? (
                <p className="text-base-content/70 text-center py-4">No pending applications</p>
              ) : (
                pendingApplications.map((app) => (
                  <div key={app._id} className="flex items-start justify-between gap-3 pb-4 border-b border-base-300 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {app.tuitionId?.title || `${app.tuitionId?.subject} - Class ${app.tuitionId?.class}`}
                      </p>
                      <p className="text-sm text-base-content/70">
                        Student: {app.tuitionId?.studentId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-primary font-semibold mt-1">
                        Budget: ৳{app.tuitionId?.budget || 'N/A'}/month
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {app.createdAt ? getTimeAgo(app.createdAt) : 'Recently'}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/applications"
                      className="btn btn-ghost btn-xs"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="card-actions mt-4">
              <Link to="/dashboard/applications" className="btn btn-primary btn-sm w-full">
                View All Applications
              </Link>
            </div>
          </div>
        </div>

        {/* Ongoing Tuitions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              Ongoing Tuitions
            </h2>
            <div className="space-y-4">
              {ongoingTuitions.length === 0 ? (
                <p className="text-base-content/70 text-center py-4">No ongoing tuitions</p>
              ) : (
                ongoingTuitions.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold">
                        {item.tuitionId?.title || `${item.tuitionId?.subject} - Class ${item.tuitionId?.class}`}
                      </p>
                      <p className="text-sm text-base-content/70">
                        Student: {item.tuitionId?.studentId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-primary">
                        Schedule: {item.tuitionId?.schedule || 'N/A'}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/ongoing-tuitions"
                      className="btn btn-ghost btn-xs"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="card-actions mt-4">
              <Link to="/dashboard/ongoing-tuitions" className="btn btn-primary btn-sm w-full">
                View All Tuitions
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
            <Link to="/tuitions" className="btn btn-primary btn-outline justify-start">
              <BookOpen size={20} />
              Browse Tuitions
            </Link>
            <Link to="/dashboard/ongoing-tuitions" className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              My Students
            </Link>
            <Link to="/dashboard/payments" className="btn btn-primary btn-outline justify-start">
              <DollarSign size={20} />
              View Earnings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

