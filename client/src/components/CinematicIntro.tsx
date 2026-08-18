import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 1000);
  };

  useEffect(() => {
    const attemptPlay = async () => {
      if (videoRef.current) {
        try {
          // Attempt to play with audio first
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsMuted(false);
        } catch (error) {
          console.warn("Autoplay with audio blocked, falling back to muted autoplay.", error);
          // Fallback to muted autoplay
          if (videoRef.current) {
            videoRef.current.muted = true;
            try {
              await videoRef.current.play();
              setIsMuted(true);
            } catch (fallbackError) {
              console.error("Muted autoplay also failed.", fallbackError);
            }
          }
        }
      }
    };
    
    attemptPlay();
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
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

      {/* Video element */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        playsInline
        onEnded={handleComplete}
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          console.error("Video failed to load.", e);
          handleComplete();
        }}
      />
      
      {/* Glitch Overlay effects */}
      <motion.div 
        animate={{ 
          opacity: [0, 0.1, 0, 0.2, 0],
          scale: [1, 1.05, 1, 1.02, 1]
        }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
        className="absolute inset-0 bg-color-red/20 mix-blend-overlay pointer-events-none z-20" 
      />

      {/* Unmute Button Overlay (only shows if browser forced mute) */}
      <AnimatePresence>
        {isMuted && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMute}
            className="absolute top-10 right-10 z-50 flex items-center gap-2 bg-black/60 border border-color-red/50 text-white px-4 py-2 rounded-sm hover:bg-color-red/20 transition-colors font-mono text-sm tracking-wider backdrop-blur-sm"
          >
            <VolumeX size={18} className="text-color-red" />
            UNMUTE AUDIO
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Skip Button */}
      <button 
        onClick={() => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          handleComplete();
        }}
        className="absolute bottom-10 right-10 z-50 text-text-muted font-mono tracking-widest text-sm hover:text-white hover:drop-shadow-[0_0_10px_rgba(217,4,41,0.8)] transition-all cursor-pointer overflow-hidden group"
      >
        <span className="relative z-10">[ SKIP SEQUENCE ]</span>
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-color-red transition-all duration-300 group-hover:w-full" />
      </button>
    </motion.div>
  );
};
