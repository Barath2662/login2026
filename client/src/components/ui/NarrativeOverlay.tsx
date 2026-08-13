import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "SYSTEM BOOT SEQUENCE INITIATED...",
  "WARNING: ANOMALOUS ENTITIES DETECTED IN SECTOR 7.",
  "AI CORES HAVE GONE ROGUE. DATA HARVESTING IN PROGRESS.",
  "PROTOCOL 'SURVIVOR' ACTIVATED. GOOD LUCK, OPERATIVE."
];

export const NarrativeOverlay = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequence = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 5500)
    ];
    return () => sequence.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center p-8">
      {/* Glitchy full screen flash */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0, 1, 0], scale: 1, filter: ['blur(10px)', 'blur(0px)', 'blur(5px)', 'blur(0px)'] }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-7xl md:text-9xl font-mono font-black tracking-tighter text-color-danger opacity-30 mix-blend-screen" style={{ WebkitTextStroke: '2px #D90429' }}>
              BREACH
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal text box */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-[#050505]/90 backdrop-blur-md border border-border-color p-6 md:p-8 shadow-[0_0_40px_rgba(217,4,41,0.15)] overflow-hidden rounded-sm">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-color-red to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-30 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 space-y-3 font-mono text-sm md:text-base">
          <AnimatePresence mode="popLayout">
            {MESSAGES.slice(0, phase + 1).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${idx === phase ? 'text-white' : 'text-text-muted'} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
              >
                <span className={`${idx === phase ? 'text-color-red drop-shadow-[0_0_10px_rgba(217,4,41,0.8)]' : 'text-text-muted/50'} font-bold mr-3`}>{'>'}</span>
                <span className="leading-relaxed tracking-wide">{msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2.5 h-5 bg-color-red ml-4 mt-2"
          />
        </div>
      </div>
    </div>
  );
};
