import { GraduationCap, BookOpen, DollarSign, Users, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const TutorDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Active Tuitions',
      value: '8',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      change: '+2 this month',
    },
    {
      title: 'Total Students',
      value: '24',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/20',
      change: '+5 new',
    },
    {
      title: 'Monthly Earnings',
      value: '৳45,000',
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
      change: '+15%',
    },
    {
      title: 'Success Rate',
      value: '92%',
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/20',
      change: '+3%',
    },
  ];

  const pendingApplications = [
    { id: 1, title: 'Class 9-10 Mathematics', student: 'Student ABC', budget: '৳5,000', time: '2 hours ago' },
    { id: 2, title: 'Physics Tuition', student: 'Student XYZ', budget: '৳6,000', time: '5 hours ago' },
    { id: 3, title: 'English Language', student: 'Student DEF', budget: '৳4,500', time: '1 day ago' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', student: 'John Doe', time: '4:00 PM - 6:00 PM', date: 'Today' },
    { id: 2, subject: 'Physics', student: 'Jane Smith', time: '5:00 PM - 7:00 PM', date: 'Tomorrow' },
    { id: 3, subject: 'Chemistry', student: 'Mike Johnson', time: '3:00 PM - 5:00 PM', date: 'Dec 17' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Application accepted: Class 9-10 Mathematics', status: 'success', time: '3 hours ago' },
    { id: 2, activity: 'Payment received: ৳5,000 from Student ABC', status: 'success', time: '1 day ago' },
    { id: 3, activity: 'New application: Physics Tuition', status: 'info', time: '2 days ago' },
    { id: 4, activity: 'Class completed: Mathematics with John Doe', status: 'success', time: '3 days ago' },
  ];

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
        {stats.map((stat, index) => (
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

      {/* Pending Applications & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Applications */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Clock className="text-warning" size={20} />
              Pending Applications
            </h2>
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app.id} className="flex items-start justify-between gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{app.title}</p>
                    <p className="text-sm text-base-content/70">Student: {app.student}</p>
                    <p className="text-sm text-primary font-semibold mt-1">Budget: {app.budget}/month</p>
                    <p className="text-xs text-base-content/50 mt-1">{app.time}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="btn btn-success btn-xs">
                      <CheckCircle size={14} />
                      Accept
                    </button>
                    <button className="btn btn-error btn-xs">Decline</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm w-full">View All Applications</button>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Upcoming Classes
            </h2>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-lg font-bold">{classItem.date === 'Today' ? 'TODAY' : classItem.date === 'Tomorrow' ? 'TOM' : classItem.date}</span>
                    {classItem.date !== 'Today' && classItem.date !== 'Tomorrow' && (
                      <span className="text-xs text-base-content/50">DEC</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{classItem.subject}</p>
                    <p className="text-sm text-base-content/70">Student: {classItem.student}</p>
                    <p className="text-sm text-primary">{classItem.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm w-full">View Full Schedule</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-success' : 'bg-info'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-base-content/50 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary btn-outline justify-start">
              <BookOpen size={20} />
              Browse Tuitions
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              My Students
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <DollarSign size={20} />
              View Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

