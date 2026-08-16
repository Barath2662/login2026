import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, Users, Loader2 } from 'lucide-react';
import { GlitchText } from '../../components/ui/GlitchText';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { survivor } = useAuthStore();
  const [registrations, setRegistrations] = useState([]);
  const [squads, setSquads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, teamsRes, eventsRes] = await Promise.all([
          api.get('/registrations/my'),
          api.get('/teams/my').catch(() => ({ data: [] })), // Might return 404 if no team
          api.get('/events/')
        ]);
        
        // Map backend event data structure
        const mappedRegs = (regRes.data || []).map(r => ({
          id: r.event.id,
          name: r.event.name,
          startTime: r.event.date + 'T' + r.event.start_time,
          venue: r.event.venue
        }));
        
        setRegistrations(mappedRegs);
        setSquads(Array.isArray(teamsRes.data) ? teamsRes.data : (teamsRes.data ? [teamsRes.data] : []));
        setTotalEvents(eventsRes.data?.length || 0);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (survivor) {
      fetchData();
    }
  }, [survivor]);

  if (isLoading || !survivor) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dashboard Header / Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-color pb-6 gap-6">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase mb-2" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
            Multiverse Hub Dashboard
          </GlitchText>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-color-red font-mono">STATUS: ONLINE</span>
            <span className="text-text-muted">|</span>
            <span className="text-text-secondary">OPERATIVE: {survivor.name?.toUpperCase() || survivor.fullName?.toUpperCase() || 'UNKNOWN'}</span>
          </div>
        </div>

        {/* Global Countdown Placeholder */}
        <div className="bg-bg-card border border-border-color p-4 rounded-sm">
          <p className="text-xs text-text-muted font-mono mb-2">INVASION T-MINUS</p>
          <div className="text-2xl font-mono font-bold text-white">24:00:00</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Map Area */}
        <div className="lg:col-span-3 space-y-8">
          
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
                  {registrations.map((reg) => (
                    <div key={reg.id} className="p-4 bg-black/40 border border-border-color/50 rounded flex flex-col space-y-2 group hover:border-color-silver/30 transition-colors cursor-pointer">
                      <p className="text-sm font-bold text-white uppercase">{reg.name}</p>
                      <p className="text-xs text-text-muted">{new Date(reg.startTime).toLocaleString()} - {reg.venue}</p>
                    </div>
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
                  {squads.map((member) => (
                    <div key={member.id} className="p-3 bg-black/40 border border-border-color/50 rounded flex flex-col space-y-2 group hover:border-color-silver/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-white uppercase">{member.name || member.squadName || 'TEAM'}</p>
                          <p className="text-xs text-color-silver font-mono mt-1">
                            {member.created_by === survivor.id ? 'SQUAD LEADER' : 'OPERATIVE'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-border-color/30 pt-2 mt-1">
                        <span className="text-xs text-text-muted font-mono">TEAM ID:</span>
                        <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded text-white tracking-widest select-all">
                          {member.id}
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
                  <span className="text-text-muted text-sm">/ {totalEvents}</span>
                </div>
                <div className="w-full h-1 bg-border-color mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-color-red transition-all duration-1000" 
                    style={{ width: totalEvents > 0 ? `${(registrations.length / totalEvents) * 100}%` : '0%' }}
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
    </div>
  );
}
