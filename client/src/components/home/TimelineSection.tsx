import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { LogIn, FileText, Users, Trophy } from 'lucide-react';

const MILESTONES = [
  {
    icon: LogIn,
    title: "Registration Opens",
    date: "07",
    monthYear: "JUN 2026",
    desc: "Portal goes live. Assemble your team and lock in your spot before it fills up.",
    status: "COMPLETED",
    isGrandFinal: false
  },
  {
    icon: FileText,
    title: "Idea (PPT) Submission",
    date: "25",
    monthYear: "JUL 2026",
    desc: "Final date to submit your initial idea and presentation deck.",
    status: "ACTIVE",
    isGrandFinal: false
  },
  {
    icon: Users,
    title: "Shortlisted Teams Announced",
    date: "07",
    monthYear: "AUG 2026",
    desc: "Selected teams notified and briefed on problem statement and next round.",
    status: "STANDBY",
    isGrandFinal: false
  },
  {
    icon: Trophy,
    title: "Grand Final",
    date: "14",
    monthYear: "AUG 2026",
    desc: "24 hours of intense hacking, live judging by industry experts, and the grand award ceremony.",
    status: "STANDBY",
    isGrandFinal: true
  }
];

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
          <span className="font-mono text-[11px] text-[#E01B22] font-black tracking-[0.25em] block uppercase">
            Mark your Calendar.
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            EVENT TIMELINE
          </h2>
        </div>

        {/* Scrollable Timeline Path */}
        <div ref={containerRef} className="relative mt-20 pb-10">
          
          {/* Central Vertical Tracking Line (Desktop: centered; Mobile: shifted to left) */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#2A1A1D] -translate-x-1/2 z-0">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-[#E01B22] origin-top shadow-[0_0_15px_rgba(224,27,34,0.8)]"
              style={{ scaleY, height: '100%' }}
            />
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-12 md:space-y-24">
            {MILESTONES.map((milestone, idx) => (
              <TimelineItem key={idx} item={milestone} index={idx} />
            ))}
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
  const isInView = useInView(ref, { once: false, amount: 0.35 });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative w-full">
      
      {/* ── Desktop Alternating Layout ── */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full min-h-[160px]">
          
          {/* LEFT SIDE */}
          <div className="flex justify-end pr-12 relative w-full h-full items-center">
            {isEven && (
              <>
                <TimelineCard item={item} isInView={isInView} align="right" />
                {/* Horizontal branch connecting to center node */}
                <div className={`absolute top-1/2 -translate-y-1/2 right-0 h-[2px] w-12 transition-colors duration-500 z-0 ${isInView ? 'bg-[#E01B22]' : 'bg-[#2A1A1D]'}`} />
                {/* Vertical branch corner if we want it to look like a tree (optional, we use simple horizontal line here to keep it clean) */}
              </>
            )}
            {!isEven && (
              <div className="text-right">
                <span className={`block font-display text-4xl font-black transition-colors duration-500 ${isInView ? 'text-[#E01B22]' : 'text-[#6B5A5C]'}`}>{item.date}</span>
                <span className={`block font-mono text-sm tracking-widest font-bold transition-colors duration-500 ${isInView ? 'text-[#F7F2F2]' : 'text-[#6B5A5C]'}`}>{item.monthYear}</span>
              </div>
            )}
          </div>

          {/* CENTER NODE */}
          <div className="flex justify-center items-center z-20 w-8">
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                isInView
                  ? 'bg-[#E01B22] border-[#E01B22] shadow-[0_0_15px_rgba(224,27,34,0.9)] scale-125'
                  : 'bg-[#0A0607] border-[#2A1A1D]'
              }`}
            >
              {isInView && <div className="w-1.5 h-1.5 rounded-full bg-[#F7F2F2]" />}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-start pl-12 relative w-full h-full items-center">
            {!isEven && (
              <>
                <TimelineCard item={item} isInView={isInView} align="left" />
                {/* Horizontal branch connecting to center node */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-[2px] w-12 transition-colors duration-500 z-0 ${isInView ? 'bg-[#E01B22]' : 'bg-[#2A1A1D]'}`} />
              </>
            )}
            {isEven && (
              <div className="text-left">
                <span className={`block font-display text-4xl font-black transition-colors duration-500 ${isInView ? 'text-[#E01B22]' : 'text-[#6B5A5C]'}`}>{item.date}</span>
                <span className={`block font-mono text-sm tracking-widest font-bold transition-colors duration-500 ${isInView ? 'text-[#F7F2F2]' : 'text-[#6B5A5C]'}`}>{item.monthYear}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Mobile Layout (Left aligned timeline) ── */}
      <div className="md:hidden flex relative min-h-[120px] items-start">
        {/* Center Node (shifted to left) */}
        <div className="absolute left-[24px] top-6 -translate-x-1/2 z-20">
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

        {/* Horizontal branch */}
        <div className={`absolute top-8 left-[24px] w-8 h-[2px] transition-colors duration-500 z-0 ${isInView ? 'bg-[#E01B22]' : 'bg-[#2A1A1D]'}`} />

        {/* Content Side */}
        <div className="pl-14 pr-4 w-full pt-1">
          <div className="flex items-center gap-3 mb-3">
             <span className={`font-display text-3xl font-black transition-colors duration-500 ${isInView ? 'text-[#E01B22]' : 'text-[#6B5A5C]'}`}>{item.date}</span>
             <span className={`font-mono text-xs tracking-widest font-bold transition-colors duration-500 ${isInView ? 'text-[#F7F2F2]' : 'text-[#6B5A5C]'}`}>{item.monthYear}</span>
          </div>
          <TimelineCard item={item} isInView={isInView} align="left" />
        </div>
      </div>

    </div>
  );
};

