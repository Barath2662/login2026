import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitchNavbar } from '../components/GlitchNavbar';
import { Footer } from '../components/Footer';
import { useThemeStore } from '../store/themeStore';
import { ProfileCompletionModal } from '../components/ProfileCompletionModal';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../services/api';
import { CinematicIntro } from '../components/CinematicIntro';

export const MainLayout = () => {
  const location = useLocation();
  const { reduceMotion } = useThemeStore();
  const { session, survivor, setSession, setSurvivor, resetAuth, setInitialized } = useAuthStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('intro_seen'));

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_seen', 'true');
    setShowIntro(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setInitialized(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setInitialized]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session && !survivor) {
        try {
          const { data } = await api.get('/users/me');
          if (data.exists) {
            setSurvivor(data.profile);
            setShowProfileModal(false);
          } else {
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error("Error fetching user profile", error);
        } finally {
          setInitialized(true);
        }
      } else if (!session) {
        resetAuth();
        setShowProfileModal(false);
        setInitialized(true);
      } else if (session && survivor) {
        setInitialized(true);
      }
    };
    
    fetchProfile();
  }, [session, survivor, setSurvivor, resetAuth, setInitialized]);

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
        {/* pt-20 to offset the fixed header height */}
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
            transition={{ duration: 0.2 }}
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
