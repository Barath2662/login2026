import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

export const EventOrbit: React.FC<EventOrbitProps> = ({ events }) => {
  const navigate = useNavigate();
  const [activeEvent, setActiveEvent] = useState<OrbitEvent | null>(null);
  
  // Animation state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = React.useRef<number>(0);

  const animate = () => {
    if (!isHovered) {
      setRotationAngle(prev => (prev + 0.002) % (2 * Math.PI));
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isHovered]);

  // Layout parameters for Desktop
  const center = 250; // Center X and Y of the 500x500 container
  const radius = 190; // Orbital radius
  const totalEvents = events.length;

  const handleNodeClick = (evt: OrbitEvent) => {
    navigate(`/events/${(evt as any).slug}`);
  };

  return (
    <div 
      className="w-full flex items-center justify-center py-6 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Desktop & Tablet Orbital view (hidden on small mobile screens) ── */}
      <div className="hidden md:block relative w-[500px] h-[500px] shrink-0">
        
        {/* Faint Inner Ring 2 */}
        <div className="absolute w-[220px] h-[220px] top-[140px] left-[140px] rounded-full border border-[#2A1A1D]/30 pointer-events-none" />

        {/* Faint Inner Ring 1 */}
        <div className="absolute w-[300px] h-[300px] top-[100px] left-[100px] rounded-full border border-[#2A1A1D]/50 pointer-events-none" />

        {/* Outer Orbit Path (Dashed) */}
        <div className="absolute w-[380px] h-[380px] top-[60px] left-[60px] rounded-full border border-dashed border-[#E01B22]/15 pointer-events-none" />

        {/* Orbit Indicator Dots */}
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E01B22]/55 pointer-events-none animate-pulse" />
        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E01B22]/55 pointer-events-none animate-pulse" />
        <div className="absolute left-[60px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E01B22]/55 pointer-events-none animate-pulse" />
        <div className="absolute right-[60px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E01B22]/55 pointer-events-none animate-pulse" />

        {/* Central Hub centerpiece */}
        <EventHub
          activeEventName={activeEvent?.name}
          activeEventCategory={activeEvent ? ((activeEvent as any).detail?.quote || activeEvent.category) : undefined}
        />

        {/* 11 Evenly Spaced Event Nodes */}
        {events.map((evt, index) => {
          // Calculate positions dynamically using trigonometry
          // Add rotationAngle to make them orbit over time
          const angle = (index / totalEvents) * 2 * Math.PI - Math.PI / 2 + rotationAngle;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          return (
            <EventNode
              key={evt.id}
              name={evt.shortName}
              logo={evt.logo}
              x={x}
              y={y}
              isActive={activeEvent?.id === evt.id}
              onMouseEnter={() => setActiveEvent(evt)}
              onMouseLeave={() => setActiveEvent(null)}
              onClick={() => handleNodeClick(evt)}
            />
          );
        })}
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
