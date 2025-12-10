import { User, BookOpen, Users, DollarSign, Clock, Calendar, Plus, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Active Tuitions',
      value: '3',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Applications Sent',
      value: '12',
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/20',
    },
    {
      title: 'Total Spent',
      value: '৳15,000',
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Pending Approvals',
      value: '5',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
  ];

  const myTuitions = [
    { id: 1, subject: 'Mathematics', class: '9-10', tutor: 'Dr. Ahmed Hasan', status: 'active', budget: '৳5,000' },
    { id: 2, subject: 'Physics', class: '11-12', tutor: 'Fatima Rahman', status: 'pending', budget: '৳6,000' },
    { id: 3, subject: 'English', class: '6-8', tutor: 'Karim Uddin', status: 'active', budget: '৳4,500' },
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', tutor: 'Dr. Ahmed Hasan', time: '4:00 PM - 6:00 PM', date: 'Today' },
    { id: 2, subject: 'English', tutor: 'Karim Uddin', time: '3:00 PM - 5:00 PM', date: 'Tomorrow' },
    { id: 3, subject: 'Physics', tutor: 'Fatima Rahman', time: '5:00 PM - 7:00 PM', date: 'Dec 17' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Tuition post created: Mathematics Class 9-10', status: 'info', time: '2 hours ago' },
    { id: 2, activity: 'Application accepted by Dr. Ahmed Hasan', status: 'success', time: '1 day ago' },
    { id: 3, activity: 'Payment made: ৳5,000 for Mathematics tuition', status: 'success', time: '2 days ago' },
    { id: 4, activity: 'New tutor applied: Physics Tuition', status: 'info', time: '3 days ago' },
  ];

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
        <button className="btn btn-primary">
          <Plus size={20} />
          Post New Tuition
        </button>
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

      {/* My Tuitions & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tuitions */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              My Tuitions
            </h2>
            <div className="space-y-4">
              {myTuitions.map((tuition) => (
                <div key={tuition.id} className="flex items-start justify-between gap-3 pb-4 border-b border-base-300 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{tuition.subject}</p>
                      <span className={`badge badge-sm ${
                        tuition.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {tuition.status}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/70">Class: {tuition.class}</p>
                    <p className="text-sm text-base-content/70">Tutor: {tuition.tutor}</p>
                    <p className="text-sm text-primary font-semibold mt-1">Budget: {tuition.budget}/month</p>
                  </div>
                  <button className="btn btn-ghost btn-xs">View</button>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-primary btn-sm w-full">View All Tuitions</button>
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
                    <span className="text-lg font-bold">
                      {classItem.date === 'Today' ? 'TODAY' : classItem.date === 'Tomorrow' ? 'TOM' : classItem.date}
                    </span>
                    {classItem.date !== 'Today' && classItem.date !== 'Tomorrow' && (
                      <span className="text-xs text-base-content/50">DEC</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{classItem.subject}</p>
                    <p className="text-sm text-base-content/70">Tutor: {classItem.tutor}</p>
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
              <Plus size={20} />
              Post New Tuition
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <Users size={20} />
              Find Tutors
            </button>
            <button className="btn btn-primary btn-outline justify-start">
              <CheckCircle size={20} />
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

