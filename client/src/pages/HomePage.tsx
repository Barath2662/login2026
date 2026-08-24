import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight, ChevronRight, Calendar, Users, Trophy } from 'lucide-react';
import { Logo3D } from '../components/ui/Logo3D';
import { useAuthStore } from '../store/authStore';

/* ── Animated Counter Hook ─────────────────────────────────── */
const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.events.getAll().then((res) => {
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      }
    }).catch(() => {});
  }, []);

  const eventsCounter = useCountUp(11, 1200);

  return (
    <div className="min-h-screen bg-[#0A0607] text-[#F7F2F2] section-safe">
      
      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="relative min-h-[92vh] flex items-center px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] overflow-hidden">
        
        {/* Background Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4A050A]/40 via-[#0A0607] to-[#0A0607] pointer-events-none" />

        {/* Animated dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#FF2A2A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient background glow behind right side logo */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(224,27,34,0.18)_0%,_transparent_70%)] pointer-events-none filter blur-3xl" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 py-12 sm:py-16">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Eyebrow — slide in from left */}
            <div className="animate-slide-in-left">
              <div className="mono-label flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A2A] animate-pulse-glow" />
                <span>NATIONAL TECHNICAL SYMPOSIUM • 35TH EDITION</span>
              </div>
            </div>

            {/* Headline — staggered entrance */}
            <div className="space-y-2">
              <h1 className="display-xl text-[#F7F2F2] animate-fade-in-up stagger-2">
                LOGIN <span className="text-[#E01B22]">2026</span>
              </h1>
              <p className="font-display text-2xl sm:text-4xl font-bold text-[#FF2A2A] tracking-widest uppercase animate-fade-in-up stagger-3">
                THE LAST HUMAN
              </p>
            </div>

            {/* Body Copy */}
            <p className="text-sm sm:text-base text-[#A79798] font-body leading-relaxed max-w-[58ch] animate-fade-in-up stagger-4">
              The perfect fusion of masterminds. Ten regular arenas plus one headline flagship competition — governed by eleven mechanical guardians.
            </p>

            {/* CTAs — shimmer effect */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 animate-fade-in-up stagger-5">
              {isAuthenticated ? (
                <Link
                  to={
                    user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power'
                      ? '/admin'
                      : user?.role === 'event_coordinator'
                      ? '/coordinator'
                      : user?.user_type === 'ALUMNI'
                      ? '/alumni'
                      : '/dashboard'
                  }
                  className="shimmer-btn px-8 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(224,27,34,0.4)] flex items-center justify-center gap-3"
                >
                  {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power'
                    ? 'ADMIN CONTROL PANEL'
                    : user?.role === 'event_coordinator'
                    ? 'COORDINATOR HUB'
                    : user?.user_type === 'ALUMNI'
                    ? 'ALUMNI PORTAL'
                    : 'ACCESS SURVIVOR DOSSIER'}{' '}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="shimmer-btn px-8 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(224,27,34,0.4)] flex items-center justify-center gap-3"
                >
                  REGISTER FOR SYMPOSIUM <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                to="/events"
                className="px-8 py-4 bg-[#130C0E] hover:bg-[#1A1114] border border-[#3E2529] hover:border-[#E01B22]/60 text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-3"
              >
                EXPLORE ALL 11 ARENAS
              </Link>
            </div>

            {/* Authentic Symposium Telemetry Strip */}
            <div className="pt-6 border-t border-[#2A1A1D] flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs text-[#A79798] animate-fade-in-up stagger-6">
              <div ref={eventsCounter.ref}>
                <span className="mono-label block mb-1 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#E08A17]" /> COMPETITION ARENAS
                </span>
                <strong className="text-lg sm:text-xl text-[#E08A17] font-mono tabular-nums">
                  11 <span className="text-xs text-[#A79798] font-normal">ARENAS (1 FLAGSHIP)</span>
                </strong>
              </div>
              <div className="h-8 w-px bg-[#2A1A1D] hidden sm:block" />
              <div>
                <span className="mono-label block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E01B22]" /> SYMPOSIUM SCHEDULE
                </span>
                <strong className="text-lg sm:text-xl text-[#F7F2F2] font-mono">18 &amp; 19 SEP 2026</strong>
              </div>
              <div className="h-8 w-px bg-[#2A1A1D] hidden sm:block" />
              <div>
                <span className="mono-label block mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF2A2A]" /> ORGANIZING BODY
                </span>
                <strong className="text-lg sm:text-xl text-[#F7F2F2] font-mono">CAA • PSG TECH</strong>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Floating Interactive Logo */}
          <div className="lg:col-span-5 flex items-center justify-center relative z-20 py-4 lg:py-0">
            <Logo3D className="w-full max-w-[380px] sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] aspect-square" />
          </div>

        </div>
      </section>

      {/* ═══ 2. DIRECTIVE BAND (About) ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-3 mono-label text-[#E01B22] font-bold animate-fade-in-up">
          [ DIRECTIVE // 01 ]
        </div>
        <div className="lg:col-span-9 space-y-6 text-sm text-[#A79798] font-body leading-relaxed max-w-3xl animate-fade-in-up stagger-2">
          <h2 className="display-m text-[#F7F2F2]">
            THIRTY-FIVE YEARS OF MASTERMINDS
          </h2>
          <p>
            LOGIN is the national technical symposium organized annually by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore.
          </p>
          <p>
            The 2026 edition introduces <strong className="text-[#F7F2F2]">"THE LAST HUMAN"</strong> — testing technical depth, logic, and rapid decision-making across two days of high-intensity competition.
          </p>
        </div>
      </section>

      {/* ═══ 3. EVENTS PREVIEW HORIZONTAL STRIP ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] space-y-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="mono-label">GUARDIAN ARENAS</span>
            <h2 className="display-m text-[#F7F2F2]">11 COMPETITION ARENAS</h2>
          </div>
          <Link to="/events" className="font-mono text-xs text-[#E01B22] hover:text-[#FF2A2A] font-bold flex items-center gap-1 link-underline transition-colors">
            VIEW ALL 11 EVENTS <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Snap Scroll Strip */}
        <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 snap-scroll-x">
          {events.map((evt, idx) => (
            <Link
              key={evt.id}
              to={`/events?id=${evt.id}`}
              className={`w-72 sm:w-80 shrink-0 bg-[#130C0E] border border-[#2A1A1D] hover:border-[#FF2A2A]/70 p-5 sm:p-6 rounded-[2px] space-y-4 transition-all card-hover-lift corner-bracket-container group animate-fade-in-up`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="corner-bracket-tl" />
              <div className="corner-bracket-br" />

              <div className="h-36 sm:h-40 bg-[#1A1114] border-2 border-[#3E2529] flex items-center justify-center p-4 rounded-[2px] overflow-hidden shadow-[inset_0_0_30px_rgba(224,27,34,0.06)]">
                <img
                  src={evt.guardian_asset || '/assets/logo.svg'}
                  alt={evt.name}
                  className="max-h-24 sm:max-h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-110 animate-float-slow drop-shadow-[0_0_15px_rgba(224,27,34,0.2)]"
                />
              </div>

              <div className="space-y-1">
                <span className="mono-label text-[#E01B22]">{evt.category} • DAY {evt.day}</span>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors truncate">
                  {evt.name}
                </h3>
              </div>

              <p className="text-xs text-[#A79798] line-clamp-2 leading-relaxed">{evt.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 4. FLAGSHIP BAND ═══ */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#130C0E] border-b border-[#2A1A1D] relative overflow-hidden">
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0607_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
          <div className="lg:col-span-5 text-center">
            <img
              src="/assets/guardians/the_last_standing.svg"
              alt="Star of LOGIN Flagship"
              className="max-h-64 sm:max-h-80 mx-auto object-contain animate-float drop-shadow-[0_0_40px_rgba(224,27,34,0.25)]"
            />
          </div>
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <span className="chip-registered px-3 py-1 inline-flex items-center gap-1 animate-pulse-glow">
              ★ HEADLINE FLAGSHIP EVENT
            </span>
            <h2 className="display-l text-[#F7F2F2]">STAR OF LOGIN</h2>
            <p className="text-sm text-[#A79798] leading-relaxed max-w-xl mx-auto lg:mx-0">
              The supreme battle of endurance. Multi-stage elimination testing algorithmic speed, system design, logic puzzles, and high-pressure decision making.
            </p>
            <Link
              to="/events?id=11"
              className="shimmer-btn inline-flex items-center gap-2 px-6 py-3 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-all hover:shadow-[0_0_25px_rgba(224,27,34,0.4)]"
            >
              INSPECT FLAGSHIP BRIEFING <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 5. ALUMNI INVITATION BAND ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-[#F7F2F2] text-[#0A0607] border-b border-[#2A1A1D] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#E01B22 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="font-mono text-xs font-bold text-[#E01B22] tracking-widest uppercase">
              PSG TECH MCA ALUMNI INVITATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0A0607]">
              WELCOME HOME, ALUMNI
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A5C] leading-relaxed">
              Reconnect with past batches, network with current students, and witness the 35th edition of LOGIN on 18 & 19 September 2026.
            </p>
          </div>

          <Link
            to="/register?type=alumni"
            className="shimmer-btn px-8 py-4 bg-[#E01B22] hover:bg-[#B4111A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shrink-0 shadow-lg transition-all hover:shadow-[0_0_30px_rgba(224,27,34,0.4)]"
          >
            ALUMNI REGISTRATION FORM →
          </Link>
        </div>
      </section>

    </div>
  );
};
