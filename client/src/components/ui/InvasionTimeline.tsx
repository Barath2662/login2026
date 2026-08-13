import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useSurvivorStore } from '../../store/survivorStore';
import { EventSkeleton } from './EventSkeleton';
import { UnifiedDossierModal } from './UnifiedDossierModal';
import { EventCard } from './EventCard';

export const InvasionTimeline = () => {
  const { isAuthenticated, registeredWorlds } = useSurvivorStore();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['invasion_events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data.events || [];
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
    const now = new Date();
    const opensAt = new Date(event.registrationOpensAt);
    const closesAt = new Date(event.registrationClosesAt);
    const isClosed = now > closesAt;
    const isUpcoming = now < opensAt;
    const isRegistered = registeredWorlds.includes(event.id);

    return { isClosed, isUpcoming, isRegistered };
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-24 px-4 overflow-hidden">
      {/* Central Glowing Line (Sticky effect via fixed tracking, but simple absolute line works for static flow) */}
      <div className="absolute top-0 bottom-0 left-[20px] md:left-1/2 w-[2px] bg-bg-secondary -translate-x-1/2 overflow-hidden z-0">
        <motion.div 
          className="w-full h-full bg-color-red-dim shadow-[0_0_15px_rgba(217,4,41,1)]"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-12 md:gap-20">
        {events.map((event: any, index: number) => {
          const { isClosed, isUpcoming, isRegistered } = getEventState(event);
          const isLeft = index % 2 === 0;

          return (
            <motion.div 
              key={event.id}
              className={`w-full md:w-5/12 ml-[40px] md:ml-0 flex flex-col ${isLeft ? 'md:self-start md:items-end' : 'md:self-end md:items-start'}`}
              initial={{ opacity: 0, x: isLeft ? -50 : 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
            >
              {/* Node indicator */}
              <div 
                className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-color-red-dim border-2 border-black -translate-x-1/2 mt-6 z-20 shadow-[0_0_10px_rgba(217,4,41,0.8)]"
              />

              {/* Event Card */}
              <EventCard 
                event={event} 
                isRegistered={isRegistered} 
                onClick={setSelectedEvent} 
                isLeftAligned={isLeft} 
              />
            </motion.div>
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
