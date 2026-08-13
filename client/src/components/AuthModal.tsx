import React, { FC, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google Auth Error:', error);
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
                  SYSTEM LOGIN
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
            <div className="p-6 space-y-8 text-center">
              <p className="text-[#A8A9AD] text-sm leading-relaxed">
                ACCESSING THE MULTIVERSE HUB REQUIRES SECURE BIOMETRIC AUTHENTICATION. PROCEED VIA SECURE TUNNEL.
              </p>
              
              <button 
                onClick={handleGoogleLogin} 
                className="group relative w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-lg border border-[#A8A9AD]/50 bg-[#111111]/80 text-[#E5E5E5] hover:bg-[#111111] hover:border-[#D90429] hover:shadow-[0_0_20px_rgba(217,4,41,0.4)] transition-all duration-300 active:scale-95 overflow-hidden"
              >
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D90429]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                
                <svg width="24" height="24" viewBox="0 0 48 48" className="flex-shrink-0 relative z-10">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span className="font-sans font-semibold tracking-wide relative z-10 group-hover:text-white transition-colors">INITIATE GOOGLE HANDSHAKE</span>
              </button>
            </div>
            
            {/* Footer texture */}
            <div className="h-6 w-full bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay border-t border-[#A8A9AD]/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
};
