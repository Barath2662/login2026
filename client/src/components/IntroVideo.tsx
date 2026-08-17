import React, { useState, useEffect, useRef } from 'react';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If user already saw intro in this session, complete immediately
    if (sessionStorage.getItem('hasPlayedIntro') === 'true') {
      onComplete();
      return;
    }
  }, [onComplete]);

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
    <div className="fixed inset-0 z-50 bg-[#0A0A0C] flex items-center justify-center overflow-hidden">
      {/* Intro Video Element */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        poster="/assets/logo.svg"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={handleFinish}
        onError={handleError}
        className="w-full h-full object-cover"
      />

      {/* Overlay UI Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-[#141418]/80 hover:bg-[#141418] text-[#F2F2F4] border border-[#2A1416] rounded-full text-xs font-mono tracking-wider transition-colors"
        >
          {isMuted ? 'UNMUTE 🔊' : 'MUTE 🔇'}
        </button>

        <button
          onClick={handleFinish}
          className="px-6 py-2 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] rounded-full text-xs font-mono font-bold tracking-widest transition-transform hover:scale-105 shadow-lg shadow-[#E01B24]/30"
        >
          SKIP ▶
        </button>
      </div>

      {/* Bottom Branding Bar */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
        <div>
          <h2 className="text-[#E01B24] font-bold text-xl tracking-widest uppercase font-display">LOGIN 2026</h2>
          <p className="text-[#9A9AA2] text-xs font-mono">35th Edition Technical Symposium | PSG Tech</p>
        </div>
        <p className="text-[#FF3B30] text-xs font-mono animate-pulse">LAST MAN STANDING</p>
      </div>
    </div>
  );
};
