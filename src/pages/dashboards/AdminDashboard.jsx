import { Shield, Users, BookOpen, DollarSign, AlertCircle, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      change: '+12%',
    },
    {
      title: 'Pending Approvals',
      value: '45',
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
      change: '+5',
    },
    {
      title: 'Active Tuitions',
      value: '892',
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/20',
      change: '+23',
    },
    {
      title: 'Total Revenue',
      value: '৳2,45,000',
      icon: DollarSign,
      color: 'text-info',
      bgColor: 'bg-info/20',
      change: '+18%',
    },
  ];

  const pendingActions = [
    { id: 1, type: 'Tutor Verification', name: 'Dr. Ahmed Hasan', subject: 'Mathematics', time: '2 hours ago' },
    { id: 2, type: 'Tuition Post', name: 'Class 9-10 Math', student: 'Student ABC', time: '3 hours ago' },
    { id: 3, type: 'Tutor Verification', name: 'Fatima Rahman', subject: 'Physics', time: '5 hours ago' },
    { id: 4, type: 'Dispute', name: 'Payment Issue', parties: 'Tutor XYZ & Student DEF', time: '1 day ago' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Tutor verified: Dr. Ahmed Hasan', status: 'approved', time: '1 hour ago' },
    { id: 2, activity: 'Tuition post approved: Class 9-10 Math', status: 'approved', time: '2 hours ago' },
    { id: 3, activity: 'New user registered: Student ABC', status: 'info', time: '3 hours ago' },
    { id: 4, activity: 'Dispute resolved: Payment Issue', status: 'resolved', time: '5 hours ago' },
    { id: 5, activity: 'Tutor rejected: Invalid credentials', status: 'rejected', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="text-primary" size={40} />
            Admin Dashboard
          </h1>
          <p className="text-base-content/70">Manage and monitor the platform</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <AlertCircle className="text-warning" size={20} />
              Pending Actions
            </h2>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{action.type}</p>
                    <p className="text-sm text-base-content/70">{action.name}</p>
                    {action.subject && (
                      <p className="text-xs text-base-content/50 mt-1">Subject: {action.subject}</p>
                    )}
                    {action.student && (
                      <p className="text-xs text-base-content/50 mt-1">Student: {action.student}</p>
                    )}
                    {action.parties && (
                      <p className="text-xs text-base-content/50 mt-1">Parties: {action.parties}</p>
                    )}
                    <p className="text-xs text-base-content/50 mt-1">{action.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-xs">
                      <CheckCircle size={14} />
                    </button>
                    <button className="btn btn-error btn-xs">
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm w-full">View All</button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Activity className="text-primary" size={20} />
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'approved' || activity.status === 'resolved' 
                      ? 'bg-success' 
                      : activity.status === 'rejected' 
                      ? 'bg-error' 
                      : 'bg-info'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-base-content/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm w-full">View All Activities</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              Manage Users
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <BookOpen size={20} />
              Review Posts
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <AlertCircle size={20} />
              Handle Disputes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

