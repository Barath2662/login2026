import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import eventsData from '../../data/events.json';
import { EventOrbit } from '../events/EventOrbit';

// Static event metadata representing the 11 arenas
const STATIC_EVENTS = [
  { id: 1, name: "NOSTOS: The Journey Home", shortName: "Nostos", logo: "/assets/events/nostos.png", category: "NON_TECHNICAL", slug: "nostos" },
  { id: 2, name: "Code Relay", shortName: "Code Relay", logo: "/assets/events/code_relay.png", category: "TECHNICAL", slug: "code-relay" },
  { id: 3, name: "In The Slot", shortName: "In The Slot", logo: "/assets/events/in_the_slot.png", category: "NON_TECHNICAL", slug: "in-the-slot" },
  { id: 4, name: "Debug Arena", shortName: "Debug Arena", logo: "/assets/events/debug_arena.png", category: "TECHNICAL", slug: "debug-arena" },
  { id: 5, name: "CodeXcape", shortName: "CodeXcape", logo: "/assets/events/code_x_cape.png", category: "TECHNICAL", slug: "codexcape" },
  { id: 6, name: "Blind Coding", shortName: "Blind Coding", logo: "/assets/events/blind_coding.png", category: "TECHNICAL", slug: "blind-coding" },
  { id: 7, name: "The Extraction", shortName: "The Extraction", logo: "/assets/events/the_extraction.png", category: "TECHNICAL", slug: "the-extraction" },
  { id: 8, name: "Pixel Paradox: AI or Reality?", shortName: "Pixel Paradox", logo: "/assets/events/pixel_paradox.png", category: "NON_TECHNICAL", slug: "pixel-paradox" },
  { id: 9, name: "Project Phoenix: System Recovery", shortName: "Proj Phoenix", logo: "/assets/events/phoenix.png", category: "TECHNICAL", slug: "project-phoenix" },
  { id: 10, name: "Hunt your Treasure — QR Escape Challenge", shortName: "QR Hunt", logo: "/assets/events/hunt_your_treasure.png", category: "NON_TECHNICAL", slug: "hunt-your-treasure" },
  { id: 11, name: "Star of LOGIN", shortName: "Star of LOGIN", logo: "/assets/events/star_of_login.png", category: "TECHNICAL", slug: "star-of-login" }
];

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState(STATIC_EVENTS);

  useEffect(() => {
    if (eventsData && eventsData.length > 0) {
      const updated = STATIC_EVENTS.map(item => {
        const matched = eventsData.find((e: any) => {
          const nameDb = e.name.toLowerCase();
          const nameStatic = item.name.toLowerCase();
          return nameDb.includes(nameStatic) || nameStatic.includes(nameDb) || 
                 (nameStatic.includes('qr') && nameDb.includes('treasure')) ||
                 (nameStatic.includes('phoenix') && nameDb.includes('phoenix'));
        });
        return matched ? { ...item, id: matched.id, category: matched.category, slug: matched.slug } : item;
      });
      setEvents(updated);
    }
  }, []);

  return (
    <section id="events-section" className="py-24 px-4 bg-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* 1. Left — Introduction (25% on desktop) */}
          <div className="lg:col-span-3 space-y-4 text-center lg:text-left select-none">
            <span className="font-mono text-[11px] text-[#E01B22] font-black tracking-[0.25em] block">
              [ DIRECTIVE // 02 ]
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase leading-none">
              11 COMPETITION <br className="hidden lg:block" />
              <span className="text-[#E01B22]">ARENAS</span>
            </h2>
            <p className="text-sm text-[#A79798] leading-relaxed font-body font-medium max-w-[28ch] mx-auto lg:mx-0">
              Eleven battlegrounds. <br />
              One ultimate challenge. <br />
              Are you ready?
            </p>
          </div>

          {/* 2. Center — Circular Event System (50% on desktop) */}
          <div className="lg:col-span-6 flex justify-center">
            <EventOrbit events={events} />
          </div>

          {/* 3. Right — CTA Link (25% on desktop) */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#E01B22] hover:text-[#FF2A2A] font-bold group tracking-wider transition-colors duration-300"
            >
              EXPLORE ALL EVENTS 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventsSection;
