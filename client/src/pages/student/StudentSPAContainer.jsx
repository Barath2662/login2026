import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import StudentEvents from './Events';

const StudentSPAContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isNavigating = useRef(false);
  const scrollTimeout = useRef(null);

  // Scroll to section on route change
  useEffect(() => {
    if (location.state?.noScroll) return;

    const path = location.pathname.substring(1); // 'home' or 'events'
    const element = document.getElementById(`student-${path}`);
    
    if (element) {
      isNavigating.current = true;
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      }, 100);
    }
  }, [location.pathname, location.state]);

  // Update URL silently on scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (isNavigating.current) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('student-', '');
          const targetPath = `/${id}`;
          if (targetPath !== location.pathname) {
            navigate(targetPath, { replace: true, state: { noScroll: true } });
          }
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 }); 

    const sections = document.querySelectorAll('.student-spa-section');
    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, [location.pathname, navigate]);

  return (
    <div className="w-full">
      <div id="student-home" className="student-spa-section min-h-screen">
        <StudentDashboard />
      </div>
      <div id="student-events" className="student-spa-section min-h-screen border-t border-border-color">
        <StudentEvents />
      </div>
    </div>
  );
};

export default StudentSPAContainer;
