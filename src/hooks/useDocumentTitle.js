import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = () => {
      const path = location.pathname;
      const routeTitles = {
        '/': 'Home',
        '/tuitions': 'Tuitions',
        '/tutors': 'Tutors',
        '/about': 'About',
        '/contact': 'Contact',
        '/login': 'Login',
        '/register': 'Register',
        '/dashboard': 'Dashboard',
      };

      // Check for dynamic routes
      if (path.startsWith('/tuitions/')) return 'Tuition Details';
      if (path.startsWith('/tutors/')) return 'Tutor Profile';
      if (path.startsWith('/dashboard/')) {
        const dashboardRoutes = {
          '/dashboard/tuitions': 'My Tuitions',
          '/dashboard/tutors': 'Tutors',
          '/dashboard/payments': 'Payment History',
          '/dashboard/profile': 'Profile Settings',
          '/dashboard/users': 'Manage Users',
          '/dashboard/settings': 'Settings',
          '/dashboard/students': 'My Students',
          '/dashboard/earnings': 'Earnings',
          '/dashboard/applications': 'Applications',
        };
        return dashboardRoutes[path] || 'Dashboard';
      }

      return routeTitles[path] || 'eTuitionBd';
    };

    const pageTitle = getPageTitle();
    document.title = pageTitle === 'Home' || pageTitle === 'eTuitionBd' 
      ? 'eTuitionBd - Tuition Management System' 
      : `${pageTitle} - eTuitionBd`;
  }, [location.pathname]);
};

export default useDocumentTitle;

