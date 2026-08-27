import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(11);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 0s ─────── SYSTEM BOOT
    // 1s ─────── SCANNING LIFE FORMS
    // 2.5s ───── HUMANS DETECTED
    // 4s ─────── FINAL SUBJECT DETECTED
    // 5s ─────── THE LAST HUMAN
    // 6s ─────── ENTER LOGIN 2K26

    const timeouts = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => handleFinish(), 6000),
    ];

    // Progress bar
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / 60), 100)); // 60 ticks of 100ms = 6s
    }, 100);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 2) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev - 1;
        });
      }, 1500 / 11);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  const handleFinish = () => {
    localStorage.setItem('hasPlayedIntro', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0607] flex flex-col items-center justify-center overflow-hidden font-mono text-[#F7F2F2]">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-10" />

      {/* Main Content Area */}
      <div className="z-20 w-full max-w-2xl px-6 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div key="phase0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="text-[#E01B22] text-sm tracking-widest uppercase">INITIALIZING SYSTEM...</div>
              <div className="text-xs text-[#6B5A5C] tracking-widest flex items-center gap-2 justify-center">
                <span>[</span>
                <span className="text-[#F7F2F2]">████████░░</span>
                <span>] 82%</span>
              </div>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-[#F7F2F2] text-sm tracking-widest uppercase animate-pulse">SCANNING LIFE FORMS...</div>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="text-[#E01B22] text-sm tracking-widest uppercase">HUMANS DETECTED: {countdown.toString().padStart(2, '0')}</div>
              <div className="text-7xl sm:text-9xl font-black font-display tracking-wider text-[#F7F2F2]">
                {countdown.toString().padStart(2, '0')}
              </div>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div key="phase3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-[#E01B22] text-sm tracking-widest uppercase">FINAL SUBJECT DETECTED.</div>
              <div className="text-4xl sm:text-6xl font-black font-display tracking-widest text-[#F7F2F2]">
                THE LAST HUMAN.
              </div>
            </motion.div>
          )}

          {phase === 4 && (
            <motion.div key="phase4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="space-y-4">
              <div className="text-5xl sm:text-7xl font-black font-display tracking-widest text-[#E01B22]">
                LOGIN 2K26
              </div>
              <div className="text-xs text-[#A79798] tracking-widest uppercase">SYSTEM UNLOCKED.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="w-full h-[2px] bg-[#2A1A1D]">
          <div className="h-full bg-[#E01B22] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-end px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={handleFinish}
            className="text-[#A79798] font-mono tracking-widest text-[10px] sm:text-xs hover:text-white transition-all cursor-pointer flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[2px] bg-black/30 backdrop-blur-sm uppercase"
          >
            SKIP INTRO <span className="text-[#E01B22]">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};
