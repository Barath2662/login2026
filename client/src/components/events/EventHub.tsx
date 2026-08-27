import React from 'react';

interface EventHubProps {
  activeEventName?: string;
  activeEventCategory?: string;
}

export const EventHub: React.FC<EventHubProps> = ({
  activeEventName,
  activeEventCategory,
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none select-none">
      {/* Outer subtle glow */}
      <div className="absolute w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(224,27,34,0.14)_0%,_transparent_70%)] animate-pulse duration-4000" />

      {/* Main Hub Container */}
      <div className="w-[150px] h-[150px] rounded-full border border-[#2A1A1D] bg-[#0A0607] flex flex-col items-center justify-center p-3 text-center shadow-[0_0_40px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(224,27,34,0.05)] relative overflow-hidden">
        {/* Faint Grid Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:10px_10px]" />

        {/* Inner Hub Ring */}
        <div className="absolute inset-2 rounded-full border border-[#2A1A1D]/40" />

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
              <span className="text-4xl sm:text-5xl font-display font-black text-[#F7F2F2] tracking-wider leading-none">
                11
              </span>
              <span className="text-[10px] font-mono font-bold text-[#A79798] uppercase tracking-[0.25em] mt-0.5">
                ARENAS
              </span>
              <div className="w-7 h-[2px] bg-[#E01B22] mt-2" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHub;
