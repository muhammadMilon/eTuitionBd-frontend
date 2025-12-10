import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Users, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const dashboardLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/tuitions', label: 'My Tuitions', icon: BookOpen },
    { path: '/dashboard/tutors', label: 'Tutors', icon: Users },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-square btn-ghost"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-base-200 border-r border-base-300 transition-transform duration-300`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-8 mt-12 lg:mt-4">
            <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
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
              <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email?.charAt(0).toUpperCase()}
              </div>
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
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

