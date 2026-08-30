import React from 'react';
import { motion } from 'framer-motion';

interface EventHubProps {
  isHovered?: boolean;
  onClick?: () => void;
}

export const EventHub: React.FC<EventHubProps> = ({
  isHovered,
  onClick,
}) => {
  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer select-none"
      onClick={onClick}
    >
      {/* ── 01. Outward Pulsing Ripple Circle 1 ── */}
      <motion.div 
        animate={{ 
          scale: [0.75, 1.45],
          opacity: [0.6, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeOut" 
        }}
        className="absolute w-[210px] h-[210px] rounded-full border border-[#E01B22]/50 pointer-events-none" 
      />

      {/* ── 02. Outward Pulsing Ripple Circle 2 (Staggered Delay) ── */}
      <motion.div 
        animate={{ 
          scale: [0.75, 1.45],
          opacity: [0.6, 0]
        }}
        transition={{ 
          duration: 3, 
          delay: 1.5,
          repeat: Infinity, 
          ease: "easeOut" 
        }}
        className="absolute w-[210px] h-[210px] rounded-full border border-[#E01B22]/40 pointer-events-none" 
      />

      {/* ── 03. Ambient Radial Glow Background ── */}
      <motion.div 
        animate={{ 
          scale: isHovered ? [1.1, 1.3, 1.1] : [0.95, 1.15, 0.95],
          opacity: isHovered ? [0.4, 0.6, 0.4] : [0.18, 0.35, 0.18]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(224,27,34,0.5)_0%,_transparent_70%)] pointer-events-none filter blur-xl" 
      />

      {/* ── 04. Rotating Dashed Outer Circle (Clockwise) ── */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute w-[235px] h-[235px] rounded-full border border-dashed border-[#E01B22]/40 pointer-events-none"
      />

      {/* ── 05. Rotating Dotted Inner Circle (Counter-Clockwise) ── */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[185px] h-[185px] rounded-full border border-dotted border-[#E01B22]/60 pointer-events-none z-10"
      />

      {/* ── 06. Orbiting Light Dot around the Perimeter ── */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-[210px] h-[210px] rounded-full pointer-events-none z-20"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E01B22] shadow-[0_0_12px_#E01B22]" />
      </motion.div>

      {/* ── 07. Main Hub Center Core ── */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.06 : [1, 1.03, 1]
        }}
        transition={{ 
          scale: isHovered ? { duration: 0.3, ease: "easeOut" } : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`w-[210px] h-[210px] rounded-full border-2 transition-colors duration-300 bg-[#0A0607] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden z-20 ${
          isHovered 
            ? 'border-[#E01B22] shadow-[0_0_50px_rgba(224,27,34,0.4),inset_0_0_30px_rgba(224,27,34,0.2)]' 
            : 'border-[#3E2529] shadow-[0_0_35px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Radar / Grid Scan Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:10px_10px]" />

        {/* Steady Central Title Display */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
          <span className="text-5xl sm:text-6xl font-display font-black tracking-wider leading-none text-[#F7F2F2] drop-shadow-[0_0_15px_rgba(224,27,34,0.4)]">
            11
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A79798]">
            ARENAS
          </span>
          <div className="w-8 h-[2px] bg-[#E01B22] mt-1 shadow-[0_0_8px_rgba(224,27,34,0.8)]" />
        </div>
      </motion.div>

    </div>
  );
};

export default EventHub;
