import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, BookOpen, CheckCircle, CreditCard, DollarSign, Info, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('⚠️  VITE_STRIPE_PUBLISHABLE_KEY not found in environment variables');
}

const stripePromise = loadStripe(stripePublishableKey || 'pk_test_placeholder');

const CheckoutForm = ({ application, applicationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Create payment intent
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
        
        // If Stripe is not configured, show helpful message
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

    if (!stripe || !elements || !clientSecret) {
      return;
    }

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
        // Confirm payment with backend
        const { data } = await api.post('/api/payments/confirm-payment', {
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
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-success">Payment Successful!</h3>
        <p className="text-base-content/70">
          The tutor has been successfully hired. Redirecting you to your applications...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="alert alert-warning mb-6">
          <Info size={20} />
          <div className="text-sm">
            <p className="font-bold">Test Mode Active</p>
            <p>Use the following test card details:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Card Number: <span className="font-mono bg-warning-content/10 text-warning-content font-bold px-2 py-0.5 rounded">4242 4242 4242 4242</span></li>
              <li>MM/YY: <span className="font-mono bg-warning-content/10 text-warning-content font-bold px-2 py-0.5 rounded">12/30</span></li>
              <li>CVC: <span className="font-mono bg-warning-content/10 text-warning-content font-bold px-2 py-0.5 rounded">123</span></li>
              <li>ZIP: <span className="font-mono bg-warning-content/10 text-warning-content font-bold px-2 py-0.5 rounded">12345</span></li>
            </ul>
          </div>
        </div>

        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            Card Details
            <div className="flex gap-1">
              <span className="badge badge-xs badge-ghost">Visa</span>
              <span className="badge badge-xs badge-ghost">Mastercard</span>
              <span className="badge badge-xs badge-ghost">Amex</span>
            </div>
          </span>
        </label>
        <div className="p-4 border border-base-300 rounded-lg bg-base-100 focus-within:border-primary transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="card-actions">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe || loading || !clientSecret}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <CreditCard size={20} />
              Pay ৳{application.expectedSalary?.toLocaleString()}
            </>
          )}
        </button>
      </div>
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
    }, 2000);
  };

  if (!application || !applicationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="text-primary" size={40} />
            Checkout
          </h1>
          <p className="text-base-content/70">Complete payment to approve tutor application</p>
        </div>
        <Link to="/dashboard/applications" className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Payment Details</h2>
              
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

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-xl sticky top-4">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      {application.tutorId?.photoUrl ? (
                        <img src={application.tutorId.photoUrl} alt={application.tutorId.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        application.tutorId?.name?.charAt(0)?.toUpperCase() || 'T'
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold flex items-center gap-2">
                      <User size={16} />
                      {application.tutorId?.name || 'Tutor'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-base-content/70 flex items-center gap-2 mb-1">
                    <BookOpen size={16} />
                    Tuition
                  </p>
                  <p className="font-semibold">
                    {application.tuitionId?.title || `${application.tuitionId?.subject} - Class ${application.tuitionId?.class}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-base-content/70 mb-1">Expected Salary</p>
                  <p className="text-2xl font-bold text-primary flex items-center gap-2">
                    <DollarSign size={24} />
                    ৳{application.expectedSalary?.toLocaleString()}
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">per month</p>
                </div>

                <div className="divider"></div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ৳{application.expectedSalary?.toLocaleString()}
                  </span>
                </div>

                <div className="alert alert-info mt-4">
                  <CheckCircle size={20} />
                  <span className="text-sm">
                    After successful payment, the tutor will be approved and other applications will be closed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

