import type { FC } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, Cpu } from 'lucide-react';

export const PassInvoice: FC = () => {
  const { items, getTotal } = useCartStore();
  const { survivor: user } = useAuthStore();

  return (
    <div className="bg-black border border-border-color p-6 relative font-mono text-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-border-color pb-4 mb-4 relative z-10">
        <div>
          <h3 className="text-color-red font-bold text-lg mb-1 tracking-widest">TRANSACTION LOG</h3>
          <p className="text-text-muted text-xs">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <Cpu className="text-color-silver" size={24} />
      </div>

      {/* User Info */}
      <div className="mb-6 space-y-1 relative z-10">
        <p className="text-text-secondary"><span className="text-text-muted">OPERATIVE:</span> {user?.fullName || 'UNKNOWN'}</p>
        <p className="text-text-secondary"><span className="text-text-muted">CONTACT:</span> {user?.email || 'N/A'}</p>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6 relative z-10">
        <div className="flex justify-between text-xs text-text-muted border-b border-border-color/50 pb-2">
          <span>ITEM DESC</span>
          <span>CREDITS</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <span className="text-color-red">{'>'}</span>
              <span>{item.name}</span>
            </div>
            <span>₹{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Total & Warning */}
      <div className="border-t border-border-color pt-4 relative z-10">
        <div className="flex justify-between items-center text-lg font-bold text-white mb-4">
          <span>TOTAL DUE:</span>
          <span className="text-color-red shadow-color-red drop-shadow-md">₹{getTotal().toFixed(2)}</span>
        </div>
        
        <div className="bg-color-danger/10 border border-color-danger/30 p-3 rounded-sm flex items-start space-x-3 mb-3">
          <ShieldAlert className="text-color-danger flex-shrink-0" size={16} />
          <p className="text-xs text-color-danger/90">
            PAYMENT REQUIRED TO UNLOCK MULTIVERSE HUB ENTRANCE. ALL TRANSACTIONS ARE FINAL.
          </p>
        </div>

        <div className="bg-color-red/10 border border-color-red/30 p-3 rounded-sm flex items-start space-x-3">
          <ShieldAlert className="text-color-red flex-shrink-0" size={16} />
          <p className="text-xs text-color-red/90 uppercase">
            Bring your physical college ID card to the venue — entry requires ID verification at check-in.
          </p>
        </div>
      </div>
    </div>
  );
};
