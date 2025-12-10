import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4">
      <div className="card bg-base-200 shadow-2xl w-full max-w-2xl">
        <div className="card-body text-center">
          <img 
            src="/error-404.png" 
            alt="404 Not Found" 
            className="w-full max-w-md mx-auto mb-6"
          />
          <h2 className="card-title text-3xl justify-center mb-4">
            Page Not Found
          </h2>
          <p className="text-base-content/70 mb-6">
            The page you're looking for doesn't exist or has been moved.
            <br />
            Please check the URL or return to the home page.
          </p>
          <div className="card-actions justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              <Home size={20} className="mr-2" />
              Go to Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline"
            >
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

