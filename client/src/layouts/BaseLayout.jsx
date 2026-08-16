import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitchNavbar } from '../components/GlitchNavbar';
import { Footer } from '../components/Footer';
import { useThemeStore } from '../store/themeStore';
import { ProfileCompletionModal } from '../components/ProfileCompletionModal';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CinematicIntro } from '../components/CinematicIntro';

export const BaseLayout = () => {
  const location = useLocation();
  const { reduceMotion } = useThemeStore();
  const { token, survivor, setSurvivor, resetAuth, setInitialized } = useAuthStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('intro_seen'));
  
  // Only update the animation key if navigating between fundamentally different pages (not SPA sections)
  const getBaseKey = (path) => {
    const spaPaths = ['/', '/home', '/events', '/about', '/legacy', '/contact'];
    return spaPaths.includes(path) ? 'spa-container' : path;
  };

  const [animationKey, setAnimationKey] = useState(getBaseKey(location.pathname));

  useEffect(() => {
    if (!location.state?.noScroll) {
      setAnimationKey(getBaseKey(location.pathname));
    }
  }, [location.pathname, location.state]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_seen', 'true');
    setShowIntro(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !survivor) {
        try {
          const { data } = await api.users.profile();
          // Backend returns the user object directly. Check if mandatory profile fields exist to determine completion.
          if (data && data.college_name && data.phone) {
            setSurvivor(data);
            setShowProfileModal(false);
          } else {
            setSurvivor(data);
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error("Error fetching user profile", error);
          resetAuth();
        } finally {
          setInitialized(true);
        }
      } else if (!token) {
        resetAuth();
        setShowProfileModal(false);
        setInitialized(true);
      } else if (token && survivor) {
        setInitialized(true);
      }
    };
    
    fetchProfile();
  }, [token, survivor, setSurvivor, resetAuth, setInitialized]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <GlitchNavbar />
          <ProfileCompletionModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
          <main className="flex-grow pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={animationKey}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default BaseLayout;
