import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { GlitchText } from '../components/ui/GlitchText';
import { Button } from '../components/ui/Button';
import { PassInvoice } from '../components/ui/PassInvoice';
import { CheckCircle2, XCircle, Loader2, Lock } from 'lucide-react';
import { api } from '../services/api';

type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const ArmoryCheckout = () => {
  const navigate = useNavigate();
  const { survivor, updatePaidStatus } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    setPaymentState('processing');

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      setPaymentState('failed');
      return;
    }

    try {
      // 1. Get worldIds from cart
      const worldIds = items
        .filter(item => item.type === 'world_pass' && item.id.startsWith('world_'))
        .map(item => item.id.replace('world_', ''));
      
      // We pass worldIds even if empty, because backend might accept just the base pass.
      // Wait, currently backend createCartOrder expects non-empty worldIds.
      // We'll pass it as is. If no worldIds, we might need a dummy or the backend should be updated to allow empty worldIds.
      // Let's pass what we have.
      const orderResponse = await api.post('/payment/create-cart-order', { worldIds });
      
      if (orderResponse.data.bypassedPayment) {
        // Free registration success
        setPaymentState('success');
        clearCart();
        return;
      }

      const { orderId, amount, currency } = orderResponse.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
        amount: amount,
        currency: currency,
        name: 'Login 2K26',
        description: 'Survivor Pass & Operations',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Client-side verification for fast UI feedback
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            setPaymentState('success');
            updatePaidStatus();
            navigate('/hub');
          } catch (err) {
            console.error('Payment verification failed', err);
            setPaymentState('failed');
          }
        },
        prefill: {
          name: survivor?.fullName || '',
          email: survivor?.email || '',
          contact: survivor?.mobileNo || ''
        },
        theme: {
          color: 'var(--color-red)'
        },
        modal: {
          ondismiss: function() {
            setPaymentState('idle');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed', response.error);
        setPaymentState('failed');
      });
      
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setPaymentState('failed');
    }
  };

  const handleProceedToHub = () => {
    navigate('/hub');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-24 mb-24 pb-12 px-4">
      <div className="border-b border-border-color pb-6">
        <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase">
          The Armory
        </GlitchText>
        <p className="text-text-secondary mt-2">
          Secure your access passes. Verification required for Multiverse Hub entry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Invoice */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 uppercase">Current Manifest</h2>
          <PassInvoice />
        </div>

        {/* Right Column: Gateway UI */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 uppercase">Payment Gateway</h2>
          
          <div className="bg-bg-card border border-border-color rounded-sm p-8 shadow-2xl relative min-h-[300px] flex flex-col items-center justify-center text-center">
            
            {paymentState === 'idle' && (
              <div className="space-y-6 w-full">
                <p className="text-text-secondary mb-8 text-sm">
                  Complete the transaction to acquire your Survivor Pass and gain access to the Multiverse Hub.
                </p>
                
                <div className="flex flex-col items-center space-y-3">
                  <button 
                    onClick={handlePayment} 
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-md bg-[#528FF0] text-white hover:bg-[#528FF0]/90 hover:shadow-[0_0_20px_rgba(82,143,240,0.4)] transition-all duration-300 font-bold tracking-widest"
                  >
                    <Lock size={18} className="flex-shrink-0" />
                    <span>PAY NOW</span>
                  </button>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">
                    Powered by Razorpay Secure
                  </span>
                </div>
              </div>
            )}

            {paymentState === 'processing' && (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 size={48} className="text-color-red animate-spin" />
                <p className="text-white font-mono animate-pulse">ESTABLISHING SECURE GATEWAY...</p>
                <p className="text-text-muted text-sm">Awaiting gateway authorization.</p>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-color-red/20 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={40} className="text-color-red" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">SUCCESS - PASS GRANTED</h3>
                <p className="text-text-secondary text-sm px-4">
                  Invoice sent to {survivor?.email}. Your Survivor Pass has been updated.
                  Gatekeeper clearance granted.
                </p>
                <Button onClick={handleProceedToHub} className="w-full mt-4">
                  Enter Multiverse Hub
                </Button>
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
                <Button variant="outline" onClick={() => setPaymentState('idle')} className="w-full mt-4 text-color-red border-color-red">
                  Retry Transaction
                </Button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};
