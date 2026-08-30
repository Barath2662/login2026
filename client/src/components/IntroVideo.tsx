import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoProps {
  onComplete: () => void;
}

const COUNTDOWN_SEQ = [11, 9, 7, 5, 3, 2, 1];

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(11);
  const [progress, setProgress] = useState(0);
  const hasFinished = useRef(false);

  const duration = 7500; // Total 7.5 seconds

  const handleFinish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    localStorage.setItem('hasPlayedIntro', 'true');
    onComplete();
  };

  useEffect(() => {
    const start = performance.now();
    let frameId: number;
    let currentPhase = 0;
    let currentCountdownIndex = 0;

    const updateProgress = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));

      if (elapsed >= duration) {
        handleFinish();
        return;
      }

      // Timeline Phase Calculation
      let newPhase = 0;
      if (elapsed >= 6300) newPhase = 4;      // ENTERING ARENAS
      else if (elapsed >= 6000) newPhase = 3; // RED FLASH
      else if (elapsed >= 4000) newPhase = 2; // COUNTDOWN
      else if (elapsed >= 2000) newPhase = 1; // SCANNING

      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        setPhase(newPhase);
      }

      // Deterministic Countdown Calculation (during Phase 2)
      if (newPhase === 2) {
        const phaseProgress = (elapsed - 4000) / 2000; // 0 to 1
        const index = Math.min(
          COUNTDOWN_SEQ.length - 1,
          Math.max(0, Math.floor(phaseProgress * COUNTDOWN_SEQ.length))
        );
        if (index !== currentCountdownIndex) {
          currentCountdownIndex = index;
          setCountdown(COUNTDOWN_SEQ[index]);
        }
      }

      frameId = requestAnimationFrame(updateProgress);
    };

    frameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const getStatusText = () => {
    if (phase === 0) return "BOOTING SYSTEM...";
    if (phase === 1) return "SCANNING LIFE FORMS...";
    if (phase === 2) return "ANALYZING SIGNALS...";
    if (phase === 3) return "SYSTEM OVERRIDE...";
    if (phase === 4) return "ENTERING ARENAS...";
    return "INITIALIZING";
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0607] flex flex-col items-center justify-center overflow-hidden font-mono text-[#F7F2F2]">

      {/* LAYER 1: Subtle Red Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none z-0" />

      {/* LAYER 2: Moving Scan Line */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[15%] bg-gradient-to-b from-transparent via-[#E01B22]/10 to-transparent pointer-events-none z-0"
      />

      {/* LAYER 3: Glitch/Noise Overlay */}
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-[0.05] mix-blend-overlay pointer-events-none z-10" />

      {/* ── HUD ELEMENTS ── */}
      <div className="absolute inset-4 sm:inset-8 z-20 pointer-events-none text-[9px] sm:text-[10px] text-[#F7F2F2]/30 tracking-[0.15em] font-mono select-none">
        {/* Top Left */}
        <div className="absolute top-0 left-0 flex flex-col gap-1">
          <span className="text-[#E01B22]/50 font-bold">LAST HUMAN</span>
          <span>BUILD: 2.026</span>
          <span>STATUS: ONLINE</span>
        </div>
        {/* Top Right */}
        <div className="absolute top-0 right-0 flex flex-col gap-1 text-right">
          <span>COORDINATES</span>
          <span className="text-[#E01B22]/50 font-bold">11.026 // ARENA</span>
          <span>SECURE_CONNECTION</span>
        </div>
        {/* Bottom Left */}
        <div className="absolute bottom-12 left-0 flex flex-col gap-1">
          <span>© MCA // PSG</span>
          <span>SYSTEM PROTOCOL</span>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="z-30 w-full max-w-2xl px-6 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">

          {/* PHASE 0: SYSTEM BOOT */}
          {phase === 0 && (
            <motion.div key="phase0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <div className="border border-[#E01B22]/30 p-6 bg-black/40 backdrop-blur-sm min-w-[280px] text-left shadow-[0_0_20px_rgba(224,27,34,0.1)]">
                <div className="text-[#E01B22] text-sm tracking-widest uppercase mb-4 font-bold border-b border-[#E01B22]/30 pb-2">
                  INITIALIZING 'LAST HUMAN'
                </div>
                <div className="text-[10px] sm:text-xs text-[#A79798] tracking-widest flex flex-col gap-2 font-mono">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <span className="text-[#E01B22] mr-2">&gt;</span>Establishing connection...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <span className="text-[#E01B22] mr-2">&gt;</span>Loading arena protocols...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <span className="text-[#E01B22] mr-2">&gt;</span>Searching biological signatures...
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 1: SCANNING */}
          {phase === 1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-6">
              <div className="text-[#F7F2F2] text-sm sm:text-base tracking-widest uppercase animate-pulse font-bold">
                SCANNING LIFE FORMS...
              </div>
              <div className="relative w-64 h-8 border border-[#E01B22]/40 bg-black/50 overflow-hidden shadow-[0_0_15px_rgba(224,27,34,0.15)]">
                {/* Horizontal scanner */}
                <motion.div
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#E01B22]/80 to-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 text-[#E01B22]/50 text-[10px]">
                  <span>[</span>
                  <span>● ● ● ● ● ● ●</span>
                  <span>]</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 2: COUNTDOWN */}
          {phase === 2 && (
            <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <div className="text-[#E01B22] text-sm tracking-widest uppercase mb-4 font-bold">LIFE FORMS DETECTED</div>
              <div className="h-[120px] sm:h-[150px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={countdown}
                    initial={{ opacity: 0, scale: 1.3, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 20 }}
                    transition={{ duration: 0.12 }}
                    className="text-8xl sm:text-[140px] font-black font-display tracking-wider text-[#F7F2F2] leading-none"
                    style={{ textShadow: '0 0 20px rgba(247,242,242,0.3)' }}
                  >
                    {countdown.toString().padStart(2, '0')}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="text-[#A79798] text-xs sm:text-sm tracking-[0.4em] uppercase mt-4">
                HUMANS
              </div>
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="mt-4 text-[#E01B22]">
                ↓ ↓ ↓
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 3: RED FLASH */}
          {phase === 3 && (
            <motion.div key="phase3">
              {/* Just the flash, the rest is hidden momentarily for impact */}
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 bg-[#E01B22] z-50 pointer-events-none mix-blend-screen"
              />
            </motion.div>
          )}

          {/* PHASE 4: ENTERING ARENA */}
          {phase >= 4 && (
            <motion.div key="phase4" className="flex flex-col items-center justify-center w-full h-full absolute inset-0">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex flex-col items-center">
                <div className="text-xl sm:text-3xl font-bold font-mono tracking-[0.3em] text-[#E01B22] uppercase drop-shadow-[0_0_20px_rgba(224,27,34,0.6)] animate-pulse">
                  ACCESS GRANTED TO SURVIVE...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM PROGRESS BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-sm border-t border-[#2A1A1D]">
        <div className="px-4 py-2 sm:px-8 sm:py-3 max-w-7xl mx-auto">
          {/* Status Text & Percentage */}
          <div className="flex justify-between items-end text-[9px] sm:text-[10px] text-[#A79798] font-mono tracking-widest mb-2 uppercase">
            <span>{getStatusText()}</span>
            <span className="text-[#F7F2F2] font-bold">{Math.floor(progress)}%</span>
          </div>

          {/* Thematic Progress Bar */}
          <div className="w-full h-[3px] bg-[#2A1A1D] rounded-full overflow-hidden relative">
            {/* Grid notches in background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px)] bg-[size:10px_100%] opacity-50 z-10 pointer-events-none" />
            {/* Fill */}
            <div className="h-full bg-[#E01B22] relative z-0" style={{ width: `${progress}%` }}>
              {/* Animated bright tip */}
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white opacity-80 blur-[2px]" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default IntroVideo;
