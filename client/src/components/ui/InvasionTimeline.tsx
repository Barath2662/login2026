import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useSurvivorStore } from '../../store/survivorStore';
import { EventSkeleton } from './EventSkeleton';
import { UnifiedDossierModal } from './UnifiedDossierModal';
import { EventCard } from './EventCard';

export const InvasionTimeline = () => {
  const { registeredWorlds } = useSurvivorStore();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['invasion_events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return Array.isArray(res.data) ? res.data : (res.data.events || []);
    },
    retry: 2
  });

  if (isLoading) {
    return <EventSkeleton />;
  }

  if (isError || !events) {
    return (
      <div className="w-full py-20 text-center flex flex-col items-center">
        <p className="text-color-red font-mono mb-4 text-xl tracking-widest">CRITICAL ERROR: TIMELINE DATA CORRUPT</p>
        <p className="text-text-secondary">Failed to establish connection with the central archive.</p>
      </div>
    );
  }

  const getEventState = (event: any) => {
    const isRegistered = registeredWorlds.includes(event.id);
    return { isRegistered };
  };

  // Deduplicate events by ID or normalized name
  const uniqueEvents = (events || []).filter((e: any, index: number, self: any[]) =>
    index === self.findIndex((t: any) => t.id === e.id || t.name.toLowerCase().trim() === e.name.toLowerCase().trim())
  );

  // Separate Star of Login (Marquee Event) from regular events
  const starOfLogin = uniqueEvents.find(
    (e: any) => e.is_flagship || e.name.toLowerCase().includes('star of login')
  );

  const regularEvents = uniqueEvents.filter(
    (e: any) => !e.is_flagship && !e.name.toLowerCase().includes('star of login')
  );

  // Group regular events by Day and Overlapping Time Slot into same-row clusters
  const clusters: any[][] = [];
  const processedEvents = regularEvents.map((e: any) => {
    const dateStr = typeof e.date === 'string' ? e.date.split('T')[0] : String(e.date);
    return {
      ...e,
      sortKey: `${dateStr}T${e.start_time}`
    };
  }).sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey));

  processedEvents.forEach((event: any) => {
    let added = false;
    for (const cluster of clusters) {
      const cEvent = cluster[0];
      const sameDay = event.sortKey.split('T')[0] === cEvent.sortKey.split('T')[0];
      // Check if events overlap in time (occur in the same time window)
      if (sameDay && event.start_time < cEvent.end_time && event.end_time > cEvent.start_time) {
        cluster.push(event);
        added = true;
        break;
      }
    }
    if (!added) {
      clusters.push([event]);
    }
  });

  // Assign column index within each same-row cluster
  clusters.forEach((cluster) => {
    cluster.forEach((event, idx) => {
      event.colIndex = idx;
    });
  });

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 overflow-hidden min-h-screen">
      
      {/* STAR OF LOGIN — MARQUEE EVENT SECTION */}
      {starOfLogin && (
        <div className="mb-16 w-full max-w-5xl mx-auto bg-gradient-to-r from-[#3A0307]/90 via-[#130608] to-[#3A0307]/90 border-2 border-color-red p-6 sm:p-8 rounded-sm shadow-[0_0_35px_rgba(239,35,60,0.4)] relative overflow-hidden z-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-color-red/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 text-left w-full">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-color-red text-white font-mono text-xs font-bold rounded-sm tracking-widest uppercase shadow-md">
                  ★ FLAGSHIP MARQUEE EVENT
                </span>
                <span className="text-xs font-mono text-[#E08A17] font-semibold border border-[#E08A17]/40 px-2 py-0.5 rounded-sm">
                  INVITE-ONLY TOURNAMENT
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-wider">
                {starOfLogin.name}
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed">
                {starOfLogin.description}
              </p>

              {/* Explicit Qualification Notice as requested */}
              <div className="bg-black/80 p-4 border-l-4 border-color-red rounded-r-sm space-y-1">
                <p className="text-xs font-mono font-bold text-[#FF2A2A] uppercase tracking-wider">
                  ⚠️ PARTICIPATION RULE & QUALIFICATION NOTICE
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Only the winners of other symposium events qualify to play in the Star of Login. Event coordinators will communicate directly with qualified participants.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted pt-2 border-t border-border-color/50">
                <span>🗓 19.09.2026 (Day 2)</span>
                <span>🕒 {starOfLogin.start_time?.slice(0,5)} - {starOfLogin.end_time?.slice(0,5)} IST</span>
                <span>📍 Venue: {starOfLogin.venue}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TWO PARALLEL CONTINUOUS LINES (Desktop) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[calc(50%-16px)] w-[2px] bg-border-color z-0">
        <motion.div 
          className="w-full h-full bg-color-red shadow-[0_0_8px_rgba(239,35,60,0.8)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <div className="hidden md:block absolute top-0 bottom-0 left-[calc(50%+16px)] w-[2px] bg-border-color z-0">
        <motion.div 
          className="w-full h-full bg-color-red shadow-[0_0_8px_rgba(239,35,60,0.8)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* SINGLE CONTINUOUS LINE (Mobile) */}
      <div className="md:hidden absolute top-0 bottom-0 left-[20px] w-[2px] bg-border-color z-0">
        <motion.div 
          className="w-full h-full bg-color-red shadow-[0_0_8px_rgba(239,35,60,0.8)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-12 md:gap-16">
        {clusters.map((cluster, cIndex) => {
          const registeredEventInCluster = cluster.find((e: any) => registeredWorlds.includes(e.id));
          const eventsToRender = registeredEventInCluster ? [registeredEventInCluster] : cluster;

          const gridColsClass = eventsToRender.length === 3 
            ? 'grid-cols-1 md:grid-cols-3' 
            : eventsToRender.length === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2';

          return (
            <div key={cIndex} className="w-full space-y-3">
              <div className={`w-full grid ${gridColsClass} gap-6 md:gap-8 relative`}>
                {eventsToRender.map((event: any, eIndex: number) => {
                  const { isRegistered } = getEventState(event);
                  const isLeft = event.colIndex === 0;

                  return (
                    <motion.div 
                      key={event.id}
                      className="relative w-full flex flex-col items-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, delay: eIndex * 0.1 }}
                    >
                      <div className="w-full relative z-10">
                        <EventCard 
                          event={event} 
                          isRegistered={isRegistered} 
                          onClick={setSelectedEvent} 
                          isLeftAligned={isLeft} 
                          className="bg-black/90 backdrop-blur-sm h-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <UnifiedDossierModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
      />
    </div>
  );
};
