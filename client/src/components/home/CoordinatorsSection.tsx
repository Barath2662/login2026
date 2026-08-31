import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CoordinatorsSection: React.FC = () => {
  return (
    <section id="coordinators-section" className="py-20 px-4 sm:px-6 bg-[#130C0E] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0607_1px,transparent_1px),linear-gradient(to_bottom,#0a0607_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(224,27,34,0.08)_0%,_transparent_75%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-2 select-none">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ LEADERSHIP PROFILE
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            DEPARTMENT COORDINATORS
          </h2>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wider max-w-lg mx-auto">
            The organizing core behind the 35th grand edition of LOGIN.
          </p>
        </div>

        {/* Group Photo Container */}
        <div className="relative max-w-5xl mx-auto w-full overflow-hidden bg-[#0A0607]/80 border border-[#2A1A1D] rounded-[2px] shadow-2xl group">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />

          {/* Tech labels / HUD */}
          <div className="absolute top-4 left-4 text-[9px] font-mono text-[#E01B22]/80 z-20 flex flex-col space-y-1">
            <span>SYS // TEAM_UNIT_05</span>
            <span>DEPT: MCA</span>
          </div>
          <div className="absolute top-4 right-4 text-[9px] font-mono text-[#E01B22]/80 z-20 text-right">
            <span>STATUS: ACTIVE</span>
          </div>

          {/* Image */}
          <img
            src="/coords.webp"
            alt="Department Coordinators"
            className="w-full max-h-[500px] object-cover object-top relative z-10 filter contrast-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/coords_bold.webp';
            }}
          />
        </div>

        {/* Coordinators Grid */}
        <div className="space-y-12 max-w-5xl mx-auto pb-10">
          
          {/* CORE LEADERSHIP */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                CORE LEADERSHIP
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">TREASURER</p>
                <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">SWARNA RATHNA A</h3>
              </div>
              <div className="border border-[#E01B22] bg-[#1A080A]/90 p-4 rounded-[2px] text-center shadow-[0_0_20px_rgba(224,27,34,0.25)] group flex flex-col justify-center items-center min-h-[90px] relative">
                <p className="font-mono text-[9px] text-[#E01B22] font-black tracking-widest uppercase mb-1">SECRETARY</p>
                <h3 className="font-display font-black text-xs sm:text-[13px] tracking-wide uppercase leading-snug text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors">BARATHVIKRAMAN S K</h3>
              </div>
              <div className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">PLACEMENT REPRESENTATIVE</p>
                <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">TINO BRITTY J</h3>
              </div>
            </div>
          </div>

          {/* EXECUTIVE COORDINATORS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2A1A1D]/50">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                EXECUTIVE COORDINATORS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['STEPHINA SMILY C', 'ARAVINDH KANNAN M S', 'MUGUNDHAN K P'].map((name) => (
                <div key={name} className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                  <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">EXECUTIVE COORDINATOR</p>
                  <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">{name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* SPECIALIZED COORDINATORS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2A1A1D]/50">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                DEPARTMENT COORDINATORS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: 'ALUMNI COORDINATOR', name: 'SAKTHIVEL MALLAIAH R G A' },
                { role: 'TECHNICAL COORDINATOR', name: 'TAMILINI S' },
                { role: 'PUBLIC RELATION', name: 'GAYATHRI S' },
                { role: 'STUDENT DEVELOPMENT', name: 'DEEPIKAA B S' }
              ].map((item) => (
                <div key={item.name} className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                  <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">{item.role}</p>
                  <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">{item.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* EXECUTIVE MEMBERS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2A1A1D]/50">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                EXECUTIVE MEMBERS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['NITHEESH MUTHU KRISHNAN C', 'SURIYA G V', 'DIVYADHARSHINI K'].map((name) => (
                <div key={name} className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                  <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">EXECUTIVE MEMBER</p>
                  <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">{name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* WEBSITE DEVELOPERS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2A1A1D]/50">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                WEBSITE DEVELOPERS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['NITHEESH MUTHU KRISHNAN C', 'CHINNAYA K', 'TAMILINI S', 'BARATHVIKRAMAN S K'].map((name) => (
                <div key={name} className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                  <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">DEVELOPER</p>
                  <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">{name}</h3>
                </div>
              ))}
            </div>
          </div>
          {/* WEBSITE FACULTY COORDINATORS */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2A1A1D]/50">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase font-bold">
                WEBSITE FACULTY COORDINATORS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {['MR. SUNDAR C', 'MS A MANORANJITHAM'].map((name) => (
                <div key={name} className="border border-[#2A1A1D] bg-[#0A0607]/90 p-4 rounded-[2px] text-center hover:border-[#E01B22]/60 transition-colors group flex flex-col justify-center items-center min-h-[90px]">
                  <p className="font-mono text-[9px] text-[#E01B22] font-bold tracking-widest uppercase mb-1">FACULTY COORDINATOR</p>
                  <h3 className="font-display font-black text-xs sm:text-[13px] text-[#F7F2F2] tracking-wide uppercase leading-snug group-hover:text-[#E01B22] transition-colors">{name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoordinatorsSection;
