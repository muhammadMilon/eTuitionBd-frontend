import { BookOpen, DollarSign, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, Shield, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useDocumentTitle();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Role-based navigation links
  const getDashboardLinks = () => {
    const baseLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (userRole === 'admin') {
      return [
        ...baseLinks,
        { path: '/dashboard/users', label: 'User Management', icon: Users },
        { path: '/dashboard/tuition-management', label: 'Tuition Management', icon: BookOpen },
        { path: '/dashboard/payments', label: 'Payment History', icon: DollarSign },
        { path: '/dashboard/profile', label: 'Profile', icon: User },
      ];
    } else if (userRole === 'tutor') {
      return [
        ...baseLinks,
        { path: '/dashboard/my-applications', label: 'My Applications', icon: BookOpen },
        { path: '/dashboard/ongoing-tuitions', label: 'Ongoing Tuitions', icon: BookOpen },
        { path: '/dashboard/payments', label: 'Revenue History', icon: DollarSign },
        { path: '/dashboard/profile', label: 'Profile', icon: User },
      ];
    } else {
      // Student
      return [
        ...baseLinks,
        { path: '/dashboard/tuitions', label: 'My Tuitions', icon: BookOpen },
        { path: '/dashboard/tutors', label: 'Find Tutors', icon: Users },
        { path: '/dashboard/applications', label: 'Applications', icon: BookOpen },
        { path: '/dashboard/payments', label: 'Payment History', icon: DollarSign },
        { path: '/dashboard/profile', label: 'Profile', icon: User },
      ];
    }
  };

  const dashboardLinks = getDashboardLinks();

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Toggle - Adjusted position */}
        <button
          className="lg:hidden fixed top-[4.5rem] left-4 z-40 btn btn-square btn-ghost bg-base-100 shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-base-200 border-r border-base-300 transition-transform duration-300 lg:h-auto h-[calc(100vh-64px)] lg:mt-0 mt-16`}
        >
          <div className="h-full flex flex-col p-4 overflow-y-auto">
            <div className="mb-6 mt-2">
            <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
            {userRole && (
              <span className="badge badge-sm badge-primary mt-2 capitalize">
                {userRole}
              </span>
            )}
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {dashboardLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-base-300 pt-4">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-base-300">
              {currentUser?.photoURL ? (
                <div className="w-10 h-10 rounded-full">
                  <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  {currentUser?.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-base-content/70 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-error/20 text-error transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

