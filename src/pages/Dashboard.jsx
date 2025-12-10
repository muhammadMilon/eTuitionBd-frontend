import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import TutorDashboard from './dashboards/TutorDashboard';
import StudentDashboard from './dashboards/StudentDashboard';

const Dashboard = () => {
  const { userRole, currentUser } = useAuth();

  // Render dashboard based on user role
  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'tutor') {
    return <TutorDashboard />;
  } else {
    // Default to student dashboard
    return <StudentDashboard />;
  }
};

export default Dashboard;

