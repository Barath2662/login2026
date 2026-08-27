import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const MILESTONES = [
  {
    code: "SYSTEM ONLINE",
    title: "Registration Opens",
    date: "AUG 20",
    desc: "Create your LOGIN identity and secure your place in the arena.",
    status: "COMPLETED"
  },
  {
    code: "ASSEMBLE THE SQUAD",
    title: "Team Formation",
    date: "SEP 01 — SEP 18",
    desc: "Build your crew and synchronize team coordinates.",
    status: "ACTIVE"
  },
  {
    code: "FINAL LOCKDOWN",
    title: "Registration Closes",
    date: "SEP 20",
    desc: "All roster changes and entries are permanently locked.",
    status: "LOCKING"
  },
  {
    code: "ARENAS REVEALED",
    title: "Event Schedules",
    date: "SEP 25",
    desc: "Unlock detailed timings, rules, and event briefings.",
    status: "STANDBY"
  },
  {
    code: "IGNITION",
    title: "DAY 01 // Competitions",
    date: "OCT 01",
    desc: "The system activates. First wave of contests commences.",
    status: "STANDBY"
  },
  {
    code: "SURVIVAL",
    title: "DAY 02 // Final Rounds",
    date: "OCT 02",
    desc: "Elimination brackets tighten. Only the absolute strongest survive.",
    status: "STANDBY"
  },
  {
    code: "THE LAST HUMAN",
    title: "Grand Finale",
    date: "OCT 02",
    desc: "The final logic showdown. The champion is crowned.",
    status: "STANDBY"
  }
];

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the container relative to the viewport center
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="timeline-section" className="py-24 px-4 bg-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 select-none">
          <span className="font-mono text-[11px] text-[#E01B22] font-black tracking-[0.25em] block">
            [ DIRECTIVE // 03 ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            SYMPOSIUM TIMELINE
          </h2>
          <p className="text-xs text-[#A79798] font-mono uppercase tracking-[0.15em] max-w-sm mx-auto">
            Follow the path to LOGIN 2K26.
          </p>
        </div>

        {/* Scrollable Timeline Path */}
        <div ref={containerRef} className="relative mt-20">
          
          {/* Central Vertical Tracking Line (Desktop: centered; Mobile: shifted to 24px) */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#2A1A1D] -translate-x-1/2 z-10">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-[#E01B22] origin-top shadow-[0_0_10px_rgba(224,27,34,0.6)]"
              style={{ scaleY, height: '100%' }}
            />
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            {MILESTONES.map((milestone, idx) => (
              <TimelineItem key={idx} item={milestone} index={idx} />
            ))}
          </div>

          {/* System Complete Bottom Node */}
          <div className="relative flex justify-start md:justify-center pl-[24px] md:pl-0 pt-16 z-20">
            <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-[#E01B22] bg-[#0A0607] flex items-center justify-center shadow-[0_0_15px_rgba(224,27,34,0.5)]">
                <div className="w-2 h-2 rounded-full bg-[#E01B22]" />
              </div>
              <span className="font-mono text-[9px] font-bold text-[#E01B22] uppercase tracking-[0.25em] ml-8 md:ml-0 md:absolute md:top-8 md:whitespace-nowrap">
                ◉ SYSTEM COMPLETE
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

interface TimelineItemProps {
  item: typeof MILESTONES[0];
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Detect if item is around viewport center
  const isInView = useInView(ref, { once: false, amount: 0.35 });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative min-h-[45vh] md:min-h-[60vh] flex flex-col justify-center py-6">
      
      {/* ── Desktop & Tablet alternating grid ── */}
      <div className="hidden md:grid grid-cols-9 items-center w-full">
        {/* Left column (milestones on even index) */}
        <div className="col-span-4 pr-16">
          {isEven && <TimelineContent item={item} index={index} isInView={isInView} />}
        </div>

        {/* Center dot column */}
        <div className="col-span-1 flex justify-center items-center z-20">
          <div
            className={`w-4.5 h-4.5 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
              isInView
                ? 'bg-[#E01B22] border-[#E01B22] shadow-[0_0_15px_rgba(224,27,34,0.9)] scale-125'
                : 'bg-[#0A0607] border-[#2A1A1D]'
            }`}
          >
            {isInView && <div className="w-1.5 h-1.5 rounded-full bg-[#F7F2F2]" />}
          </div>
        </div>

        {/* Right column (milestones on odd index) */}
        <div className="col-span-4 pl-16">
          {!isEven && <TimelineContent item={item} index={index} isInView={isInView} alignLeftOnDesktop />}
        </div>
      </div>

      {/* ── Mobile simple left-aligned vertical layout ── */}
      <div className="md:hidden pl-14 pr-4 text-left relative">
        {/* Dot aligned at absolute left 24px */}
        <div className="absolute left-[24px] top-[6px] -translate-x-1/2 z-20">
          <div
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              isInView
                ? 'bg-[#E01B22] border-[#E01B22] shadow-[0_0_12px_rgba(224,27,34,0.6)] scale-110'
                : 'bg-[#0A0607] border-[#2A1A1D]'
            }`}
          >
            {isInView && <div className="w-1.5 h-1.5 rounded-full bg-[#F7F2F2]" />}
          </div>
        </div>

        <TimelineContent item={item} index={index} isInView={isInView} alignLeftOnDesktop />
      </div>
    </div>
  );
};

interface TimelineContentProps {
  item: typeof MILESTONES[0];
  index: number;
  isInView: boolean;
  alignLeftOnDesktop?: boolean;
}

const TimelineContent: React.FC<TimelineContentProps> = ({ item, index, isInView, alignLeftOnDesktop }) => {
  const alignClass = alignLeftOnDesktop 
    ? 'text-left items-start' 
    : 'text-left md:text-right items-start md:items-end';

  const justifyClass = alignLeftOnDesktop
    ? 'justify-start'
    : 'justify-start md:justify-end';

  return (
    <div className={`flex flex-col ${alignClass} space-y-2 transition-all duration-750 transform ${
      isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 translate-y-6 scale-95'
    }`}>
      {/* Code index and Status indicator */}
      <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#E01B22] ${justifyClass}`}>
        <span>0{index + 1} // {item.code}</span>
        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold rounded-[1px] border ${
          item.status === 'ACTIVE' 
            ? 'bg-[#E01B22]/10 border-[#E01B22]/40 text-[#E01B22]' 
            : item.status === 'COMPLETED'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : item.status === 'LOCKING'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-[#2A1A1D]/40 border-[#2A1A1D]/60 text-[#A79798]'
        }`}>
          {item.status}
        </span>
      </div>

      {/* Main Title */}
      <h3 className="text-xl sm:text-2xl font-display font-black text-[#F7F2F2] tracking-wider uppercase leading-none">
        {item.title}
      </h3>

      {/* Date */}
      <p className="text-xs font-mono font-bold tracking-[0.15em] text-[#B8B2B2] uppercase">
        {item.date}
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed font-body font-medium max-w-[38ch]">
        {item.desc}
      </p>
    </div>
  );
};

export default TimelineSection;
