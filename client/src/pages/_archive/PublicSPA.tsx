import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlitchText } from '../components/ui/GlitchText';
import { Button } from '../components/ui/Button';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { UnifiedDossierModal } from '../components/ui/UnifiedDossierModal';
import { useThemeStore } from '../store/themeStore';

import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

// Section Imports

import { LegacyPage } from './LegacyPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';

gsap.registerPlugin(ScrollTrigger);

// Lazy load the heavy 3D component (if needed later)
// const HeroAIRobot = lazy(() => import('../components/3d/HeroAIRobot'));
import { Hero2DVisual } from '../components/ui/Hero2DVisual';
import { InvasionTimeline } from '../components/ui/InvasionTimeline';

export const PublicSPA = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reduceMotion } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const worldParam = searchParams.get('world');

  useEffect(() => {
    if (reduceMotion) return;

    // GSAP Scroll reveals for each section
    sectionsRef.current.forEach((section) => {
      if (!section) return;

      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [reduceMotion]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const handleAccessIntel = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeProfile = async () => {
    setIsInitializing(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        }
      });
    } catch (e) {
      setIsInitializing(false);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-white" style={{ scrollBehavior: 'smooth' }}>

      {/* Hero Section */}
      <section id="home" className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">

        {/* Scanlines overlay for the entire section */}
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto w-full gap-8 py-10 translate-x-[65px] md:-translate-y-15 -translate-y-7.5">

          {/* Left Column: Text and Buttons */}
          <div className="flex flex-col items-center justify-center text-center md:w-1/2">
            <div className="mb-2 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              PSG College of Technology
            </div>
            <div className="mb-4 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              Department of MCA Presents
            </div>
            <div className="mb-6 font-mono text-[#D90429] tracking-[0.3em] text-sm md:text-base opacity-90 border-b-2 border-t-2 border-[#D90429]/30 py-2 px-4">
              NATIONAL TECHNICAL SYMPOSIUM 2026
            </div>

            <GlitchText as="h2" className="text-6xl md:text-8xl lg:text-[7rem] leading-none font-black uppercase tracking-tighter mb-4 text-center text-[#E5E5E5] drop-shadow-2xl">
              LOGIN<span className="text-[#D90429]">2K26</span>
            </GlitchText>

            <h3 className="text-2xl md:text-4xl font-bold text-[#A8A9AD] mb-8 tracking-wide text-center">
              THE LAST HUMAN
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 mb-10 w-full justify-center items-center">
              {!isAuthenticated ? (
                <Button
                  className="h-14 px-8 text-lg disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto text-center justify-center flex"
                  onClick={handleInitializeProfile}
                  disabled={isInitializing}
                >
                  {isInitializing ? 'CONNECTING...' : 'INITIALIZE PROFILE'}
                </Button>
              ) : (
                <Button className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex" onClick={() => navigate('/hub')}>
                  PROCEED TO DASHBOARD
                </Button>
              )}
              <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex" onClick={handleAccessIntel}>
                ACCESS INTEL
              </Button>
            </div>

            <div className="bg-black/60 backdrop-blur-md p-4 border border-color-red/30 rounded-sm inline-block">
              <CountdownTimer targetDate="2026-09-20T00:00:00" />
            </div>
          </div>

          {/* Right Column: 2D Interactive Visual */}
          <div className="md:w-1/2 w-full h-[50vh] md:h-[65vh] max-h-[700px] relative z-0 flex items-center justify-center">
            <Hero2DVisual />
          </div>

        </div>
      </section>

      {/* Multiverse Grid Section */}
      <section id="worlds" ref={addToRefs} className="py-32 px-4 bg-bg-secondary relative border-y border-border-color">
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-5 mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <GlitchText as="h2" className="text-3xl md:text-5xl font-mono font-bold uppercase">
              The Multiverse Grid
            </GlitchText>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              11 isolated realities. Infinite anomalous permutations. Only one path to the core.
            </p>
          </div>

          <InvasionTimeline />
        </div>
      </section>

      {/* Rest of the stacked sections */}
      <section id="about" className="pt-24 min-h-screen">
        <AboutPage />
      </section>



      <section id="legacy" className="pt-24 min-h-screen">
        <LegacyPage />
      </section>

      <section id="contact" className="pt-24 min-h-screen">
        <ContactPage />
      </section>

      {/* Modal for World Details */}
      <UnifiedDossierModal
        isOpen={!!worldParam}
        id={worldParam || undefined}
        onClose={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('world');
          setSearchParams(newParams);
        }}
      />
    </div>
  );
};
