import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Check both currentUser and token for authentication
  const token = typeof window !== 'undefined' ? localStorage.getItem('etuitionbd_token') : null;
  const isAuthenticated = currentUser || token;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

