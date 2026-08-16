import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicIntro } from '../components/CinematicIntro';

export const EntrySplashPage = () => {
  const navigate = useNavigate();
  
  const [introFinished, setIntroFinished] = useState(() => {
    return typeof sessionStorage !== 'undefined' 
      ? sessionStorage.getItem('login2k26_intro_seen') === 'true'
      : true;
  });

  useEffect(() => {
    if (introFinished) {
      navigate('/app', { replace: true });
    }
  }, [introFinished, navigate]);

  if (introFinished) {
    return null; // Will redirect immediately
  }

  return (
    <CinematicIntro 
      onComplete={() => {
        setIntroFinished(true);
      }} 
    />
  );
};
