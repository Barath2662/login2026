import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [participantCount, setParticipantCount] = useState<number>(142);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.stats.getParticipantStats().then((res) => {
      if (res.data?.verified_participants) {
        setParticipantCount(res.data.verified_participants);
      }
    }).catch(() => {});

    api.events.getAll().then((res) => {
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0607] text-[#F7F2F2]">
      
      {/* 1. Hero Section (Left-aligned on grid, Command Console vs Colossus) */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] overflow-hidden scanlines">
        
        {/* Background Dot Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4A050A]/30 via-[#0A0607] to-[#0A0607] pointer-events-none" />

        {/* THE LAST STANDING Silhouette Bleeding off Right Edge */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block w-[600px] h-[600px]">
          <img src="/assets/guardians/the_last_standing.svg" alt="Flagship Mech" className="w-full h-full object-contain" />
        </div>

        <div className="max-w-4xl space-y-8 relative z-10 py-20 text-left">
          
          {/* Eyebrow */}
          <div className="mono-label flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF2A2A] animate-ping" />
            <span>NATIONAL TECHNICAL SYMPOSIUM • 35TH EDITION</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="display-xl text-[#F7F2F2]">
              LOGIN <span className="text-[#E01B22]">2026</span>
            </h1>
            <p className="font-display text-2xl sm:text-4xl font-bold text-[#FF2A2A] tracking-widest uppercase">
              LAST MAN STANDING
            </p>
          </div>

          {/* Body Copy (Max 60 chars) */}
          <p className="text-sm sm:text-base text-[#A79798] font-body leading-relaxed max-w-[60ch]">
            The perfect fusion of masterminds. Ten regular arenas plus one headline flagship competition — governed by eleven mechanical guardians.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              REGISTER FOR SYMPOSIUM <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/events"
              className="px-8 py-4 bg-[#130C0E] hover:bg-[#1A1114] border border-[#3E2529] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-3"
            >
              EXPLORE ALL 11 ARENAS
            </Link>
          </div>

          {/* Real API Telemetry Counter Strip */}
          <div className="pt-6 border-t border-[#2A1A1D] flex flex-wrap items-center gap-8 font-mono text-xs text-[#A79798]">
            <div>
              <span className="mono-label block">VERIFIED SURVIVORS</span>
              <strong className="text-base text-[#F7F2F2] font-mono">{participantCount} PARTICIPANTS</strong>
            </div>
            <div className="h-8 w-px bg-[#2A1A1D] hidden sm:block" />
            <div>
              <span className="mono-label block">OFFICIAL EVENTS</span>
              <strong className="text-base text-[#E08A17] font-mono">11 ARENAS</strong>
            </div>
            <div className="h-8 w-px bg-[#2A1A1D] hidden sm:block" />
            <div>
              <span className="mono-label block">SYMPOSIUM DATES</span>
              <strong className="text-base text-[#F7F2F2] font-mono">18 & 19 SEP 2026</strong>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Directive Band (Asymmetric About Section) */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 mono-label text-[#E01B22] font-bold">
          [ DIRECTIVE // 01 ]
        </div>
        <div className="lg:col-span-9 space-y-6 text-sm text-[#A79798] font-body leading-relaxed max-w-3xl">
          <h2 className="display-m text-[#F7F2F2]">
            THIRTY-FIVE YEARS OF MASTERMINDS
          </h2>
          <p>
            LOGIN is the national technical symposium organized annually by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore.
          </p>
          <p>
            The 2026 edition introduces <strong className="text-[#F7F2F2]">"Last Man Standing"</strong> — testing technical depth, logic, and rapid decision-making across two days of high-intensity competition.
          </p>
        </div>
      </section>

      {/* 3. Events Preview Horizontal Strip */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-[#2A1A1D] space-y-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="mono-label">GUARDIAN ARENAS</span>
            <h2 className="display-m text-[#F7F2F2]">11 COMPETITION ARENAS</h2>
          </div>
          <Link to="/events" className="font-mono text-xs text-[#E01B22] hover:underline font-bold flex items-center gap-1">
            VIEW ALL 11 EVENTS →
          </Link>
        </div>

        {/* Scroll Strip */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#3E2529]">
          {events.map((evt) => (
            <Link
              key={evt.id}
              to={`/events?id=${evt.id}`}
              className="w-80 shrink-0 bg-[#130C0E] border border-[#2A1A1D] hover:border-[#FF2A2A] p-6 rounded-[2px] space-y-4 transition-all group corner-bracket-container"
            >
              <div className="corner-bracket-tl" />
              <div className="corner-bracket-br" />

              <div className="h-40 bg-[#0A0607] border border-[#2A1A1D] flex items-center justify-center p-4">
                <img src={evt.guardian_asset || '/assets/logo.svg'} alt={evt.name} className="max-h-28 w-auto object-contain transition-transform group-hover:scale-105" />
              </div>

              <div className="space-y-1">
                <span className="mono-label text-[#E01B22]">{evt.category} • DAY {evt.day}</span>
                <h3 className="font-display font-bold text-base text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors truncate">
                  {evt.name}
                </h3>
              </div>

              <p className="text-xs text-[#A79798] line-clamp-2">{evt.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flagship Band (Star of LOGIN Edge-to-Edge) */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 bg-[#130C0E] border-b border-[#2A1A1D]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-center">
            <img src="/assets/guardians/the_last_standing.svg" alt="Star of LOGIN Flagship" className="max-h-80 mx-auto object-contain" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="chip-registered px-3 py-1 inline-flex items-center gap-1">
              ★ HEADLINE FLAGSHIP EVENT
            </span>
            <h2 className="display-l text-[#F7F2F2]">STAR OF LOGIN</h2>
            <p className="text-sm text-[#A79798] leading-relaxed">
              The supreme battle of endurance. Multi-stage elimination testing algorithmic speed, system design, logic puzzles, and high-pressure decision making.
            </p>
            <Link
              to="/events?id=11"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px]"
            >
              INSPECT FLAGSHIP BRIEFING →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. One Permitted Paper Inversion Accent Band (§2 Alumni Section) */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-[#F7F2F2] text-[#0A0607] border-b border-[#2A1A1D]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs font-bold text-[#E01B22] tracking-widest uppercase">
              PSG TECH MCA ALUMNI INVITATION
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#0A0607]">
              WELCOME HOME, ALUMNI
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A5C] leading-relaxed">
              Reconnect with past batches, network with current students, and witness the 35th edition of LOGIN on 18 & 19 September 2026.
            </p>
          </div>

          <Link
            to="/register?type=alumni"
            className="px-8 py-4 bg-[#E01B22] hover:bg-[#B4111A] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shrink-0 shadow-lg"
          >
            ALUMNI REGISTRATION FORM →
          </Link>
        </div>
      </section>

    </div>
  );
};
