import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4">
          <div className="card bg-base-200 shadow-2xl w-full max-w-2xl">
            <div className="card-body text-center">
              <img 
                src="/error-404.png" 
                alt="Error 404" 
                className="w-full max-w-md mx-auto mb-6"
              />
              <h2 className="card-title text-3xl justify-center mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-base-content/70 mb-6">
                We encountered an unexpected error. Please try again or go back to the home page.
              </p>
              <div className="card-actions justify-center">
                <Link to="/" className="btn btn-primary">
                  Go to Home
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-outline"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

