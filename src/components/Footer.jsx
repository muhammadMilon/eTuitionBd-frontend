import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 mb-4 inline-flex">
              <img src="/logo.jpg" alt="eTuitionBd Logo" className="h-12 w-12 rounded-full object-cover" />
              <h3 className="text-xl font-bold text-primary">eTuitionBd</h3>
            </Link>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Your trusted platform for connecting students with qualified tutors.
              We simplify the process of finding and managing tuition, making
              education accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-base-content/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tuitions" className="text-base-content/70 hover:text-primary transition-colors">
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="text-base-content/70 hover:text-primary transition-colors">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-base-content/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base-content/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={18} />
                <span className="text-base-content/70 text-sm">
                  123 Education Street<br />
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary" size={18} />
                <a
                  href="tel:+8801234567890"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  +880 1234 567890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary" size={18} />
                <a
                  href="mailto:info@etuitionbd.com"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  info@etuitionbd.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-base-300 mt-8 pt-8 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} eTuitionBd. Built with passion for education. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

