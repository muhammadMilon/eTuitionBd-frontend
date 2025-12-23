import { Calendar, ChevronRight, CreditCard, DollarSign, Download, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';

const RevenueHistory = () => {
  const [loading, setLoading] = useState(true);
  const [revenues, setRevenues] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeTuitions: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/payments/tutor/my-revenue');
      setRevenues(data.payments || []);
      
      const total = (data.payments || []).reduce((sum, p) => sum + p.amount, 0);
      setStats({
        totalEarnings: total,
        activeTuitions: (data.payments || []).length,
        pendingPayments: 0
      });
    } catch (error) {
      console.error('Error fetching revenue:', error);
      toast.error('Failed to load revenue history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <DollarSign className="text-success" size={40} />
          Revenue History
        </h1>
        <p className="text-base-content/70">Track your earnings and payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl border-l-4 border-success">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-70">Total Earnings</p>
                <h2 className="text-3xl font-bold text-success font-mono">৳{stats.totalEarnings.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-success/20 rounded-xl text-success">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl border-l-4 border-primary">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-70">Paid Tuitions</p>
                <h2 className="text-3xl font-bold text-primary font-mono">{stats.activeTuitions}</h2>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl text-primary">
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl border-l-4 border-info">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-70">Average per Tuition</p>
                <h2 className="text-3xl font-bold text-info font-mono">
                  ৳{stats.activeTuitions > 0 ? Math.round(stats.totalEarnings / stats.activeTuitions).toLocaleString() : 0}
                </h2>
              </div>
              <div className="p-3 bg-info/20 rounded-xl text-info">
                <CreditCard size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card bg-base-200 shadow-xl overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 flex items-center justify-between border-b border-base-300">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <button className="btn btn-ghost btn-sm gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-lg w-full">
              <thead className="bg-base-300">
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {revenues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 opacity-50 italic">
                      No earnings records found.
                    </td>
                  </tr>
                ) : (
                  revenues.map((rev) => (
                    <tr key={rev._id} className="hover:bg-base-100 transition-colors">
                      <td className="text-sm opacity-70">
                        {new Date(rev.transactionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <div className="font-bold">{rev.studentId?.name || 'N/A'}</div>
                        <div className="text-xs opacity-50">{rev.studentId?.email}</div>
                      </td>
                      <td>
                        <div className="badge badge-outline">{rev.tuitionId?.subject || 'N/A'}</div>
                      </td>
                      <td className="font-mono font-bold text-success">
                        +৳{rev.amount.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-success badge-sm font-bold uppercase py-3 px-3">Paid</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-circle btn-sm">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueHistory;
