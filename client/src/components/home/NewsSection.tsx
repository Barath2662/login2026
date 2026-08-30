import React from 'react';

export const NewsSection: React.FC = () => {
  const stats = [
    { label: 'TOTAL PRIZE POOL', value: '₹1,00,000', desc: 'ACROSS ALL ARENAS' },
    { label: 'COMPETITION ARENAS', value: '11 EVENTS', desc: 'TECHNICAL & NON-TECHNICAL' },
    { label: 'PARTICIPATING INSTITUTIONS', value: '100+\nCOLLEGES', desc: 'NATIONAL LEVEL' },
    { label: 'EXPECTED PARTICIPANTS', value: '1000+\nSTUDENTS', desc: 'ACROSS THE COUNTRY' },
  ];

  return (
    <section className="py-12 bg-[#0A0607] border-b border-[#2A1A1D]">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* ── SYMPOSIUM METRICS ── */}
        <div>
          {/* Section Divider & Title */}
          <div className="text-center mb-6 select-none">
            <h3 className="text-xs font-mono text-[#E01B22] font-black tracking-[0.25em] uppercase">
              SYMPOSIUM // METRICS
            </h3>
            <p className="text-[9px] text-[#6B5A5C] font-mono mt-0.5">// OPERATIONAL METRIC READOUTS</p>
          </div>

          {/* Grid Layout of Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const isPrizeCard = idx === 0;

              return (
                <div 
                  key={idx} 
                  className={`group relative p-6 rounded-[2px] transition-all duration-300 flex flex-col min-h-[220px] ${
                    isPrizeCard
                      ? 'bg-[#1A080A]/90 border-2 border-[#E01B22] shadow-[0_0_25px_rgba(224,27,34,0.35)] hover:shadow-[0_0_35px_rgba(224,27,34,0.5)] scale-[1.02]'
                      : 'bg-[#130C0E] border border-[#2A1A1D]/60 hover:border-[#E01B22]/50 hover:-translate-y-1'
                  }`}
                >
                  {/* Highlight Ribbon for 1st Prize Box */}
                  {isPrizeCard && (
                    <div className="absolute -top-3 left-4 bg-[#E01B22] text-[#F7F2F2] px-2.5 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase rounded-[1px] shadow-md">
                      ✦ CASH PRIZES
                    </div>
                  )}

                  {/* Faint Background Text for 11 Events */}
                  {idx === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <span className="text-[10px] font-mono font-black text-[#E01B22] opacity-[0.03] tracking-widest uppercase">
                        // ACTIVE ARENAS
                      </span>
                    </div>
                  )}

                  {/* Tech Label Header - TOP */}
                  <div className="flex justify-between items-center text-[9px] font-mono border-b border-[#2A1A1D]/50 pb-3 select-none">
                    <span className={isPrizeCard ? 'text-[#E01B22] font-black tracking-wider' : 'text-[#6B5A5C]'}>
                      METRIC // 0{idx + 1}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isPrizeCard
                        ? 'bg-[#E01B22] shadow-[0_0_10px_#E01B22] animate-pulse'
                        : 'bg-[#E01B22]/60 group-hover:bg-[#E01B22] group-hover:shadow-[0_0_8px_#E01B22]'
                    }`} />
                  </div>
                  
                  {/* Metric Readout - CENTER */}
                  <div className="flex-1 flex flex-col items-start justify-center py-5">
                    <span className={`block text-[8px] font-mono uppercase tracking-wider mb-2 ${
                      isPrizeCard ? 'text-[#E01B22] font-black' : 'text-[#6B5A5C]'
                    }`}>
                      {stat.label}
                    </span>
                    <strong className={`block text-3xl sm:text-[32px] leading-[1.1] font-display font-black tracking-wide transition-colors whitespace-pre-line ${
                      isPrizeCard
                        ? 'text-[#E01B22] drop-shadow-[0_0_12px_rgba(224,27,34,0.4)]'
                        : 'text-[#F7F2F2] group-hover:text-white'
                    }`}>
                      {stat.value}
                    </strong>
                  </div>

                  {/* Subtext description - BOTTOM */}
                  <div className="mt-auto">
                    <span className={`block text-[8px] font-mono uppercase tracking-widest ${
                      isPrizeCard ? 'text-[#E08A17] font-bold' : 'text-[#6B5A5C]'
                    }`}>
                      {stat.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default NewsSection;