interface TimelineCardProps {
  item: typeof MILESTONES[0];
  isInView: boolean;
  align: 'left' | 'right';
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, isInView, align }) => {
  const Icon = item.icon;
  const isSpecial = item.isGrandFinal;

  return (
    <div className={`w-full max-w-sm transition-all duration-700 transform ${
      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className={`relative border rounded-[2px] p-6 shadow-xl transition-colors duration-500 ${
        isSpecial 
          ? `bg-[#0A0607] border-[#E01B22] ${isInView ? 'shadow-[0_0_20px_rgba(224,27,34,0.15)]' : ''}`
          : `bg-[#130C0E]/80 backdrop-blur-sm border-[#2A1A1D] ${isInView ? 'hover:border-[#E01B22]/50' : ''}`
      }`}>
        
        {/* Status Badge */}
        <div className={`absolute -top-3 ${align === 'right' ? 'right-6' : 'left-6'}`}>
          <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-bold rounded-[1px] border shadow-sm ${
            item.status === 'ACTIVE' 
              ? 'bg-[#1C0D10] border-[#E01B22]/60 text-[#E01B22]' 
              : item.status === 'COMPLETED'
              ? 'bg-[#0F291E] border-green-500/40 text-green-400'
              : 'bg-[#0A0607] border-[#2A1A1D] text-[#A79798]'
          }`}>
            {item.status}
          </span>
        </div>

        <div className="flex flex-col space-y-4 pt-1">
          {/* Header row: Icon & Title */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-[2px] border ${isSpecial ? 'bg-[#E01B22]/10 border-[#E01B22]/30 text-[#E01B22]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#E01B22]'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className={`text-lg sm:text-xl font-display font-black tracking-wider uppercase leading-tight mt-1 ${isSpecial ? 'text-[#E01B22] drop-shadow-[0_0_8px_rgba(224,27,34,0.3)]' : 'text-[#F7F2F2]'}`}>
              {item.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed font-body font-medium">
            {item.desc}
          </p>
        </div>

      </div>
    </div>
  );
};

export default TimelineSection;
