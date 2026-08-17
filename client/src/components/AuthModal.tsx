import React, { FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setAuth = useAuthStore(state => state.setAuth);
  const setSurvivor = useAuthStore(state => state.setSurvivor);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      // Reset state when opened
      setMode('LOGIN');
      setEmail('');
      setPassword('');
      setName('');
      setError(null);
    } else {
      dialog.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        await api.auth.register({ email, password, name });
        // Auto login after successful registration
        const res = await api.auth.login({ email, password });
        setAuth(true, res.data.token);
        setSurvivor(res.data.user);
        onClose();
        window.location.href = '/home';
      } else {
        const res = await api.auth.login({ email, password });
        setAuth(true, res.data.token);
        setSurvivor(res.data.user);
        onClose();
        
        const role = res.data.user?.role;
        if (role === 'event_coordinator') {
          window.location.href = '/event-dashboard';
        } else if (role === 'admin') {
          window.location.href = '/admin';
        } else if (role === 'junior_attendance') {
          window.location.href = '/junior-attendance';
        } else if (role === 'special_user') {
          window.location.href = '/special-user';
        } else {
          window.location.href = '/home';
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Connection severed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent backdrop:bg-[#050505]/90 backdrop:backdrop-blur-md m-auto w-full max-w-md overflow-visible outline-none"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#050505]/80 backdrop-blur-lg border border-[#A8A9AD]/50 rounded-xl shadow-[0_0_40px_rgba(217,4,41,0.15)] overflow-hidden w-full relative mx-4 md:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D90429] to-transparent opacity-70" />

            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[#A8A9AD] font-mono text-xs uppercase tracking-widest mb-1 block">
                  SECURE CONNECTION //
                </span>
                <h2 className="text-2xl font-black uppercase text-[#E5E5E5] tracking-tight">
                  {mode === 'LOGIN' ? 'SYSTEM LOGIN' : 'NEW OPERATIVE'}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close Terminal"
                className="text-[#A8A9AD] hover:text-[#D90429] transition-colors p-1 cursor-pointer active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-center relative z-10">
              <p className="text-[#A8A9AD] text-sm leading-relaxed mb-4">
                {mode === 'LOGIN' 
                  ? 'ENTER YOUR CREDENTIALS TO ACCESS THE MULTIVERSE HUB.' 
                  : 'REGISTER YOUR BIOMETRICS TO ENTER THE SYSTEM.'}
              </p>

              {error && (
                <div className="bg-[#D90429]/10 border border-[#D90429]/30 text-[#D90429] text-xs font-mono p-3 rounded-md text-left">
                  ERROR: {error}
                </div>
              )}

              {mode === 'REGISTER' && (
                <div className="space-y-1 text-left">
                  <label className="text-xs font-mono text-[#A8A9AD] uppercase tracking-wider ml-1">Operative Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#111111]/80 border border-[#A8A9AD]/30 rounded-lg px-4 py-3 text-[#E5E5E5] font-mono focus:outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-xs font-mono text-[#A8A9AD] uppercase tracking-wider ml-1">Secure Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#111111]/80 border border-[#A8A9AD]/30 rounded-lg px-4 py-3 text-[#E5E5E5] font-mono focus:outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] transition-all"
                  placeholder="operative@grid.net"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-mono text-[#A8A9AD] uppercase tracking-wider ml-1">Access Key (Password)</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#111111]/80 border border-[#A8A9AD]/30 rounded-lg px-4 py-3 text-[#E5E5E5] font-mono focus:outline-none focus:border-[#D90429] focus:ring-1 focus:ring-[#D90429] transition-all"
                  placeholder="••••••••••••"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center space-x-3 px-4 py-4 mt-6 rounded-lg border border-[#A8A9AD]/50 bg-[#111111]/80 text-[#E5E5E5] hover:bg-[#111111] hover:border-[#D90429] hover:shadow-[0_0_20px_rgba(217,4,41,0.4)] transition-all duration-300 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Hover shine effect */}
                {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D90429]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
                
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#D90429]" />
                ) : (
                  <span className="font-sans font-semibold tracking-wide relative z-10 group-hover:text-white transition-colors">
                    {mode === 'LOGIN' ? 'INITIATE HANDSHAKE' : 'ESTABLISH CONNECTION'}
                  </span>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-[#A8A9AD]/20 text-xs font-mono text-[#A8A9AD]">
                {mode === 'LOGIN' ? (
                  <p>NEW TO THE GRID? <button type="button" onClick={() => setMode('REGISTER')} className="text-[#D90429] hover:underline cursor-pointer tracking-wider">REGISTER HERE</button></p>
                ) : (
                  <p>ALREADY HAVE ACCESS? <button type="button" onClick={() => setMode('LOGIN')} className="text-[#D90429] hover:underline cursor-pointer tracking-wider">LOGIN HERE</button></p>
                )}
              </div>
            </form>
            
            {/* Footer texture */}
            <div className="h-6 w-full absolute bottom-0 left-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};
