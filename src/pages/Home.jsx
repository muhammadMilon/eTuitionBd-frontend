import { Link } from 'react-router-dom';
import { BookOpen, Users, Shield, Clock, MapPin, DollarSign, GraduationCap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-base-200 to-base-300">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="mb-5 text-5xl font-bold">
              Find Your Perfect Tutor
              <span className="text-primary block mt-2">Connect & Learn</span>
            </h1>
            <p className="mb-8 text-lg text-base-content/80">
              eTuitionBd is your trusted platform for connecting students with qualified tutors.
              Post your tuition requirements, browse verified tutors, and manage everything in one place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/tuitions" className="btn btn-primary btn-lg">
                Browse Tuitions
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose eTuitionBd?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Shield className="text-primary mb-4" size={48} />
                <h3 className="card-title">Verified Tutors</h3>
                <p className="text-base-content/70">
                  All tutors are verified by our admin team to ensure quality and reliability.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Clock className="text-primary mb-4" size={48} />
                <h3 className="card-title">Easy Management</h3>
                <p className="text-base-content/70">
                  Track your classes, payments, and communications all in one dashboard.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <DollarSign className="text-primary mb-4" size={48} />
                <h3 className="card-title">Transparent Pricing</h3>
                <p className="text-base-content/70">
                  Clear pricing with transparent payment tracking for all transactions.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <MapPin className="text-primary mb-4" size={48} />
                <h3 className="card-title">Location-Based</h3>
                <p className="text-base-content/70">
                  Find tutors near you with our location-based search feature.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <GraduationCap className="text-primary mb-4" size={48} />
                <h3 className="card-title">All Subjects</h3>
                <p className="text-base-content/70">
                  Covering all subjects and classes from primary to higher education.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Users className="text-primary mb-4" size={48} />
                <h3 className="card-title">Community Support</h3>
                <p className="text-base-content/70">
                  Join a community of students and tutors working together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-base-200">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Requirement</h3>
              <p className="text-base-content/70">
                Create an account and post your tuition requirements with details about class, subject, location, and budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Tutors Apply</h3>
              <p className="text-base-content/70">
                Qualified tutors will browse and apply to your tuition post with their profiles and experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Started</h3>
              <p className="text-base-content/70">
                Review applications, communicate with tutors, and start your learning journey with the selected tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-base-content/70 mb-8">
            Join thousands of students and tutors already using eTuitionBd
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

