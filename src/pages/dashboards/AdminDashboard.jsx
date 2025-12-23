import { AlertCircle, BookOpen, DollarSign, PieChart as PieChartIcon, Shield, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell, Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import api from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    activeTuitions: 0,
    totalRevenue: 0,
  });
  const [pendingTuitions, setPendingTuitions] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tuitionsRes, analyticsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/tuitions?status=pending&limit=5'),
        api.get('/api/admin/analytics/revenue')
      ]);

      setStats({
        totalUsers: statsRes.data.totalUsers || 0,
        totalStudents: statsRes.data.totalStudents || 0,
        totalTutors: statsRes.data.totalTutors || 0,
        pendingTuitions: statsRes.data.pendingTuitions || 0,
        activeTuitions: statsRes.data.activeTuitions || 0,
        totalRevenue: statsRes.data.totalRevenue || 0,
      });

      setPendingTuitions(tuitionsRes.data.tuitions || []);
      
      // Format revenue data for charts
      const rawMonthly = analyticsRes.data.monthlyRevenue || [];
      const formattedRevenue = rawMonthly.reverse().map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue
      }));
      setRevenueData(formattedRevenue);

      // User distribution for Pie Chart
      setUserDistribution([
        { name: 'Students', value: statsRes.data.totalStudents || 0 },
        { name: 'Tutors', value: statsRes.data.totalTutors || 0 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981']; // Primary and Success colors

  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingTuitions.toString(),
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Active Tuitions',
      value: stats.activeTuitions.toString(),
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/20',
    },
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-info',
      bgColor: 'bg-info/20',
    },
  ];

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="text-primary" size={40} />
            Admin Overview
          </h1>
          <p className="text-base-content/70">Performance and platform statistics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={32} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="card-title mb-6 flex items-center gap-2 text-primary">
            <TrendingUp size={20} />
            Revenue Growth
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="card-title mb-6 flex items-center gap-2 text-primary">
            <PieChartIcon size={20} />
            User Distribution
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tuitions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title flex items-center gap-2">
                <AlertCircle className="text-warning" size={24} />
                Pending Approvals
              </h2>
              <Link to="/dashboard/tuition-management" className="btn btn-primary btn-sm rounded-full">
                Review All
              </Link>
            </div>
            <div className="space-y-4">
              {pendingTuitions.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">All caught up! No pending tuitions.</div>
              ) : (
                pendingTuitions.map((tuition) => (
                  <div key={tuition._id} className="flex items-center gap-4 p-4 bg-base-100 rounded-xl hover:bg-base-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {tuition.title || `${tuition.subject} - Class ${tuition.class}`}
                      </p>
                      <p className="text-xs text-base-content/60">
                         {tuition.studentId?.name || 'Anonymous Student'}
                      </p>
                    </div>
                    <span className="text-xs opacity-50 whitespace-nowrap">
                      {tuition.createdAt ? getTimeAgo(tuition.createdAt) : 'New'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6">Platform Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/dashboard/users" className="btn btn-outline btn-lg flex-col h-auto py-6 gap-2 hover:bg-primary/10">
                <Users size={32} className="text-primary" />
                <span className="text-sm">Manage Users</span>
              </Link>
              <Link to="/dashboard/tuition-management" className="btn btn-outline btn-lg flex-col h-auto py-6 gap-2 hover:bg-success/10">
                <BookOpen size={32} className="text-success" />
                <span className="text-sm">Review Tuitions</span>
              </Link>
              <Link to="/dashboard/payments" className="btn btn-outline btn-lg flex-col h-auto py-6 gap-2 hover:bg-info/10">
                <DollarSign size={32} className="text-info" />
                <span className="text-sm">Financial Reports</span>
              </Link>
              <div className="btn btn-outline btn-lg flex-col h-auto py-6 gap-2 opacity-50 cursor-not-allowed">
                <Shield size={32} className="text-warning" />
                <span className="text-sm">System Logs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


