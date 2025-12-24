import axios from 'axios';

// Base URL from env or fallback to local dev server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://etuitionbd-by-milon.vercel.app/',
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('etuitionbd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't redirect on auth endpoints or /me endpoint (used for token verification)
      const authEndpoints = ['/auth/register', '/auth/login', '/auth/me'];
      const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
      
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Clear invalid token
      localStorage.removeItem('etuitionbd_token');
      
      // Only redirect if we're not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // Show error message
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Session expired. Please login again.');
        }
        // Small delay before redirect to show message
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


