import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { Hero2DVisual } from '../../components/ui/Hero2DVisual';
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
        
        {/* Scanlines overlay for the entire section */}
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto w-full gap-8 py-10">

          {/* Left Column: Text and Buttons */}
          <div className="flex flex-col items-center justify-center text-center md:w-[55%] lg:w-[60%]">
            <div className="mb-2 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              PSG College of Technology
            </div>
            <div className="mb-4 font-mono text-[#A8A9AD] tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">
              Department of MCA Presents
            </div>
            <div className="mb-6 font-mono text-[#D90429] tracking-[0.3em] text-sm md:text-base opacity-90 border-b-2 border-t-2 border-[#D90429]/30 py-2 px-4">
              NATIONAL TECHNICAL SYMPOSIUM 2026
            </div>

            <GlitchText as="h2" className="text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6rem] leading-none font-black uppercase tracking-tighter mb-4 text-center text-[#E5E5E5] drop-shadow-2xl">
              LOGIN<span className="text-[#D90429]">2K26</span>
            </GlitchText>

            <h3 className="text-2xl md:text-4xl font-bold text-[#A8A9AD] mb-8 tracking-wide text-center">
              THE LAST HUMAN
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 mb-10 w-full justify-center items-center relative z-30">
              {!isAuthenticated ? (
                <Button
                  className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex"
                  onClick={handleInitializeProfile}
                >
                  INITIALIZE PROFILE
                </Button>
              ) : (
                <Button className="h-14 px-8 text-lg w-full sm:w-auto text-center justify-center flex" onClick={() => navigate('/student/home')}>
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
          <div className="md:w-[45%] lg:w-[40%] w-full h-[50vh] md:h-[65vh] max-h-[700px] relative z-0 flex items-center justify-center">
            <Hero2DVisual />
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
