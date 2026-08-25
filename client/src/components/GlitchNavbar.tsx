import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from './AuthModal';
import { api } from '../services/api';

export const GlitchNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { isAuthenticated, survivor, resetAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Enter the Multiverse', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'Contact', path: '/contact' },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.auth.logout();
      resetAuth();
      setIsDropdownOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      resetAuth();
      setIsDropdownOpen(false);
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/95 backdrop-blur-md border-b border-border-color shadow-[0_4px_30px_rgba(217,4,41,0.2)]'
          : 'bg-bg-primary/85 backdrop-blur-sm border-b border-border-color/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col items-center gap-2">
        
        {/* Top Centered Brand Header: [Logo 1][Logo 2] PSG COLLEGE OF TECHNOLOGY ... [Logo 3][Logo 4] */}
        <div className="w-full flex items-center justify-between md:justify-center gap-4 sm:gap-8 relative min-h-[76px]">
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Central Logo & Brand Header Cluster */}
          <div className="flex items-center justify-center gap-3 sm:gap-8 shrink-0 mx-auto w-full max-w-4xl px-2">
            {/* Left 2 Logos — auto-floating */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-color-red/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float">
                <img src="/assets/logos/psg-main.png" alt="PSG Main" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-color-red/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float-delayed">
                <img src="/assets/logos/psg-100.png" alt="PSG 100 Yrs" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {/* Center Brand Text — Wide, Prominent & Distinct */}
            <Link to="/home" className="flex flex-col items-center text-center px-2 sm:px-6 group shrink-0 flex-1">
              <span className="text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-[0.22em] text-[#E8DCDC] uppercase leading-tight drop-shadow">
                PSG COLLEGE OF TECHNOLOGY
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-[0.18em] text-color-red uppercase leading-tight mt-1">
                COMPUTER APPLICATIONS ASSOCIATION PRESENTS
              </span>
              <span className="font-mono font-black text-2xl sm:text-3xl md:text-4xl tracking-wider text-white group-hover:text-color-red transition-colors leading-tight mt-1 drop-shadow-[0_0_18px_rgba(224,27,34,0.5)]">
                LOGIN<span className="text-color-red group-hover:text-color-silver transition-colors">2K26</span>
              </span>
            </Link>

            {/* Right 2 Logos — auto-floating */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-color-red/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float-delayed">
                <img src="/assets/logos/psg-75.png" alt="PSG 75 Yrs" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-color-red/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float">
                <img src="/assets/logos/caa.png" alt="CAA Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Top Right Corner Profile Button / Survivor Login */}
          <div className="hidden md:flex items-center absolute right-0 top-1/2 -translate-y-1/2">
            {isAuthenticated && survivor ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 w-10 h-10 rounded-full border-2 border-color-red bg-[#130C0E] justify-center text-color-red hover:bg-color-red/20 transition-all shadow-[0_0_15px_rgba(239,35,60,0.4)] focus:outline-none"
                  title={survivor.name}
                >
                  <UserIcon size={20} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 rounded-sm bg-[#111420] border border-[var(--color-red)] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-[var(--color-red)]/30">
                        <p className="text-sm font-bold text-white truncate">{survivor.name}</p>
                        <p className="text-xs text-text-muted font-mono">{survivor.role}</p>
                      </div>
                      <div className="py-1">
                        {survivor.role === 'admin' || survivor.role === 'super_admin' ? (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-mono text-white hover:bg-color-red/20 transition-colors"
                          >
                            COMMAND CENTER
                          </Link>
                        ) : survivor.role === 'event_coordinator' ? (
                          <Link
                            to="/coordinator"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-mono text-white hover:bg-color-red/20 transition-colors"
                          >
                            COORDINATOR HUB
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-mono text-white hover:bg-color-red/20 transition-colors"
                          >
                            DOSSIER & MISSIONS
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="block w-full text-left px-4 py-2 text-xs font-mono text-color-red hover:bg-color-red/10 transition-colors disabled:opacity-50"
                        >
                          {isLoggingOut ? 'DISCONNECTING...' : 'ABORT CONNECTION'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-1.5 text-xs font-bold font-mono rounded-sm bg-color-red text-black hover:bg-color-red/90 transition-all shadow-[0_0_15px_rgba(239,35,60,0.4)] hover:shadow-[0_0_25px_rgba(239,35,60,0.7)] hover:scale-105 tracking-wider uppercase"
              >
                SURVIVOR LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Bottom Horizontal Centered Navigation Bar */}
        <div className="w-full hidden md:flex items-center justify-center border-t border-[#2A1A1D]/60 pt-2 pb-0.5">
          <nav className="flex items-center space-x-6 lg:space-x-8 font-mono text-xs tracking-wider">
            {(!isAuthenticated || !survivor || survivor.role === 'student') && navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                    isActive ? 'text-color-red bg-color-red/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {/* Glowing Hover Underline */}
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-color-red transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`} />
                  {/* Hover glow spread */}
                  <span className="absolute inset-0 rounded-sm bg-color-red/0 group-hover:bg-color-red/5 transition-colors duration-300 -z-10" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary/95 backdrop-blur-md border-b border-border-color absolute top-full left-0 right-0 shadow-2xl animate-fade-in-up" style={{ animationDuration: '0.25s' }}>
          <div className="px-4 pt-2 pb-6 space-y-1">
            {(!isAuthenticated || !survivor || survivor.role === 'student') && navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive ? 'text-color-red bg-bg-card' : 'text-text-secondary hover:text-color-red hover:bg-bg-card'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              {isAuthenticated && survivor ? (
                <>
                  {survivor.role === 'student' && (
                    <>
                      <Link
                        to="/profile"
                        className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-text-secondary hover:text-[var(--color-red)] hover:border-[var(--color-red)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        SURVIVOR DOSSIER
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-text-secondary hover:text-[var(--color-red)] hover:border-[var(--color-red)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        MULTIVERSE HUB
                      </Link>
                      <Link
                        to="/registered-events"
                        className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-text-secondary hover:text-[var(--color-red)] hover:border-[var(--color-red)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        REGISTERED EVENTS
                      </Link>
                      <Link
                        to="/team"
                        className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-text-secondary hover:text-[var(--color-red)] hover:border-[var(--color-red)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        SQUAD / TEAM
                      </Link>
                    </>
                  )}
                  {survivor.role === 'event_coordinator' && (
                    <Link
                      to="/event-dashboard"
                      className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-color-silver hover:border-color-silver transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      EVENT DASHBOARD
                    </Link>
                  )}
                  {survivor.role === 'admin_power' && (
                    <Link
                      to="/admin/access-control"
                      className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-color-silver hover:border-color-silver transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      SUPER ADMIN DASHBOARD
                    </Link>
                  )}
                  {survivor.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-color-silver hover:border-color-silver transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                  {survivor.role === 'special_user' && (
                    <Link
                      to="/special-user"
                      className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-color-silver hover:border-color-silver transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      SPECIAL DASHBOARD
                    </Link>
                  )}
                  {survivor.role === 'junior_attendance' && (
                    <Link
                      to="/junior-attendance"
                      className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm border border-border-color text-color-silver hover:border-color-silver transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      JUNIOR ATTENDANCE
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="block w-full text-center px-5 py-3 text-sm font-medium rounded-sm bg-color-danger/20 text-color-danger hover:bg-color-danger/30 transition-colors"
                  >
                    ABORT CONNECTION
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                  className="block w-full text-center px-5 py-3 text-base font-medium rounded-sm bg-color-red text-black hover:bg-color-red/90 transition-colors shadow-[0_0_15px_rgba(239,35,60,0.3)] tracking-wider"
                >
                  SURVIVOR LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
