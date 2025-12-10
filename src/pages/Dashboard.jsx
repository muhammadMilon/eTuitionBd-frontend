import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, DollarSign, TrendingUp, User, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Active Tuitions',
      value: '12',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Total Applications',
      value: '45',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/20',
    },
    {
      title: 'Total Earnings',
      value: '৳25,000',
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Success Rate',
      value: '85%',
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/20',
    },
  ];

  const recentActivities = [
    { id: 1, activity: 'New application received for Mathematics tuition', time: '2 hours ago' },
    { id: 2, activity: 'Payment received from Student ABC', time: '5 hours ago' },
    { id: 3, activity: 'Tuition post approved by admin', time: '1 day ago' },
    { id: 4, activity: 'Profile updated successfully', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {currentUser?.displayName || 'User'}!
        </h1>
        <p className="text-base-content/70">Here's what's happening with your account today.</p>
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
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary btn-outline justify-start">
              <BookOpen size={20} />
              Post New Tuition
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              Browse Applications
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <User size={20} />
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-base-content/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Upcoming Schedule
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-base-300">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">15</span>
                  <span className="text-xs text-base-content/50">DEC</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Mathematics Class</p>
                  <p className="text-sm text-base-content/70">4:00 PM - 6:00 PM</p>
                  <p className="text-xs text-base-content/50 mt-1">Student: John Doe</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-base-300">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">16</span>
                  <span className="text-xs text-base-content/50">DEC</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Physics Class</p>
                  <p className="text-sm text-base-content/70">5:00 PM - 7:00 PM</p>
                  <p className="text-xs text-base-content/50 mt-1">Student: Jane Smith</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

