import React, { useState } from 'react';
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

  const handleLogout = () => {
    resetAuth();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0607]/95 backdrop-blur border-b border-[#2A1A1D] w-full shadow-2xl">
      <div className="max-w-screen-2xl mx-auto px-4 py-3.5 flex flex-col items-center gap-3">
        
        {/* Top Centered Brand Header: [Logo 1][Logo 2] PSG COLLEGE OF TECHNOLOGY ... [Logo 3][Logo 4] */}
        <div className="w-full flex items-center justify-between md:justify-center gap-4 sm:gap-8 relative min-h-[76px]">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A79798] hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Central Logo & Brand Header Cluster */}
          <div className="flex items-center justify-center gap-3 sm:gap-8 shrink-0 mx-auto w-full max-w-4xl px-2">
            {/* Left 2 Logos — auto-floating */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-[#E01B22]/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float">
                <img src="/assets/logos/psg-main.png" alt="PSG Main" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-[#E01B22]/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float-delayed">
                <img src="/assets/logos/psg-100.png" alt="PSG 100 Yrs" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            {/* Center Brand Text — Wide, Prominent & Distinct */}
            <Link to="/" className="flex flex-col items-center text-center px-2 sm:px-6 group shrink-0 flex-1">
              <span className="text-xs sm:text-sm md:text-base font-mono font-extrabold tracking-[0.22em] text-[#E8DCDC] uppercase leading-tight drop-shadow">
                PSG COLLEGE OF TECHNOLOGY
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-[0.18em] text-[#FF2A2A] uppercase leading-tight mt-1">
                COMPUTER APPLICATIONS ASSOCIATION PRESENTS
              </span>
              <span className="font-mono font-black text-2xl sm:text-3xl md:text-4xl tracking-wider text-white group-hover:text-[#FF2A2A] transition-colors leading-tight mt-1 drop-shadow-[0_0_18px_rgba(224,27,34,0.5)]">
                LOGIN<span className="text-[#FF2A2A]">2K26</span>
              </span>
            </Link>

            {/* Right 2 Logos — auto-floating */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-[#E01B22]/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float-delayed">
                <img src="/assets/logos/psg-75.png" alt="PSG 75 Yrs" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-[#E01B22]/70 bg-white p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.4)] shrink-0 animate-float">
                <img src="/assets/logos/caa.png" alt="CAA Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Top Right Corner Profile Button / Sign In */}
          <div className="hidden md:flex items-center absolute right-0 top-1/2 -translate-y-1/2">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-[2px] transition-all shadow-[0_0_15px_rgba(224,27,34,0.4)] hover:shadow-[0_0_25px_rgba(224,27,34,0.7)] hover:scale-105"
              >
                SURVIVOR LOGIN
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-[#130C0E] hover:bg-[#1A1114] border border-[#2A1A1D] px-3 py-1.5 rounded-[2px] transition-colors shadow-md"
                >
                  <div className="w-7 h-7 rounded-full bg-[#7E0910] border border-[#FF2A2A] flex items-center justify-center font-bold text-xs text-[#F7F2F2]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#F7F2F2]">{user?.name || 'User'}</span>
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

                    {/* Role-Specific Primary Dashboard Link */}
                    {user?.role === 'admin' || user?.role === 'super_admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono font-bold text-[#FF2A2A] hover:bg-[#1A1114] transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#FF2A2A]" />
                        COMMAND CENTER
                      </Link>
                    ) : user?.role === 'admin_power' ? (
                      <Link
                        to="/admin/access-control"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono font-bold text-[#FF2A2A] hover:bg-[#1A1114] transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#FF2A2A]" />
                        SUPER ADMIN CONTROL
                      </Link>
                    ) : user?.role === 'event_coordinator' ? (
                      <Link
                        to="/coordinator"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono font-bold text-[#E08A17] hover:bg-[#1A1114] transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-[#E08A17]" />
                        COORDINATOR HUB
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono font-bold text-[#F7F2F2] hover:bg-[#1A1114] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#E01B22]" />
                        SURVIVOR DOSSIER
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
        </div>

        {/* Bottom Horizontal Centered Navigation Bar */}
        <div className="w-full hidden md:flex items-center justify-center border-t border-[#2A1A1D]/60 pt-2 pb-0.5">
          <nav className="flex items-center space-x-5 lg:space-x-8 font-mono text-xs tracking-wider">
            <Link
              to="/home"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/home' || location.pathname === '/' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/home' || location.pathname === '/' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            <Link
              to="/events"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/events' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              Events
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/events' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            <Link
              to="/timeline"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/timeline' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              Timeline
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/timeline' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            <Link
              to="/legacy"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/legacy' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              Legacy
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/legacy' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            <Link
              to="/alumni"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/alumni' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              Alumni
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/alumni' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            <Link
              to="/about"
              className={`relative py-1 px-3 rounded-sm transition-all duration-200 uppercase font-bold group ${
                location.pathname === '/about' ? 'text-[#E01B22] bg-[#E01B22]/10' : 'text-[#A79798] hover:text-white hover:bg-white/5'
              }`}
            >
              About
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#E01B22] transition-all duration-300 ${
                location.pathname === '/about' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
              }`} />
            </Link>

            {/* Command Search Trigger */}
            {onOpenCommandSearch && (
              <button
                onClick={onOpenCommandSearch}
                className="flex items-center gap-2 bg-[#130C0E] hover:bg-[#1A1114] border border-[#2A1A1D] text-[#A79798] px-3 py-1 rounded-[2px] text-xs font-mono transition-colors"
                title="Search events and routes"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="bg-[#0A0607] px-1 py-0.2 rounded-[2px] text-[10px] text-[#F7F2F2] border border-[#2A1A1D]">Ctrl+K</kbd>
              </button>
            )}
          </nav>
        </div>
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
