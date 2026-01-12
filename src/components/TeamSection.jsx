import { motion } from 'framer-motion';
import { Facebook, Globe, Linkedin, Star, Twitter } from 'lucide-react';
import SectionHeader from './SectionHeader';

const TeamSection = () => {
  return (
    <section className="py-24 px-4 bg-base-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03]"></div>
      <div className="container mx-auto relative">
        <SectionHeader 
          title="Meet Our Team" 
          subtitle="The passionate minds behind eTuitionBd dedicated to transforming education."
        />
        
        {/* Featured Team Member - CEO */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative max-w-md w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="card bg-base-100 border border-base-content/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-4 right-4 z-10">
                 <div className="badge badge-primary gap-1 p-3 font-bold shadow-lg">
                   <Star size={12} className="fill-current" /> FOUNDER
                 </div>
              </div>
              <figure className="relative h-80 overflow-hidden">
                <img 
                  src="/milon.jpg" 
                  alt="Muhammad Milon" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                />
              </figure>
              <div className="card-body text-center p-8 bg-base-100 relative">
                <h3 className="text-3xl font-black mb-1">Muhammad Milon</h3>
                <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Co-Founder & CEO</p>
                
                <div className="flex justify-center gap-4 mb-6">
                    <a href="#" className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-white transition-all"><Facebook size={18} /></a>
                    <a href="#" className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-white transition-all"><Twitter size={18} /></a>
                    <a href="#" className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-white transition-all"><Linkedin size={18} /></a>
                    <a href="https://himilon.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-white transition-all tooltip" data-tip="Portfolio">
                      <Globe size={18} />
                    </a>
                </div>

                <p className="italic opacity-80 text-lg">"Visionary leader with a passion for ed-tech innovation, dedicated to creating accessible learning opportunities for everyone."</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Other Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { 
              name: 'Sazedul Sobuj', 
              role: 'Marketing Lead', 
              image: '/sobuj.jpg',
              bio: 'Driving growth through strategic marketing and community engagement.'
            },
            { 
              name: 'Muhammad Masud', 
              role: 'Chief Technology Officer', 
              image: '/masud.jpg',
              bio: 'Leading the technological vision and ensuring robust platform performance.'
            },
            { 
              name: 'Md. Mohibullah', 
              role: 'Head of Operations', 
              image: '/mohi.jpg',
              bio: 'Orchestrating seamless operations for optimal user experience.'
            }
          ].map((member, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group w-full max-w-xs mx-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-base-100 relative">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  </div>
                  {/* Social links appearing on hover */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <a href="#" className="p-2 rounded-full bg-base-100 shadow-lg text-primary hover:bg-primary hover:text-white transition-colors"><Facebook size={14} /></a>
                    <a href="#" className="p-2 rounded-full bg-base-100 shadow-lg text-primary hover:bg-primary hover:text-white transition-colors"><Linkedin size={14} /></a>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{member.role}</p>
                  <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
