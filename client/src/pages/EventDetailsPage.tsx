import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import eventsData from '../data/events.json';
import { Monitor, ArrowLeft, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const EventDetailsPage: React.FC = () => {
  const { id: slug } = useParams(); // Using slug as id in the url
  const navigate = useNavigate();
  const { isAuthenticated, user, survivor } = useAuthStore();
  
  const [registering, setRegistering] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>(['']);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      api.registrations.getMyRegistrations().then((res) => {
        if (Array.isArray(res.data)) {
          setUserRegistrations(res.data.map((r: any) => r.event_id));
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const selectedEvent = eventsData.find((e: any) => e.slug === slug) as any;

  useEffect(() => {
    if (!selectedEvent) return;
    setTeamNameInput('');
    setTeamMemberEmails(Array.from({ length: Math.max(1, (selectedEvent.min_team_size || 1) - 1) }, () => ''));
  }, [selectedEvent]);

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-[#0A0607] py-12 px-4 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-16 h-16 text-[#E01B22] mb-4" />
        <h1 className="text-3xl font-display font-bold text-[#F7F2F2]">EVENT NOT FOUND</h1>
        <p className="text-[#A79798] mt-2 font-mono">The specified arena data is missing or corrupted.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-6 px-6 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px]"
        >
          Return to Arenas
        </button>
      </div>
    );
  }

  const detail = selectedEvent.detail;
  const isRegistered = userRegistrations.includes(selectedEvent.id) || survivor?.registrations?.some((r: any) => r.worldId === selectedEvent.id);

  const handleRegisterEvent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const minMembers = Math.max(1, selectedEvent.min_team_size || 1);
    const maxMembers = Math.max(minMembers, selectedEvent.max_team_size || minMembers);
    const enteredTeammates = teamMemberEmails.map((email) => email.trim()).filter(Boolean);
    const totalMembers = 1 + enteredTeammates.length;

    if (selectedEvent.team_type === 'TEAM' && (totalMembers < minMembers || totalMembers > maxMembers)) {
      alert(`This event requires ${minMembers}–${maxMembers} members total. Please adjust the teammate list.`);
      return;
    }

    try {
      setRegistering(true);

      const payload: any = {
        event_id: selectedEvent.id,
        team_name: selectedEvent.team_type === 'TEAM' ? teamNameInput : undefined,
      };

      if (selectedEvent.team_type === 'TEAM') {
        payload.team_members = enteredTeammates;
      }

      await api.registrations.register(payload);
      setUserRegistrations([...userRegistrations, selectedEvent.id]);
      alert("Registration successful!");
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register for event.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2] animate-in fade-in">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/events')}
          className="mb-8 inline-flex items-center gap-2 text-[#A79798] hover:text-[#F7F2F2] font-mono text-xs uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Arenas
        </button>

        <div className="bg-[#130C0E] border border-[#E01B22] rounded-[2px] shadow-2xl overflow-hidden relative corner-bracket-container">
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          {/* Split Layout: Left Guardian Panel vs Right Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Guardian Panel */}
            <div className="lg:col-span-5 bg-[#0A0607] p-8 border-b lg:border-b-0 lg:border-r border-[#2A1A1D] flex flex-col items-center justify-center text-center scanlines relative min-h-[400px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e01b22_1px,transparent_1px),linear-gradient(to_bottom,#e01b22_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03]" />
              <img
                src={selectedEvent.guardian_asset || '/assets/login.png'}
                alt="Guardian Art"
                className="max-h-72 w-auto object-contain mb-6 animate-float-slow drop-shadow-[0_0_30px_rgba(224,27,34,0.3)] z-10"
              />
              <div className="z-10 bg-[#0A0607]/80 backdrop-blur-sm p-4 rounded border border-[#2A1A1D]">
                <span className="mono-label text-[#FF2A2A] font-bold block mb-2 text-sm tracking-widest">
                  GUARDIAN // {detail.guardianName}
                </span>
                <p className="text-xs font-mono italic text-[#A79798]">
                  "{detail.quote}"
                </p>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8 font-body text-xs text-[#F7F2F2]">
              
              <div>
                <span className="mono-label text-[#E01B22] uppercase tracking-widest">
                  {selectedEvent.category === 'TECHNICAL' ? 'Technical' : 'Non-Technical'} • DAY {selectedEvent.day} SEP
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-black text-[#F7F2F2] mt-2 leading-none">
                  {selectedEvent.name}
                </h1>
                {selectedEvent.is_online && (
                  <span className="inline-flex items-center gap-1.5 text-[#FF2A2A] font-mono text-xs tracking-widest mt-3">
                    <Monitor className="w-4 h-4" /> ONLINE EVENT
                  </span>
                )}
                <p className="text-sm font-mono text-[#FF2A2A] mt-2 opacity-90">
                  {selectedEvent.team_type === 'TEAM' ? `Team (${selectedEvent.min_team_size}${selectedEvent.max_team_size > selectedEvent.min_team_size ? `–${selectedEvent.max_team_size}` : ''} Members)` : 'Individual'} • Duration: {detail.durationText}
                </p>
              </div>

              {/* Detailed Description */}
              <div className="space-y-3">
                <h3 className="mono-label text-[#A79798] border-b border-[#2A1A1D] pb-2">EVENT OVERVIEW</h3>
                <p className="text-sm text-[#F7F2F2] leading-relaxed opacity-90">
                  {detail.fullDesc}
                </p>
              </div>

              {(selectedEvent.coordinator_name || selectedEvent.coordinator_phone) && (
                <div className="space-y-3">
                  <h3 className="mono-label text-[#A79798] border-b border-[#2A1A1D] pb-2">EVENT COORDINATORS</h3>
                  <div className="text-sm text-[#F7F2F2] leading-relaxed space-y-1 opacity-90">
                    {(selectedEvent.coordinator_name || '').split(';').map((name: string, index: number) => (
                      <div key={name}>
                        Coordinator {index + 1} - {name.trim()} {selectedEvent.coordinator_phone?.split(';')[index]?.trim() && `- ${selectedEvent.coordinator_phone.split(';')[index].trim()}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              <div className="space-y-3">
                <h3 className="mono-label text-[#A79798] border-b border-[#2A1A1D] pb-2">CORE SKILLS EVALUATED</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {detail.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 text-xs font-mono bg-[#1A1114] text-[#E01B22] border border-[#3E2529] rounded-[2px] shadow-sm">
                      • {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tactical Console Briefing Dialogue */}
              <div className="bg-[#0A0607] border border-[#5C1116] p-5 rounded-[2px] space-y-3 font-mono shadow-[inset_0_0_20px_rgba(224,27,34,0.05)]">
                <div className="flex items-center justify-between text-xs text-[#FF2A2A] border-b border-[#2A1A1D] pb-2">
                  <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> CONSOLE BRIEFING // ENCRYPTED</span>
                  <span>TACTICAL HUD</span>
                </div>
                <p className="text-sm text-[#F7F2F2] leading-relaxed pt-1 opacity-90">
                  {detail.briefing}
                </p>
              </div>

              {/* Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0A0607] p-5 rounded-[2px] border border-[#2A1A1D] text-center font-mono">
                <div>
                  <span className="mono-label block mb-1">FORMAT</span>
                  <strong className="text-[#E01B22]">{selectedEvent.team_type}</strong>
                </div>
                <div>
                  <span className="mono-label block mb-1">VENUE</span>
                  <strong className="text-[#F7F2F2]">{selectedEvent.is_online ? 'ONLINE' : (selectedEvent.venue || 'TBA')}</strong>
                </div>
                <div>
                  <span className="mono-label block mb-1">START TIME</span>
                  <strong className="text-[#F7F2F2]">{selectedEvent.start_time.slice(0, 5)}</strong>
                </div>
                <div>
                  <span className="mono-label block mb-1">FEE</span>
                  <strong className="text-[#1FA971]">INCLUDED</strong>
                </div>
              </div>

              {/* Team Registration Input if applicable */}
              {selectedEvent.team_type === 'TEAM' && !isRegistered && user?.role !== 'admin' && user?.role !== 'event_coordinator' && user?.role !== 'super_admin' && user?.role !== 'admin_power' && (
                <div className="space-y-4 pt-4 border-t border-[#2A1A1D]">
                  <div className="space-y-2">
                    <label className="mono-label text-[#F7F2F2] block">ENTER YOUR SQUAD / TEAM NAME:</label>
                    <input
                      type="text"
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      placeholder="e.g. CyberVipers"
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] px-4 py-3 text-sm font-mono text-[#F7F2F2] rounded-[2px] outline-none transition-colors"
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
                        className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] px-4 py-3 text-sm font-mono text-[#F7F2F2] rounded-[2px] outline-none transition-colors"
                      />
                    ))}
                    <p className="text-[11px] font-mono text-[#A79798] mt-1">
                      Team size must be between {Math.max(1, selectedEvent.min_team_size || 1)} and {Math.max(Math.max(1, selectedEvent.min_team_size || 1), selectedEvent.max_team_size || Math.max(1, selectedEvent.min_team_size || 1))} members total.
                    </p>
                  </div>
                </div>
              )}

              {/* Register Action */}
              <div className="pt-6 border-t border-[#2A1A1D] flex flex-col sm:flex-row items-center justify-between gap-4">
                {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'admin_power' || user?.role === 'event_coordinator' ? (
                  <button
                    onClick={() => navigate(user?.role?.includes('coord') ? '/coordinator' : '/admin')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#E08A17] text-[#0A0607] font-mono text-sm font-bold uppercase rounded-[2px] transition-colors shadow-lg hover:bg-[#FFA500]"
                  >
                    Go to Event Control Hub →
                  </button>
                ) : selectedEvent.is_flagship ? (
                  <div className="w-full bg-[#1A1114] border border-[#E01B22] p-4 text-center rounded-[2px]">
                    <span className="text-[#E01B22] font-mono text-sm font-bold uppercase tracking-widest">
                      Invite-Only (Competition Winners)
                    </span>
                  </div>
                ) : isRegistered ? (
                  <div className="w-full bg-[#0F291E] border border-[#1FA971] p-4 text-center rounded-[2px] shadow-[0_0_20px_rgba(31,169,113,0.1)]">
                    <span className="text-[#1FA971] font-mono text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5" /> Registration Confirmed
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleRegisterEvent}
                    disabled={
                      registering ||
                      (selectedEvent.team_type === 'TEAM' && (
                        !teamNameInput.trim() ||
                        (1 + teamMemberEmails.filter((email) => email.trim()).length) < Math.max(1, selectedEvent.min_team_size || 1) ||
                        (1 + teamMemberEmails.filter((email) => email.trim()).length) > Math.max(Math.max(1, selectedEvent.min_team_size || 1), selectedEvent.max_team_size || Math.max(1, selectedEvent.min_team_size || 1))
                      ))
                    }
                    className="w-full px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:opacity-50 disabled:cursor-not-allowed text-[#F7F2F2] font-mono text-sm font-bold uppercase rounded-[2px] transition-all shadow-[0_0_20px_rgba(224,27,34,0.3)] hover:shadow-[0_0_30px_rgba(255,42,42,0.5)]"
                  >
                    {registering ? 'Transmitting...' : 'Confirm Registration'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
