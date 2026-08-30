import React from 'react';
import { Link } from 'react-router-dom';

export const CommunitySection: React.FC = () => {
  return (
    <section className="w-full bg-[#F4F0EE] text-[#0A0607] py-16 sm:py-20 px-6 sm:px-12 lg:px-16 border-y border-[#E0D8D6] relative overflow-hidden shadow-2xl">
      
      {/* Light grid texture background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000c_1px,transparent_1px),linear-gradient(to_bottom,#0000000c_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none z-0" />

      {/* Side HUD label */}
      <div className="absolute top-4 left-6 text-[9px] font-mono text-[#8C7E80] uppercase tracking-widest pointer-events-none z-10 hidden sm:block">
        SYS // SAS
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Text Block */}
        <div className="space-y-3 max-w-2xl text-left">
          <span className="font-mono text-xs font-black text-[#E01B22] tracking-widest uppercase block">
            PSG TECH MCA ALUMNI INVITATION
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#0A0607] tracking-wider uppercase leading-tight">
            WELCOME HOME, ALUMNI
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3E40] font-mono leading-relaxed">
            Reconnect with past batches, network with current students, and witness the 35th edition of LOGIN on 18 & 19 September 2026.
          </p>
        </div>

        {/* Right Red CTA Button */}
        <div className="w-full md:w-auto text-left md:text-right shrink-0">
          <Link
            to="/register?type=alumni"
            className="inline-block w-full md:w-auto px-10 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-[2px] transition-all duration-300 shadow-[0_4px_20px_rgba(224,27,34,0.35)] hover:shadow-[0_6px_25px_rgba(255,42,42,0.5)] text-center"
          >
            ALUMNI REGISTRATION FORM →
          </Link>
        </div>

      </div>

    </section>
  );
};

export default CommunitySection;
