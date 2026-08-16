import { useAuthStore } from '../store/authStore';
import { GlitchText } from '../components/ui/GlitchText';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { HubNodeGraph } from '../components/ui/HubNodeGraph';
import { AlertTriangle, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from '../components/ui/EventCard';
import { UnifiedDossierModal } from '../components/ui/UnifiedDossierModal';
import { useState } from 'react';

export const HubPage = () => {
  const { survivor } = useAuthStore();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const registrations = survivor?.registrations || [];
  const squads = survivor?.squads || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dashboard Header / Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-color pb-6 gap-6">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase mb-2">
            Multiverse Hub Dashboard
          </GlitchText>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-color-red font-mono">STATUS: ONLINE</span>
            <span className="text-text-muted">|</span>
            <span className="text-text-secondary">OPERATIVE: {survivor?.fullName?.toUpperCase() || 'UNKNOWN'}</span>
          </div>
        </div>

        {/* Global Countdown */}
        <div className="bg-bg-card border border-border-color p-4 rounded-sm">
          <p className="text-xs text-text-muted font-mono mb-2">INVASION T-MINUS</p>
          <CountdownTimer targetDate="2026-09-20T00:00:00" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Map Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Node Navigation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white uppercase flex items-center">
                Node Navigation Map
              </h2>
              <div className="text-xs text-text-muted flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-color-red animate-pulse"></span>
                <span>LIVE TELEMETRY</span>
              </div>
            </div>
            
            <HubNodeGraph />
          </div>

          {/* Registered Missions & Squads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Missions List */}
            <div className="bg-bg-card border border-border-color p-5 rounded-sm">
              <h2 className="text-sm font-bold text-text-muted mb-4 font-mono flex items-center">
                <Shield size={16} className="mr-2 text-color-red" />
                REGISTERED MISSIONS
              </h2>
              
              {registrations.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-border-color rounded bg-black/20">
                  <p className="text-text-secondary text-sm mb-3">No active mission registrations found.</p>
                  <button 
                    onClick={() => navigate('/events')}
                    className="text-color-red hover:text-white font-mono text-xs underline transition-colors"
                  >
                    BROWSE AVAILABLE NODES
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {registrations.map((reg: any) => (
                    <EventCard 
                      key={reg.id} 
                      event={reg.world} 
                      isRegistered={true} 
                      onClick={setSelectedEvent} 
                      isLeftAligned={false} 
                      className="!bg-black/40 !p-4"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Squads List */}
            <div className="bg-bg-card border border-border-color p-5 rounded-sm">
              <h2 className="text-sm font-bold text-text-muted mb-4 font-mono flex items-center">
                <Users size={16} className="mr-2 text-color-silver" />
                ACTIVE SQUADS
              </h2>
              
              {squads.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border-color rounded bg-black/20">
                  <p className="text-text-secondary text-sm">No squad affiliations found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {squads.map((member: any) => (
                    <div key={member.id} className="p-3 bg-black/40 border border-border-color/50 rounded flex flex-col space-y-2 group hover:border-color-silver/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-white uppercase">{member.squad?.squadName || 'Unknown Squad'}</p>
                          <p className="text-xs text-color-silver font-mono mt-1">
                            {member.isLeader ? 'SQUAD LEADER' : 'OPERATIVE'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-border-color/30 pt-2 mt-1">
                        <span className="text-xs text-text-muted font-mono">INVITE CODE:</span>
                        <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded text-white tracking-widest select-all">
                          {member.squad?.inviteCode || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          {/* Player Stats Widget */}
          <div className="bg-bg-card border border-border-color p-5 rounded-sm shadow-xl">
            <h2 className="text-sm font-bold text-text-muted mb-4 font-mono">OPERATIVE STATS</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-secondary mb-1">MISSIONS REGISTERED</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">{registrations.length}</span>
                  <span className="text-text-muted text-sm">/ 11</span>
                </div>
                <div className="w-full h-1 bg-border-color mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-color-red transition-all duration-1000" 
                    style={{ width: `${(registrations.length / 11) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-1">SQUAD AFFILIATIONS</p>
                <span className="text-lg font-bold text-color-silver">{squads.length}</span>
              </div>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-color-danger/10 border border-color-danger/50 p-4 rounded-sm flex items-start space-x-3">
            <AlertTriangle className="text-color-danger mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-color-danger mb-1">CRITICAL ALERT</p>
              <p className="text-xs text-color-danger/80">
                The Star of Login (World 11) remains locked until prerequisite nodes are compromised.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      <UnifiedDossierModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
      />
    </div>
  );
};
