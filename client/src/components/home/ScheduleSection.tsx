import React, { useState } from 'react';
import { Clock, MapPin, ChevronRight, Zap, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCHEDULE_DATA: Record<'DAY_01' | 'DAY_02', Array<{ time: string; title: string; type: string; venue: string; bgClass: string; accent: string; image?: string; slug?: string }>> = {
  DAY_01: [
    { time: '09:00 AM', title: 'Inauguration', type: 'GENERAL', venue: 'F block assembly hall', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22', image: '/assets/gallery-1.webp' },
    { time: '10:00 AM', title: 'Snacks', type: 'GENERAL', venue: 'F Block Canteen', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
    { time: '10:30 AM', title: 'Code Relay', type: 'TECHNICAL', venue: 'CAT Lab', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316', image: '/assets/events/code_relay.webp', slug: 'code-relay' },
    { time: '10:30 AM', title: 'Hunt your Treasure', type: 'GAMING', venue: 'K503, K504, K505', bgClass: 'from-[#0D1C16] to-[#0A0607]', accent: '#10B981', image: '/assets/events/hunt_your_treasure.webp', slug: 'hunt-your-treasure' },
    { time: '12:30 PM', title: 'Lunch', type: 'GENERAL', venue: 'F block Canteen', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
    { time: '01:30 PM', title: 'Pixel Paradox', type: 'CREATIVE', venue: 'IS Lab', bgClass: 'from-[#160A18] to-[#0A0607]', accent: '#A855F7', image: '/assets/events/pixel_paradox.webp', slug: 'pixel-paradox' },
    { time: '01:30 PM', title: 'Project Phoenix', type: 'TECHNICAL', venue: 'CAT Lab', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316', image: '/assets/events/phoenix.webp', slug: 'project-phoenix' },
    { time: '03:00 PM', title: 'In the Slot', type: 'GAMING', venue: 'F202', bgClass: 'from-[#0D1C16] to-[#0A0607]', accent: '#10B981', image: '/assets/events/in_the_slot.webp', slug: 'in-the-slot' },
    { time: '03:30 PM', title: 'Blind Coding', type: 'TECHNICAL', venue: 'CC Lab', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316', image: '/assets/events/blind_coding.webp', slug: 'blind-coding' },
  ],
  DAY_02: [
    { time: '09:30 AM', title: 'The Extraction', type: 'TECHNICAL', venue: 'CAT Lab', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316', image: '/assets/events/the_extraction.webp', slug: 'the-extraction' },
    { time: '10:00 AM', title: 'Debug Arena', type: 'TECHNICAL', venue: 'CC Lab', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316', image: '/assets/events/debug_arena.webp', slug: 'debug-arena' },
    { time: '12:30 PM', title: 'Star of Login (Round 1)', type: 'GENERAL', venue: 'F202', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22', image: '/assets/events/star_of_login.webp', slug: 'star-of-login' },
    { time: '01:00 PM', title: 'Lunch', type: 'GENERAL', venue: 'F block Canteen', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
    { time: '02:00 PM', title: 'Star of Login (Round 2)', type: 'GENERAL', venue: 'D block conference hall (Ground floor)', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22', image: '/assets/events/star_of_login.webp', slug: 'star-of-login' },
    { time: '03:30 PM', title: 'Valedictory', type: 'GENERAL', venue: 'D block conference hall (Ground floor)', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22', image: '/assets/gallery-2.webp' },
    { time: '05:00 PM', title: 'Entertainment', type: 'GAMING', venue: 'Centenary hall', bgClass: 'from-[#0D1C16] to-[#0A0607]', accent: '#10B981', image: '/assets/events/nostos.webp', slug: 'nostos' },
    { time: '07:30 PM', title: 'Dinner', type: 'GENERAL', venue: 'Near F block canteen', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
  ],
};

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'DAY_01' | 'DAY_02'>('DAY_01');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(0);
  const [direction, setDirection] = useState(1);

  const handleDaySwitch = (day: 'DAY_01' | 'DAY_02') => {
    if (day === activeDay) return;
    setDirection(day === 'DAY_02' ? 1 : -1);
    setActiveDay(day);
    setActiveIndex(0);
    setExpandedMobileIndex(0);
  };

  const toggleMobileAccordion = (idx: number) => {
    setExpandedMobileIndex(expandedMobileIndex === idx ? null : idx);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      z: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
              [ DIRECTIVE // 04 ]
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
              DAY SPOTLIGHT & SCHEDULE
            </h2>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            {/* Category Legend */}
            <div className="flex flex-wrap justify-center items-center gap-3 text-[9px] font-mono tracking-widest text-[#9A9AA2] bg-[#130C0E] border border-[#2A1A1D] px-3 py-1.5 rounded-[2px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E01B22]"></span>GENERAL</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F97316]"></span>TECHNICAL</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>CREATIVE</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>GAMING</span>
            </div>

            {/* Desktop Day Toggles */}
            <div className="hidden md:flex bg-[#130C0E] border border-[#2A1A1D] p-1 rounded-[2px] w-fit">
              {(['DAY_01', 'DAY_02'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => handleDaySwitch(day)}
                  className={`px-6 py-2.5 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeDay === day
                      ? 'bg-[#E01B22] text-[#F7F2F2] shadow-[0_0_15px_rgba(224,27,34,0.4)]'
                      : 'text-[#6B5A5C] hover:text-[#A79798]'
                  }`}
                >
                  {day.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE STICKY DAY SELECTOR ── */}
        <div className="md:hidden sticky top-16 z-30 bg-[#0A0607]/95 backdrop-blur-md py-2.5 border-y border-[#2A1A1D] flex justify-center gap-3">
          {(['DAY_01', 'DAY_02'] as const).map((day) => (
            <button
              key={day}
              onClick={() => handleDaySwitch(day)}
              className={`flex-1 py-2 text-xs font-mono font-bold tracking-widest uppercase rounded-[2px] transition-all border ${
                activeDay === day
                  ? 'bg-[#E01B22] text-[#F7F2F2] border-[#E01B22] shadow-[0_0_12px_rgba(224,27,34,0.4)]'
                  : 'bg-[#130C0E] text-[#A79798] border-[#2A1A1D]'
              }`}
            >
              {day.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* ── MOBILE VERTICAL TIMELINE + ACCORDION ── */}
        <div className="md:hidden relative pt-2 pb-6 px-1">
          {/* Continuous Left Vertical Line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-[#2A1A1D]" />

          <div className="space-y-4 relative z-10">
            {SCHEDULE_DATA[activeDay].map((item, idx) => {
              const isExpanded = expandedMobileIndex === idx;

              return (
                <div key={`mobile-item-${idx}`} className="relative pl-8">
                  
                  {/* Timeline Dot (●) */}
                  <div 
                    className="absolute left-0 top-3.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#0A0607] flex items-center justify-center shadow-md transition-transform duration-300"
                    style={{ backgroundColor: item.accent }}
                  >
                    {isExpanded && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </div>

                  {/* Time Label Header */}
                  <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] font-bold" style={{ color: item.accent }}>
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                    <span className="text-[#A79798] text-[9px] font-normal">• {item.type}</span>
                  </div>

                  {/* Accordion Card Box */}
                  <div 
                    onClick={() => toggleMobileAccordion(idx)}
                    className={`border rounded-[2px] transition-all duration-300 overflow-hidden cursor-pointer ${
                      isExpanded 
                        ? 'bg-[#130C0E] border-[#E01B22]/70 shadow-[0_0_20px_rgba(224,27,34,0.15)]' 
                        : 'bg-[#0A0607]/90 border-[#2A1A1D] hover:border-[#E01B22]/30'
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <h3 className="font-display font-black text-sm text-[#F7F2F2] tracking-wider uppercase leading-snug">
                        {item.title}
                      </h3>
                      <button className="text-[#A79798] shrink-0 p-1">
                        {isExpanded ? <Minus className="w-4 h-4 text-[#E01B22]" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Smooth Expanded Accordion Drawer */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="px-3.5 pb-4 pt-1 border-t border-[#2A1A1D]/60 space-y-3 font-mono text-xs"
                        >
                          <div className="flex items-center gap-2 text-[#A79798] text-[11px] pt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: item.accent }} />
                            <span className="uppercase tracking-wider font-semibold text-[#F7F2F2]">{item.venue}</span>
                          </div>

                          {item.slug ? (
                            <div className="pt-1">
                              <a
                                href={`/events/${item.slug}`}
                                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#E01B22] hover:text-[#FF2A2A] transition-colors"
                              >
                                <span>[ VIEW DETAILS &rarr; ]</span>
                              </a>
                            </div>
                          ) : (
                            <p className="text-[10px] text-[#A79798]">General schedule assembly block for LOGIN 2K26 participants.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP HORIZONTAL ACCORDION GALLERY ── */}
        <div className="hidden md:block relative w-full h-[450px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeDay}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 w-full h-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x"
            >
              <div className="flex flex-row w-full h-full gap-4 p-2 bg-[#130C0E]/50 border border-[#2A1A1D] rounded-[4px] backdrop-blur-sm">
                {SCHEDULE_DATA[activeDay].map((item, idx) => {
                  const isActive = activeIndex === idx;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`relative group cursor-pointer snap-center overflow-hidden rounded-[2px] transition-[flex,min-width,max-width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        isActive 
                          ? 'flex-[5] min-w-[380px] max-w-full' 
                          : 'flex-[1] min-w-[80px] max-w-[80px]'
                      }`}
                    >
                      {/* Background Image */}
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-30' : 'opacity-20 group-hover:opacity-40'}`} 
                        />
                      )}
                      
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.bgClass || 'from-[#1A0B0E] to-[#0A0607]'} ${item.image ? 'opacity-70' : 'opacity-90'}`} />
                      
                      {/* Active Glow Border */}
                      <div className={`absolute inset-0 border-2 transition-colors duration-500 ${isActive ? 'border-opacity-50' : 'border-transparent'}`} style={{ borderColor: item.accent }} />
                      
                      {/* Scanlines */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-overlay" />

                      {/* --- DESKTOP COLLAPSED STATE CONTENT --- */}
                      <div className={`absolute inset-0 flex flex-col justify-between items-center py-6 transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex flex-col items-center justify-center h-full overflow-hidden py-4">
                          <span className="font-display text-sm font-black tracking-widest text-white/90 uppercase [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-end pb-2">
                           <div className="w-[1px] h-8 bg-white/20 mb-2"></div>
                           <span className="font-mono text-[10px] font-bold tracking-widest text-[#F7F2F2]/60 whitespace-nowrap">
                             {item.time.split(' ')[0]}
                           </span>
                        </div>
                      </div>

                      {/* --- DESKTOP EXPANDED STATE CONTENT --- */}
                      <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-500 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                        
                        <div className="w-12 h-1 mb-6 rounded-full" style={{ backgroundColor: item.accent, boxShadow: `0 0 10px ${item.accent}` }} />

                        <div className="flex flex-row items-end justify-between gap-4">
                          <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase border bg-black/40 backdrop-blur-md rounded-[2px]" style={{ color: item.accent, borderColor: item.accent }}>
                              <Zap className="w-3 h-3" /> {item.type}
                            </span>
                            
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white tracking-wider uppercase leading-none drop-shadow-lg max-w-[300px] text-wrap">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-white/70 font-mono text-xs md:text-sm pt-2">
                              <MapPin className="w-4 h-4 shrink-0" style={{ color: item.accent }} />
                              <span className="uppercase tracking-widest">{item.venue}</span>
                            </div>
                            
                            <div className="pt-2">
                               <a href={item.slug ? `/events/${item.slug}` : '/events'} className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase transition-colors" style={{ color: item.accent }}>
                                 [ VIEW DETAILS &rarr; ]
                               </a>
                            </div>
                          </div>

                          <div className="shrink-0 border bg-black/60 backdrop-blur-md p-4 rounded-[2px] flex flex-col items-center justify-center min-w-[100px]" style={{ borderColor: `${item.accent}40` }}>
                            <Clock className="w-5 h-5 mb-1" style={{ color: item.accent }} />
                            <span className="font-mono text-base font-bold text-white tracking-wider">
                              {item.time.split(' ')[0]}
                            </span>
                            <span className="font-mono text-[10px] text-white/60 font-bold">
                              {item.time.split(' ')[1]}
                            </span>
                          </div>
                        </div>
                        
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Link */}
        <div className="flex justify-center pt-4">
          <a
            href="/events"
            className="group flex items-center gap-2 font-mono text-xs text-[#A79798] hover:text-[#E01B22] transition-colors uppercase tracking-widest border border-transparent hover:border-[#E01B22]/30 px-6 py-3 rounded-[2px] bg-[#130C0E]/50"
          >
            VIEW FULL EVENT DETAILS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default ScheduleSection;
