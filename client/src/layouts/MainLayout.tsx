import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Ticker } from '../components/Ticker';
import { UnpaidBanner } from '../components/UnpaidBanner';
import { Footer } from '../components/Footer';
import { IntroVideo } from '../components/IntroVideo';
import { CommandSearchModal } from '../components/CommandSearchModal';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const { token, user, setUser, resetAuth, setInitialized } = useAuthStore();
  const [showIntro, setShowIntro] = useState<boolean>(() => sessionStorage.getItem('hasPlayedIntro') !== 'true');
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const syncProfile = async () => {
      if (token && !user) {
        try {
          const res = await api.users.profile();
          if (res.data) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('Invalid token or session expired');
          resetAuth();
        } finally {
          setInitialized(true);
        }
      } else {
        setInitialized(true);
      }
    };

    syncProfile();
  }, [token, user, setUser, resetAuth, setInitialized]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0607] text-[#F7F2F2] selection:bg-[#E01B22] selection:text-[#F7F2F2]">
      
      {/* Intro Video Overlay */}
      {showIntro && <IntroVideo onComplete={() => setShowIntro(false)} />}

      {/* Main App Shell */}
      {!showIntro && (
        <>
          {/* Header & Navigation */}
          <Navbar onOpenCommandSearch={() => setCommandSearchOpen(true)} />

          {/* Announcements Ticker (Renders ONLY if active announcements exist) */}
          <Ticker />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Outlet />
          </main>

          {/* Unpaid Nudge Banner (Fixed bottom stack for unverified participants) */}
          <UnpaidBanner />

          {/* Footer */}
          <Footer onReplayIntro={() => setShowIntro(true)} />

          {/* Command Search Modal (Ctrl+K) */}
          <CommandSearchModal
            isOpen={commandSearchOpen}
            onClose={() => setCommandSearchOpen(false)}
          />
        </>
      )}
    </div>
  );
};
