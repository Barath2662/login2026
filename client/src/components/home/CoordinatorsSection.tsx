import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { DecryptedText } from '../../animations/DecryptedText';

interface CoordCardProps {
  name: string;
  role: string;
  isSecretary?: boolean;
  imageSrc?: string;
  status?: string;
}

const CoordCard: React.FC<CoordCardProps> = ({ name, role, isSecretary = false, imageSrc, status = "ONLINE" }) => {
  return (
    <div className={`relative border border-[#2A1A1D] bg-[#0A0607]/80 backdrop-blur-sm rounded-[2px] transition-all duration-500 group overflow-hidden ${
      isSecretary 
        ? 'p-6 border-[#E01B22]/40 shadow-[0_0_30px_rgba(224,27,34,0.05)] hover:border-[#E01B22]' 
        : 'p-4 hover:border-[#E01B22]/50 hover:bg-[#130C0E]/50'
    }`}>
      {/* Laser Scanning line for Secretary */}
      {isSecretary && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E01B22] to-transparent animate-[scan_3s_ease-in-out_infinite] z-20 pointer-events-none" />
      )}

      {/* Futuristic Background Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />

      {/* Hologram Image Container for Secretary */}
      {isSecretary && imageSrc ? (
        <div className="relative w-full aspect-square mb-5 overflow-hidden border border-[#2A1A1D] bg-black/60 group-hover:border-[#E01B22]/40 transition-colors">
          {/* Tech ticks */}
          <div className="absolute top-2 left-2 text-[8px] font-mono text-[#E01B22]/50">SYS // DETECTED</div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#E01B22]/50">LATENCY // 4MS</div>
          
          {/* Dynamic glitch scan line */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(224,27,34,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-70" />
          
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0"
          />
          {/* Red color overlay blend */}
          <div className="absolute inset-0 bg-[#E01B22]/10 mix-blend-color pointer-events-none" />
        </div>
      ) : null}

      {/* Avatar Placeholder for Coordinators */}
      {!isSecretary && (
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-10 h-10 rounded-full border border-[#2A1A1D] flex items-center justify-center bg-[#130C0E] group-hover:border-[#E01B22]/40 transition-colors">
            <User className="w-4 h-4 text-[#A79798] group-hover:text-[#E01B22] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#A79798] tracking-widest uppercase">NODE // COORD</span>
            <span className="text-[10px] font-mono text-[#E01B22] font-black tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] animate-pulse" />
              {status}
            </span>
          </div>
        </div>
      )}

      {/* Core metadata info */}
      <div className="space-y-1 select-none">
        <span className="text-[10px] font-mono font-bold text-[#E01B22]/80 uppercase tracking-widest block">
          {role}
        </span>
        <h4 className="text-sm sm:text-base font-display font-black text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
          {name}
        </h4>
        
        {isSecretary && (
          <div className="flex items-center gap-2 pt-2.5 border-t border-[#2A1A1D] mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E01B22]" />
            <span className="text-[9px] font-mono text-[#A79798] tracking-widest uppercase">
              SYMPOSIUM CHAIRPERSON
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const CoordinatorsSection: React.FC = () => {
  return (
    <section id="coordinators-section" className="py-24 px-4 bg-[#130C0E] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0607_1px,transparent_1px),linear-gradient(to_bottom,#0a0607_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      {/* Red ambient glow behind Secretary */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(224,27,34,0.05)_0%,_transparent_75%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
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

        {/* Dynamic 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Treasurer & Coordinator (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="text-left md:text-right pb-2 border-b border-[#2A1A1D] hidden md:block">
              <span className="text-[9px] font-mono text-[#6B5A5C] tracking-widest block uppercase">
                // EXECUTIVE MATRIX LEFT
              </span>
            </div>
            <CoordCard 
              name="Hari Prasath S" 
              role="Treasurer" 
              status="SECURE"
            />
            <CoordCard 
              name="Kavya R" 
              role="Joint Secretary / Coordinator" 
              status="ONLINE"
            />
          </div>

          {/* CENTER: Secretary (md:col-span-4) */}
          <div className="md:col-span-4">
            <CoordCard 
              name="Nitheesh M K" 
              role="Student Secretary" 
              isSecretary={true}
              imageSrc="/assets/secretary.png"
              status="ACTIVE"
            />
          </div>

          {/* RIGHT: Two Coordinators (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="text-left pb-2 border-b border-[#2A1A1D] hidden md:block">
              <span className="text-[9px] font-mono text-[#6B5A5C] tracking-widest block uppercase">
                // EXECUTIVE MATRIX RIGHT
              </span>
            </div>
            <CoordCard 
              name="Sanjay Kumar A" 
              role="Event Coordinator" 
              status="ONLINE"
            />
            <CoordCard 
              name="Abishek S" 
              role="Technical Coordinator" 
              status="ACTIVE"
            />
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
