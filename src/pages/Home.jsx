import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Clock, DollarSign, GraduationCap, MapPin, Shield, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import api from '../api/axiosInstance';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

  const heroSlides = [
    {
      title: "Find Your Perfect Tutor Today",
      description: "Connect with qualified tutors for personalized learning experiences. The most trusted platform in Bangladesh.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000&q=80",
      ctaText: "Browse Tuitions",
      ctaLink: "/tuitions",
      secondaryText: "Become a Tutor",
      secondaryLink: "/register"
    },
    {
      title: "Study Smarter, Not Harder",
      description: "Master any subject with our expert tutors. Choose between flexible online or offline sessions.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000&q=80",
      ctaText: "Find Tutors",
      ctaLink: "/tuitions",
      secondaryText: "View Subjects",
      secondaryLink: "/tuitions"
    },
    {
      title: "Expert Learning Community",
      description: "Join thousands of students and share the journey of knowledge with certified educators.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000&q=80",
      ctaText: "Join Now",
      ctaLink: "/register",
      secondaryText: "How it Works",
      secondaryLink: "#how-it-works"
    },
    {
      title: "Share Your Knowledge",
      description: "Help students reach their full potential. Start your teaching journey as a verified tutor today.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000&q=80",
      ctaText: "Get Started",
      ctaLink: "/register",
      secondaryText: "Tutor Benefits",
      secondaryLink: "#why-choose-us"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Swiper */}
      <section className="relative overflow-hidden bg-base-200">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          speed={800}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          className="w-full h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="min-h-[80vh] sm:min-h-[85vh] lg:min-h-[75vh] xl:min-h-[85vh] 2xl:min-h-[80vh] w-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-16 xl:py-24 2xl:py-32">
                  <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-16 xl:gap-24">
                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-5 sm:space-y-6 md:space-y-8"
                      >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                          Premium Tutor Network
                        </span>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.1] text-base-content tracking-tight">
                          {slide.title.split(' ').map((word, i) => (
                            <span key={i} className={i >= slide.title.split(' ').length - 2 ? "text-primary" : ""}>
                              {word}{' '}
                            </span>
                          ))}
                        </h1>
                        
                        <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-xl lg:max-w-md xl:max-w-xl mx-auto lg:mx-0 leading-relaxed">
                          {slide.description}
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
                          <Link to={slide.ctaLink} className="btn btn-primary btn-md md:btn-lg px-6 sm:px-8 xl:px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            {slide.ctaText} <ArrowRight className="ml-2" size={20} />
                          </Link>
                          <a href={slide.secondaryLink} className="btn btn-ghost btn-md md:btn-lg px-6 sm:px-8 xl:px-10 rounded-2xl border-2 border-base-content/10 hover:bg-base-content/5">
                            {slide.secondaryText}
                          </a>
                        </div>

                        {/* Stats Info */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-8 sm:pt-10 border-t border-base-content/10 w-fit mx-auto lg:mx-0">
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className="text-2xl sm:text-3xl font-black text-primary">500+</div>
                            <div className="text-[9px] sm:text-[10px] font-bold opacity-50 uppercase tracking-widest">Expert Tutors</div>
                          </div>
                          <div className="w-px h-8 sm:h-10 bg-base-content/10"></div>
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className="text-2xl sm:text-3xl font-black text-primary">1200+</div>
                            <div className="text-[9px] sm:text-[10px] font-bold opacity-50 uppercase tracking-widest">Happy Students</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Image Section */}
                    <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 order-1 lg:order-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative mx-auto lg:ml-auto max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-none"
                      >
                        {/* Blob Background */}
                        <div className="absolute -inset-4 sm:-inset-6 bg-primary/20 blur-2xl sm:blur-3xl rounded-full opacity-50 animate-pulse"></div>
                        
                        <div className="aspect-square relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-base-300 group">
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-60"></div>
                        </div>
                        
                        {/* Floating elements */}
                        <motion.div
                          animate={{ y: [0, -12, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-base-100/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 hidden sm:block"
                        >
                          <div className="text-center">
                            <div className="bg-success/20 p-1.5 sm:p-2 rounded-xl mb-1 sm:mb-2 inline-block">
                              <CheckCircle className="text-success" size={20} />
                            </div>
                            <div className="text-[9px] sm:text-xs font-black tracking-tighter">VERIFIED<br/>TUTORS</div>
                          </div>
                        </motion.div>

                        <motion.div
                          animate={{ y: [0, 12, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-primary p-3 sm:p-4 px-4 sm:px-6 rounded-2xl sm:rounded-3xl shadow-2xl text-white hidden sm:flex items-center gap-2 sm:gap-3"
                        >
                          <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg">
                            <Shield size={16} />
                          </div>
                          <div className="text-left font-black tracking-tight leading-none text-[10px] sm:text-sm uppercase">
                            Secure<br/>Platform
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Controls */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
            <button className="swiper-button-prev-custom p-3 rounded-full bg-base-100/50 backdrop-blur-md border border-white/10 text-base-content hover:bg-primary hover:text-white transition-all">
              <ArrowRight className="rotate-180" size={20} />
            </button>
            <div className="custom-pagination !static flex gap-2"></div>
            <button className="swiper-button-next-custom p-3 rounded-full bg-base-100/50 backdrop-blur-md border border-white/10 text-base-content hover:bg-primary hover:text-white transition-all">
              <ArrowRight size={20} />
            </button>
          </div>
        </Swiper>

        <style dangerouslySetInnerHTML={{ __html: `
          .custom-pagination .swiper-pagination-bullet {
            width: 12px;
            height: 6px;
            border-radius: 4px;
            background: currentColor;
            opacity: 0.2;
            transition: all 0.3s ease;
            margin: 0 !important;
          }
          .custom-pagination .swiper-pagination-bullet-active {
            width: 30px;
            opacity: 1;
            background: var(--p) !important;
          }
          .hero-swiper .swiper-button-disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        `}} />
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
      <section id="how-it-works" className="py-24 px-4 bg-slate-950 text-white relative overflow-hidden scroll-mt-20">
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
      <section id="why-choose-us" className="py-24 px-4 bg-base-100 scroll-mt-20">
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

