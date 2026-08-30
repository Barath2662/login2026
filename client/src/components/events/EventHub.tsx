import React from 'react';
import { motion } from 'framer-motion';

interface EventHubProps {
  activeEventName?: string;
  activeEventCategory?: string;
  isHovered?: boolean;
}

export const EventHub: React.FC<EventHubProps> = ({
  activeEventName,
  activeEventCategory,
  isHovered,
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none select-none">
      {/* Outer subtle glow */}
      <div className={`absolute w-[180px] h-[180px] rounded-full transition-colors duration-500 ${isHovered ? 'bg-[radial-gradient(circle_at_center,_rgba(224,27,34,0.25)_0%,_transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,_rgba(224,27,34,0.14)_0%,_transparent_70%)]'}`} />

      {/* Main Hub Container with breathing animation */}
      <motion.div 
        animate={{ scale: isHovered ? 1.05 : [1, 1.02, 1] }}
        transition={{ 
          scale: isHovered ? { duration: 0.3, ease: "easeOut" } : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`w-[150px] h-[150px] rounded-full border transition-colors duration-500 bg-[#0A0607] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden ${isHovered ? 'border-[#E01B22]/50 shadow-[0_0_50px_rgba(224,27,34,0.15),inset_0_0_30px_rgba(224,27,34,0.1)]' : 'border-[#2A1A1D] shadow-[0_0_40px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(224,27,34,0.05)]'}`}
      >
        {/* Faint Grid Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:10px_10px]" />

        {/* Inner Hub Ring */}
        <div className={`absolute inset-2 rounded-full border transition-colors duration-500 ${isHovered ? 'border-[#E01B22]/30' : 'border-[#2A1A1D]/40'}`} />

        {/* Text Area */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
          {activeEventName ? (
            <>
              {/* Dynamic info on Hover */}
              <span className="text-[9px] font-mono font-bold text-[#E01B22] uppercase tracking-[0.15em]">
                {activeEventCategory || 'ARENA'}
              </span>
              <span className="text-sm font-display font-black text-[#F7F2F2] uppercase tracking-wider line-clamp-2 max-w-[110px] leading-tight mt-1">
                {activeEventName}
              </span>
              <div className="w-6 h-[1.5px] bg-[#E01B22] mt-1.5" />
            </>
          ) : (
            <>
              {/* Default central title */}
              <span className={`text-4xl sm:text-5xl font-display font-black tracking-wider leading-none transition-colors duration-300 ${isHovered ? 'text-[#ffffff]' : 'text-[#F7F2F2]'}`}>
                11
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] mt-0.5 transition-colors duration-300 ${isHovered ? 'text-[#F7F2F2]' : 'text-[#A79798]'}`}>
                ARENAS
              </span>
              <div className="w-7 h-[2px] bg-[#E01B22] mt-2" />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventHub;
