import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/payments/');
      setPayments(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId) => {
    try {
      await api.put(`/payments/${paymentId}/verify`);
      fetchPayments();
    } catch (err) {
      alert('Failed to verify payment');
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to initiate a refund for this transaction?')) return;
    try {
      await api.put(`/payments/${paymentId}/refund`);
      fetchPayments();
    } catch (err) {
      alert('Failed to initiate refund');
    }
  };

  const filtered = payments.filter(p => 
    (p.student_id?.toString().includes(searchQuery.toLowerCase())) ||
    (p.transaction_reference?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.id?.toString().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          Global <span className="text-color-silver">Payments</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          Master financial ledger tracking the one-time ₹100 participation fee.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20">
          <div className="relative max-w-md">
            <Input 
              placeholder="Search by Operative Name or Transaction ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Pay ID / UTR</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative ID</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Date</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    <div>{pay.id}</div>
                    <div className="text-xs text-text-muted">{pay.transaction_reference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">UID: {pay.student_id}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">₹ {pay.amount}</td>
                  <td className="px-6 py-4 font-mono text-xs">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-sm border ${
                      pay.status === 'successful' ? 'text-green-500 bg-green-500/10 border-green-500/30' : 
                      pay.status === 'failed' ? 'text-color-danger bg-color-danger/10 border-color-danger/30' :
                      'text-color-silver bg-color-silver/10 border-color-silver/30'
                    }`}>
                      {pay.status === 'successful' && <CheckCircle2 size={12} />}
                      {pay.status === 'failed' && <XCircle size={12} />}
                      {pay.status === 'in_progress' && <Clock size={12} />}
                      {(pay.status || 'unknown').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {pay.status === 'in_progress' && (
                      <Button onClick={() => handleVerify(pay.id)} size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500 hover:text-black">
                        Verify
                      </Button>
                    )}
                    {pay.status === 'successful' && (
                      <Button onClick={() => handleRefund(pay.id)} size="sm" variant="outline" className="text-color-danger border-color-danger hover:bg-color-danger hover:text-black">
                        Refund
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
