import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EventNode from './EventNode';
import EventHub from './EventHub';

interface OrbitEvent {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  category: string;
  slug: string;
}

interface EventOrbitProps {
  events: OrbitEvent[];
  isExploreHovered?: boolean;
}

export const EventOrbit: React.FC<EventOrbitProps> = ({ events, isExploreHovered = false }) => {
  const navigate = useNavigate();
  const [activeEvent, setActiveEvent] = useState<OrbitEvent | null>(null);
  const [isHubHovered, setIsHubHovered] = useState(false);
  const [activeSignalIndex, setActiveSignalIndex] = useState<number>(-1);

  // Trigger occasional signal on a random path
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeEvent && !isHubHovered && !isExploreHovered) {
        const randomIndex = Math.floor(Math.random() * events.length);
        setActiveSignalIndex(randomIndex);
        setTimeout(() => setActiveSignalIndex(-1), 1500); // Signal duration
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length, activeEvent, isHubHovered, isExploreHovered]);

  // Layout parameters for Desktop
  const center = 250; // Center X and Y of the 500x500 container
  const baseRadius = 190;
  const spreadRadius = 210;
  const radius = (isHubHovered || isExploreHovered) ? spreadRadius : baseRadius;
  const totalEvents = events.length;

  const handleNodeClick = (evt: OrbitEvent) => {
    navigate(`/events/${(evt as any).slug}`);
  };

  // Compute dynamic position for the active event preview card
  let activeCardX = center;
  let activeCardY = center;
  if (activeEvent) {
    const activeIndex = events.findIndex(e => e.id === activeEvent.id);
    if (activeIndex !== -1) {
      const angle = (activeIndex / totalEvents) * 2 * Math.PI - Math.PI / 2;
      const nodeX = center + radius * Math.cos(angle);
      const nodeY = center + radius * Math.sin(angle);
      
      const dx = center - nodeX;
      const dy = center - nodeY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const pushDist = 135; // Position card 135px towards center from node center
      
      activeCardX = nodeX + (dx / dist) * pushDist;
      activeCardY = nodeY + (dy / dist) * pushDist;
    }
  }

  return (
    <div 
      className="w-full flex items-center justify-center py-6 select-none relative"
    >
      {/* ── Desktop & Tablet Orbital view (hidden on small mobile screens) ── */}
      <div className="hidden md:block relative w-[500px] h-[500px] shrink-0 z-10">

        {/* Outer Orbit Path (Dashed) */}
        <div className="absolute w-[380px] h-[380px] top-[60px] left-[60px] rounded-full border border-dashed border-[#E01B22]/15 pointer-events-none" />

        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
          {events.map((evt, index) => {
             const angle = (index / totalEvents) * 2 * Math.PI - Math.PI / 2;
             const x = center + radius * Math.cos(angle);
             const y = center + radius * Math.sin(angle);
             const isActive = activeEvent?.id === evt.id;
             const isSignalActive = activeSignalIndex === index;
             const lineOpacity = isActive || isExploreHovered ? 0.6 : 0.15;
             const lineColor = isActive || isExploreHovered ? '#E01B22' : '#2A1A1D';

             return (
               <g key={`line-${evt.id}`}>
                 <motion.line
                   x1={center}
                   y1={center}
                   x2={x}
                   y2={y}
                   stroke={lineColor}
                   strokeWidth={isActive ? 2 : 1}
                   initial={false}
                   animate={{ opacity: lineOpacity, x2: x, y2: y }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                 />
                 {isSignalActive && (
                   <motion.circle
                     r="2"
                     fill="#E01B22"
                     initial={{ cx: center, cy: center, opacity: 1 }}
                     animate={{ cx: x, cy: y, opacity: 0 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                   />
                 )}
               </g>
             );
          })}
        </svg>

        {/* Central Hub centerpiece */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] z-20 cursor-pointer"
          onMouseEnter={() => setIsHubHovered(true)}
          onMouseLeave={() => setIsHubHovered(false)}
        >
          <EventHub
            activeEventName={activeEvent?.name}
            activeEventCategory={activeEvent ? ((activeEvent as any).detail?.quote || activeEvent.category) : undefined}
            isHovered={isHubHovered || isExploreHovered}
          />
        </div>

        {/* 11 Evenly Spaced Event Nodes */}
        {events.map((evt, index) => {
          const angle = (index / totalEvents) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = activeEvent?.id === evt.id;
          
          return (
            <EventNode
              key={evt.id}
              name={evt.shortName}
              logo={evt.logo}
              x={x}
              y={y}
              index={index}
              isActive={isActive}
              isAnyActive={!!activeEvent}
              isExploreHovered={isExploreHovered}
              onMouseEnter={() => setActiveEvent(evt)}
              onMouseLeave={() => setActiveEvent(null)}
              onClick={() => handleNodeClick(evt)}
            />
          );
        })}

        {/* Event Preview Panel */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div 
              initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.95 }}
              animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1, transition: { duration: 0.25, delay: 0.2, ease: "easeOut" } }}
              exit={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }}
              style={{ left: activeCardX, top: activeCardY }}
              className="absolute w-56 bg-[#0A0607]/95 border border-[#E01B22]/50 shadow-[0_0_20px_rgba(224,27,34,0.2)] rounded p-4 z-40 pointer-events-none backdrop-blur-md"
            >
              <h3 className="text-sm font-display font-black text-[#F7F2F2] uppercase tracking-wider mb-2 border-b border-[#E01B22]/30 pb-2">
                {activeEvent.name}
              </h3>
              <p className="text-xs font-mono text-[#A79798] mb-3 leading-relaxed">
                {(activeEvent as any).description || 'Enter the arena and prove your skills in this ultimate challenge.'}
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#E01B22]">
                <span className="uppercase">{activeEvent.category.replace('_', ' ')}</span>
                <span className="text-[#F7F2F2] bg-[#E01B22]/20 px-2 py-0.5 rounded">EXPLORE &rarr;</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile view (Grid representation instead of the full Orbit circle) ── */}
      <div className="md:hidden w-full max-w-lg px-4 space-y-6">
        {/* Simple Central Hub display on Mobile */}
        <div className="flex items-center justify-center">
          <div className="w-[120px] h-[120px] rounded-full border border-[#2A1A1D] bg-[#0A0607] flex flex-col items-center justify-center p-3 text-center shadow-[0_0_30px_rgba(224,27,34,0.1)] relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:10px_10px]" />
            <span className="text-3xl font-display font-black text-[#F7F2F2]">11</span>
            <span className="text-[9px] font-mono font-bold text-[#A79798] uppercase tracking-[0.2em] mt-0.5">ARENAS</span>
            <div className="w-5 h-[1.5px] bg-[#E01B22] mt-1.5" />
          </div>
        </div>

        {/* Responsive Grid of Event Cards */}
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3.5 pt-2">
          {events.map((evt) => (
            <button
              key={evt.id}
              onClick={() => handleNodeClick(evt)}
              className="flex flex-col items-center justify-center p-3.5 rounded-[2px] bg-[#0A0607]/80 border border-[#2A1A1D] active:border-[#E01B22] transition-colors text-center group"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-2">
                <img
                  src={evt.logo}
                  alt={evt.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/login.png';
                  }}
                  className="max-h-full max-w-full object-contain filter brightness-95 group-active:brightness-110"
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-[#A79798] group-active:text-[#F7F2F2] leading-tight block">
                {evt.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventOrbit;
