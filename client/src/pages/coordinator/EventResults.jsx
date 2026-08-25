import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trophy, Medal, Save, Users, AlertTriangle, Loader2, Mail, Phone, GraduationCap } from 'lucide-react';
import { api } from '../../services/api';

const EventResults = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [registrations, setRegistrations] = useState([]);
  
  const [winnerTeam, setWinnerTeam] = useState('');
  const [runnerTeam, setRunnerTeam] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.events.getAll();
        const eventsData = Array.isArray(data) ? data : (data.data || []);
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setSelectedEventId(eventsData[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations for the selected event to populate the dropdowns
  useEffect(() => {
    if (!selectedEventId) return;
    const fetchRegs = async () => {
      try {
        const { data } = await api.get(`/registrations/event/${selectedEventId}`);
        setRegistrations(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Failed to fetch registrations for event:', err);
      }
    };
    fetchRegs();
  }, [selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) return;
    const fetchResults = async () => {
      try {
        const { data } = await api.results.getEventResult(selectedEventId);
        if (data && data.winner_team) {
          setWinnerTeam(data.winner_team);
          setRunnerTeam(data.runner_team);
          setIsLocked(data.is_locked || false);
        } else {
          setWinnerTeam('');
          setRunnerTeam('');
          setIsLocked(false);
        }
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setWinnerTeam('');
        setRunnerTeam('');
        setIsLocked(false);
      }
    };
    fetchResults();
  }, [selectedEventId]);

  const handleSave = async () => {
    if (!selectedEventId) return;
    try {
      await api.results.saveEventResult(selectedEventId, {
        winner_team: winnerTeam,
        runner_team: runnerTeam,
        is_locked: true
      });
      setIsLocked(true);
      alert(`Results locked and broadcasted for event ${selectedEventId}.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save results.');
    }
  };

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-silver animate-spin" />
      </div>
    );
  }

  // Find the selected registrations for Dossier previews
  const selectedWinnerReg = registrations.find(r => r.student && `${r.student.name} (${r.student.student_id_code})` === winnerTeam);
  const selectedRunnerReg = registrations.find(r => r.student && `${r.student.name} (${r.student.student_id_code})` === runnerTeam);

  const activeEvent = events.find(e => e.id.toString() === selectedEventId);
  const isTeam = activeEvent?.team_type === 'TEAM';

  const renderDossier = (reg, colorClass, borderColor) => {
    if (!reg || !reg.student) return null;
    const { student } = reg;
    return (
      <div className={`mt-4 p-4 bg-bg-primary/50 border ${borderColor} rounded-sm relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 bg-gradient-to-bl from-${colorClass} to-transparent`} />
        
        <h4 className={`text-xs font-mono uppercase tracking-widest ${colorClass} mb-3`}>
          {isTeam ? 'Squad Leader Dossier' : 'Operative Dossier'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase mb-0.5">
              {isTeam ? 'Leader Name' : 'Operative Name'}
            </p>
            <p className="text-sm font-bold text-white line-clamp-1">{student.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase mb-0.5">
              {isTeam ? 'Leader ID' : 'Operative ID'}
            </p>
            <p className="text-sm font-mono text-white">{student.student_id_code}</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="text-text-muted w-3 h-3" />
            <p className="text-xs text-text-secondary truncate">{student.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-text-muted w-3 h-3" />
            <p className="text-xs text-text-secondary">{student.phone}</p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2 mt-1 pt-3 border-t border-border-color/50">
            <GraduationCap className="text-text-muted w-3 h-3 shrink-0" />
            <p className="text-xs text-text-secondary truncate">{student.college_name} - {student.department}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
            Operation <span className="text-color-silver">Results</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Declare the surviving operatives. Once locked, results are broadcasted to the Multiverse Hub.
          </p>
        </div>
        <div className="min-w-[200px]">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-bg-card border border-border-color focus:border-color-silver rounded-sm px-3 py-2 text-white font-mono text-sm h-10"
          >
            <option value="" disabled>Select an Event</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl p-6 md:p-8 max-w-3xl">
        
        {isLocked && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-sm flex gap-3 items-start">
            <Trophy className="text-red-500 mt-1" size={20} />
            <div>
              <div className="text-red-500 font-bold font-mono uppercase tracking-wider mb-1">Results Locked & Broadcasted</div>
              <div className="text-sm text-text-secondary">The final operation results have been permanently recorded in the central database. Contact the Grand Admin to request amendments.</div>
            </div>
          </div>
        )}

        <div className="space-y-10">
          
          {/* Winner Section */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-color-silver" />
            <h2 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-3">
              <Trophy className="text-color-silver" size={24} /> 
              Prime Survivors (Winners)
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  {isTeam ? 'Select Squad Leader (Team)' : 'Select Operative'}
                </label>
                <div className="relative">
                  {/* Replaced Input with Select for verified search */}
                  <select
                    value={winnerTeam}
                    onChange={(e) => setWinnerTeam(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-bg-primary border border-border-color focus:border-color-silver rounded-sm pl-10 pr-3 py-2 text-white font-mono text-sm h-10 appearance-none"
                  >
                    <option value="">{isTeam ? '-- Select Squad Leader --' : '-- Select Winner --'}</option>
                    {/* Only show locked value if not in registrations, otherwise show registrations */}
                    {isLocked && !selectedWinnerReg && winnerTeam && (
                       <option value={winnerTeam}>{winnerTeam}</option>
                    )}
                    {registrations.map(reg => (
                      <option key={reg.id} value={`${reg.student?.name} (${reg.student?.student_id_code})`}>
                        {reg.student?.name} ({reg.student?.student_id_code})
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                </div>
                
                {/* Dossier Preview for Winner */}
                {renderDossier(selectedWinnerReg, 'text-color-silver', 'border-color-silver/30')}

              </div>
            </div>
          </div>

          {/* Runner Section */}
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-color-red" />
            <h2 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-3">
              <Medal className="text-color-red" size={24} /> 
              Secondary Survivors (Runners-up)
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  {isTeam ? 'Select Squad Leader (Team)' : 'Select Operative'}
                </label>
                <div className="relative">
                  {/* Replaced Input with Select for verified search */}
                  <select
                    value={runnerTeam}
                    onChange={(e) => setRunnerTeam(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-bg-primary border border-border-color focus:border-color-red rounded-sm pl-10 pr-3 py-2 text-white font-mono text-sm h-10 appearance-none"
                  >
                    <option value="">{isTeam ? '-- Select Squad Leader --' : '-- Select Runner-up --'}</option>
                    {/* Only show locked value if not in registrations, otherwise show registrations */}
                    {isLocked && !selectedRunnerReg && runnerTeam && (
                       <option value={runnerTeam}>{runnerTeam}</option>
                    )}
                    {registrations.map(reg => (
                      <option key={reg.id} value={`${reg.student?.name} (${reg.student?.student_id_code})`}>
                        {reg.student?.name} ({reg.student?.student_id_code})
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                </div>

                {/* Dossier Preview for Runner */}
                {renderDossier(selectedRunnerReg, 'text-color-red', 'border-color-red/30')}

              </div>
            </div>
          </div>

          {!isLocked && (
            <div className="pt-6 border-t border-border-color mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <AlertTriangle size={14} /> Warning: Once locked, results cannot be altered.
              </div>
              <Button 
                onClick={handleSave}
                disabled={!winnerTeam || !runnerTeam || !selectedWinnerReg || !selectedRunnerReg}
                className="w-full sm:w-auto flex items-center gap-2 bg-color-silver text-black hover:bg-white border-none disabled:opacity-50"
              >
                <Save size={16} /> LOCK & BROADCAST RESULTS
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventResults;
