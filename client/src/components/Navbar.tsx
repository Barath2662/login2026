import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Search, Menu, X, LogOut, LayoutDashboard, Shield, Trophy } from 'lucide-react';

interface NavbarProps {
  onOpenCommandSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandSearch }) => {
  const { isAuthenticated, user, resetAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Countdown calculation to 18 September 2026
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-09-18T09:30:00+05:30').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    resetAuth();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0607]/95 backdrop-blur border-b border-[#2A1A1D] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Mark & Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <img src="/assets/logo.svg" alt="LOGIN 2026 Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center gap-2">
              <img src="/assets/login_logo.jpg" alt="LOGIN 2026" className="h-8 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#1A1114] text-[#FF2A2A] border border-[#3E2529] rounded-[2px]">
                35th Edition
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#A79798] tracking-widest hidden md:block">PSG COLLEGE OF TECHNOLOGY</p>
          </div>
        </Link>

        {/* Countdown Timer Readout */}
        <div className="hidden lg:flex items-center gap-3 bg-[#130C0E] border border-[#2A1A1D] px-4 py-1.5 rounded-[2px] font-mono text-xs text-[#A79798]">
          <span className="w-2 h-2 rounded-full bg-[#FF2A2A] animate-ping" />
          <span className="text-[#6B5A5C] uppercase tracking-wider text-[10px]">T-MINUS:</span>
          <span className="text-[#F7F2F2] font-bold">
            {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-body">
          <Link
            to="/events"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/events' ? 'text-[#E01B22] font-semibold' : 'text-[#F7F2F2] hover:text-[#E01B22]'
            }`}
          >
            Events
          </Link>
          <Link
            to="/timeline"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/timeline' ? 'text-[#E01B22] font-semibold' : 'text-[#F7F2F2] hover:text-[#E01B22]'
            }`}
          >
            Timeline
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/about' ? 'text-[#E01B22] font-semibold' : 'text-[#F7F2F2] hover:text-[#E01B22]'
            }`}
          >
            About
          </Link>

          {/* Command Search Trigger (⌘K / Ctrl+K) */}
          {onOpenCommandSearch && (
            <button
              onClick={onOpenCommandSearch}
              className="flex items-center gap-2 bg-[#130C0E] hover:bg-[#1A1114] border border-[#2A1A1D] text-[#A79798] px-3 py-1.5 rounded-[2px] text-xs font-mono transition-colors"
              title="Search events and routes"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="bg-[#0A0607] px-1.5 py-0.5 rounded-[2px] text-[10px] text-[#F7F2F2] border border-[#2A1A1D]">Ctrl+K</kbd>
            </button>
          )}
        </nav>

        {/* Auth Aware Right Controls */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#F7F2F2] hover:text-[#E01B22] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors shadow-md"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 bg-[#130C0E] hover:bg-[#1A1114] border border-[#2A1A1D] px-3 py-1.5 rounded-[2px] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#7E0910] border border-[#FF2A2A] flex items-center justify-center font-bold text-xs text-[#F7F2F2]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-[#F7F2F2] line-clamp-1">{user?.name || 'User'}</p>
                  <p className="text-[10px] font-mono text-[#6B5A5C] uppercase">{user?.role || 'Participant'}</p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-[#2A1A1D]">
                    <p className="text-xs font-bold text-[#F7F2F2]">{user?.name}</p>
                    <p className="text-[10px] text-[#A79798] truncate">{user?.email}</p>
                    {user?.student_id_code && (
                      <p className="text-[10px] font-mono text-[#1FA971] font-bold mt-1">ID: {user.student_id_code}</p>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-xs text-[#F7F2F2] hover:bg-[#1A1114] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#E01B22]" />
                    Dashboard
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-[#F7F2F2] hover:bg-[#1A1114] transition-colors"
                    >
                      <Shield className="w-4 h-4 text-[#FF2A2A]" />
                      Admin Control Panel
                    </Link>
                  )}

                  {user?.role === 'admin_power' && (
                    <Link
                      to="/admin/access-control"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-[#F7F2F2] hover:bg-[#1A1114] transition-colors"
                    >
                      <Shield className="w-4 h-4 text-[#FF2A2A]" />
                      Super Admin Dashboard
                    </Link>
                  )}

                  {user?.role === 'event_coordinator' && (
                    <Link
                      to="/coordinator"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-[#F7F2F2] hover:bg-[#1A1114] transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-[#E08A17]" />
                      Coordinator Portal
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#FF2A2A] hover:bg-[#1A1114] transition-colors text-left border-t border-[#2A1A1D] mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#F7F2F2] p-2 hover:bg-[#130C0E] rounded-[2px]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0607] border-b border-[#2A1A1D] px-4 pt-4 pb-6 space-y-4">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F7F2F2] hover:text-[#E01B22]"
          >
            Events (11)
          </Link>
          <Link
            to="/timeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F7F2F2] hover:text-[#E01B22]"
          >
            Timeline (18-19 Sep)
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F7F2F2] hover:text-[#E01B22]"
          >
            About Fest
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-[#2A1A1D] space-y-2">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-[#FF2A2A]/10 text-[#FF2A2A] rounded-[2px] font-mono text-xs font-bold border border-[#FF2A2A]/20"
                >
                  ADMIN CONTROL PANEL
                </Link>
              )}
              {user?.role === 'admin_power' && (
                <Link
                  to="/admin/access-control"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-[#FF2A2A]/10 text-[#FF2A2A] rounded-[2px] font-mono text-xs font-bold border border-[#FF2A2A]/20"
                >
                  SUPER ADMIN DASHBOARD
                </Link>
              )}
              {user?.role === 'event_coordinator' && (
                <Link
                  to="/coordinator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-[#E08A17]/10 text-[#E08A17] rounded-[2px] font-mono text-xs font-bold border border-[#E08A17]/20"
                >
                  COORDINATOR PORTAL
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-[#130C0E] text-[#F7F2F2] rounded-[2px] font-mono text-xs font-bold"
              >
                GO TO DASHBOARD
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2.5 bg-[#2A1A1D] text-[#FF2A2A] rounded-[2px] font-mono text-xs font-bold"
              >
                SIGN OUT
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#2A1A1D] flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-[#130C0E] text-[#F7F2F2] rounded-[2px] font-mono text-xs font-bold"
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-[#E01B22] text-[#F7F2F2] rounded-[2px] font-mono text-xs font-bold"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
