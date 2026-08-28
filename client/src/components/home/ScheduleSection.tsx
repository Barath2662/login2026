import React, { useState } from 'react';
import { Clock, MapPin, ChevronRight, Zap } from 'lucide-react';

const SCHEDULE_DATA: Record<'DAY_01' | 'DAY_02', Array<{ time: string; title: string; type: string; venue: string; bgClass: string; accent: string }>> = {
  DAY_01: [
    { time: '08:30 AM', title: 'Inauguration Ceremony', type: 'GENERAL', venue: 'F-Block Auditorium', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
    { time: '10:00 AM', title: 'Star of LOGIN Prelims', type: 'FLAGSHIP', venue: 'MCA Lab', bgClass: 'from-[#1C0D10] to-[#0A0607]', accent: '#F59E0B' },
    { time: '11:30 AM', title: 'Net Hunt (Online)', type: 'TECHNICAL', venue: 'Lab 4', bgClass: 'from-[#13111C] to-[#0A0607]', accent: '#6366F1' },
    { time: '02:00 PM', title: 'Pitch Perfect (Case Study)', type: 'TECHNICAL', venue: 'Seminar Hall', bgClass: 'from-[#0D1C16] to-[#0A0607]', accent: '#10B981' },
  ],
  DAY_02: [
    { time: '09:00 AM', title: 'Star of LOGIN Finals', type: 'FLAGSHIP', venue: 'F-Block Auditorium', bgClass: 'from-[#1C0D10] to-[#0A0607]', accent: '#F59E0B' },
    { time: '10:30 AM', title: 'Code Storm', type: 'TECHNICAL', venue: 'MCA Lab', bgClass: 'from-[#13111C] to-[#0A0607]', accent: '#6366F1' },
    { time: '01:30 PM', title: 'Workshop on Edge Computing', type: 'WORKSHOP', venue: 'IT Seminar Hall', bgClass: 'from-[#1C140D] to-[#0A0607]', accent: '#F97316' },
    { time: '03:30 PM', title: 'Valedictory & Prize Distribution', type: 'GENERAL', venue: 'F-Block Auditorium', bgClass: 'from-[#1A0B0E] to-[#0A0607]', accent: '#E01B22' },
  ],
};

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'DAY_01' | 'DAY_02'>('DAY_01');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="py-24 px-4 bg-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
              [ DIRECTIVE // 04 ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
              DAY SPOTLIGHT & SCHEDULE
            </h2>
          </div>
          
          {/* Day Toggles */}
          <div className="flex bg-[#130C0E] border border-[#2A1A1D] p-1 rounded-[2px]">
            {(['DAY_01', 'DAY_02'] as const).map((day) => (
              <button
                key={day}
                onClick={() => { setActiveDay(day); setActiveIndex(0); }}
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

        {/* ACCORDION GALLERY */}
        <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[450px] gap-2 md:gap-4 p-2 bg-[#130C0E]/50 border border-[#2A1A1D] rounded-[4px] backdrop-blur-sm">
          {SCHEDULE_DATA[activeDay].map((item, idx) => {
            const isActive = activeIndex === idx;
            
            return (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative group cursor-pointer overflow-hidden rounded-[2px] transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isActive ? 'flex-[4] md:flex-[5]' : 'flex-[1] md:flex-[1]'
                }`}
              >
                {/* Background Gradient & Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgClass} opacity-80`} />
                
                {/* Active Glow Border */}
                <div className={`absolute inset-0 border-2 transition-colors duration-500 ${isActive ? 'border-opacity-50' : 'border-transparent'}`} style={{ borderColor: item.accent }} />
                
                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-overlay" />

                {/* --- COLLAPSED STATE CONTENT (Vertical Text) --- */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  {/* Desktop Vertical Text */}
                  <div className="hidden md:flex flex-col items-center gap-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-white/50 -rotate-90 whitespace-nowrap mb-8">
                      {item.time}
                    </span>
                    <span className="font-display text-lg font-bold tracking-widest text-white/80 -rotate-90 whitespace-nowrap uppercase">
                      {item.title}
                    </span>
                  </div>
                  {/* Mobile Horizontal Text (when collapsed) */}
                  <div className="md:hidden flex items-center justify-between w-full px-6">
                    <span className="font-display text-sm font-bold tracking-widest text-white/80 uppercase truncate">
                      {item.title}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#E01B22]">
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* --- EXPANDED STATE CONTENT --- */}
                <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                  
                  {/* Glowing Accent Line */}
                  <div className="w-12 h-1 mb-6 rounded-full" style={{ backgroundColor: item.accent, boxShadow: `0 0 10px ${item.accent}` }} />

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-3">
                      {/* Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase border bg-black/40 backdrop-blur-md rounded-[2px]" style={{ color: item.accent, borderColor: item.accent }}>
                        <Zap className="w-3 h-3" /> {item.type}
                      </span>
                      
                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white tracking-wider uppercase leading-none drop-shadow-lg">
                        {item.title}
                      </h3>
                      
                      {/* Venue */}
                      <div className="flex items-center gap-2 text-white/70 font-mono text-xs md:text-sm">
                        <MapPin className="w-4 h-4" style={{ color: item.accent }} />
                        <span className="uppercase tracking-widest">{item.venue}</span>
                      </div>
                    </div>

                    {/* Time Box */}
                    <div className="shrink-0 border bg-black/60 backdrop-blur-md p-3 md:p-4 rounded-[2px] flex flex-col items-center justify-center min-w-[120px]" style={{ borderColor: `${item.accent}40` }}>
                      <Clock className="w-5 h-5 mb-1" style={{ color: item.accent }} />
                      <span className="font-mono text-sm md:text-base font-bold text-white tracking-wider">
                        {item.time.split(' ')[0]}
                      </span>
                      <span className="font-mono text-[10px] text-white/60 font-bold">
                        {item.time.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                  
                </div>

              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="flex justify-center pt-4">
          <a
            href="/timeline"
            className="group flex items-center gap-2 font-mono text-xs text-[#A79798] hover:text-[#E01B22] transition-colors uppercase tracking-widest border border-transparent hover:border-[#E01B22]/30 px-6 py-3 rounded-[2px] bg-[#130C0E]/50"
          >
            Access Full Database <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};
