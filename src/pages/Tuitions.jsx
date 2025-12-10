import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, DollarSign, Clock, Search, Filter, Eye } from 'lucide-react';

const Tuitions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const tuitions = [
    {
      id: 1,
      title: 'Class 9-10 Mathematics Tuition',
      subject: 'Mathematics',
      class: '9-10',
      location: 'Dhanmondi, Dhaka',
      budget: '5000-7000',
      schedule: 'Saturday & Sunday, 4 PM - 6 PM',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Physics Tutor Needed',
      subject: 'Physics',
      class: '11-12',
      location: 'Gulshan, Dhaka',
      budget: '8000-10000',
      schedule: 'Monday, Wednesday, Friday, 5 PM - 7 PM',
      postedDate: '5 days ago',
    },
    {
      id: 3,
      title: 'English Language Tuition',
      subject: 'English',
      class: '6-8',
      location: 'Uttara, Dhaka',
      budget: '4000-6000',
      schedule: 'Thursday & Saturday, 3 PM - 5 PM',
      postedDate: '1 week ago',
    },
  ];

  const filteredTuitions = tuitions.filter((tuition) =>
    tuition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tuition.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tuition.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="text-primary" size={40} />
            Available Tuitions
          </h1>
          <p className="text-base-content/70 text-lg">
            Browse and apply to tuition posts from students across the platform
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-base-200 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              <input
                type="text"
                placeholder="Search by subject, class, or location..."
                className="input input-bordered w-full pl-10 bg-base-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        {/* Tuitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTuitions.map((tuition) => (
            <div key={tuition.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title text-primary">{tuition.title}</h2>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen size={16} className="text-base-content/50" />
                    <span className="font-semibold">Class:</span>
                    <span>{tuition.class}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-base-content/50" />
                    <span>{tuition.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-base-content/50" />
                    <span className="font-semibold">Budget:</span>
                    <span>৳{tuition.budget}/month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-base-content/50" />
                    <span>{tuition.schedule}</span>
                  </div>
                </div>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-xs text-base-content/50">{tuition.postedDate}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/tuitions/${tuition.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                    <Link
                      to={`/tuitions/${tuition.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTuitions.length === 0 && (
          <div className="text-center py-12">
            <img 
              src="/App-Error.png" 
              alt="No tuitions found" 
              className="w-full max-w-md mx-auto mb-6"
            />
            <p className="text-lg text-base-content/70">No tuitions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tuitions;

