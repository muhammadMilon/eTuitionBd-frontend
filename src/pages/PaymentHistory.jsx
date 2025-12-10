import { useState } from 'react';
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
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - replace with actual API call
  const getPaymentData = () => {
    if (userRole === 'student') {
      return [
        {
          id: 1,
          transactionId: 'TXN-2024-001',
          type: 'Payment',
          amount: 5000,
          tutorName: 'Dr. Ahmed Hasan',
          subject: 'Mathematics',
          status: 'completed',
          date: '2024-12-15',
          paymentMethod: 'bKash',
          invoice: true,
        },
        {
          id: 2,
          transactionId: 'TXN-2024-002',
          type: 'Payment',
          amount: 4500,
          tutorName: 'Fatima Rahman',
          subject: 'Physics',
          status: 'completed',
          date: '2024-12-10',
          paymentMethod: 'Nagad',
          invoice: true,
        },
        {
          id: 3,
          transactionId: 'TXN-2024-003',
          type: 'Payment',
          amount: 6000,
          tutorName: 'Karim Uddin',
          subject: 'English',
          status: 'pending',
          date: '2024-12-20',
          paymentMethod: 'Bank Transfer',
          invoice: false,
        },
        {
          id: 4,
          transactionId: 'TXN-2024-004',
          type: 'Payment',
          amount: 5000,
          tutorName: 'Dr. Ahmed Hasan',
          subject: 'Mathematics',
          status: 'failed',
          date: '2024-12-05',
          paymentMethod: 'bKash',
          invoice: false,
        },
        {
          id: 5,
          transactionId: 'TXN-2024-005',
          type: 'Payment',
          amount: 5500,
          tutorName: 'Fatima Rahman',
          subject: 'Physics',
          status: 'completed',
          date: '2024-11-28',
          paymentMethod: 'Rocket',
          invoice: true,
        },
      ];
    } else if (userRole === 'tutor') {
      return [
        {
          id: 1,
          transactionId: 'TXN-2024-001',
          type: 'Earning',
          amount: 5000,
          studentName: 'Student ABC',
          subject: 'Mathematics',
          status: 'completed',
          date: '2024-12-15',
          paymentMethod: 'bKash',
          invoice: true,
        },
        {
          id: 2,
          transactionId: 'TXN-2024-002',
          type: 'Earning',
          amount: 4500,
          studentName: 'Student XYZ',
          subject: 'Physics',
          status: 'completed',
          date: '2024-12-10',
          paymentMethod: 'Nagad',
          invoice: true,
        },
        {
          id: 3,
          transactionId: 'TXN-2024-003',
          type: 'Earning',
          amount: 6000,
          studentName: 'Student DEF',
          subject: 'English',
          status: 'pending',
          date: '2024-12-20',
          paymentMethod: 'Bank Transfer',
          invoice: false,
        },
        {
          id: 4,
          transactionId: 'TXN-2024-004',
          type: 'Earning',
          amount: 5000,
          studentName: 'Student ABC',
          subject: 'Mathematics',
          status: 'completed',
          date: '2024-11-25',
          paymentMethod: 'bKash',
          invoice: true,
        },
        {
          id: 5,
          transactionId: 'TXN-2024-005',
          type: 'Earning',
          amount: 5500,
          studentName: 'Student GHI',
          subject: 'Chemistry',
          status: 'completed',
          date: '2024-11-20',
          paymentMethod: 'Rocket',
          invoice: true,
        },
      ];
    } else {
      // Admin - all transactions
      return [
        {
          id: 1,
          transactionId: 'TXN-2024-001',
          type: 'Payment',
          amount: 5000,
          from: 'Student ABC',
          to: 'Dr. Ahmed Hasan',
          subject: 'Mathematics',
          status: 'completed',
          date: '2024-12-15',
          paymentMethod: 'bKash',
          invoice: true,
        },
        {
          id: 2,
          transactionId: 'TXN-2024-002',
          type: 'Payment',
          amount: 4500,
          from: 'Student XYZ',
          to: 'Fatima Rahman',
          subject: 'Physics',
          status: 'completed',
          date: '2024-12-10',
          paymentMethod: 'Nagad',
          invoice: true,
        },
        {
          id: 3,
          transactionId: 'TXN-2024-003',
          type: 'Payment',
          amount: 6000,
          from: 'Student DEF',
          to: 'Karim Uddin',
          subject: 'English',
          status: 'pending',
          date: '2024-12-20',
          paymentMethod: 'Bank Transfer',
          invoice: false,
        },
        {
          id: 4,
          transactionId: 'TXN-2024-004',
          type: 'Payment',
          amount: 5000,
          from: 'Student ABC',
          to: 'Dr. Ahmed Hasan',
          subject: 'Mathematics',
          status: 'failed',
          date: '2024-12-05',
          paymentMethod: 'bKash',
          invoice: false,
        },
        {
          id: 5,
          transactionId: 'TXN-2024-005',
          type: 'Payment',
          amount: 5500,
          from: 'Student GHI',
          to: 'Fatima Rahman',
          subject: 'Chemistry',
          status: 'completed',
          date: '2024-11-28',
          paymentMethod: 'Rocket',
          invoice: true,
        },
      ];
    }
  };

  const payments = getPaymentData();

  const filteredPayments = payments.filter((payment) => {
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

