import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { Hero2DVisual } from '../../components/ui/Hero2DVisual';
import { Logo3D } from '../../components/ui/Logo3D';
import { useAuthStore } from '../../store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeProfile = async () => {
    navigate('/login');
  };

  const handleAccessIntel = () => {
    navigate('/about');
  };

  return (
    <div className="bg-bg-primary min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-20">

        {/* Logo circles — top left overlay */}
        <div className="absolute top-24 left-4 sm:left-8 z-30 flex items-center gap-2">
          {[
            { src: '/assets/logos/psg-main.png', alt: 'PSG Tech'    },
            { src: '/assets/logos/psg-100.png',  alt: 'PSG 100 Yrs' },
            { src: '/assets/logos/psg-75.png',   alt: 'PSG 75 Yrs'  },
            { src: '/assets/logos/caa.png',      alt: 'CAA'          },
          ].map((logo) => (
            <div
              key={logo.alt}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#E01B22]/50 bg-white shrink-0 overflow-hidden flex items-center justify-center shadow-[0_0_10px_rgba(224,27,34,0.4)]"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-[85%] h-[85%] object-contain"
              />
            </div>
          ))}
        </div>
        
        {/* Scanlines overlay for the entire section */}
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto w-full gap-8 py-10">

          {/* Left Column: Logo */}
          <div className="flex justify-center md:justify-start items-center md:w-[45%] lg:w-[40%] w-full relative z-30 mb-8 md:mb-0">
            <Logo3D className="w-[80%] md:w-[100%] max-w-[600px] aspect-square" />
          </div>

          {/* Right Column: Text and Buttons (Centered) */}
          <div className="flex flex-col items-center justify-center text-center md:w-[55%] lg:w-[60%]">
            <div className="mb-2 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              PSG College of Technology
            </div>
            <div className="mb-4 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              Department of MCA Presents
            </div>
            <div className="mb-8 font-mono text-[#D90429] tracking-[0.3em] text-sm md:text-base opacity-90 border-b-2 border-t-2 border-[#D90429]/30 py-2 px-4">
              NATIONAL TECHNICAL SYMPOSIUM 2026
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-[#A8A9AD] mb-10 tracking-widest text-center">
              THE LAST HUMAN
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 mb-12 w-full justify-center items-center relative z-30">
              {!isAuthenticated ? (
                <Button
                  className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex"
                  onClick={handleInitializeProfile}
                >
                  INITIALIZE PROFILE
                </Button>
              ) : (
                <Button className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex" onClick={() => navigate('/dashboard')}>
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

        </div>
      </section>
    </div>
  );
};

export default Home;
