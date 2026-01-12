import { Bell, BookOpen, Calendar, Heart, Home, Info, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Moon, Sun, User, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Check if user is authenticated (either Firebase user or has token)
  const isAuthenticated = currentUser || (typeof window !== 'undefined' && localStorage.getItem('etuitionbd_token'));

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      const unread = data.notifications?.filter(n => !n.isRead).length || 0;
      setUnreadNotifications(unread);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tuitions', label: 'Tuitions', icon: BookOpen },
    { path: '/tutors', label: 'Tutors', icon: Users },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="navbar bg-base-200 shadow-lg sticky top-0 z-50 border-b border-base-300">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link 
            to="/" 
            className="btn btn-ghost normal-case text-xl font-bold text-primary"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src="/logo.jpg" alt="eTuitionBd Logo" className="h-12 w-12 rounded-full object-cover mr-2" />
            eTuitionBd
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-none hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex items-center gap-2 hover:bg-base-300 rounded-lg"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle - Desktop */}
        <div className="hidden lg:flex items-center ml-2">
          <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Auth Navigation - Desktop */}
        <div className="flex-none hidden lg:flex items-center gap-2 ml-4">
          {loading ? null : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard/notifications" className="btn btn-ghost btn-circle relative">
                <Bell size={24} />
                {unreadNotifications > 0 && (
                  <span className="badge badge-primary badge-sm absolute top-0 right-0">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>
              <div className="dropdown dropdown-end" ref={dropdownRef}>
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                {currentUser?.photoURL || currentUser?.photoUrl ? (
                  <div className="w-10 rounded-full">
                    <img 
                      src={currentUser.photoURL || currentUser.photoUrl} 
                      alt={currentUser.displayName || currentUser.name || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    {(currentUser?.displayName || currentUser?.name) ? (
                      (currentUser.displayName || currentUser.name).charAt(0).toUpperCase()
                    ) : (
                      currentUser?.email?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                )}
              </label>
              {dropdownOpen && (
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-200 rounded-box w-52 border border-base-300"
                >
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={18} />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/bookmarks"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Heart size={18} />
                      Bookmarks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/messages"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <MessageSquare size={18} />
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/schedule"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Calendar size={18} />
                      My Schedule
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-error"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex-none lg:hidden flex items-center gap-2">
           <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden w-full border-t border-base-300">
          <ul className="menu p-4 bg-base-200">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </li>
            ))}
            {loading ? null : isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/notifications"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bell size={18} />
                    Notifications
                    {unreadNotifications > 0 && (
                      <span className="badge badge-primary badge-sm ml-auto">{unreadNotifications}</span>
                    )}
                  </Link>
                </li>
                <li>
                    <Link
                      to="/dashboard/messages"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <MessageSquare size={18} />
                      Messages
                    </Link>
                  </li>
                <li>
                    <Link
                      to="/dashboard/schedule"
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar size={18} />
                      My Schedule
                    </Link>
                  </li>
                <li>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/bookmarks"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart size={18} />
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

