import { useState } from 'react';
import { Users, Star, GraduationCap, MapPin, Search } from 'lucide-react';

const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const tutors = [
    {
      id: 1,
      name: 'Dr. Ahmed Hasan',
      subject: 'Mathematics',
      experience: '10 years',
      education: 'PhD in Mathematics',
      location: 'Dhanmondi, Dhaka',
      rating: 4.8,
      students: 150,
      verified: true,
    },
    {
      id: 2,
      name: 'Fatima Rahman',
      subject: 'Physics',
      experience: '7 years',
      education: 'MSc in Physics',
      location: 'Gulshan, Dhaka',
      rating: 4.9,
      students: 120,
      verified: true,
    },
    {
      id: 3,
      name: 'Karim Uddin',
      subject: 'English',
      experience: '5 years',
      education: 'MA in English Literature',
      location: 'Uttara, Dhaka',
      rating: 4.7,
      students: 95,
      verified: true,
    },
  ];

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Users className="text-primary" size={40} />
            Verified Tutors
          </h1>
          <p className="text-base-content/70 text-lg">
            Browse our verified and experienced tutors
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 bg-base-200 p-6 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
            <input
              type="text"
              placeholder="Search by name, subject, or location..."
              className="input input-bordered w-full pl-10 bg-base-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="card-title text-lg">{tutor.name}</h2>
                      {tutor.verified && (
                        <span className="badge badge-success badge-sm">Verified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap size={16} className="text-base-content/50" />
                    <span className="font-semibold">Subject:</span>
                    <span>{tutor.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap size={16} className="text-base-content/50" />
                    <span>{tutor.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-base-content/50" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Experience:</span>
                    <span>{tutor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="text-warning" size={16} />
                    <span className="font-semibold">{tutor.rating}</span>
                    <span className="text-base-content/50">({tutor.students} students)</span>
                  </div>
                </div>

                <div className="card-actions mt-4">
                  <button className="btn btn-primary btn-sm w-full">View Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-base-content/30" size={64} />
            <p className="text-lg text-base-content/70">No tutors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutors;

