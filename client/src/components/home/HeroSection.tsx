import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { DecryptedText } from '../../animations/DecryptedText';

interface HeroSectionProps {
  onExploreEvents: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreEvents }) => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/hero.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* ── Cinematic Overlays for Readability ── */}
      
      {/* Layer 1: Dark Base Vignette Overlay */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />
      
      {/* Layer 2: Deep Red Thematic Vignette Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(126,9,16,0.18)_0%,_transparent_75%)] pointer-events-none z-0" />
      
      {/* Layer 3: Vertical Fade Gradients (Bottom Blend & Top Darkener) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0A0607] pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#FF2A2A 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Localized Dark Overlay behind content for maximum text legibility */}
      <div 
        className="absolute inset-x-0 top-[20%] bottom-[15%] pointer-events-none z-0 select-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 80%)',
        }}
      />

      {/* ── Top Header Spacer & Institutional Label ── */}
      {/* Offset by pt-32 to allow transparent Navbar to sit cleanly above it */}
      <div className="w-full pt-32 pb-2 px-4 relative z-10 flex flex-col items-center select-none space-y-3.5">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3 justify-center select-none">
            {/* PSG Main Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#2A1A1D]/60 flex items-center justify-center p-1.5 shadow-lg">
              <img 
                src="/assets/logos/psg-main.png" 
                alt="PSG Main" 
                className="w-full h-full object-contain" 
              />
            </div>
            {/* PSG Centenary Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#2A1A1D]/60 flex items-center justify-center p-1.5 shadow-lg">
              <img 
                src="/assets/logos/psg-100.png" 
                alt="PSG Centenary" 
                className="w-full h-full object-contain" 
              />
            </div>
            {/* PSG 75th Year Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#2A1A1D]/60 flex items-center justify-center p-1.5 shadow-lg">
              <img 
                src="/assets/logos/psg-75.png" 
                alt="PSG 75" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
          <span 
            className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#B8B2B2] uppercase"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.6)' }}
          >
            PSG COLLEGE OF TECHNOLOGY PRESENTS
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 font-mono tracking-[0.2em] text-[#F7F2F2] font-bold text-[10px] sm:text-xs uppercase text-center">
          <span style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.7)' }}>
            [ <DecryptedText 
              text="35TH EDITION" 
              animateOn="view" 
              speed={65} 
              maxIterations={12}
              useOriginalCharsOnly
            /> ]
          </span>
          <span 
            className="text-[#B8B2B2] font-semibold text-[8px] sm:text-[9px] tracking-[0.25em] mt-0.5 block"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.6)' }}
          >
            NATIONAL TECHNICAL SYMPOSIUM
          </span>
        </div>
      </div>

      {/* ── Main Hero Content ── */}
      <div className="max-w-4xl mx-auto px-4 w-full relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-5">
        
        {/* Brand Headings */}
        <div className="space-y-1">
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#F7F2F2] tracking-wider uppercase"
            style={{ textShadow: '0 3px 12px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 0, 0, 0.7)' }}
          >
            LOGIN <span className="text-[#E01B22]">2K26</span>
          </h1>
          <div className="flex items-center justify-center select-none">
            <div 
              className="font-mono text-[11px] sm:text-xs font-bold text-[#F5F5F5] tracking-[0.35em] uppercase"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 0, 0, 0.6)' }}
            >
              [ <DecryptedText 
                text="THE LAST HUMAN" 
                animateOn="view" 
                speed={70} 
                maxIterations={15}
              /> ]
            </div>
          </div>
        </div>

        {/* Short Powerful Description */}
        <p 
          className="text-xs sm:text-sm md:text-base text-[#F7F2F2]/95 max-w-[46ch] leading-relaxed font-body font-medium"
          style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.6)' }}
        >
          Where innovation, competition, and the next generation of technologists converge.
        </p>

        {/* Actions - Primary (Red Filled) vs Secondary (Subtle Link) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto pt-2">
          {isAuthenticated ? (
            <Link
              to={
                user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power'
                  ? '/admin'
                  : user?.role === 'event_coordinator'
                  ? '/coordinator'
                  : user?.user_type === 'ALUMNI'
                  ? '/alumni'
                  : '/dashboard'
              }
              className="shimmer-btn w-full sm:w-auto px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-lg hover:shadow-[0_0_20px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2"
            >
              {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power'
                ? 'COMMAND CENTER'
                : user?.role === 'event_coordinator'
                ? 'COORDINATOR PORTAL'
                : 'MY DASHBOARD'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="shimmer-btn w-full sm:w-auto px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-lg hover:shadow-[0_0_20px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2"
            >
              REGISTER NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={onExploreEvents}
            className="text-[#A79798] hover:text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-2 px-4 group"
          >
            EXPLORE EVENTS <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

      </div>

      {/* ── Bottom Padding / Scroll Indicator Area ── */}
      <div className="w-full pb-10 pt-4 px-4 relative z-10 flex flex-col items-center justify-center select-none font-mono text-[9px] tracking-[0.25em] text-[#A79798]/55">
        <span>SCROLL TO EXPLORE</span>
        <span className="mt-1 text-xs text-[#E01B22] animate-pulse">↓</span>
      </div>

    </section>
  );
};
