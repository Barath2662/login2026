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
        setTimeout(() => setActiveSignalIndex(-1), 1500);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length, activeEvent, isHubHovered, isExploreHovered]);

  // Layout parameters for Desktop
  const center = 330;
  const baseRadius = 245;
  const spreadRadius = 270;
  const radius = (isHubHovered || isExploreHovered) ? spreadRadius : baseRadius;
  const totalEvents = events.length;

  const handleNodeClick = (evt: OrbitEvent) => {
    navigate(`/events/${(evt as any).slug}`);
  };

  const handleHubClick = () => {
    if (activeEvent) {
      navigate(`/events/${(activeEvent as any).slug}`);
    } else {
      navigate('/events');
    }
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
      const pushDist = 175;
      
      activeCardX = nodeX + (dx / dist) * pushDist;
      activeCardY = nodeY + (dy / dist) * pushDist;
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-6 select-none relative">
      {/* ── Desktop & Tablet Orbital view (660x660 Large Animated Canvas) ── */}
      <div className="hidden md:block relative w-[660px] h-[660px] shrink-0 z-10">

        {/* Outer Orbit Path (Dashed) */}
        <motion.div 
          animate={{ rotate: isExploreHovered ? 360 : [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] top-[80px] left-[80px] rounded-full border border-dashed border-[#E01B22]/30 pointer-events-none" 
        />

        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
          {events.map((evt, index) => {
             const angle = (index / totalEvents) * 2 * Math.PI - Math.PI / 2;
             const x = center + radius * Math.cos(angle);
             const y = center + radius * Math.sin(angle);
             const isActive = activeEvent?.id === evt.id;
             const isSignalActive = activeSignalIndex === index || isActive;
             const lineOpacity = isActive ? 0.95 : isExploreHovered ? 0.6 : 0.25;
             const lineColor = isActive ? '#E01B22' : isExploreHovered ? '#E01B22' : '#3E2529';

             return (
               <g key={`line-${evt.id}`}>
                 <motion.line
                   x1={center}
                   y1={center}
                   x2={x}
                   y2={y}
                   stroke={lineColor}
                   strokeWidth={isActive ? 3 : 1.5}
                   initial={false}
                   animate={{ opacity: lineOpacity, x2: x, y2: y }}
                   transition={{ duration: 0.4, ease: "easeInOut" }}
                 />
                 {isSignalActive && (
                   <motion.circle
                     r={isActive ? "4" : "3"}
                     fill="#E01B22"
                     initial={{ cx: x, cy: y, opacity: 1 }}
                     animate={{ cx: center, cy: center, opacity: isActive ? 0.8 : 0 }}
                     transition={{ duration: isActive ? 1 : 1.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                   />
                 )}
               </g>
             );
          })}
        </svg>

        {/* Central Hub centerpiece */}
        <div 
          onMouseEnter={() => setIsHubHovered(true)}
          onMouseLeave={() => setIsHubHovered(false)}
        >
          <EventHub
            isHovered={isHubHovered || isExploreHovered}
            onClick={handleHubClick}
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

        {/* Event Preview Floating Card */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div 
              initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.85 }}
              animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
              exit={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.85 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              style={{ left: activeCardX, top: activeCardY }}
              className="absolute w-64 bg-[#0A0607]/95 border-2 border-[#E01B22] shadow-[0_0_35px_rgba(224,27,34,0.4)] rounded-[2px] p-4 z-40 cursor-pointer backdrop-blur-md"
              onClick={() => handleNodeClick(activeEvent)}
            >
              <h3 className="text-sm font-display font-black text-[#F7F2F2] uppercase tracking-wider mb-1.5 border-b border-[#E01B22]/40 pb-1.5 flex items-center justify-between">
                <span>{activeEvent.name}</span>
                <span className="text-xs text-[#E01B22]">&rarr;</span>
              </h3>
              <p className="text-xs font-mono text-[#A79798] mb-3 leading-relaxed line-clamp-2">
                {(activeEvent as any).description || 'Enter the arena and prove your skills in this ultimate challenge.'}
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#E01B22]">
                <span className="uppercase bg-[#E01B22]/15 px-2 py-0.5 rounded border border-[#E01B22]/30">{activeEvent.category.replace('_', ' ')}</span>
                <span className="text-[#F7F2F2] bg-[#E01B22] px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-extrabold shadow-md">ENTER ARENA</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile View: Perfectly Symmetrical & Uniform 2-Column Grid ── */}
      <div className="md:hidden w-full max-w-md px-3 space-y-5">
        
        {/* Central Hub Counter Badge */}
        <div className="flex items-center justify-center">
          <div 
            className="w-[130px] h-[130px] rounded-full border-2 border-[#E01B22] bg-[#0A0607] flex flex-col items-center justify-center p-3 text-center shadow-[0_0_30px_rgba(224,27,34,0.3)] relative cursor-pointer group active:scale-95 transition-transform"
            onClick={handleHubClick}
          >
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:10px_10px]" />
            <span className="text-4xl font-display font-black text-[#F7F2F2]">11</span>
            <span className="text-[9px] font-mono font-bold text-[#A79798] uppercase tracking-[0.2em] mt-0.5">ARENAS</span>
            <div className="w-6 h-[2px] bg-[#E01B22] mt-1 shadow-[0_0_8px_rgba(224,27,34,0.8)]" />
          </div>
        </div>

        {/* Uniform Grid of Event Cards */}
        <motion.div 
          className="grid grid-cols-2 gap-3 pt-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {events.map((evt, idx) => {
            const isLastSingle = (events.length % 2 !== 0) && (idx === events.length - 1);

            return (
              <motion.button
                key={evt.id}
                onClick={() => handleNodeClick(evt)}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 10 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
                className={`h-[110px] w-full flex flex-col items-center justify-center p-3 rounded-[2px] bg-[#0A0607]/90 border border-[#2A1A1D] active:border-[#E01B22] hover:border-[#E01B22]/60 transition-all text-center group ${
                  isLastSingle ? 'col-span-2 max-w-[200px] justify-self-center' : ''
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-1.5 shrink-0">
                  <img
                    src={evt.logo}
                    alt={evt.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/login.webp';
                    }}
                    className="max-h-full max-w-full object-contain filter brightness-110 group-active:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-mono font-black text-[#F7F2F2] leading-tight block uppercase tracking-wider group-hover:text-[#E01B22] transition-colors line-clamp-1">
                  {evt.shortName}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default EventOrbit;
