import { ArrowLeft, Database, Eye, Lock, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-base-100">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="btn btn-ghost mb-8 gap-2 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
            <Lock size={48} className="text-primary" />
            Privacy Policy
          </h1>
          <p className="text-xl opacity-60">Last updated: January 1, 2026</p>
        </div>

        <div className="grid gap-8">
          <section className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <Database size={24} />
                 </div>
                 <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              <p className="opacity-80 mb-4">
                We collect information you fulfill to provide better services to all our users. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-70 ml-2">
                <li>Personal identification (Name, Email, Phone number, etc.)</li>
                <li>Educational background and qualifications for tutors.</li>
                <li>Tuition requirements and preferences for students.</li>
              </ul>
            </div>
          </section>

          <section className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                   <Eye size={24} />
                 </div>
                 <h2 className="text-2xl font-bold">How We Use Information</h2>
              </div>
              <p className="opacity-80">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-70 mt-4 ml-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Match students with suitable tutors.</li>
                <li>Process transactions and send related information.</li>
                <li>Verify the identity of tutors for safety.</li>
              </ul>
            </div>
          </section>

          <section className="card bg-base-200 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                   <Share2 size={24} />
                 </div>
                 <h2 className="text-2xl font-bold">Information Sharing</h2>
              </div>
              <p className="opacity-80">
                We do not share your personal information with companies, organizations, or individuals outside of eTuitionBd except in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 opacity-70 mt-4 ml-2">
                <li>With your consent.</li>
                <li>For legal reasons or to protect our rights.</li>
                <li>With verified tutors/students for the purpose of tuition arrangement (contact details).</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center bg-base-200 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">Rights to Your Data</h3>
          <p className="opacity-70 max-w-2xl mx-auto mb-6">
            You have the right to access, update, or delete your personal information at any time. 
            Contact us if you have any concerns about your data privacy.
          </p>
          <a href="mailto:privacy@etuitionbd.com" className="btn btn-primary px-8 rounded-full">Contact Data Officer</a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
