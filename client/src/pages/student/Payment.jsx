import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Lock, FileText } from 'lucide-react';
import { GlitchText } from '../../components/ui/GlitchText';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

export default function Payment() {
  const navigate = useNavigate();
  const { survivor, setSurvivor } = useAuthStore();
  const [paymentState, setPaymentState] = useState('loading'); // 'loading' | 'idle' | 'processing' | 'success' | 'failed' | 'in_progress'
  const [utr, setUtr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get('/payments/my');
        if (data.status === 'successful') {
           setPaymentState('success');
        } else if (data.status === 'in_progress' || data.status === 'review') {
           setPaymentState('in_progress');
        } else {
           setPaymentState('idle');
        }
      } catch (err) {
        setPaymentState('idle');
      }
    };
    if (survivor) {
      fetchStatus();
    }
  }, [survivor]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!utr.trim()) {
      setErrorMsg('Please enter a valid Transaction Reference.');
      return;
    }
    
    setPaymentState('processing');
    setErrorMsg('');

    try {
      await api.post('/payments/', { transaction_reference: utr.trim() });
      setPaymentState('in_progress');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit payment reference.');
      setPaymentState('failed');
    }
  };

  const handleProceedToDashboard = () => {
    navigate('/student/home');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 px-4 pt-8">
      <div className="border-b border-border-color pb-6">
        <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
          Participation Fee
        </GlitchText>
        <p className="text-text-secondary mt-2">
          Secure your access pass. A one-time payment of Rs. 100 is required for Multiverse Hub entry and event registration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Details */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 uppercase">Transaction Manifest</h2>
          <div className="bg-bg-card border border-border-color p-6 rounded-sm space-y-4">
            <div className="flex justify-between border-b border-border-color/30 pb-4">
              <span className="text-text-secondary font-mono">OPERATIVE</span>
              <span className="text-white font-bold">{survivor.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-border-color/30 pb-4">
              <span className="text-text-secondary font-mono">ITEM</span>
              <span className="text-white font-bold">Universal Participation Pass</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-text-muted font-mono text-lg">TOTAL FEE</span>
              <span className="text-color-red font-bold text-2xl">Rs. 100.00</span>
            </div>
          </div>
        </div>

        {/* Right Column: Gateway UI */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 uppercase">Payment Gateway</h2>
          
          <div className="bg-bg-card border border-border-color rounded-sm p-8 shadow-2xl relative min-h-[300px] flex flex-col items-center justify-center text-center">
            
            {paymentState === 'loading' && (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 size={48} className="text-[#A8A9AD] animate-spin" />
                <p className="text-white font-mono animate-pulse">CHECKING PAYMENT STATUS...</p>
              </div>
            )}

            {paymentState === 'idle' && (
              <form onSubmit={handlePayment} className="space-y-6 w-full">
                <p className="text-text-secondary mb-4 text-sm">
                  Please pay the fee via the college payment gateway. Then enter the Transaction Reference (UTR) below.
                </p>
                
                {errorMsg && (
                  <div className="p-2 bg-color-danger/10 border border-color-danger text-color-danger text-xs font-mono text-left">
                    {errorMsg}
                  </div>
                )}
                
                <div className="space-y-2 text-left">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">TRANSACTION REFERENCE / UTR</label>
                  <input
                    type="text"
                    required
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. UPI/1234567890"
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-2 text-white font-mono focus:ring-0 focus:border-[#D90429] outline-none"
                  />
                </div>
                
                <div className="flex flex-col items-center space-y-3 pt-4">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-md bg-color-red text-white hover:bg-color-red/90 hover:shadow-[0_0_20px_rgba(217,4,41,0.4)] transition-all duration-300 font-bold tracking-widest uppercase"
                  >
                    <FileText size={18} className="flex-shrink-0" />
                    <span>SUBMIT REFERENCE</span>
                  </button>
                </div>
              </form>
            )}

            {paymentState === 'processing' && (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 size={48} className="text-color-red animate-spin" />
                <p className="text-white font-mono animate-pulse">ESTABLISHING SECURE GATEWAY...</p>
                <p className="text-text-muted text-sm">Awaiting gateway authorization.</p>
              </div>
            )}

            {paymentState === 'in_progress' && (
              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-color-silver/20 border border-color-silver rounded-full flex items-center justify-center mb-2">
                  <Loader2 size={40} className="text-color-silver animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">VERIFICATION PENDING</h3>
                <p className="text-text-secondary text-sm px-4">
                  Your transaction reference has been submitted and is awaiting verification by the administration.
                </p>
                <button 
                  onClick={handleProceedToDashboard} 
                  className="w-full mt-4 px-6 py-3 rounded border border-[#A8A9AD] text-[#A8A9AD] hover:bg-[#A8A9AD]/10 transition-colors uppercase font-bold tracking-widest text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-color-red/20 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={40} className="text-color-red" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">SUCCESS - PASS GRANTED</h3>
                <p className="text-text-secondary text-sm px-4">
                  Payment verified. Gatekeeper clearance granted.
                </p>
                <button 
                  onClick={handleProceedToDashboard} 
                  className="w-full mt-4 px-6 py-3 rounded bg-color-red text-white hover:bg-red-600 transition-colors font-bold uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(217,4,41,0.4)]"
                >
                  Enter Dashboard
                </button>
              </div>
            )}

            {paymentState === 'failed' && (
              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-color-danger/20 rounded-full flex items-center justify-center mb-2">
                  <XCircle size={40} className="text-color-danger" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">Transaction Failed</h3>
                <p className="text-text-secondary text-sm px-4">
                  The connection was interrupted or the bank rejected the request. Please try again.
                </p>
                <button 
                  onClick={() => setPaymentState('idle')} 
                  className="w-full mt-4 px-6 py-3 rounded border border-color-red text-color-red hover:bg-color-red/10 transition-colors uppercase font-bold"
                >
                  Retry Transaction
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
