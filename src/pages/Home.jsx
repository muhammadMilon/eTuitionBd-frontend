import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Clock, DollarSign, GraduationCap, MapPin, Shield, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const Home = () => {
  const [latestTuitions, setLatestTuitions] = useState([]);
  const [latestTutors, setLatestTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tuitionsRes, tutorsRes] = await Promise.all([
          api.get('/api/tuitions/latest?limit=6'),
          api.get('/api/users/tutors?limit=4')
        ]);
        
        setLatestTuitions(tuitionsRes.data.tuitions || []);
        setLatestTutors(tutorsRes.data.tutors || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center mb-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-base-content/70 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[90vh] bg-base-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="hero-content text-center z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="mb-6 text-5xl md:text-7xl font-bold leading-tight">
                Find Your Perfect <br/>
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Tutor Today
                </span>
              </h1>
              <p className="mb-8 text-xl text-base-content/80 max-w-2xl mx-auto">
                Connect with qualified tutors or find tuition jobs easily. 
                The most trusted platform for education needs in Bangladesh.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link to="/tuitions" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/30 transition-all">
                Browse Tuitions <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg hover:bg-base-content/5">
                Become a Tutor
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-base-content/10"
            >
              {[
                { label: 'Active Tutors', value: '500+' },
                { label: 'Happy Students', value: '1200+' },
                { label: 'Subjects', value: '50+' },
                { label: 'Districts', value: '64' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-sm font-medium opacity-70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Tuitions Section - Dynamic */}
      <section className="py-24 px-4 bg-base-100">
        <div className="container mx-auto">
          <SectionHeader 
            title="Latest Tuition Jobs" 
            subtitle="Explore the most recent tuition opportunities posted by students and parents."
          />
          
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {latestTuitions.length > 0 ? (
                latestTuitions.map((job) => (
                  <motion.div key={job._id} variants={itemVariants} className="card bg-base-200 hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/50 group">
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-2">
                        <div className="badge badge-primary badge-outline">{job.subject}</div>
                        <span className="text-xs font-mono opacity-50">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="card-title group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="space-y-2 mt-4 text-sm opacity-80">
                         <div className="flex items-center gap-2">
                           <GraduationCap size={16} className="text-primary" />
                           <span>Class: {job.class}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <MapPin size={16} className="text-primary" />
                           <span className="truncate">{job.location}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <DollarSign size={16} className="text-primary" />
                           <span>{job.budget} BDT/month</span>
                         </div>
                      </div>
                      <div className="card-actions justify-end mt-4">
                        <Link to={`/tuition/${job._id}`} className="btn btn-sm btn-ghost group-hover:btn-primary">View Details</Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 opacity-50">No tuitions found.</div>
              )}
            </motion.div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/tuitions" className="btn btn-outline px-8">View All Tuitions</Link>
          </div>
        </div>
      </section>

      {/* Latest Tutors Section - Dynamic */}
      <section className="py-24 px-4 bg-base-200">
        <div className="container mx-auto">
          <SectionHeader 
            title="Featured Tutors" 
            subtitle="Connect with our top-rated tutors available for both online and offline sessions."
          />

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
             {latestTutors.length > 0 ? (
               latestTutors.map((tutor) => (
                 <motion.div key={tutor._id} variants={itemVariants} className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                   <figure className="h-48 bg-base-300 relative overflow-hidden">
                     {tutor.photoUrl ? (
                       <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                         <User size={64} />
                       </div>
                     )}
                     <div className="absolute top-2 right-2 badge badge-success gap-1">
                        <CheckCircle size={12} /> Verified
                     </div>
                   </figure>
                   <div className="card-body p-5">
                     <h3 className="font-bold text-lg text-center">{tutor.name}</h3>
                     <p className="text-center text-sm opacity-70 line-clamp-2 min-h-[2.5em]">{tutor.qualifications || 'Experienced Tutor'}</p>
                     <div className="divider my-2"></div>
                     <div className="flex flex-wrap gap-1 justify-center">
                       {(tutor.subjects || []).slice(0, 3).map((sub, i) => (
                         <span key={i} className="badge badge-xs badge-neutral">{sub}</span>
                       ))}
                     </div>
                     <Link to={`/tutors/${tutor._id}`} className="btn btn-primary btn-sm btn-block mt-4">View Profile</Link>
                   </div>
                 </motion.div>
               ))
             ) : (
                <div className="col-span-full text-center py-10 opacity-50">No tutors found.</div>
             )}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg opacity-90">Get started in 3 simple steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                step: '01', 
                title: 'Post Requirement', 
                desc: 'Create an account and post your tuition requirements with details about class, subject, and budget.',
                icon: BookOpen 
              },
              { 
                step: '02', 
                title: 'Tutors Apply', 
                desc: 'Qualified tutors will review your post and apply. You can also browse tutor profiles directly.',
                icon: Users 
              },
              { 
                step: '03', 
                title: 'Start Learning', 
                desc: 'Select the best tutor, discuss details, and start your learning journey immediately.',
                icon: CheckCircle 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="card bg-base-100 text-base-content border-none shadow-2xl"
              >
                <div className="card-body items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-8xl leading-none font-mono">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 rotate-3 hover:rotate-6 transition-transform">
                    <item.icon size={32} />
                  </div>
                  <h3 className="card-title text-xl mb-2">{item.title}</h3>
                  <p className="opacity-70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-4 bg-base-100">
        <div className="container mx-auto">
          <SectionHeader title="Why Choose eTuitionBd?" />
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { title: 'Verified Tutors', icon: Shield, desc: 'Every tutor undergoes a strict verification process for safety.' },
              { title: 'Easy Management', icon: Clock, desc: 'Track classes, attendance, and payments in one dashboard.' },
              { title: 'Transparent Pricing', icon: DollarSign, desc: 'Zero hidden fees. Negotiate directly with tutors.' },
              { title: 'Location Based', icon: MapPin, desc: 'Find tutors in your local area or opt for online sessions.' },
              { title: 'All Subjects', icon: GraduationCap, desc: 'From KG to University level, we cover all academic subjects.' },
              { title: 'Community', icon: Users, desc: 'Join a growing community of learners and educators.' },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="card bg-base-200 hover:bg-base-300 transition-colors border-l-4 border-transparent hover:border-primary">
                <div className="card-body">
                  <feature.icon className="text-primary mb-4" size={40} />
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-base-200">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-lg text-base-content/70 mb-8">
              Join thousands of students and tutors. It takes less than 2 minutes to get started.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg rounded-full px-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

