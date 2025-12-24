import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    FileText,
    Search,
    TrendingUp,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

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
      } else if (userRole === 'admin') {
        const { data } = await api.get('/api/payments/admin/all');
        setPayments(data.payments || []);
      } else {
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
      type: userRole === 'admin' ? 'Transaction' : (userRole === 'student' ? 'Payment' : 'Earning'),
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
    const payment = paymentData.find((p) => p.transactionId === transactionId);
    if (!payment) {
      toast.error('Payment record not found');
      return;
    }

    try {
      const doc = new jsPDF();

      // Add Company Logo/Name
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text('eTuitionBd', 20, 30);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Your Trusted Private Tuition Platform', 20, 38);

      // Invoice Header
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text('INVOICE', 140, 30);

      doc.setFontSize(10);
      doc.text(`Invoice No: INV-${payment.transactionId.substring(0, 8).toUpperCase()}`, 140, 40);
      doc.text(`Date: ${payment.date}`, 140, 45);

      // separator
      doc.setDrawColor(230);
      doc.line(20, 55, 190, 55);

      // Bill To/From
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill From (Student)', 20, 70);
      doc.text('Payment To (Tutor)', 110, 70);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(payment.studentName || payment.from || 'N/A', 20, 78);
      doc.text(payment.tutorName || payment.to || 'N/A', 110, 78);

      // Transaction Details Table
      autoTable(doc, {
        startY: 95,
        head: [['Description', 'Reference', 'Amount']],
        body: [
          [
            `Tuition Payment for ${payment.subject}`,
            `Ref: ${payment.transactionId}`,
            `BDT ${payment.amount.toLocaleString()}`,
          ],
        ],
        headStyles: { 
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 255, 252] },
        margin: { left: 20, right: 20 },
      });

      const finalY = doc.lastAutoTable.finalY + 10;

      // Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total Amount Paid:', 110, finalY + 10);
      doc.text(`BDT ${payment.amount.toLocaleString()}`, 160, finalY + 10);

      // Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(150);
      const footerY = doc.internal.pageSize.height - 20;
      doc.text('This is an electronically generated invoice and does not require a signature.', 20, footerY);
      doc.text('Thank you for using eTuitionBd!', 20, footerY + 5);

      doc.save(`Invoice_${transactionId}.pdf`);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF invoice');
    }
  };

  const handleExport = () => {
    if (filteredPayments.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.text('eTuitionBd - Payment Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);
      doc.text(`Role: ${userRole.toUpperCase()}`, 20, 33);
      doc.text(`Total Transactions: ${filteredPayments.length}`, 20, 38);
      doc.text(`Total Amount: BDT ${getTotalAmount().toLocaleString()}`, 20, 43);

      const tableData = filteredPayments.map(p => [
        p.transactionId.substring(0, 10),
        p.date,
        userRole === 'admin' ? `${p.from} to ${p.to}` : (userRole === 'student' ? p.tutorName : p.studentName),
        p.subject,
        `BDT ${p.amount.toLocaleString()}`,
        p.status
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['TXN ID', 'Date', userRole === 'admin' ? 'Participants' : (userRole === 'student' ? 'Tutor' : 'Student'), 'Subject', 'Amount', 'Status']],
        body: tableData,
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 },
      });

      doc.save(`Payment_History_${new Date().getTime()}.pdf`);
      toast.success('Payment history exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export payment history');
    }
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        payment.subject.toLowerCase().includes('math') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        payment.subject.toLowerCase().includes('data structure') ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        payment.subject.toLowerCase().includes('physics') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {payment.subject}
                      </span>
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

