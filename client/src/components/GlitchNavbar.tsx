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
    { name: 'Legacy', path: '/legacy' },
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
          ? 'bg-bg-primary/90 backdrop-blur-md border-b border-border-color shadow-[0_4px_30px_rgba(217,4,41,0.1)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <span className="font-mono font-bold text-2xl tracking-tighter text-white group-hover:text-color-red transition-colors">
              LOGIN<span className="text-color-red group-hover:text-color-silver transition-colors">2K26</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {(!isAuthenticated || !survivor || survivor.role === 'student') && navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-color-red ${
                    isActive ? 'text-color-red' : 'text-text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {isAuthenticated && survivor ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 w-10 h-10 rounded-full border border-color-red bg-bg-card justify-center text-color-red hover:bg-color-red/10 transition-colors shadow-[0_0_15px_rgba(217,4,41,0.2)] focus:outline-none"
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
                      className="absolute right-0 mt-4 w-56 rounded-sm bg-[#111420] border border-[var(--color-red)] shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[var(--color-red)]/30">
                        <p className="text-sm font-bold text-white truncate">{survivor.name}</p>
                        <p className="text-xs text-text-muted font-mono">{survivor.role}</p>
                      </div>
                      <div className="py-1">
                        {survivor.role === 'student' && (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-text-secondary hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)] transition-colors"
                            >
                              SURVIVOR DOSSIER
                            </Link>
                            <Link
                              to="/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-text-secondary hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)] transition-colors"
                            >
                              MULTIVERSE HUB
                            </Link>
                            <Link
                              to="/registered-events"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-text-secondary hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)] transition-colors"
                            >
                              REGISTERED EVENTS
                            </Link>
                            <Link
                              to="/team"
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-text-secondary hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)] transition-colors"
                            >
                              SQUAD / TEAM
                            </Link>
                          </>
                        )}
                        {survivor.role === 'event_coordinator' && (
                          <Link
                            to="/event-dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-color-silver hover:bg-color-silver/10 transition-colors"
                          >
                            EVENT DASHBOARD
                          </Link>
                        )}
                        {survivor.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-color-silver hover:bg-color-silver/10 transition-colors"
                          >
                            ADMIN DASHBOARD
                          </Link>
                        )}
                        {survivor.role === 'special_user' && (
                          <Link
                            to="/special-user"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-color-silver hover:bg-color-silver/10 transition-colors"
                          >
                            SPECIAL DASHBOARD
                          </Link>
                        )}
                        {survivor.role === 'junior_attendance' && (
                          <Link
                            to="/junior-attendance"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-color-silver hover:bg-color-silver/10 transition-colors"
                          >
                            JUNIOR ATTENDANCE
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="block w-full text-left px-4 py-2 text-sm text-color-danger hover:bg-color-danger/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-5 py-2 text-sm font-medium rounded-sm bg-color-red text-black hover:bg-color-red/90 transition-colors shadow-[0_0_15px_rgba(239,35,60,0.3)] hover:shadow-[0_0_25px_rgba(239,35,60,0.5)] tracking-wider"
              >
                SURVIVOR LOGIN
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border-color absolute top-20 left-0 right-0 shadow-xl">
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
