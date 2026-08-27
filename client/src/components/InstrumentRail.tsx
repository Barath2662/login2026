import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const InstrumentRail: React.FC = () => {
  const location = useLocation();
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Determine section name from route path
  const getSectionName = () => {
    const path = location.pathname;
    if (path === '/') return 'NODE // 01 • SECTOR // PSG • STATUS // ONLINE';
    if (path === '/events') return 'NODE // 02 • SECTOR // EVENTS • STATUS // ONLINE';
    if (path === '/timeline') return 'NODE // 03 • SECTOR // SCHEDULE • STATUS // ONLINE';
    if (path === '/about') return 'NODE // 04 • SECTOR // ABOUT • STATUS // ONLINE';
    if (path === '/dashboard') return 'NODE // 05 • SECTOR // PORTAL • STATUS // ACTIVE';
    if (path === '/coordinator') return 'NODE // 06 • SECTOR // CONTROL • STATUS // ACTIVE';
    if (path === '/admin') return 'NODE // 07 • SECTOR // ADMIN • STATUS // ACTIVE';
    return 'SYSTEM // ONLINE • EDITION // 35 • STATUS // ACTIVE';
  };

  return (
    <aside className="hidden xl:flex fixed left-0 top-20 bottom-0 w-[72px] bg-[#0A0607] border-r border-[#2A1A1D] z-30 flex-col justify-between items-center py-6 select-none pointer-events-none">
      
      {/* Scroll Progress Line (Red) */}
      <div className="w-1 bg-[#2A1A1D] h-32 rounded-full overflow-hidden relative">
        <div
          className="w-full bg-[#E01B22] transition-all duration-75"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      {/* Vertical Section Name */}
      <div 
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#6B5A5C] uppercase font-bold whitespace-nowrap"
        style={{ writingMode: 'vertical-rl' }}
      >
        {getSectionName()}
      </div>

      {/* Tick Ruler Axis */}
      <div className="flex flex-col gap-2 opacity-50">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`h-px transition-colors ${i % 4 === 0 ? 'w-4 bg-[#FF2A2A]' : 'w-2 bg-[#3E2529]'}`}
          />
        ))}
      </div>

    </aside>
  );
};
