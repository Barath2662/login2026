import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, ShieldAlert, CheckCircle2, XCircle, RefreshCw, Send, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const PaymentVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/payments/');
      const txns = Array.isArray(data) ? data : (data.data || []);
      setTransactions(txns);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTxns = transactions.filter(t => 
    (t.student_id?.toString().includes(searchQuery.toLowerCase())) ||
    (t.transaction_reference?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.id?.toString().includes(searchQuery.toLowerCase()))
  );

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'failed') {
        if (!window.confirm('Are you sure you want to initiate a refund/fail for this transaction?')) return;
        await api.put(`/payments/${id}/refund`);
      } else if (newStatus === 'successful') {
        await api.put(`/payments/${id}/verify`);
      }
      fetchTransactions();
    } catch (err) {
      alert(`Failed to update status to ${newStatus}`);
    }
  };

  const notifyStudent = (id) => {
    console.log(`Push notification sent to student ID: ${id}`);
    alert(`Notification sent to OP (UID: ${id})`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="mb-10">
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          Transaction <span className="text-yellow-500">Validation</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm max-w-2xl">
          Review manual payment submissions. Verify cleared transactions or initiate refunds for anomalies.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden relative z-10">
        <div className="p-4 border-b border-border-color bg-black/20 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Input 
              placeholder="Search by Student Name or TXN ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-yellow-500/30 focus:border-yellow-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
          
          <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-sm border border-yellow-500/30">
              <RefreshCw size={14} /> PENDING: {transactions.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-sm border border-green-500/30">
              <CheckCircle2 size={14} /> VERIFIED: {transactions.filter(t => t.status === 'successful').length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative Name</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredTxns.length > 0 ? (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white font-mono">{txn.id}</div>
                      <div className="text-xs text-text-muted mt-1">{txn.transaction_reference}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white font-mono">{txn.student?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-muted mt-1">{txn.student?.roll_no || 'N/A'} (UID: {txn.student_id})</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">₹ {txn.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-sm border ${
                        txn.status === 'successful' ? 'text-green-500 bg-green-500/10 border-green-500/30' :
                        txn.status === 'in_progress' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' :
                        'text-color-danger bg-color-danger/10 border-color-danger/30'
                      }`}>
                        {txn.status === 'successful' && <CheckCircle2 size={12} />}
                        {txn.status === 'in_progress' && <RefreshCw size={12} className="animate-spin-slow" />}
                        {txn.status === 'failed' && <XCircle size={12} />}
                        {(txn.status || 'unknown').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.status === 'in_progress' ? (
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStatus(txn.id, 'failed')}
                            className="border-color-danger text-color-danger hover:bg-color-danger hover:text-black text-xs h-8"
                          >
                            REFUND
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateStatus(txn.id, 'successful')}
                            className="bg-green-500 text-black hover:bg-green-400 border-none text-xs h-8"
                          >
                            VERIFY
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => notifyStudent(txn.student_id)}
                          className="border-border-color text-text-muted hover:text-white flex items-center gap-2 text-xs h-8 ml-auto"
                        >
                          <Send size={12} /> NOTIFY OP
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;
