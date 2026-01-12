import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, CreditCard, DollarSign, Info, Mail, ShieldCheck, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useTheme } from '../../hooks/useTheme';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey || 'pk_test_placeholder');

const CheckoutForm = ({ application, applicationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await api.post('/api/payments/create-payment-intent', {
          applicationId: applicationId,
        });
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
        toast.error(errorMessage);
        if (errorMessage.includes('Stripe is not configured')) {
          toast.error('Payment system is not configured. Please contact administrator.');
        }
      }
    };

    if (applicationId) {
      createPaymentIntent();
    }
  }, [applicationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: application.tutorId?.name || 'Tutor',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await api.post('/api/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          applicationId: applicationId,
        });
        toast.success('Payment successful! Application approved.');
        setSuccess(true);
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b',
        fontFamily: '"Outfit", sans-serif',
        '::placeholder': {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-success/20 text-success flex items-center justify-center shadow-2xl shadow-success/20"
        >
          <CheckCircle size={56} />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-base-content dark:text-white italic uppercase tracking-tighter">Payment Success!</h3>
          <p className="text-base-content/60 dark:text-slate-400 max-w-xs mx-auto">
            The tutor has been successfully hired. Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-warning/10 border border-warning/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Info size={120} />
          </div>
          <div className="relative flex items-start gap-4">
            <div className="p-2 rounded-xl bg-warning/20 text-warning mt-1">
              <Info size={20} />
            </div>
            <div className="space-y-3">
              <p className="font-black text-warning uppercase tracking-widest text-[10px]">Developer Test Mode</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase opacity-50 block text-base-content dark:text-base-content">Test Card</span>
                  <span className="font-mono bg-warning/20 px-2 py-0.5 rounded text-xs text-base-content/80">4242 4242 4242 4242</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase opacity-50 block text-base-content dark:text-base-content">Details</span>
                  <span className="font-mono bg-warning/20 px-2 py-0.5 rounded text-xs italic text-base-content/80">12/30 • 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-widest opacity-50 text-base-content dark:text-base-content">Secure Card Entry</span>
            <div className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 opacity-30 grayscale" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3 opacity-30 grayscale" alt="Mastercard" />
            </div>
          </label>
          <div className="p-5 rounded-2xl bg-base-200 dark:bg-white/5 border border-base-300 dark:border-white/10 focus-within:ring-4 ring-primary/20 transition-all shadow-inner">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full rounded-2xl shadow-2xl shadow-primary/30 h-16 text-lg font-black tracking-tight text-white"
        disabled={!stripe || loading || !clientSecret}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            Pay ৳{application.expectedSalary?.toLocaleString()}
          </div>
        )}
      </button>

      <p className="text-[10px] text-center opacity-30 flex items-center justify-center gap-2 text-base-content dark:text-white">
        <CreditCard size={12} />
        PCI COMPLIANT & SECURE 256-BIT ENCRYPTION
      </p>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    if (location.state?.application && location.state?.applicationId) {
      setApplication(location.state.application);
      setApplicationId(location.state.applicationId);
    } else {
      toast.error('No application selected for payment');
      navigate('/dashboard/applications');
    }
  }, [location, navigate]);

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/dashboard/applications');
    }, 3000);
  };

  if (!application || !applicationId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 sm:p-8">
      {/* Navigation & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Link to="/dashboard/applications" className="group flex items-center gap-2 text-base-content/60 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Cancel Transaction
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-base-content dark:text-white leading-none">
            Checkout<span className="text-primary italic">.</span>
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-success/10 border border-success/20 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-success">Secure Gateway Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Payment Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="relative group">
            {/* Artistic decoration */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-white/10 rounded-[2.5rem] shadow-2xl shadow-base-content/5 dark:shadow-black overflow-hidden">
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-base-300 dark:border-white/5">
                  <div className="p-4 rounded-2xl bg-base-200 dark:bg-white/5 text-primary">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-base-content dark:text-white italic tracking-tight">Payment Method</h2>
                    <p className="text-base-content/60 dark:text-slate-400 text-sm">Transferring funds to Secure BD Escrow</p>
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    application={application}
                    applicationId={applicationId}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="bg-base-100/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-base-300 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 space-y-8 shadow-2xl shadow-base-content/5 dark:shadow-black">
            <h2 className="text-xl font-black text-base-content dark:text-white uppercase tracking-widest flex items-center gap-3">
              <Target className="text-primary" size={24} />
              Booking Summary
            </h2>
            
            {/* Tutor Profile Mini Card */}
            <div className="p-6 rounded-3xl bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 flex items-center gap-5 group transition-all hover:bg-base-200 dark:hover:bg-white/[0.08]">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 p-0.5 overflow-hidden">
                  {application.tutorId?.photoUrl ? (
                    <img src={application.tutorId.photoUrl} alt={application.tutorId.name} className="w-full h-full rounded-[14px] object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black text-2xl">
                      {application.tutorId?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-4 border-base-100 dark:border-[#0f172a] flex items-center justify-center">
                  <CheckCircle size={10} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Assigned Tutor</p>
                <div className="font-bold text-base-content dark:text-white text-lg leading-none">{application.tutorId?.name || 'Tutor'}</div>
                <div className="text-base-content/60 dark:text-slate-400 text-xs mt-1 flex items-center gap-1">
                  <Mail size={12} /> {application.tutorId?.email}
                </div>
              </div>
            </div>

            {/* Tuition Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-base-300 dark:border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base-content/50 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <BookOpen size={12} /> Subject
                  </div>
                  <div className="text-base-content dark:text-white font-bold">{application.tuitionId?.subject}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base-content/50 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Target size={12} /> Class
                  </div>
                  <div className="text-base-content dark:text-white font-bold">{application.tuitionId?.class}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="text-base-content/60 dark:text-slate-400 text-sm font-medium transition-colors group-hover:text-base-content/80 dark:group-hover:text-slate-300 italic">Monthly Tuition Salary</span>
                  <span className="text-base-content dark:text-white font-bold">৳{application.expectedSalary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-base-content/60 dark:text-slate-400 text-sm font-medium transition-colors group-hover:text-base-content/80 dark:group-hover:text-slate-300 italic">Service & Gateway Fee</span>
                  <span className="text-base-content/40 dark:text-slate-500 font-bold line-through ml-2 text-xs">৳500</span>
                  <span className="text-success font-black text-[10px] uppercase ml-auto">Free</span>
                </div>
                
                <div className="p-6 rounded-[2rem] bg-primary/10 border-2 border-primary/20 border-dashed mt-8 flex justify-between items-center group transition-all hover:bg-primary/20">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Total Payable</span>
                    <div className="text-3xl font-black text-base-content dark:text-white italic tracking-tighter leading-none">৳{application.expectedSalary?.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                    <DollarSign size={24} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-info/10 text-info flex items-start gap-3">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wide">
                  Your payment is secured by BD Tutors Guild. The tutor will be notified immediately upon transaction completion.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
