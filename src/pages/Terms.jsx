import { AlertCircle, ArrowLeft, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-base-100">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="btn btn-ghost mb-8 gap-2 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
            <FileText size={48} className="text-primary" />
            Terms of Service
          </h1>
          <p className="text-xl opacity-60">Last updated: January 1, 2026</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
              Acceptance of Terms
            </h2>
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <p className="opacity-80 leading-relaxed">
                  By accessing and using eTuitionBd, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              User Accounts
            </h2>
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <ul className="space-y-4 opacity-80">
                  <li className="flex gap-3">
                    <Shield className="flex-shrink-0 text-success mt-1" size={18} />
                    <span>You are responsible for maintaining the confidentiality of your account and password.</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="flex-shrink-0 text-warning mt-1" size={18} />
                    <span>You agree to accept responsibility for all activities that occur under your account.</span>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="flex-shrink-0 text-success mt-1" size={18} />
                    <span>We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
              Tutor & Student Conduct
            </h2>
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-2 text-primary">For Tutors</h3>
                    <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                      <li>Must provide accurate qualifications.</li>
                      <li>Respect student privacy and safety.</li>
                      <li>Deliver agreed-upon tuition hours.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-secondary">For Students/Guardians</h3>
                    <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                      <li>Provide safe environment for offline tuition.</li>
                      <li>Respect tutor's time and schedule.</li>
                      <li>Pay agreed fees on time.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
              Limitation of Liability
            </h2>
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <p className="opacity-80 leading-relaxed">
                  eTuitionBd shall not be held liable for any damages that arise from the use or inability to use the materials on eTuitionBd’s website, even if eTuitionBd or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="opacity-50 text-sm">Have questions about our terms?</p>
          <Link to="/contact" className="link link-primary font-bold">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
