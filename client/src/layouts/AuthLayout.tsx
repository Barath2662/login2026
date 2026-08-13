import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-color-red/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-color-silver/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-5 mix-blend-overlay" />
      </div>

      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Base</span>
        </Link>
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-mono font-bold text-xl tracking-tighter text-white">
            LOGIN<span className="text-color-red">2K26</span>
          </span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-sm text-text-muted">
        SYSTEM VERIFICATION REQUIRED FOR ACCESS.
      </footer>
    </div>
  );
};
