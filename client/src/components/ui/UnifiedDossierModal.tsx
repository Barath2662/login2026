import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { WORLD_LORE } from '../../constants/worlds';
import { Button } from './Button';
import { 
  X, Skull, TerminalSquare, AlertTriangle, ShieldAlert, 
  Clock, Lock, CheckCircle2, 
  Loader2, Info, Target, Cpu 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../services/api';

interface UnifiedDossierModalProps {
  id?: string;
  event?: any;
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedDossierModal = ({ id, event: propEvent, isOpen, onClose }: UnifiedDossierModalProps) => {
  const navigate = useNavigate();
  const { survivor, setSurvivor, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [activeTab, setActiveTab] = useState<'briefing' | 'intel' | 'access'>('briefing');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teammateEmails, setTeammateEmails] = useState<string[]>(['', '', '']);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset tab and state on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab('briefing');
      setRegistrationSuccess(false);
      setTeamName('');
      setTeammateEmails(['', '', '']);
      setFormError(null);
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, id, propEvent]);

  // Fetch events if only ID is provided
  const { data: WORLDS, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return Array.isArray(res.data) ? res.data : (res.data.events || []);
    },
    enabled: isOpen && !propEvent,
    staleTime: 5 * 60 * 1000,
  });

  const eventData = propEvent || (WORLDS ? WORLDS.find((w: any) => w.id === id) : null);
  const currentIndex = WORLDS ? WORLDS.findIndex((w: any) => w.id === eventData?.id) : -1;
  const prevWorld = WORLDS && currentIndex > 0 ? WORLDS[currentIndex - 1] : null;
  const nextWorld = WORLDS && currentIndex < WORLDS.length - 1 ? WORLDS[currentIndex + 1] : null;

  const isAlreadyRegistered = survivor?.registrations?.some(r => r.worldId === eventData?.id) || false;

  const handleRegister = async () => {
    if (!isAuthenticated || !survivor) {
      alert("AUTHENTICATION REQUIRED. INITIALIZE PROFILE FIRST.");
      return;
    }

    if (!survivor.hasPaidFee) {
      if (eventData) {
        addItem({
          id: `world_${eventData.id}`,
          name: `Registration: ${eventData.title || eventData.name}`,
          price: 0,
          type: 'world_pass'
        });
      }
      navigate('/payment');
      return;
    }

    const minMembers = eventData.min_team_size || eventData.minTeamSize || 1;
    const maxMembers = eventData.max_team_size || eventData.maxTeamSize || 1;
    const isTeamEvent = maxMembers > 1 || eventData.team_type === 'TEAM' || eventData.isTeam;
    const mandatoryExtra = Math.max(1, minMembers - 1);

    if (isTeamEvent) {
      if (!teamName.trim()) {
        setFormError("Team Name is required for group events.");
        return;
      }

      const cleanEmails = teammateEmails.map(e => e.trim().toLowerCase()).filter(Boolean);
      const uniqueEmails = [...new Set(cleanEmails)];

      if (uniqueEmails.length < cleanEmails.length) {
        setFormError("Duplicate teammate emails are not allowed.");
        return;
      }

      if (uniqueEmails.length < mandatoryExtra) {
        setFormError(`This team event requires at least ${mandatoryExtra} teammate email(s).`);
        return;
      }
    }

    setFormError(null);
    setIsRegistering(true);

    try {
      const payload = {
        event_id: eventData.id,
        team_name: isTeamEvent ? teamName.trim() : undefined,
        team_members: isTeamEvent ? teammateEmails.map(e => ({ email: e.trim() })).filter(m => m.email) : undefined
      };

      await api.post('/registrations/', payload);
      setRegistrationSuccess(true);
      const profileRes = await api.get('/users/profile');
      if (profileRes.data) {
        setSurvivor(profileRes.data);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Registration failed.";
      setFormError(msg);
    } finally {
      setIsRegistering(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowLeft' && prevWorld) navigate(`?world=${prevWorld.id}`);
    if (e.key === 'ArrowRight' && nextWorld) navigate(`?world=${nextWorld.id}`);
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isLoading && !propEvent) {
    return (
      <dialog open className="fixed inset-0 z-[100] bg-transparent m-auto w-full h-full flex items-center justify-center backdrop:bg-[#050505]/95 backdrop:backdrop-blur-md">
        <Loader2 className="w-12 h-12 text-[#D90429] animate-spin" />
      </dialog>
    );
  }

  if (!eventData) return null;

  const worldNum = eventData.worldNumber || eventData.id;
  
  // Ensure the world number maps to an existing image/lore (1-11)
  const normalizedWorldNum = ((worldNum - 1) % 11) + 1;
  const paddedNum = normalizedWorldNum < 10 ? `0${normalizedWorldNum}` : normalizedWorldNum;

  const lore = WORLD_LORE[normalizedWorldNum] || {
    name: eventData.title || eventData.name,
    theme: eventData.category || 'Unknown',
    villainName: eventData.invaderName || 'NULL_SECTOR',
    villainQuote: '"Your firewalls are built on fragile logic. My chaos is absolute."'
  };

  const isFinale = normalizedWorldNum === 11;
  const primaryColor = isFinale ? 'text-color-danger' : 'text-color-red';
  const borderColor = isFinale ? 'border-color-danger/30' : 'border-color-red/30';
  const glowShadow = isFinale ? 'shadow-[0_0_50px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_50px_rgba(217,4,41,0.15)]';

  const now = new Date();
  const opensAt = eventData.registrationOpensAt ? new Date(eventData.registrationOpensAt) : null;
  const closesAt = eventData.registrationClosesAt ? new Date(eventData.registrationClosesAt) : null;

  const isLockedFuture = opensAt && now < opensAt;
  const isLockedPast = closesAt && now > closesAt;
  const isAvailable = !isLockedFuture && !isLockedPast;

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent backdrop:bg-[#050505]/95 backdrop:backdrop-blur-md m-auto w-full max-w-3xl overflow-visible outline-none z-[100]"
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
      onKeyDown={handleKeyDown}
      onCancel={(e) => { e.preventDefault(); onClose(); }} 
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-[#050505] border ${borderColor} rounded-lg ${glowShadow} overflow-hidden w-full relative mx-4 md:mx-auto flex flex-col max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header */}
          <div className={`p-6 md:p-8 border-b ${borderColor} relative overflow-hidden shrink-0 bg-black/40`}>
            {isFinale && (
              <div className="absolute top-8 right-20 flex items-center space-x-2 text-color-danger font-mono text-xs font-bold animate-pulse z-10 hidden sm:flex">
                <ShieldAlert size={14} />
                <span>OMEGA LEVEL THREAT</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#A8A9AD] hover:text-white transition-colors cursor-pointer z-50 p-2 bg-black/50 rounded"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                ${isFinale ? 'border-color-danger bg-color-danger/10 text-color-danger shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-color-red bg-color-red/10 text-color-red shadow-[0_0_20px_rgba(217,4,41,0.2)]'}
              `}>
                <span className="font-mono text-4xl md:text-5xl font-bold">{paddedNum}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[#A8A9AD] font-mono text-xs md:text-sm tracking-widest mb-1">
                  <TerminalSquare size={14} />
                  <span>NODE DATA STREAM</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold uppercase text-white font-['Orbitron']">
                  {eventData.name || eventData.title || lore.name}
                </h1>
                <h2 className={`text-sm md:text-base font-mono ${primaryColor}`}>
                  // {eventData.category || lore.theme}
                </h2>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex items-center border-b ${borderColor} shrink-0 bg-[#111111]/80`}>
            <button 
              onClick={() => setActiveTab('briefing')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-mono text-xs md:text-sm tracking-widest transition-colors ${activeTab === 'briefing' ? `border-b-2 ${isFinale ? 'border-color-danger text-color-danger bg-color-danger/5' : 'border-color-red text-color-red bg-color-red/5'}` : 'border-b-2 border-transparent text-[#A8A9AD] hover:bg-white/5 hover:text-white'}`}
            >
              <Info size={16} /> <span className="hidden sm:inline">MISSION BRIEFING</span><span className="sm:hidden">BRIEFING</span>
            </button>
            <button 
              onClick={() => setActiveTab('intel')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-mono text-xs md:text-sm tracking-widest transition-colors ${activeTab === 'intel' ? `border-b-2 ${isFinale ? 'border-color-danger text-color-danger bg-color-danger/5' : 'border-color-red text-color-red bg-color-red/5'}` : 'border-b-2 border-transparent text-[#A8A9AD] hover:bg-white/5 hover:text-white'}`}
            >
              <Target size={16} /> <span className="hidden sm:inline">TARGET INTEL</span><span className="sm:hidden">INTEL</span>
            </button>
            <button 
              onClick={() => setActiveTab('access')}
              className={`flex-1 py-4 flex items-center justify-center space-x-2 font-mono text-xs md:text-sm tracking-widest transition-colors ${activeTab === 'access' ? `border-b-2 ${isFinale ? 'border-color-danger text-color-danger bg-color-danger/5' : 'border-color-red text-color-red bg-color-red/5'}` : 'border-b-2 border-transparent text-[#A8A9AD] hover:bg-white/5 hover:text-white'}`}
            >
              <Cpu size={16} /> <span className="hidden sm:inline">TERMINAL ACCESS</span><span className="sm:hidden">ACCESS</span>
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-gradient-to-b from-transparent to-[#111111]/50 min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {activeTab === 'briefing' && (
                <motion.div 
                  key="briefing"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="text-[#A8A9AD] text-sm font-mono uppercase tracking-widest mb-3 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 animate-pulse ${isFinale ? 'bg-color-danger' : 'bg-color-red'}`} />
                      Narrative Directive
                    </h3>
                    <p className="text-[#E5E5E5] leading-relaxed text-base opacity-90">
                      {eventData.description || (isFinale
                        ? "This is it. The core of the Rogue AI's intelligence network. The Star of Login holds the key to restoring our reality. Expect heavy resistance, complex algorithmic defenses, and reality-bending anomalies. Only the most elite operatives will survive this encounter."
                        : "You are attempting to infiltrate a corrupted sector of the grid. Analyze the threat parameters and execute the required protocol to purge the anomaly. The Rogue AI has heavily fortified this node.")}
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-[#A8A9AD] text-sm font-mono uppercase tracking-widest mb-3 flex items-center">
                      <span className="w-2 h-2 bg-[#A8A9AD] rounded-full mr-3" />
                      Threat Parameters
                    </h3>
                    <ul className="space-y-3 font-mono text-sm text-[#E5E5E5]/80 bg-[#111111]/80 p-4 rounded border border-[#A8A9AD]/20">
                      <li className="flex items-start space-x-3">
                        <span className={primaryColor}>{'>'}</span>
                        <span>DIFFICULTY: {isFinale ? 'NIGHTMARE' : 'HIGH'}</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className={primaryColor}>{'>'}</span>
                        <span>TEAM SIZE: {eventData.minTeamSize}-{eventData.maxTeamSize} OPERATIVES</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className={primaryColor}>{'>'}</span>
                        <span>VENUE: {eventData.venue || 'VIRTUAL GRID'}</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className={primaryColor}>{'>'}</span>
                        <span>DURATION: {eventData.time || '24 HOURS'}</span>
                      </li>
                    </ul>
                  </section>
                </motion.div>
              )}

              {activeTab === 'intel' && (
                <motion.div 
                  key="intel"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className={`w-full sm:w-2/3 md:w-1/3 mx-auto aspect-square rounded-md border overflow-hidden flex-shrink-0 relative bg-[#050505] ${isFinale ? 'border-color-danger shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-color-red shadow-[0_0_20px_rgba(217,4,41,0.2)]'}`}>
                    <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 mix-blend-overlay pointer-events-none z-10" />
                    <img
                      src={`/src/assets/villains/world-${paddedNum}.png`}
                      alt={lore.villainName}
                      className="w-full h-full object-cover relative z-0 mix-blend-hard-light grayscale sepia hue-rotate-[320deg] saturate-[300%] brightness-75"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwNTA1MDUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI0E4QTlBRCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNHB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tk8gREFUQTwvdGV4dD48L3N2Zz4='; 
                      }}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-6">
                    <div>
                      <h4 className="text-xs text-[#A8A9AD] font-mono uppercase tracking-widest mb-1">Target Identity</h4>
                      <h3 className={`text-2xl font-bold uppercase font-mono tracking-wide ${primaryColor}`}>
                        {lore.villainName}
                      </h3>
                      <p className="text-sm font-mono text-[#E5E5E5] mt-1">
                        // {lore.theme}
                      </p>
                    </div>

                    <div className="bg-[#111111]/80 border-l-2 border-[#A8A9AD]/50 p-4 text-sm font-mono italic text-[#E5E5E5] opacity-90 shadow-inner">
                      {lore.villainQuote}
                    </div>

                    {eventData.rules && eventData.rules.length > 0 && (
                      <div>
                        <h4 className="text-xs text-[#A8A9AD] font-mono uppercase tracking-widest mb-2 mt-4">Engagement Rules</h4>
                        <ul className="space-y-1 text-[#E5E5E5]/70 text-xs list-disc pl-4 font-mono">
                          {eventData.rules.map((rule: string, i: number) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'access' && (
                <motion.div 
                  key="access"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className={`p-6 md:p-8 rounded-lg border ${isFinale ? 'border-color-danger/50 bg-color-danger/5' : 'border-[#D90429]/30 bg-black/40 shadow-inner'}`}>
                    
                    {isLockedFuture ? (
                      <div className="mb-8 p-5 rounded bg-zinc-500/10 border border-zinc-500/30">
                        <div className="flex items-center space-x-3 text-zinc-500 mb-2">
                          <Clock size={20} />
                          <span className="font-bold font-mono text-lg">OPENS IN {formatDistanceToNow(opensAt!, { addSuffix: false })}</span>
                        </div>
                        <p className="text-sm text-zinc-500/80 font-mono">Registration window has not yet opened.</p>
                      </div>
                    ) : isLockedPast ? (
                      <div className="mb-8 p-5 rounded bg-color-danger/10 border border-color-danger/30">
                        <div className="flex items-center space-x-3 text-color-danger mb-2">
                          <Lock size={20} />
                          <span className="font-bold font-mono text-lg">LOCKED - INCURSION COMPLETE</span>
                        </div>
                        <p className="text-sm text-color-danger/80 font-mono">Registration window has closed.</p>
                      </div>
                    ) : registrationSuccess || isAlreadyRegistered ? (
                      <div className="mb-8 p-5 rounded bg-[#D90429]/10 border border-[#D90429]/30">
                        <div className="flex items-center space-x-3 text-[#D90429] mb-2">
                          <CheckCircle2 size={20} />
                          <span className="font-bold font-mono text-lg">MISSION ACCEPTED</span>
                        </div>
                        <p className="text-sm text-[#D90429]/80 font-mono">Access granted. Awaiting deployment.</p>
                      </div>
                    ) : (
                      <div className="mb-8 space-y-2">
                        <h3 className="font-bold text-white uppercase text-lg">Infiltration Terminal</h3>
                        <p className="text-sm text-[#A8A9AD] font-mono">
                          Requires an active Survivor Pass and valid credentials for infiltration.
                        </p>
                      </div>
                    )}

                    {(() => {
                      const minMembers = eventData.min_team_size || eventData.minTeamSize || 1;
                      const maxMembers = eventData.max_team_size || eventData.maxTeamSize || 1;
                      const isTeam = maxMembers > 1 || eventData.team_type === 'TEAM' || eventData.isTeam;
                      const mandatoryCount = Math.max(1, minMembers - 1);
                      const maxExtraCount = Math.max(1, maxMembers - 1);

                      if (!isTeam || registrationSuccess || isAlreadyRegistered || !isAvailable) {
                        return formError ? (
                          <div className="mb-4 p-3 bg-color-danger/20 border border-color-danger text-color-danger font-mono text-xs rounded-sm text-left">
                            ⚠️ {formError}
                          </div>
                        ) : null;
                      }

                      return (
                        <div className="mb-6 p-4 bg-[#111115] border border-color-red/40 rounded-sm space-y-4 text-left">
                          <div className="border-b border-[#2A1A1D] pb-2">
                            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                              SQUAD REGISTRATION FORM ({minMembers}–{maxMembers} MEMBERS)
                            </h4>
                            <p className="text-xs text-text-muted font-mono mt-0.5">
                              Leader is automatically set to your profile ({survivor?.email}). Enter registered teammate emails below.
                            </p>
                          </div>

                          {formError && (
                            <div className="p-3 bg-color-danger/20 border border-color-danger text-color-danger font-mono text-xs rounded-sm">
                              ⚠️ {formError}
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-mono text-[#A79798] mb-1 font-bold">TEAM NAME *</label>
                            <input
                              type="text"
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                              placeholder="e.g. CyberVanguards"
                              className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-color-red rounded-sm px-3 py-2 text-xs font-mono text-white outline-none"
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="block text-xs font-mono text-[#A79798] font-bold">
                              TEAMMATE EMAILS (VERIFIED AGAINST LOGIN 2026 DATABASE)
                            </label>

                            {Array.from({ length: maxExtraCount }).map((_, idx) => {
                              const isMandatory = idx < mandatoryCount;
                              return (
                                <div key={idx} className="space-y-1">
                                  <span className="text-[11px] font-mono text-text-muted block">
                                    Teammate #{idx + 2} Email {isMandatory ? <span className="text-color-red">* (Mandatory)</span> : '(Optional)'}
                                  </span>
                                  <input
                                    type="email"
                                    value={teammateEmails[idx] || ''}
                                    onChange={(e) => {
                                      const updated = [...teammateEmails];
                                      updated[idx] = e.target.value;
                                      setTeammateEmails(updated);
                                    }}
                                    placeholder={isMandatory ? "teammate@college.edu (Required)" : "teammate@college.edu (Optional)"}
                                    className="w-full bg-[#0A0A0C] border border-[#2A1A1D] focus:border-color-red rounded-sm px-3 py-2 text-xs font-mono text-white outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    <Button
                      variant={isFinale ? 'danger' : 'primary'}
                      className={`w-full h-16 text-lg tracking-widest font-black ${(!isAvailable || isRegistering || registrationSuccess || isAlreadyRegistered) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isAvailable || isRegistering || registrationSuccess || isAlreadyRegistered}
                      onClick={handleRegister}
                    >
                      {isRegistering ? 'PROCESSING LINK...' :
                        registrationSuccess || isAlreadyRegistered ? 'REGISTERED' :
                          isFinale ? 'INITIATE BOSS BATTLE' : 'DEFEND THIS WORLD'}
                    </Button>
                  </div>

                  {isFinale ? (
                    <div className="bg-color-danger/20 border border-color-danger p-4 rounded-sm flex items-start space-x-3 shadow-lg">
                      <Skull className="text-color-danger flex-shrink-0 mt-1" size={18} />
                      <p className="text-xs text-color-danger/90 font-mono leading-relaxed">
                        WARNING: FATAL ERRORS POSSIBLE. ENSURE ALL PREREQUISITE SKILLS ARE MAXIMIZED BEFORE ENTRY.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black/60 border border-[#A8A9AD]/30 p-4 rounded-sm flex items-start space-x-3">
                      <AlertTriangle className="text-[#A8A9AD] flex-shrink-0 mt-1" size={18} />
                      <p className="text-xs text-[#A8A9AD]/90 font-mono leading-relaxed">
                        NOTICE: Maintain network isolation protocols during entry sequence. Coordinate loadouts with your squad.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </dialog>
  );
};
