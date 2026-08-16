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

  // Helper to check overlap
  const isOverlapping = (e1: any, e2: any) => {
    return e1.timeStart < e2.timeEnd && e1.timeEnd > e2.timeStart;
  };

  // Process and cluster events
  const clusters: any[][] = [];
  const processedEvents = (events || []).map((e: any) => {
    // Ensure consistent string format for safe sorting
    const dateStr = typeof e.date === 'string' ? e.date.split('T')[0] : String(e.date);
    return {
      ...e,
      // Create an exact ISO-like string for foolproof string comparison sorting
      sortKey: `${dateStr}T${e.start_time}`
    };
  }).sort((a: any, b: any) => {
    const aWorld = a.worldNumber || a.id;
    const bWorld = b.worldNumber || b.id;
    return aWorld - bWorld;
  });

  processedEvents.forEach((event: any) => {
    let added = false;
    for (const cluster of clusters) {
      // Basic string comparison for overlap check since they occur on the same day
      const cEvent = cluster[0];
      const sameDay = event.sortKey.split('T')[0] === cEvent.sortKey.split('T')[0];
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

  // Assign columns within each cluster to maintain parallel track alignment
  clusters.forEach((cluster, cIndex) => {
    cluster.forEach((event, idx) => {
      // If 2 events overlap, one takes left track, one takes right.
      // If 1 event, it alternates tracks based on row index.
      event.colIndex = cluster.length === 2 ? idx : (cIndex % 2); 
    });
  });

  return (
    <div className="relative w-full max-w-7xl mx-auto py-24 px-4 overflow-hidden min-h-screen">
      
      {/* TWO PARALLEL CONTINUOUS LINES (Desktop) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[calc(50%-16px)] w-[2px] bg-bg-secondary z-0">
        <motion.div 
          className="w-full h-full bg-color-red-dim shadow-[0_0_15px_rgba(217,4,41,1)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <div className="hidden md:block absolute top-0 bottom-0 left-[calc(50%+16px)] w-[2px] bg-bg-secondary z-0">
        <motion.div 
          className="w-full h-full bg-color-red-dim shadow-[0_0_15px_rgba(217,4,41,1)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* SINGLE CONTINUOUS LINE (Mobile) */}
      <div className="md:hidden absolute top-0 bottom-0 left-[20px] w-[2px] bg-bg-secondary z-0">
        <motion.div 
          className="w-full h-full bg-color-red-dim shadow-[0_0_15px_rgba(217,4,41,1)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-12 md:gap-24">
        {clusters.map((cluster, cIndex) => {
          // Hide unselected overlapping events if user registered for one
          const registeredEventInCluster = cluster.find((e: any) => registeredWorlds.includes(e.id));
          const eventsToRender = registeredEventInCluster ? [registeredEventInCluster] : cluster;

          return (
            <div key={cIndex} className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
              {eventsToRender.map((event: any, eIndex: number) => {
                const { isRegistered } = getEventState(event);
                const isLeft = event.colIndex === 0;

                return (
                  <motion.div 
                    key={event.id}
                    className={`relative w-full flex flex-col ${isLeft ? 'md:col-start-1 md:items-end' : 'md:col-start-2 md:items-start'}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: eIndex * 0.1, type: "spring", bounce: 0.4 }}
                  >
                    {/* Node indicator - Attaches to the corresponding parallel line */}
                    <div 
                      className={`
                        absolute top-[24px] w-4 h-4 rounded-full bg-color-red-dim border-2 border-black z-20 shadow-[0_0_10px_rgba(217,4,41,0.8)]
                        /* Mobile Positioning */
                        left-[20px] -translate-x-1/2
                        /* Desktop Positioning */
                        md:left-auto md:right-auto md:translate-x-0
                        ${isLeft ? 'md:right-[-16px] md:translate-x-[50%]' : 'md:left-[-16px] md:-translate-x-[50%]'}
                      `}
                    />

                    {/* Event Card */}
                    <div className={`w-full max-w-[320px] relative z-10 pl-14 md:pl-0 ${isLeft ? 'md:mr-[30px]' : 'md:ml-[30px]'}`}>
                      <EventCard 
                        event={event} 
                        isRegistered={isRegistered} 
                        onClick={setSelectedEvent} 
                        isLeftAligned={isLeft} 
                        className="bg-black/90 backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>
                );
              })}
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
