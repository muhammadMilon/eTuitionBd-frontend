import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import TuitionDetails from './pages/TuitionDetails';
import Tuitions from './pages/Tuitions';
import TutorProfile from './pages/TutorProfile';
import Tutors from './pages/Tutors';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import PaymentHistory from './pages/PaymentHistory';
import ProfileSettings from './pages/ProfileSettings';

// Student Dashboard Pages
import AllTutors from './pages/dashboards/AllTutors';
import AppliedTutors from './pages/dashboards/AppliedTutors';
import Checkout from './pages/dashboards/Checkout';
import EditTuition from './pages/dashboards/EditTuition';
import MyTuitions from './pages/dashboards/MyTuitions';
import PostNewTuition from './pages/dashboards/PostNewTuition';

// Tutor Dashboard Pages
import MyApplications from './pages/dashboards/MyApplications';
import TutorOngoingTuitions from './pages/dashboards/TutorOngoingTuitions';
import RevenueHistory from './pages/dashboards/RevenueHistory';

// Admin Dashboard Pages
import TuitionManagement from './pages/dashboards/TuitionManagement';
import UserManagement from './pages/dashboards/UserManagement';

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f1f5f9',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f1f5f9',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes with Main Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="tuitions" element={<Tuitions />} />
              <Route path="tuitions/:id" element={<TuitionDetails />} />
              <Route path="tutors" element={<Tutors />} />
              <Route path="tutors/:id" element={<TutorProfile />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Private Routes with Dashboard Layout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* Student Routes */}
              <Route path="tuitions" element={<MyTuitions />} />
              <Route path="tuitions/:id" element={<TuitionDetails />} />
              <Route path="tuitions/:id/edit" element={<EditTuition />} />
              <Route path="post-tuition" element={<PostNewTuition />} />
              <Route path="applications" element={<AppliedTutors />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="tutors" element={<AllTutors />} />
              
              {/* Tutor Routes */}
              <Route path="my-applications" element={<MyApplications />} />
              <Route path="ongoing-tuitions" element={<TutorOngoingTuitions />} />
              <Route path="revenue" element={<RevenueHistory />} />
              
              {/* Admin Routes */}
              <Route path="users" element={<UserManagement />} />
              <Route path="tuition-management" element={<TuitionManagement />} />
              
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>

            {/* Catch all - show 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
