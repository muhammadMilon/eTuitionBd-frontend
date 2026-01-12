
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, DollarSign, GraduationCap, MapPin, Shield, Star, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import api from '../api/axiosInstance';
import SectionHeader from '../components/SectionHeader';
import TeamSection from '../components/TeamSection';

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

  const renderingContent = latestTuitions.length > 0 ? (
    latestTuitions.map((job) => (
      <motion.div key={job._id} variants={itemVariants} className="card bg-base-200 hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/50 group">
        <div className="card-body">
          <div className="flex justify-between items-start mb-2">
            <div className="badge badge-primary badge-outline">{job.subject}</div>
            <span className="font-mono text-xs opacity-50">{new Date(job.createdAt).toLocaleDateString()}</span>
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
            <Link to={'/tuition/' + job._id} className="btn btn-sm btn-ghost group-hover:btn-primary">View Details</Link>
          </div>
        </div>
      </motion.div>
    ))
  ) : (
    <div className="col-span-full text-center py-10 opacity-50">No tuitions found.</div>
  );

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
              <div className="min-h-[60vh] lg:min-h-[85vh] w-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-12 xl:py-20 2xl:py-24">
                  <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16 xl:gap-24">
                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 sm:space-y-5 md:space-y-6"
                      >
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase">
                          Premium Tutor Network
                        </span>
                        
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black leading-[1.1] text-base-content tracking-tight">
                          {slide.title.split(' ').map((word, i) => (
                            <span key={i} className={i >= slide.title.split(' ').length - 2 ? "text-primary" : ""}>
                              {word}{' '}
                            </span>
                          ))}
                        </h1>
                        
                        <p className="text-sm sm:text-sm md:text-base text-base-content/70 max-w-xl lg:max-w-md xl:max-w-xl mx-auto lg:mx-0 leading-relaxed">
                          {slide.description}
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
                          <Link to={slide.ctaLink} className="btn btn-primary btn-sm md:btn-md px-5 sm:px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs sm:text-sm">
                            {slide.ctaText} <ArrowRight className="ml-1.5" size={16} />
                          </Link>
                          <a href={slide.secondaryLink} className="btn btn-ghost btn-sm md:btn-md px-5 sm:px-6 rounded-xl border border-base-content/10 hover:bg-base-content/5 text-xs sm:text-sm">
                            {slide.secondaryText}
                          </a>
                        </div>

                        {/* Stats Info */}
                        <div className="flex items-center justify-center lg:justify-start gap-5 sm:gap-8 pt-6 sm:pt-8 border-t border-base-content/10 w-fit mx-auto lg:mx-0">
                          <div className="space-y-0.5">
                            <div className="text-xl sm:text-2xl font-black text-primary">500+</div>
                            <div className="text-[8px] sm:text-[9px] font-bold opacity-50 uppercase tracking-widest">Expert Tutors</div>
                          </div>
                          <div className="w-px h-6 sm:h-8 bg-base-content/10"></div>
                          <div className="space-y-0.5">
                            <div className="text-xl sm:text-2xl font-black text-primary">1200+</div>
                            <div className="text-[8px] sm:text-[9px] font-bold opacity-50 uppercase tracking-widest">Happy Students</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Image Section - Reduced size */}
                    <div className="w-full sm:w-3/4 md:w-3/5 lg:w-2/5 order-1 lg:order-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative mx-auto lg:ml-auto max-w-[250px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px]"
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
                          className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-base-100/90 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/10 hidden sm:block"
                        >
                          <div className="text-center">
                            <div className="bg-success/20 p-1 sm:p-1.5 rounded-lg mb-1 inline-block">
                              <CheckCircle className="text-success" size={16} />
                            </div>
                            <div className="text-[8px] sm:text-[10px] font-black tracking-tighter">VERIFIED<br/>TUTORS</div>
                          </div>
                        </motion.div>

                        <motion.div
                          animate={{ y: [0, 12, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-primary p-2.5 sm:p-3 px-3 sm:px-5 rounded-xl sm:rounded-2xl shadow-xl text-white hidden sm:flex items-center gap-2"
                        >
                          <div className="bg-white/20 p-1 rounded-md">
                            <Shield size={14} />
                          </div>
                          <div className="text-left font-black tracking-tight leading-none text-[9px] sm:text-xs uppercase">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
            {renderingContent}
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
                     <Link to={'/tutors/' + tutor._id} className="btn btn-primary btn-sm btn-block mt-4">View Profile</Link>
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
      <section id="how-it-works" className="py-24 px-4 bg-base-200 text-base-content dark:bg-slate-950 dark:text-white relative overflow-hidden scroll-mt-20">
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

      {/* Statistics Section - NEW: Section 7 */}
      <section className="py-20 px-4 bg-primary text-primary-content">
        <div className="container mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
               { label: 'Active Tutors', value: '2,500+' },
               { label: 'Satisfied Students', value: '15,000+' },
               { label: 'Subjects Covered', value: '45+' },
               { label: 'Districts Reached', value: '64' }
             ].map((stat, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, scale: 0.5 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
               >
                 <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                 <div className="text-sm md:text-base opacity-80 uppercase tracking-widest font-bold">{stat.label}</div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Testimonials Section - NEW: Section 8 */}
      <section className="py-24 px-4 bg-base-200">
        <div className="container mx-auto">
          <SectionHeader 
            title="What People Say" 
            subtitle="Don't just take our word for it. Here's what our community has to say."
          />
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="pb-16"
          >
            {[
              { 
                name: 'Sarah Ahmed', 
                role: 'Guardian', 
                text: 'Found an amazing math tutor for my son within 2 days. The verification process gives me peace of mind.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
              },
              { 
                name: 'Rahim Uddin', 
                role: 'University Student', 
                text: 'eTuitionBd helped me find tuition jobs near my campus. It covers my semester fees easily!',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
              },
              { 
                name: 'Nazia Hassan', 
                role: 'A-Level Student', 
                text: 'The physics tutor I found here is excellent. My grades have improved significantly.',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
              },
              { 
                name: 'Dr. Kamal Hossain', 
                role: 'Professor', 
                text: 'A well-organized platform for educators to connect with eager learners. Highly recommended.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
              }
            ].map((review, idx) => (
               <SwiperSlide key={idx}>
                 <div className="card bg-base-100 shadow-xl border border-base-content/5 h-full">
                   <div className="card-body">
                     <div className="flex gap-1 text-warning mb-4">
                       {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)} 
                     </div>
                     <p className="mb-6 italic opacity-80">"{review.text}"</p>
                     <div className="flex items-center gap-4 mt-auto">
                       <div className="avatar">
                         <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                           <img src={review.image} alt={review.name} />
                         </div>
                       </div>
                       <div>
                         <h4 className="font-bold">{review.name}</h4>
                         <span className="text-xs opacity-60 uppercase tracking-wider">{review.role}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Team Section - NEW: Section 9 */}
      <TeamSection />

      {/* FAQ Section - NEW: Section 9 */}
      <section className="py-24 px-4 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <SectionHeader title="Frequently Asked Questions" />
          <div className="join join-vertical w-full">
            {[
              { q: 'Is it free to create a student profile?', a: 'Yes, creating a student profile and posting tuition requirements is completely free.' },
              { q: 'How do you verify tutors?', a: 'We verify national ID, educational certificates, and conduct phone interviews for premium tutors.' },
              { q: 'Can I teach multiple subjects?', a: 'Absolutely! You can list all the subjects you are qualified to teach in your profile.' },
              { q: 'How are payments handled?', a: 'We facilitate the connection. Payments are typically handled directly between guardians and tutors, but we offer a secure payment gateway for premium services.' }
            ].map((faq, idx) => (
              <div key={idx} className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="my-accordion-4" defaultChecked={idx === 0} /> 
                <div className="collapse-title text-xl font-medium">
                  {faq.q}
                </div>
                <div className="collapse-content">
                  <p className="opacity-70">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - NEW: Section 10 */}
      <section className="py-24 px-4 bg-base-300 text-base-content relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="container mx-auto text-center relative z-10">
           <SectionHeader title="Stay Updated" subtitle="Subscribe to our newsletter for the latest tuition jobs and educational tips." />
           <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
             <input type="email" placeholder="Enter your email address" className="input input-lg input-bordered w-full rounded-full focus:outline-none focus:border-primary" />
             <button className="btn btn-primary btn-lg rounded-full px-8">Subscribe</button>
           </div>
           <p className="text-sm opacity-50 mt-4">We respect your privacy. Unsubscribe at any time.</p>
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

