import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import Events from './Events';
import Legacy from './Legacy';
import About from './About';
import Contact from './Contact';

const PublicSPAContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isNavigating = useRef(false);
  const scrollTimeout = useRef(null);

  // Scroll to section on route change
  useEffect(() => {
    if (location.state?.noScroll) return;

    const path = location.pathname === '/' ? 'home' : location.pathname.substring(1);
    const element = document.getElementById(path);
    
    if (element) {
      isNavigating.current = true;
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      }, 100);
    } else if (path === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.state]);

  // Update URL silently on scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (isNavigating.current) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const targetPath = `/${id}`;
          if (targetPath !== location.pathname) {
            navigate(targetPath, { replace: true, state: { noScroll: true } });
          }
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    const sections = document.querySelectorAll('.public-spa-section');
    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, [location.pathname, navigate]);

  return (
    <div className="w-full">
      <div id="home" className="public-spa-section">
        <Home />
      </div>
      <div id="events" className="public-spa-section">
        <Events />
      </div>
      <div id="about" className="public-spa-section">
        <About />
      </div>
      <div id="legacy" className="public-spa-section">
        <Legacy />
      </div>
      <div id="contact" className="public-spa-section">
        <Contact />
      </div>
    </div>
  );
};

export default PublicSPAContainer;
