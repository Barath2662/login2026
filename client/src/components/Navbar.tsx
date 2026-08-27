import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, LogOut, LayoutDashboard, Shield, Trophy } from 'lucide-react';

interface NavbarProps {
  onOpenCommandSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { isAuthenticated, user, resetAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 48) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    resetAuth();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const isHomepage = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className={`w-full z-40 ${isHomepage && !isSticky ? 'absolute top-0 left-0 right-0 bg-transparent' : 'relative bg-[#0A0607]'}`}>
      
      {/* ── NAVBAR: MAIN NAVIGATION BAR ── */}
      <header className={`w-full transition-all duration-300 z-40 ${
        isSticky 
          ? 'fixed top-0 left-0 right-0 bg-[#130C0E]/95 backdrop-blur border-b border-[#2A1A1D] shadow-2xl' 
          : isHomepage 
          ? 'bg-transparent border-b border-transparent' 
          : 'relative bg-[#130C0E] border-b border-[#2A1A1D]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <div className="flex items-center gap-2 shrink-0">
              {/* LOGIN Logo (Circled & White themed) */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#2A1A1D]/60 bg-white flex items-center justify-center p-1 shadow-md transition-transform group-hover:scale-105 duration-300">
                <img 
                  src="/assets/login.png" 
                  alt="LOGIN Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* CAA Logo (Circled & White themed) */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#2A1A1D]/60 bg-white flex items-center justify-center p-0.5 shadow-md transition-transform group-hover:scale-105 duration-300">
                <img 
                  src="/assets/logos/caa.png" 
                  alt="CAA Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <span className="font-mono font-black text-lg sm:text-2xl tracking-wider text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors drop-shadow-[0_0_10px_rgba(224,27,34,0.3)]">
              LOGIN<span className="text-[#E01B22]">2K26</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-mono text-xs tracking-wider">
            <Link
              to="/home"
              className={`relative py-1 px-2.5 transition-colors uppercase font-bold ${
                location.pathname === '/home' || location.pathname === '/' ? 'text-[#E01B22]' : 'text-[#A79798] hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`relative py-1 px-2.5 transition-colors uppercase font-bold ${
                location.pathname === '/events' ? 'text-[#E01B22]' : 'text-[#A79798] hover:text-white'
              }`}
            >
              Events
            </Link>
            <Link
              to="/gallery"
              className={`relative py-1 px-2.5 transition-colors uppercase font-bold ${
                location.pathname === '/gallery' ? 'text-[#E01B22]' : 'text-[#A79798] hover:text-white'
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/coordinators"
              className={`relative py-1 px-2.5 transition-colors uppercase font-bold ${
                location.pathname === '/coordinators' ? 'text-[#E01B22]' : 'text-[#A79798] hover:text-white'
              }`}
            >
              Coordinators
            </Link>
            <Link
              to="/contact"
              className={`relative py-1 px-2.5 transition-colors uppercase font-bold ${
                location.pathname === '/contact' ? 'text-[#E01B22]' : 'text-[#A79798] hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/alumni"
                  className="px-3.5 py-2 border border-[#E01B22]/40 hover:border-[#E01B22] text-[#F7F2F2] hover:bg-[#E01B22]/5 font-bold text-[10px] sm:text-[11px] font-mono uppercase tracking-wider rounded-[2px] transition-all"
                >
                  ALUMNI SIGNUP
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold text-[11px] font-mono uppercase tracking-wider rounded-[2px] transition-all shadow-[0_0_15px_rgba(224,27,34,0.3)] hover:shadow-[0_0_25px_rgba(224,27,34,0.6)]"
                >
                  LOGIN
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-[#0A0607] hover:bg-[#130C0E] border border-[#2A1A1D] px-3 py-1.5 rounded-[2px] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#7E0910] border border-[#E01B22] flex items-center justify-center font-bold text-[10px] text-[#F7F2F2]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#F7F2F2] hidden sm:inline">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] shadow-2xl py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-[#2A1A1D]">
                      <p className="font-bold text-[#F7F2F2] truncate">{user?.name}</p>
                      <p className="text-[10px] text-[#A79798] truncate">{user?.email}</p>
                    </div>
                    
                    {user?.role === 'admin' || user?.role === 'super_admin' ? (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-mono text-[#E01B22] hover:bg-[#0A0607]">
                        <Shield className="w-4 h-4" /> COMMAND CENTER
                      </Link>
                    ) : user?.role === 'admin_power' ? (
                      <Link to="/admin/access-control" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-mono text-[#E01B22] hover:bg-[#0A0607]">
                        <Shield className="w-4 h-4" /> SUPER ADMIN
                      </Link>
                    ) : user?.role === 'event_coordinator' ? (
                      <Link to="/coordinator" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-mono text-[#E08A17] hover:bg-[#0A0607]">
                        <Trophy className="w-4 h-4" /> COORDINATOR HUB
                      </Link>
                    ) : (
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-mono text-[#F7F2F2] hover:bg-[#0A0607]">
                        <LayoutDashboard className="w-4 h-4 text-[#E01B22]" /> MY DASHBOARD
                      </Link>
                    )}

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-[#FF2A2A] hover:bg-[#0A0607] text-left border-t border-[#2A1A1D] mt-1">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#A79798] hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#130C0E] border-t border-[#2A1A1D] px-4 py-4 space-y-3">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-mono font-bold text-[#F7F2F2] hover:text-[#E01B22]"
            >
              HOME
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-mono font-bold text-[#F7F2F2] hover:text-[#E01B22]"
            >
              EVENTS
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-mono font-bold text-[#F7F2F2] hover:text-[#E01B22]"
            >
              GALLERY
            </Link>
            <Link
              to="/coordinators"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-mono font-bold text-[#F7F2F2] hover:text-[#E01B22]"
            >
              COORDINATORS
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-mono font-bold text-[#F7F2F2] hover:text-[#E01B22]"
            >
              CONTACT
            </Link>

            {!isAuthenticated && (
              <Link
                to="/alumni"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-mono font-bold text-[#E01B22] pt-2 border-t border-[#2A1A1D]"
              >
                ALUMNI SIGNUP
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-mono font-bold text-[#E01B22] pt-2 border-t border-[#2A1A1D]"
              >
                GO TO DASHBOARD
              </Link>
            )}
          </div>
        )}
      </header>
    </div>
  );
};
