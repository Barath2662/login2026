import { useState, useEffect, Suspense } from 'react';
import { GlitchText } from '../components/ui/GlitchText';
import { ConstellationTimeline } from '../components/ui/ConstellationTimeline';
import { ConstellationTimeline3D } from '../components/ui/ConstellationTimeline3D';

export const EventsPage = () => {
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    const checkMedia = () => {
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Fallback to 2D if mobile OR prefers reduced motion
      setUse3D(!isMobile && !prefersReducedMotion);
    };
    
    checkMedia();
    window.addEventListener('resize', checkMedia);
    return () => window.removeEventListener('resize', checkMedia);
  }, []);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-12 pb-8 relative z-20">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold text-white uppercase">
          The 11 Worlds
        </GlitchText>
        <p className="text-text-secondary px-4">
          The Rogue AI has fractured our reality into 11 isolated domains. Review the threat intel below and select your mission.
        </p>
      </div>

      {/* Constellation Timeline */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-color-red">Loading Neural Interface...</div>}>
        {use3D ? <ConstellationTimeline3D /> : <ConstellationTimeline />}
      </Suspense>

    </div>
  );
};

