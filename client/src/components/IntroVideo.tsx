import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt auto play
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: ensure muted and retry
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  // Track progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTime = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', handleTime);
    return () => video.removeEventListener('timeupdate', handleTime);
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('hasPlayedIntro', 'true');
    onComplete();
  };

  const handleError = () => {
    console.warn('Intro video failed to load or autoplay was blocked — falling back to hero.');
    setHasError(true);
    handleFinish();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (hasError) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0607] flex items-center justify-center overflow-hidden">
      {/* Video — responsive contain/cover */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        poster="/assets/login.png"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={handleFinish}
        onError={handleError}
        className="w-full h-full object-contain sm:object-cover"
        style={{ backgroundColor: '#0A0607' }}
      />

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10">
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-black/50 backdrop-blur-sm hover:bg-[#E01B22]/20 text-[#F7F2F2] border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[2px] text-[10px] sm:text-xs font-mono tracking-wider transition-colors"
        >
          {isMuted ? <VolumeX size={16} className="text-[#E01B22]" /> : <Volume2 size={16} />}
          <span className="hidden sm:inline">{isMuted ? 'UNMUTE' : 'MUTED'}</span>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Progress bar */}
        <div className="w-full h-[2px] bg-[#2A1A1D]">
          <div className="h-full bg-[#E01B22] transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-t from-black/80 to-transparent">
          <div>
            <h2 className="text-[#E01B22] font-bold text-sm sm:text-base tracking-widest uppercase font-display">LOGIN 2026</h2>
            <p className="text-[#6B5A5C] text-[10px] sm:text-xs font-mono">35th Edition • PSG College of Technology</p>
          </div>

          <button
            onClick={handleFinish}
            className="text-[#A79798] font-mono tracking-widest text-[10px] sm:text-xs hover:text-white transition-all cursor-pointer flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[2px] bg-black/30 backdrop-blur-sm"
          >
            SKIP <span className="text-[#E01B22]">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};
