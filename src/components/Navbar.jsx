import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Home, BookOpen, Users, Info, Mail, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
          <Link to="/" className="btn btn-ghost normal-case text-xl font-bold text-primary">
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

        {/* Auth Navigation - Desktop */}
        <div className="flex-none hidden lg:flex items-center gap-2 ml-4">
          {currentUser ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {currentUser.photoURL ? (
                  <div className="w-10 rounded-full">
                    <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    {currentUser.displayName ? (
                      currentUser.displayName.charAt(0).toUpperCase()
                    ) : (
                      currentUser.email?.charAt(0).toUpperCase()
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
        <div className="flex-none lg:hidden">
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
            {currentUser ? (
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
                    to="/dashboard/profile"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    Profile
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

