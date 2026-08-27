import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Filter, X, Monitor } from 'lucide-react';

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
  is_online: boolean;
  max_participants: number;
  is_flagship: boolean;
  guardian_asset: string;
  entry_fee: number;
  rules_url?: string;
  status: string;
  coordinator_name?: string;
  coordinator_phone?: string;
}

interface EventDetail {
  name: string;
  guardianName: string;
  quote: string;
  durationText: string;
  shortDesc: string;
  fullDesc: string;
  skills: string[];
  briefing: string;
}

const EVENT_DETAILS: Record<string, EventDetail> = {
  "NOSTOS: The Journey Home": {
    name: "NOSTOS: The Journey Home",
    guardianName: "HELMSMAN",
    quote: "Navigate Odysseus's trials across logic and patterns.",
    durationText: "~3 Hours",
    shortDesc: "Embark on an Odyssey-inspired team adventure filled with riddles, wordplay, logic, patterns, and visual puzzles. Work together to find your way back to Ithaca.",
    fullDesc: "Embark on an Odyssey-inspired team adventure filled with riddles, wordplay, logic, patterns, and visual puzzles. Work together as a ship’s crew, overcome challenging trials, and find your way back to Ithaca.",
    skills: ["Logical Thinking", "Teamwork", "Observation", "Problem Solving"],
    briefing: "I am HELMSMAN. Sail through wordplay, mathematical series, riddles, and pattern recognition on an interactive live world map to reach your homeland."
  },
  "Code Relay": {
    name: "Code Relay",
    guardianName: "TANDEM",
    quote: "Swap coders every five minutes. One mind in two bodies.",
    durationText: "75 Minutes",
    shortDesc: "A fast-paced collaborative coding challenge where teammates take turns coding and must quickly understand and continue each other’s work.",
    fullDesc: "A fast-paced collaborative coding challenge where teammates take turns coding and must quickly understand and continue each other’s work. Success depends on coding ability, adaptability, communication, and teamwork.",
    skills: ["Programming", "Debugging", "Teamwork", "Adaptability"],
    briefing: "I am TANDEM. Two-member teams solve complex algorithmic problems while swapping active coders on a strict five-minute timer. Sync or shatter."
  },
  "In The Slot": {
    name: "IN THE SLOT!!",
    guardianName: "GAVELON",
    quote: "Cricket wisdom, fast math, and high-stakes psychology.",
    durationText: "3–4 Hours",
    shortDesc: "Step into the world of IPL-style franchise auctions. Identify players from statistics, manage your budget, decode opponents’ hidden strategies, and build the strongest squad.",
    fullDesc: "Step into the world of IPL-style franchise auctions. Identify players from statistics, manage your budget, decode opponents’ hidden strategies, and make smart bidding decisions to build the strongest squad.",
    skills: ["Cricket Knowledge", "Strategy", "Budgeting", "Negotiation", "Decision Making"],
    briefing: "I am GAVELON. Step into the ultimate IPL-style auction. Manage your budget, anticipate rival picks, and assemble a championship squad under pressure."
  },
  "Debug Arena": {
    name: "Debug Arena",
    guardianName: "FRACTURE",
    quote: "Corrupted memory. Broken pointers. Fix it before system failure.",
    durationText: "90 Minutes",
    shortDesc: "Take the role of a software engineer and hunt down bugs in faulty programs. Identify errors, fix code, and optimize solutions.",
    fullDesc: "Take the role of a software engineer and hunt down bugs in faulty programs. Identify errors, fix code, optimize solutions, and tackle real-world debugging challenges across programming languages.",
    skills: ["Debugging", "Programming", "Analytical Thinking", "Optimization"],
    briefing: "I am FRACTURE. Flawless code is a myth; diagnosis is an art. You are tasked with identifying, isolating, and optimizing faulty programs against strict runtime limits."
  },
  "CodeXcape": {
    name: "CodeXcape",
    guardianName: "VAULTWARDEN",
    quote: "A six-digit code stands between you and freedom. The clock ticks.",
    durationText: "90 Minutes",
    shortDesc: "Solve interconnected technical challenges, combine clues, and crack the final six-digit escape code before time runs out.",
    fullDesc: "A technical escape-room challenge where teams solve interconnected programming and logic puzzles. Combine clues, communicate with your teammate, and piece together the final six-digit escape code before time runs out.",
    skills: ["Programming", "Logic", "Debugging", "Communication", "Problem Solving"],
    briefing: "I am VAULTWARDEN. Welcome to the technical escape room. Solve timed cryptographic puzzles and algorithmic riddles to extract key fragments and unlock the final escape sequence."
  },
  "Blind Coding": {
    name: "Blind Coding",
    guardianName: "VEIL",
    quote: "Code in the dark. Your eyes lie; your logic does not.",
    durationText: "60–90 Minutes",
    shortDesc: "When vision fades, logic takes over. Solve programming problems through an intentionally blurred coding interface.",
    fullDesc: "When vision fades, logic takes over. Solve programming problems through an intentionally blurred coding interface, relying on your memory, syntax knowledge, algorithms, and problem-solving ability.",
    skills: ["Coding", "Algorithms", "Logical Thinking", "Memory", "Problem Solving"],
    briefing: "I am VEIL. In this arena, visual constraints tighten progressively. You will construct syntactically flawless software while deprived of standard IDE feedback."
  },
  "The Extraction": {
    name: "The Extraction",
    guardianName: "BLACKOUT-9",
    quote: "Operation BLACKOUT is active. Breach the vault and extract the payload.",
    durationText: "3–4 Hours",
    shortDesc: "Step into a story-driven cybersecurity mission where you decode encrypted data, analyze digital clues, crack hashes, and complete extraction.",
    fullDesc: "Step into a story-driven cybersecurity mission where you decode encrypted data, analyze digital clues, crack hashes, and solve multi-layered challenges to complete the final extraction.",
    skills: ["Cybersecurity", "Cryptography", "Encoding", "Logical Thinking"],
    briefing: "I am BLACKOUT-9. Engage in a story-driven cybersecurity CTF. Overcome cryptography, authentication bypasses, and digital forensics to neutralize the threat."
  },
  "Pixel Paradox: AI or Reality?": {
    name: "Pixel Paradox: AI or Reality?",
    guardianName: "SIMULACRA",
    quote: "Deepfake or authentic? Look closely at the artifacts.",
    durationText: "60–75 Minutes",
    shortDesc: "Can you tell AI from reality? Analyze realistic images and media, spot subtle AI-generated artifacts, and reconstruct prompts.",
    fullDesc: "Can you tell AI from reality? Analyze realistic images and media, spot subtle AI-generated artifacts, identify hidden inconsistencies, and reconstruct prompts to prove your observation and AI awareness.",
    skills: ["Observation", "AI Awareness", "Critical Thinking", "Visual Analysis"],
    briefing: "I am SIMULACRA. Test your media observation and AI awareness. Differentiate synthetic generative media from authentic content through technical reasoning."
  },
  "Project Phoenix: System Recovery": {
    name: "Project Phoenix: System Recovery",
    guardianName: "PYRE-01",
    quote: "Catastrophic failure in progress. Rebuild from the ashes.",
    durationText: "2 Hours 30 Minutes",
    shortDesc: "Work as a Recovery Squad to debug applications, recover hidden services, restore infrastructure, and handle live technical incidents.",
    fullDesc: "Enter a simulated company facing a critical production failure. Work as a Recovery Squad to debug applications, recover hidden services, restore infrastructure, and handle live technical incidents before production goes down.",
    skills: ["Programming", "Debugging", "Reverse Engineering", "Linux", "Problem Solving"],
    briefing: "I am PYRE-01. A software engineering simulation simulating production disasters. Recovery squads must analyze server crash logs and restore critical infrastructure in real-time."
  },
  "Hunt your Treasure — QR Escape Challenge": {
    name: "Hunt your Treasure — QR Escape Challenge",
    guardianName: "QRUX",
    quote: "Decipher the grid. Scan the hidden marks across campus.",
    durationText: "2 Hours",
    shortDesc: "Solve clues, scan hidden QR codes across campus, and answer MCA and GK questions to unlock each stage.",
    fullDesc: "Solve clues, scan hidden QR codes across campus, and answer MCA and GK questions to unlock the next stage of the adventure.",
    skills: ["Observation", "Teamwork", "General Knowledge", "Problem Solving"],
    briefing: "I am QRUX. Solve cryptic puzzles, locate concealed QR targets across PSG Tech campus, and answer MCA and general knowledge questions to unlock the next stage."
  },
  "Star of LOGIN": {
    name: "Star of LOGIN",
    guardianName: "THE LAST STANDING",
    quote: "The headline event of LOGIN 2026. The last mind standing.",
    durationText: "3 Hours",
    shortDesc: "The headline flagship event of LOGIN 2026. Only winners of other events qualify to compete in this event.",
    fullDesc: "The headline flagship event of LOGIN 2026. Only winners of other events qualify to compete in this event. Coordinators will communicate directly with qualified participants.",
    skills: ["Advanced Coding", "Resilience", "Problem Solving", "Versatility"],
    briefing: "I am THE LAST STANDING. This is the supreme crown of LOGIN 2026. Only the most versatile, resilient, and brilliant mind will endure through multi-stage eliminate rounds."
  }
};

