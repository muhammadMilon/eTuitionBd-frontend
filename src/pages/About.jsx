import { Award, Eye, Target, Users } from 'lucide-react';

import TeamSection from '../components/TeamSection';

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">About eTuitionBd</h1>
          <p className="text-xl text-base-content/70">
            Revolutionizing the way students connect with tutors
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <Target className="text-primary" size={40} />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-base-content/80 leading-relaxed">
                Our mission is to bridge the gap between students seeking quality education and
                qualified tutors, making quality tutoring accessible to everyone. We strive to
                create a transparent, efficient, and user-friendly platform that simplifies the
                entire tuition management process.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <Eye className="text-primary" size={40} />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-base-content/80 leading-relaxed">
                To become the leading tuition management platform in Bangladesh, recognized for
                our commitment to quality, transparency, and innovation in education. We envision
                a future where every student has easy access to quality tutoring and every tutor
                can grow their teaching practice.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Award className="text-primary mb-4" size={32} />
                <h3 className="card-title">Quality First</h3>
                <p className="text-base-content/70">
                  We ensure all tutors are verified and qualified, maintaining the highest
                  standards of education delivery.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Users className="text-primary mb-4" size={32} />
                <h3 className="card-title">User-Centric</h3>
                <p className="text-base-content/70">
                  Our platform is designed with users in mind, focusing on ease of use,
                  transparency, and excellent user experience.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Target className="text-primary mb-4" size={32} />
                <h3 className="card-title">Transparency</h3>
                <p className="text-base-content/70">
                  We believe in transparent pricing, clear communication, and honest
                  relationships between students and tutors.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <Award className="text-primary mb-4" size={32} />
                <h3 className="card-title">Innovation</h3>
                <p className="text-base-content/70">
                  We continuously improve our platform with new features and technologies to
                  better serve our community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-lg text-base-content/80 leading-relaxed">
                <p>
                  eTuitionBd was founded with a simple goal: to solve the real problem of finding
                  qualified tutors and verified tuition opportunities. We recognized that the
                  traditional methods of finding tutors were time-consuming, inefficient, and
                  lacked transparency.
                </p>
                <p>
                  Today, we have built a comprehensive platform that connects students with
                  verified tutors, streamlines the application process, and provides tools for
                  managing tuition activities including financial tracking, payments, and
                  communication.
                </p>
                <p>
                  Our team is dedicated to continuously improving the platform and supporting our
                  community of students, tutors, and administrators.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Team Section */}
      <TeamSection />
    </div>
  );
};

export default About;

