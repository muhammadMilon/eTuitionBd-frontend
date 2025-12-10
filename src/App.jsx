import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import DashboardLayout from './components/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import Tuitions from './pages/Tuitions';
import TuitionDetails from './pages/TuitionDetails';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import PaymentHistory from './pages/PaymentHistory';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <ErrorBoundary>
      <Router>
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
              <Route path="tuitions" element={<div className="card bg-base-200"><div className="card-body"><h2 className="card-title">My Tuitions</h2><p>Tuition management page coming soon...</p></div></div>} />}
              <Route path="tutors" element={<div className="card bg-base-200"><div className="card-body"><h2 className="card-title">Tutors</h2><p>Tutors management page coming soon...</p></div></div>} />}
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="profile" element={<ProfileSettings />} />}
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