const getEventDetail = (eventName: string): EventDetail => {
  if (!eventName) return EVENT_DETAILS["Blind Coding"];
  const clean = eventName.toLowerCase().trim();

  if (clean.includes("blind")) return EVENT_DETAILS["Blind Coding"];
  if (clean.includes("nostos")) return EVENT_DETAILS["NOSTOS: The Journey Home"];
  if (clean.includes("relay")) return EVENT_DETAILS["Code Relay"];
  if (clean.includes("slot")) return EVENT_DETAILS["In The Slot"];
  if (clean.includes("debug")) return EVENT_DETAILS["Debug Arena"];
  if (clean.includes("xcape") || clean.includes("escape")) return EVENT_DETAILS["CodeXcape"];
  if (clean.includes("extraction")) return EVENT_DETAILS["The Extraction"];
  if (clean.includes("pixel") || clean.includes("paradox")) return EVENT_DETAILS["Pixel Paradox: AI or Reality?"];
  if (clean.includes("phoenix")) return EVENT_DETAILS["Project Phoenix: System Recovery"];
  if (clean.includes("treasure") || clean.includes("qr")) return EVENT_DETAILS["Hunt your Treasure — QR Escape Challenge"];
  if (clean.includes("star")) return EVENT_DETAILS["Star of LOGIN"];

  return EVENT_DETAILS[eventName] || {
    name: eventName,
    guardianName: "GUARDIAN",
    quote: "Enter the arena.",
    durationText: "90 Minutes",
    shortDesc: "Compete in LOGIN 2026 symposium challenge.",
    fullDesc: "Compete in LOGIN 2026 symposium challenge.",
    skills: ["Problem Solving", "Logic"],
    briefing: "Welcome to LOGIN 2026."
  };
};

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>(['']);

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

  useEffect(() => {
    if (!selectedEvent) return;
    setTeamNameInput('');
    setTeamMemberEmails(Array.from({ length: Math.max(1, (selectedEvent.max_team_size || 2) - 1) }, () => ''));
  }, [selectedEvent]);

  const handleRegisterEvent = async (event: Event) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const minMembers = Math.max(1, event.min_team_size || 1);
    const maxMembers = Math.max(minMembers, event.max_team_size || minMembers);
    const enteredTeammates = teamMemberEmails.map((email) => email.trim()).filter(Boolean);
    const totalMembers = 1 + enteredTeammates.length;

    if (event.team_type === 'TEAM' && (totalMembers < minMembers || totalMembers > maxMembers)) {
      alert(`This event requires ${minMembers}–${maxMembers} members total. Please adjust the teammate list.`);
      return;
    }

    try {
      setRegistering(true);

      const payload: any = {
        event_id: event.id,
        team_name: event.team_type === 'TEAM' ? teamNameInput : undefined,
      };

      if (event.team_type === 'TEAM') {
        payload.team_members = enteredTeammates;
      }

      await api.registrations.register(payload);

      setUserRegistrations([...userRegistrations, event.id]);
      setSelectedEvent(null);
      setTeamNameInput('');
      setTeamMemberEmails(['']);
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
            {filteredEvents.map((event, idx) => {
              const detail = getEventDetail(event.name);
              const isRegistered = userRegistrations.includes(event.id);

              return (
                <div
                  key={event.id}
                  className={`bg-[#130C0E] rounded-[2px] flex flex-col card-hover-lift corner-bracket-container border animate-fade-in-up ${
                    event.is_flagship
                      ? 'border-[#E01B22] shadow-[0_0_25px_rgba(224,27,34,0.25)]'
                      : 'border-[#2A1A1D] hover:border-[#E01B22]/50'
                  }`}
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  <div className="corner-bracket-tl" />
                  <div className="corner-bracket-br" />

                  {/* Guardian Art Frame */}
                  <div className="p-5 bg-[#1A1114] border-b-2 border-[#3E2529] flex items-center justify-center scanlines h-48 relative overflow-hidden shadow-[inset_0_0_40px_rgba(224,27,34,0.06)]">
                    {event.is_flagship && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#E01B22] text-[#F7F2F2] rounded-[2px] animate-pulse-glow z-10">
                        ★ FLAGSHIP
                      </span>
                    )}
                    <img
                      src={event.guardian_asset || '/assets/login.png'}
                      alt={`${detail.guardianName} Guardian`}
                      className="max-h-36 w-auto object-contain animate-float-slow drop-shadow-[0_0_20px_rgba(224,27,34,0.2)]"
                    />
                  </div>

                  {/* Clean Card Body Format */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Event Title */}
                      <h2 className="text-xl font-display font-bold text-[#F7F2F2] hover:text-[#E01B22] transition-colors leading-tight">
                        {event.name}
                      </h2>

                      {/* Sub-header line: Category • Team Size • Duration */}
                      <div className="text-xs font-mono font-semibold text-[#FF2A2A] mt-1">
                        {event.category === 'TECHNICAL' ? 'Technical' : 'Non-Technical'} • {(event.team_type === 'TEAM' || event.max_team_size > 1) ? `${event.min_team_size || 2}${event.max_team_size > (event.min_team_size || 1) ? `–${event.max_team_size}` : ''} Members` : 'Individual'} • {detail.durationText}
                      </div>

                      {/* Short Crisp Summary */}
                      <p className="text-xs text-[#A79798] leading-relaxed mt-3 line-clamp-3">
                        {event.description || detail.shortDesc}
                      </p>

                      {/* Skills Tags */}
                      {detail.skills && detail.skills.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#2A1A1D]/60 flex flex-wrap gap-1.5">
                          {detail.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 text-[10px] font-mono bg-[#1A1114] text-[#F7F2F2]/80 border border-[#3E2529] rounded-[2px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-4 border-t border-[#2A1A1D] flex items-center justify-between gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="px-3.5 py-2 text-xs font-mono font-semibold border border-[#2A1A1D] hover:border-[#A79798] text-[#A79798] hover:text-[#F7F2F2] rounded-[2px] transition-colors"
                      >
                        View Details
                      </button>

                      {/* CTA State Vocabulary */}
                      {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power' || user?.role === 'event_coordinator' ? (
                        <button
                          onClick={() => navigate(user?.role?.includes('coord') ? '/coordinator' : '/admin')}
                          className="px-3.5 py-2 bg-[#1A1114] border border-[#3E2529] hover:border-[#E08A17] text-[#E08A17] hover:text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors"
                        >
                          Manage Event
                        </button>
                      ) : event.is_flagship ? (
                        <span className="px-3.5 py-2 bg-[#1A1114] border border-[#E01B22] text-[#E01B22] font-mono text-xs font-bold rounded-[2px]">
                          Invite-Only
                        </span>
                      ) : !isAuthenticated ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors shadow-md"
                        >
                          Register Now
                        </button>
                      ) : isRegistered ? (
                        <span className="chip-registered px-3.5 py-2 flex items-center gap-1 text-xs font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors shadow-md"
                        >
                          Register Now
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

      {/* View Details / Briefing Modal */}
      {selectedEvent && (() => {
        const detail = getEventDetail(selectedEvent.name);
        const isRegistered = userRegistrations.includes(selectedEvent.id);

        return (
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

              {/* Split Layout: Left Guardian Panel vs Right Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Guardian Panel */}
                <div className="lg:col-span-5 bg-[#0A0607] p-8 border-b lg:border-b-0 lg:border-r border-[#2A1A1D] flex flex-col items-center justify-center text-center scanlines">
                  <img
                    src={selectedEvent.guardian_asset || '/assets/login.png'}
                    alt="Guardian Art"
                    className="max-h-56 w-auto object-contain mb-4"
                  />
                  <span className="mono-label text-[#FF2A2A] font-bold">
                    GUARDIAN // {detail.guardianName}
                  </span>
                  <p className="text-xs font-mono italic text-[#A79798] mt-2">
                    "{detail.quote}"
                  </p>
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto font-body text-xs text-[#F7F2F2]">
                  
                  <div>
                    <span className="mono-label text-[#E01B22] uppercase">
                      {selectedEvent.category === 'TECHNICAL' ? 'Technical' : 'Non-Technical'} • DAY {selectedEvent.day} SEP
                    </span>
                    <h2 className="display-l text-[#F7F2F2] mt-1">{selectedEvent.name}</h2>
                    {selectedEvent.is_online && (
                      <span className="inline-flex items-center gap-1 text-[#FF2A2A] font-mono text-xs tracking-widest mt-2">
                        <Monitor className="w-4 h-4" /> ONLINE EVENT
                      </span>
                    )}
                    <p className="text-xs font-mono text-[#FF2A2A] mt-1">
                      {selectedEvent.team_type === 'TEAM' ? `Team (${selectedEvent.min_team_size}${selectedEvent.max_team_size > selectedEvent.min_team_size ? `–${selectedEvent.max_team_size}` : ''} Members)` : 'Individual'} • Duration: {detail.durationText}
                    </p>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <span className="mono-label text-[#A79798]">EVENT OVERVIEW</span>
                    <p className="text-xs text-[#F7F2F2] leading-relaxed">
                      {detail.fullDesc}
                    </p>
                  </div>

                  {(selectedEvent.coordinator_name || selectedEvent.coordinator_phone) && (
                    <div className="space-y-2">
                      <span className="mono-label text-[#A79798]">EVENT COORDINATORS</span>
                      <div className="text-xs text-[#F7F2F2] leading-relaxed space-y-1">
                        {(selectedEvent.coordinator_name || '').split(';').map((name, index) => (
                          <div key={name}>
                            Coordinator {index + 1} - {name.trim()} {selectedEvent.coordinator_phone?.split(';')[index]?.trim() && `- ${selectedEvent.coordinator_phone.split(';')[index].trim()}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Tags */}
                  <div className="space-y-2">
                    <span className="mono-label text-[#A79798]">CORE SKILLS EVALUATED</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {detail.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-mono bg-[#1A1114] text-[#E01B22] border border-[#3E2529] rounded-[2px]">
                          • {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Console Briefing Dialogue */}
                  <div className="bg-[#0A0607] border border-[#5C1116] p-4 rounded-[2px] space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[10px] text-[#FF2A2A] border-b border-[#2A1A1D] pb-2">
                      <span>CONSOLE BRIEFING // ENCRYPTED</span>
                      <span>TACTICAL HUD</span>
                    </div>
                    <p className="text-xs text-[#F7F2F2] leading-relaxed pt-1">
                      {detail.briefing}
                    </p>
                  </div>

                  {/* Specs Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0A0607] p-4 rounded-[2px] border border-[#2A1A1D] text-center font-mono">
                    <div>
                      <span className="mono-label block">FORMAT</span>
                      <strong className="text-[#E01B22]">{selectedEvent.team_type}</strong>
                    </div>
                    <div>
                      <span className="mono-label block">VENUE</span>
                      <strong className="text-[#F7F2F2]">{selectedEvent.is_online ? 'ONLINE' : (selectedEvent.venue || 'TBA')}</strong>
                    </div>
                    <div>
                      <span className="mono-label block">START TIME</span>
                      <strong className="text-[#F7F2F2]">{selectedEvent.start_time.slice(0, 5)}</strong>
                    </div>
                    <div>
                      <span className="mono-label block">FEE</span>
                      <strong className="text-[#1FA971]">INCLUDED</strong>
                    </div>
                  </div>

                  {/* Team Registration Input if applicable */}
                  {selectedEvent.team_type === 'TEAM' && !isRegistered && user?.role !== 'admin' && user?.role !== 'event_coordinator' && user?.role !== 'super_admin' && user?.role !== 'admin_power' && (
                    <div className="space-y-3 pt-2 border-t border-[#2A1A1D]">
                      <div className="space-y-2">
                        <label className="mono-label text-[#F7F2F2] block">ENTER YOUR SQUAD / TEAM NAME:</label>
                        <input
                          type="text"
                          value={teamNameInput}
                          onChange={(e) => setTeamNameInput(e.target.value)}
                          placeholder="e.g. CyberVipers"
                          className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] px-4 py-2 text-xs font-mono text-[#F7F2F2] rounded-[2px] outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="mono-label text-[#F7F2F2] block">TEAM MEMBER EMAILS:</label>
                        {teamMemberEmails.map((email, index) => (
                          <input
                            key={`teammate-${index}`}
                            type="email"
                            value={email}
                            onChange={(e) => {
                              const next = [...teamMemberEmails];
                              next[index] = e.target.value;
                              setTeamMemberEmails(next);
                            }}
                            placeholder={`Teammate ${index + 1} email`}
                            className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] px-4 py-2 text-xs font-mono text-[#F7F2F2] rounded-[2px] outline-none"
                          />
                        ))}
                        <p className="text-[10px] font-mono text-[#A79798]">
                          Team size must be between {Math.max(1, selectedEvent.min_team_size || 1)} and {Math.max(Math.max(1, selectedEvent.min_team_size || 1), selectedEvent.max_team_size || Math.max(1, selectedEvent.min_team_size || 1))} members total.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Register Action inside Modal */}
                  <div className="pt-4 border-t border-[#2A1A1D] flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-2 border border-[#2A1A1D] text-[#A79798] hover:text-[#F7F2F2] font-mono text-xs rounded-[2px]"
                    >
                      Close Briefing
                    </button>
                    
                    {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power' || user?.role === 'event_coordinator' ? (
                      <button
                        onClick={() => navigate(user?.role?.includes('coord') ? '/coordinator' : '/admin')}
                        className="px-6 py-2 bg-[#E08A17] text-[#0A0607] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors shadow-md"
                      >
                        Go to Event Control Hub →
                      </button>
                    ) : selectedEvent.is_flagship ? (
                      <span className="px-4 py-2 bg-[#1A1114] border border-[#E01B22] text-[#E01B22] font-mono text-xs font-bold rounded-[2px]">
                        Invite-Only (Competition Winners)
                      </span>
                    ) : isRegistered ? (
                      <span className="chip-registered px-4 py-2 text-xs font-mono">
                        Registered ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegisterEvent(selectedEvent)}
                        disabled={
                          registering ||
                          (selectedEvent.team_type === 'TEAM' && (
                            !teamNameInput.trim() ||
                            (1 + teamMemberEmails.filter((email) => email.trim()).length) < Math.max(1, selectedEvent.min_team_size || 1) ||
                            (1 + teamMemberEmails.filter((email) => email.trim()).length) > Math.max(Math.max(1, selectedEvent.min_team_size || 1), selectedEvent.max_team_size || Math.max(1, selectedEvent.min_team_size || 1))
                          ))
                        }
                        className="px-6 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:opacity-50 text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors shadow-md"
                      >
                        {registering ? 'Transmitting...' : 'Confirm Registration'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default EventsPage;
