import React from 'react';
import { ShieldCheck, Crosshair } from 'lucide-react';

export const CoordinatorsSection: React.FC = () => {
  return (
    <section id="coordinators-section" className="py-20 px-4 bg-[#130C0E] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0607_1px,transparent_1px),linear-gradient(to_bottom,#0a0607_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      {/* Red ambient glow behind Group */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(224,27,34,0.08)_0%,_transparent_75%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 select-none">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block">
            ✦ LEADERSHIP PROFILE
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            DEPARTMENT COORDINATORS
          </h2>
          <p className="text-xs text-[#A79798] font-mono tracking-wider max-w-md mx-auto">
            The organizing core behind the 35th grand edition of LOGIN.
          </p>
        </div>

        {/* Unified Group Photo Layout */}
        <div className="flex flex-col items-center justify-center space-y-10">
          
          {/* Group Photo Container */}
          <div className="relative w-full max-w-5xl h-[450px] sm:h-[500px] md:h-[550px] overflow-hidden bg-transparent group flex items-end justify-center">
            
            {/* Background Container for frame (to not bound the image if it overflows, but here we contain it) */}
            <div className="absolute inset-0 bg-[#0A0607]/60" />

            {/* Corner Brackets (no full border) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            
            {/* Crosshair accents */}
            <Crosshair className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 text-[#E01B22]/30 z-20 pointer-events-none" />
            <Crosshair className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 text-[#E01B22]/30 z-20 pointer-events-none" />

            {/* Tech labels / HUD */}
            <div className="absolute top-4 left-4 text-[9px] font-mono text-[#E01B22]/70 z-20 flex flex-col space-y-1">
              <span>SYS // TEAM_UNIT_05</span>
              <span>DEPT: MCA</span>
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-[#E01B22]/70 z-20 text-right">
              <span>STATUS: ACTIVE</span>
            </div>
            
            {/* Hologram / Glow Effects inside frame */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(224,27,34,0.15)_0%,_transparent_60%)] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(224,27,34,0.1)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-30" />
            
            {/* The Group Image - Object Contain to show full faces & bodies */}
            <img 
              src="/coord_dummy.png" 
              alt="Department Coordinators" 
              className="relative w-full h-[95%] object-contain object-bottom transition-transform duration-1000 group-hover:scale-[1.03] z-10 drop-shadow-[0_0_25px_rgba(224,27,34,0.25)] filter contrast-110 saturate-[1.1]"
            />

            {/* Laser Scanning line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E01B22] to-transparent animate-[scan_3s_ease-in-out_infinite] z-20 pointer-events-none" />
          </div>

          {/* Clean Information Panel */}
          <div className="w-full max-w-4xl flex flex-col items-center space-y-8">
            
            {/* Leadership Block */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
                <span className="font-mono text-xs text-[#A79798] tracking-[0.2em] uppercase">
                  ◈ TEAM LEADERSHIP
                </span>
              </div>
              
              <div className="text-center space-y-1">
                <p className="font-mono text-[10px] sm:text-xs text-[#E01B22] tracking-widest uppercase">
                  STUDENT SECRETARY
                </p>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F7F2F2] tracking-wider uppercase drop-shadow-[0_0_10px_rgba(247,242,242,0.2)]">
                  NITHEESH M K
                </h3>
              </div>
            </div>

            {/* Other Roles 2x2 Grid */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1 */}
              <div className="border border-[#2A1A1D] bg-[#0A0607]/80 p-4 rounded-[2px] text-center hover:border-[#E01B22]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E01B22]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[9px] text-[#A79798] tracking-widest uppercase mb-1">
                  TREASURER
                </p>
                <p className="font-display font-bold text-sm text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
                  HARI PRASATH S
                </p>
              </div>

              {/* Box 2 */}
              <div className="border border-[#2A1A1D] bg-[#0A0607]/80 p-4 rounded-[2px] text-center hover:border-[#E01B22]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E01B22]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[9px] text-[#A79798] tracking-widest uppercase mb-1">
                  JOINT SECRETARY / COORD
                </p>
                <p className="font-display font-bold text-sm text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
                  KAVYA R
                </p>
              </div>

              {/* Box 3 */}
              <div className="border border-[#2A1A1D] bg-[#0A0607]/80 p-4 rounded-[2px] text-center hover:border-[#E01B22]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E01B22]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[9px] text-[#A79798] tracking-widest uppercase mb-1">
                  EVENT COORD
                </p>
                <p className="font-display font-bold text-sm text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
                  SANJAY KUMAR A
                </p>
              </div>

              {/* Box 4 */}
              <div className="border border-[#2A1A1D] bg-[#0A0607]/80 p-4 rounded-[2px] text-center hover:border-[#E01B22]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E01B22]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[9px] text-[#A79798] tracking-widest uppercase mb-1">
                  TECHNICAL COORD
                </p>
                <p className="font-display font-bold text-sm text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
                  ABISHEK S
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CSS Animation for scanning line */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

    </section>
  );
};

export default CoordinatorsSection;
