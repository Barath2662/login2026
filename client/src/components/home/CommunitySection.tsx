import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DecryptedText } from '../../animations/DecryptedText';

export const CommunitySection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Deep Red Radial Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,_rgba(224,27,34,0.08)_0%,_transparent_75%)] pointer-events-none filter blur-3xl z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Eyebrow Label */}
        <span className="font-mono text-[11px] text-[#E01B22] font-black tracking-[0.25em] block select-none">
          ✦ <DecryptedText 
            text="ALUMNI SPOTLIGHT // 2026" 
            animateOn="view" 
            speed={60} 
            maxIterations={15}
            useOriginalCharsOnly
          />
        </span>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase leading-none select-none">
          ONCE LOGIN. <br className="sm:hidden" /> ALWAYS LOGIN.
        </h2>

        {/* Supporting description */}
        <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed max-w-xl mx-auto font-body font-medium">
          Reconnect with your alma mater. Meet familiar faces and witness the next generation of masterminds enter the arena.
        </p>

        {/* Visual Date Emphasis Block */}
        <div className="flex flex-col items-center py-4 select-none">
          <span className="text-4xl sm:text-5xl font-display font-black tracking-widest text-[#F7F2F2] leading-none">
            18 — 19
          </span>
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#E01B22] uppercase mt-2">
            SEPTEMBER 2026
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            to="/register?type=alumni"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-transparent border border-[#E01B22] hover:bg-[#E01B22]/10 text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,27,34,0.35)]"
          >
            REGISTER YOUR RETURN
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Detail */}
        <div className="pt-8 border-t border-[#2A1A1D]/60 max-w-xs mx-auto select-none">
          <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#70676a] uppercase">
            35 YEARS OF LOGIN // ONE COMMUNITY
          </span>
        </div>

      </div>
    </section>
  );
};

export default CommunitySection;
