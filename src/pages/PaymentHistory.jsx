import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [userRole]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      if (userRole === 'student') {
        const { data } = await api.get('/api/payments/history');
        setPayments(data.payments || []);
      } else if (userRole === 'tutor') {
        const { data } = await api.get('/api/payments/tutor/revenue');
        setPayments(data.payments || []);
      } else {
        // Admin - would need admin endpoint
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend data to match UI format
  const getPaymentData = () => {
    return payments.map((payment) => ({
      id: payment._id,
      transactionId: payment.stripePaymentIntentId || payment._id.substring(0, 12).toUpperCase(),
      type: userRole === 'student' ? 'Payment' : 'Earning',
      amount: payment.amount || 0,
      tutorName: payment.tutorId?.name,
      studentName: payment.studentId?.name,
      from: payment.studentId?.name,
      to: payment.tutorId?.name,
      subject: payment.tuitionId?.subject || 'N/A',
      status: payment.status || 'pending',
      date: new Date(payment.transactionDate || payment.createdAt).toLocaleDateString(),
      paymentMethod: payment.paymentMethod || 'stripe',
      invoice: payment.status === 'completed',
    }));
  };

  const paymentData = getPaymentData();

  const filteredPayments = paymentData.filter((payment) => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userRole === 'student' && payment.tutorName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userRole === 'tutor' && payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userRole === 'admin' && (payment.from?.toLowerCase().includes(searchTerm.toLowerCase()) || payment.to?.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      payment.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'month' && new Date(payment.date) >= new Date(new Date().setDate(1))) ||
      (dateFilter === 'week' && new Date(payment.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTotalAmount = () => {
    return filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success badge-sm">Completed</span>;
      case 'pending':
        return <span className="badge badge-warning badge-sm">Pending</span>;
      case 'failed':
        return <span className="badge badge-error badge-sm">Failed</span>;
      default:
        return <span className="badge badge-ghost badge-sm">{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-success" size={20} />;
      case 'pending':
        return <Clock className="text-warning" size={20} />;
      case 'failed':
        return <XCircle className="text-error" size={20} />;
      default:
        return null;
    }
  };

  const handleDownloadInvoice = (transactionId) => {
    toast.success(`Downloading invoice for ${transactionId}`);
    // Handle invoice download
  };

  const handleExport = () => {
    toast.success('Exporting payment history...');
    // Handle export functionality
  };

  if (loading) {
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
            <DollarSign className="text-primary" size={40} />
            Payment History
          </h1>
          <p className="text-base-content/70">
            {userRole === 'student' && 'Track all your payments to tutors'}
            {userRole === 'tutor' && 'View your earnings and payments received'}
            {userRole === 'admin' && 'Monitor all platform transactions'}
          </p>
        </div>
        <button onClick={handleExport} className="btn btn-primary">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm mb-1">Total {userRole === 'student' ? 'Paid' : userRole === 'tutor' ? 'Earned' : 'Transactions'}</p>
                <p className="text-3xl font-bold">৳{getTotalAmount().toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-success/20">
                <TrendingUp className="text-success" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold">
                  {filteredPayments.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/20">
                <CheckCircle className="text-success" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/20">
                <Clock className="text-warning" size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              <input
                type="text"
                placeholder="Search by transaction ID, name, or subject..."
                className="input input-bordered w-full pl-10 bg-base-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select select-bordered bg-base-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              className="select select-bordered bg-base-100"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Transactions</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  {userRole === 'student' && <th>Tutor</th>}
                  {userRole === 'tutor' && <th>Student</th>}
                  {userRole === 'admin' && (
                    <>
                      <th>From</th>
                      <th>To</th>
                    </>
                  )}
                  <th>Subject</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <span className="font-mono text-sm">{payment.transactionId}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-base-content/50" />
                        <span>{payment.date}</span>
                      </div>
                    </td>
                    {userRole === 'student' && (
                      <td>
                        <span className="font-semibold">{payment.tutorName}</span>
                      </td>
                    )}
                    {userRole === 'tutor' && (
                      <td>
                        <span className="font-semibold">{payment.studentName}</span>
                      </td>
                    )}
                    {userRole === 'admin' && (
                      <>
                        <td>
                          <span className="font-semibold">{payment.from}</span>
                        </td>
                        <td>
                          <span className="font-semibold">{payment.to}</span>
                        </td>
                      </>
                    )}
                    <td>
                      <span className="badge badge-outline">{payment.subject}</span>
                    </td>
                    <td>
                      <span className="font-bold text-primary">৳{payment.amount.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="text-sm">{payment.paymentMethod}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {payment.invoice && payment.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadInvoice(payment.transactionId)}
                            className="btn btn-ghost btn-xs"
                            title="Download Invoice"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto mb-4 text-base-content/30" size={64} />
                <p className="text-lg text-base-content/70">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

