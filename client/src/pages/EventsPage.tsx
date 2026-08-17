import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Calendar, Clock, MapPin, Users, Lock, CheckCircle2, Filter, X, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  description: string;
  category: 'TECHNICAL' | 'NON_TECHNICAL';
  team_type: 'INDIVIDUAL' | 'TEAM';
  min_team_size: number;
  max_team_size: number;
  day: number;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  max_participants: number;
  is_flagship: boolean;
  guardian_asset: string;
  entry_fee: number;
  rules_url?: string;
  status: string;
}

const GUARDIAN_DATA: Record<string, { name: string; quote: string; briefing: string }> = {
  "Blind Coding": {
    name: "VEIL",
    quote: "Code in the dark. Your eyes lie; your logic does not.",
    briefing: "I am VEIL. In this arena, visual constraints tighten progressively. You will construct syntactically flawless software while deprived of standard IDE feedback. A tie-break mini-event awards bonus points to true masterminds."
  },
  "CodeXcape": {
    name: "VAULTWARDEN",
    quote: "A six-digit code stands between you and freedom. The clock ticks.",
    briefing: "I am VAULTWARDEN. Welcome to the technical escape room. Solve timed cryptographic puzzles and algorithmic riddles to extract key fragments and unlock the final escape sequence."
  },
  "Debug Arena": {
    name: "FRACTURE",
    quote: "Corrupted memory. Broken pointers. Fix it before system failure.",
    briefing: "I am FRACTURE. Flawless code is a myth; diagnosis is an art. You are tasked with identifying, isolating, and optimizing faulty programs against strict runtime limits."
  },
  "Extraction": {
    name: "BLACKOUT-9",
    quote: "Operation BLACKOUT is active. Breach the vault and extract the payload.",
    briefing: "I am BLACKOUT-9. Engage in a story-driven cybersecurity CTF. Overcome cryptography, authentication bypasses, and digital forensics to neutralize the threat."
  },
  "Project Phoenix: System Recovery": {
    name: "PYRE-01",
    quote: "Catastrophic failure in progress. Rebuild from the ashes.",
    briefing: "I am PYRE-01. A software engineering simulation simulating production disasters. Recovery squads must analyze server crash logs and restore critical infrastructure in real-time."
  },
  "Code Relay": {
    name: "TANDEM",
    quote: "Swap coders every five minutes. One mind in two bodies.",
    briefing: "I am TANDEM. Two-member teams solve complex algorithmic problems while swapping active coders on a strict five-minute timer. Sync or shatter."
  },
  "In The Slot": {
    name: "GAVELON",
    quote: "Cricket wisdom, fast math, and high-stakes psychology.",
    briefing: "I am GAVELON. Step into the ultimate IPL-style auction. Manage your budget, anticipate rival picks, and assemble a championship squad under pressure."
  },
  "Hunt Your Treasure — QR Escape Challenge": {
    name: "QRUX",
    quote: "Decipher the grid. Scan the hidden marks across campus.",
    briefing: "I am QRUX. Solve cryptic puzzles, locate concealed QR targets across PSG Tech campus, and answer MCA and general knowledge questions to unlock the next stage."
  },
  "NOSTOS: The Journey Home": {
    name: "HELMSMAN",
    quote: "Navigate Odysseus's trials across logic and patterns.",
    briefing: "I am HELMSMAN. Sail through wordplay, mathematical series, riddles, and pattern recognition on an interactive live world map to reach your homeland."
  },
  "Pixel Paradox: AI or Reality?": {
    name: "SIMULACRA",
    quote: "Deepfake or authentic? Look closely at the artifacts.",
    briefing: "I am SIMULACRA. Test your media observation and AI awareness. Differentiate synthetic generative media from authentic content through technical reasoning."
  },
  "Star of LOGIN": {
    name: "THE LAST STANDING",
    quote: "The headline event of LOGIN 2026. The last mind standing.",
    briefing: "I am THE LAST STANDING. This is the supreme crown of LOGIN 2026. Only the most versatile, resilient, and brilliant mind will endure through multi-stage eliminate rounds."
  }
};

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');

  // Category Filter state from URL query parameter ?category=
  const categoryParam = searchParams.get('category')?.toUpperCase() || 'ALL';
  const selectedEventId = searchParams.get('id');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.events.getAll();
        if (Array.isArray(res.data)) {
          setEvents(res.data);
          
          if (selectedEventId) {
            const found = res.data.find((e: Event) => e.id === Number(selectedEventId));
            if (found) setSelectedEvent(found);
          }
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedEventId]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      api.registrations.getMyRegistrations().then((res) => {
        if (Array.isArray(res.data)) {
          setUserRegistrations(res.data.map((r: any) => r.event_id));
        }
      }).catch(() => {});

      api.payments.getMyStatus().then((res) => {
        if (res.data?.status === 'VERIFIED' || res.data?.status === 'successful') {
          setPaymentVerified(true);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const filteredEvents = events.filter((e) => {
    if (categoryParam === 'TECHNICAL') return e.category === 'TECHNICAL';
    if (categoryParam === 'NON_TECHNICAL') return e.category === 'NON_TECHNICAL';
    return true;
  });

  const handleRegisterEvent = async (event: Event) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!paymentVerified) {
      navigate('/dashboard#payment');
      return;
    }

    try {
      setRegistering(true);

      await api.registrations.register({
        event_id: event.id,
        team_name: event.team_type === 'TEAM' ? teamNameInput : undefined,
      });

      setUserRegistrations([...userRegistrations, event.id]);
      setSelectedEvent(null);
      setTeamNameInput('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register for event.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-30 bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px] flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="mono-label text-[#E01B22] font-bold">CATEGORIES:</span>
            {['ALL', 'TECHNICAL', 'NON_TECHNICAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-[2px] font-mono text-xs font-bold transition-all border ${
                  (cat === 'ALL' && categoryParam === 'ALL') ||
                  (cat === 'TECHNICAL' && categoryParam === 'TECHNICAL') ||
                  (cat === 'NON_TECHNICAL' && categoryParam === 'NON_TECHNICAL')
                    ? 'bg-[#E01B22] text-[#F7F2F2] border-[#E01B22]'
                    : 'bg-[#0A0607] text-[#A79798] border-[#2A1A1D] hover:border-[#A79798]'
                }`}
              >
                {cat === 'ALL' ? 'ALL ARENAS' : cat === 'TECHNICAL' ? 'TECHNICAL' : 'NON-TECHNICAL'}
              </button>
            ))}
          </div>

          <div className="mono-label text-[#6B5A5C]">
            SHOWING {filteredEvents.length} OF 11 EVENTS
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#130C0E] border border-[#2A1A1D] h-96 rounded-[2px] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-8 space-y-4 max-w-md mx-auto">
            <Filter className="w-12 h-12 text-[#6B5A5C] mx-auto" />
            <h3 className="text-lg font-display font-bold text-[#F7F2F2]">No events match this category</h3>
            <p className="text-xs text-[#A79798]">Select 'ALL ARENAS' to view the complete list of 11 LOGIN 2026 events.</p>
            <button
              onClick={() => handleCategoryChange('ALL')}
              className="px-6 py-2 bg-[#E01B22] text-[#F7F2F2] text-xs font-mono font-bold rounded-[2px]"
            >
              SHOW ALL 11 EVENTS
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredEvents.map((event) => {
              const guardian = GUARDIAN_DATA[event.name] || {
                name: "GUARDIAN",
                quote: "Enter the arena.",
                briefing: event.description
              };
              const isRegistered = userRegistrations.includes(event.id);
              const isLocked = !paymentVerified;

              return (
                <div
                  key={event.id}
                  className={`bg-[#130C0E] rounded-[2px] flex flex-col transition-all duration-200 corner-bracket-container ${
                    event.is_flagship
                      ? 'border-2 border-[#E01B22] shadow-2xl lg:col-span-3 lg:flex-row'
                      : 'border border-[#2A1A1D] hover:border-[#3E2529]'
                  }`}
                >
                  <div className="corner-bracket-tl" />
                  <div className="corner-bracket-br" />

                  {/* Guardian Art Frame */}
                  <div className={`p-6 bg-[#0A0607] border-b border-[#2A1A1D] flex items-center justify-center scanlines ${event.is_flagship ? 'lg:w-1/3 lg:border-b-0 lg:border-r' : 'h-52'}`}>
                    <img
                      src={event.guardian_asset || '/assets/logo.svg'}
                      alt={`${guardian.name} Guardian`}
                      className="max-h-40 w-auto object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1A1114] text-[#FF2A2A] border border-[#3E2529] rounded-[2px] uppercase">
                            {event.category}
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-mono text-[#A79798] bg-[#0A0607] border border-[#2A1A1D] rounded-[2px]">
                            {event.team_type === 'TEAM' ? `TEAM (${event.min_team_size}-${event.max_team_size})` : 'INDIVIDUAL'}
                          </span>
                        </div>

                        {event.is_flagship && (
                          <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#E01B22] text-[#F7F2F2] rounded-[2px] flex items-center gap-1 shadow-md">
                            ★ FLAGSHIP
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-display font-bold text-[#F7F2F2] line-clamp-2 hover:text-[#E01B22] transition-colors">
                        {event.name}
                      </h2>

                      {/* Guardian Voice Line */}
                      <p className="text-xs font-mono italic text-[#FF2A2A] mt-1 line-clamp-1">
                        "{guardian.quote}"
                      </p>

                      {/* Description */}
                      <p className="text-xs text-[#A79798] font-body line-clamp-2 mt-2 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Event Parameters */}
                      <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono text-[#A79798] bg-[#0A0607] p-3 rounded-[2px] border border-[#2A1A1D]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#E01B22]" />
                          <span>Day {event.day} Sep</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#E01B22]" />
                          <span>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E01B22]" />
                          <span className="truncate">{event.venue || 'TBA'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#E01B22]" />
                          <span>Max: {event.max_participants || 'Unlimited'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row (Pinned to bottom) */}
                    <div className="pt-4 border-t border-[#2A1A1D] flex items-center justify-between mt-auto">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-xs font-mono text-[#A79798] hover:text-[#F7F2F2] flex items-center gap-1 transition-colors"
                      >
                        Briefing & Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* CTA State Vocabulary */}
                      {!isAuthenticated ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="px-4 py-2 bg-[#130C0E] hover:bg-[#1A1114] border border-[#E01B22] text-[#E01B22] font-mono text-xs font-bold uppercase rounded-[2px]"
                        >
                          Sign In To Register
                        </button>
                      ) : isRegistered ? (
                        <span className="chip-registered px-4 py-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered ✓
                        </span>
                      ) : isLocked ? (
                        <button
                          onClick={() => navigate('/dashboard#payment')}
                          className="chip-pending px-4 py-2 flex items-center gap-1.5"
                          title="Verify payment first to unlock event registrations"
                        >
                          <Lock className="w-3.5 h-3.5" /> Locked — Pay First
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-5 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors shadow-md"
                        >
                          REGISTER NOW
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Guardian Briefing Split Modal (§9.2 & §10) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#0A0607]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#130C0E] border border-[#E01B22] w-full max-w-4xl rounded-[2px] shadow-2xl overflow-hidden relative my-8 corner-bracket-container">
            <div className="corner-bracket-tl" />
            <div className="corner-bracket-br" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#A79798] hover:text-[#F7F2F2] p-2 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Split Layout: Left Guardian Panel (42% desktop) vs Right Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Guardian Panel */}
              <div className="lg:col-span-5 bg-[#0A0607] p-8 border-b lg:border-b-0 lg:border-r border-[#2A1A1D] flex flex-col items-center justify-center text-center scanlines">
                <img
                  src={selectedEvent.guardian_asset || '/assets/logo.svg'}
                  alt="Guardian Art"
                  className="max-h-56 w-auto object-contain mb-4"
                />
                <span className="mono-label text-[#FF2A2A] font-bold">
                  GUARDIAN // {(GUARDIAN_DATA[selectedEvent.name] || {}).name || 'SYSTEM'}
                </span>
                <p className="text-xs font-mono italic text-[#A79798] mt-2">
                  "{(GUARDIAN_DATA[selectedEvent.name] || {}).quote}"
                </p>
              </div>

              {/* Right Content Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto font-body text-xs text-[#F7F2F2]">
                
                <div>
                  <span className="mono-label text-[#E01B22] uppercase">{selectedEvent.category} • DAY {selectedEvent.day} SEP</span>
                  <h2 className="display-l text-[#F7F2F2] mt-1">{selectedEvent.name}</h2>
                </div>

                {/* Tactical Console Briefing Dialogue */}
                <div className="bg-[#0A0607] border border-[#5C1116] p-4 rounded-[2px] space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-[#FF2A2A] border-b border-[#2A1A1D] pb-2">
                    <span>CONSOLE BRIEFING // ENCRYPTED</span>
                    <span>MECHA TACTICAL HUD</span>
                  </div>
                  <p className="text-xs text-[#F7F2F2] leading-relaxed pt-1">
                    {(GUARDIAN_DATA[selectedEvent.name] || {}).briefing || selectedEvent.description}
                  </p>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0A0607] p-4 rounded-[2px] border border-[#2A1A1D] text-center font-mono">
                  <div>
                    <span className="mono-label block">FORMAT</span>
                    <strong className="text-[#E01B22]">{selectedEvent.team_type}</strong>
                  </div>
                  <div>
                    <span className="mono-label block">TEAM SIZE</span>
                    <strong className="text-[#F7F2F2]">{selectedEvent.min_team_size}-{selectedEvent.max_team_size}</strong>
                  </div>
                  <div>
                    <span className="mono-label block">VENUE</span>
                    <strong className="text-[#F7F2F2]">{selectedEvent.venue || 'TBA'}</strong>
                  </div>
                  <div>
                    <span className="mono-label block">FEE</span>
                    <strong className="text-[#1FA971]">INCLUDED</strong>
                  </div>
                </div>

                {/* Overview & Rules */}
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-sm text-[#F7F2F2] uppercase">RULES & REGULATIONS</h4>
                  <p className="text-xs text-[#A79798] leading-relaxed">
                    Carry your official LOGIN 2026 Student ID card to the venue. Malpractice or failure to arrive on time leads to immediate disqualification.
                  </p>
                </div>

                {/* Team Input */}
                {selectedEvent.team_type === 'TEAM' && !userRegistrations.includes(selectedEvent.id) && paymentVerified && (
                  <div className="bg-[#0A0607] p-4 rounded-[2px] border border-[#2A1A1D] space-y-2">
                    <label className="block text-xs font-mono text-[#E08A17] font-bold">TEAM NAME *</label>
                    <input
                      type="text"
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      placeholder="Enter team name..."
                      className="w-full bg-[#130C0E] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3 py-2 text-xs text-[#F7F2F2] outline-none font-body"
                    />
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-4 border-t border-[#2A1A1D] flex justify-between items-center">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-xs font-mono text-[#A79798] hover:text-[#F7F2F2]"
                  >
                    Close Briefing
                  </button>

                  {!isAuthenticated ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-2.5 bg-[#E01B22] text-[#F7F2F2] text-xs font-mono font-bold uppercase rounded-[2px]"
                    >
                      SIGN IN TO REGISTER
                    </button>
                  ) : userRegistrations.includes(selectedEvent.id) ? (
                    <span className="text-xs font-mono text-[#1FA971] font-bold">Registered ✓</span>
                  ) : !paymentVerified ? (
                    <button
                      onClick={() => navigate('/dashboard#payment')}
                      className="px-6 py-2.5 bg-[#E08A17] text-[#0A0607] text-xs font-mono font-bold uppercase rounded-[2px]"
                    >
                      PAYMENT REQUIRED TO UNLOCK
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisterEvent(selectedEvent)}
                      disabled={registering || (selectedEvent.team_type === 'TEAM' && !teamNameInput.trim())}
                      className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:opacity-50 text-[#F7F2F2] text-xs font-mono font-bold uppercase rounded-[2px] shadow-lg"
                    >
                      {registering ? 'CONFIRMING...' : 'CONFIRM EVENT REGISTRATION'}
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
