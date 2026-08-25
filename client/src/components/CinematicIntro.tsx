import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, Volume2 } from 'lucide-react';

export const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 1000);
  };

  useEffect(() => {
    const attemptPlay = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsMuted(false);
        } catch (error) {
          console.warn("Autoplay with audio blocked, falling back to muted autoplay.", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            try {
              await videoRef.current.play();
              setIsMuted(true);
            } catch (fallbackError) {
              console.error("Muted autoplay also failed.", fallbackError);
              handleComplete();
            }
          }
        }
      }
    };
    
    attemptPlay();
  }, []);

  // Track video progress for progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTime = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', handleTime);
    return () => video.removeEventListener('timeupdate', handleTime);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-bg-primary overflow-hidden flex items-center justify-center"
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

      {/* Video — responsive: contain on mobile, cover on desktop */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        playsInline
        onEnded={handleComplete}
        className="absolute inset-0 w-full h-full object-contain sm:object-cover z-0"
        style={{ backgroundColor: '#0A0607' }}
        onError={(e) => {
          console.error("Video failed to load.", e);
          handleComplete();
        }}
      />
      
      {/* Subtle glitch overlay */}
      <motion.div 
        animate={{ 
          opacity: [0, 0.05, 0, 0.08, 0],
        }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror", delay: 2 }}
        className="absolute inset-0 bg-color-red/10 mix-blend-overlay pointer-events-none z-20" 
      />

      {/* Top-right controls — responsive positioning */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex items-center gap-3">
        {/* Mute/Unmute */}
        <AnimatePresence>
          <motion.button 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={toggleMute}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-[#2A1A1D] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-[2px] hover:bg-[#E01B22]/20 hover:border-[#E01B22]/50 transition-colors font-mono text-[10px] sm:text-xs tracking-wider"
          >
            {isMuted ? <VolumeX size={16} className="text-[#E01B22]" /> : <Volume2 size={16} className="text-[#F7F2F2]" />}
            <span className="hidden sm:inline">{isMuted ? 'UNMUTE' : 'MUTED'}</span>
          </motion.button>
        </AnimatePresence>
      </div>
      
      {/* Bottom bar — progress + skip */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        {/* Progress bar */}
        <div className="w-full h-[2px] bg-[#2A1A1D]">
          <div 
            className="h-full bg-[#E01B22] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Left branding */}
          <div>
            <h2 className="text-[#E01B22] font-bold text-sm sm:text-base tracking-widest uppercase font-display">LOGIN 2026</h2>
            <p className="text-[#6B5A5C] text-[10px] sm:text-xs font-mono">35th Edition • PSG College of Technology</p>
          </div>

          {/* Skip button */}
          <button 
            onClick={() => {
              if (videoRef.current) videoRef.current.pause();
              handleComplete();
            }}
            className="text-[#A79798] font-mono tracking-widest text-[10px] sm:text-xs hover:text-white transition-all cursor-pointer group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[2px] bg-black/30 backdrop-blur-sm"
          >
            SKIP <span className="text-[#E01B22]">▶</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
