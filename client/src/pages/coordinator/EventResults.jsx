import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trophy, Medal, Save, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const EventResults = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [winnerTeam, setWinnerTeam] = useState('');
  const [runnerTeam, setRunnerTeam] = useState('');
  const [winnerScore, setWinnerScore] = useState('');
  const [runnerScore, setRunnerScore] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.events.getCoordinatorEvents();
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

  const handleSave = () => {
    if (!selectedEventId) return;
    setIsLocked(true);
    console.log(`Results locked and broadcasted for event ${selectedEventId}.`);
    // In real app, POST these to /api/events/:id/results
  };

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-silver animate-spin" />
      </div>
    );
  }

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
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-sm flex gap-3 items-start">
            <Trophy className="text-green-500 mt-1" size={20} />
            <div>
              <div className="text-green-500 font-bold font-mono uppercase tracking-wider mb-1">Results Locked & Broadcasted</div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Squad / Operative Name</label>
                <div className="relative">
                  <Input 
                    placeholder="Enter winning team name or ID..."
                    value={winnerTeam}
                    onChange={(e) => setWinnerTeam(e.target.value)}
                    disabled={isLocked}
                    className="pl-10 focus:border-color-silver"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Final Score</label>
                <Input 
                  placeholder="e.g. 9850"
                  type="number"
                  value={winnerScore}
                  onChange={(e) => setWinnerScore(e.target.value)}
                  disabled={isLocked}
                  className="font-mono focus:border-color-silver"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Squad / Operative Name</label>
                <div className="relative">
                  <Input 
                    placeholder="Enter runner-up team name or ID..."
                    value={runnerTeam}
                    onChange={(e) => setRunnerTeam(e.target.value)}
                    disabled={isLocked}
                    className="pl-10 focus:border-color-red"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Final Score</label>
                <Input 
                  placeholder="e.g. 8420"
                  type="number"
                  value={runnerScore}
                  onChange={(e) => setRunnerScore(e.target.value)}
                  disabled={isLocked}
                  className="font-mono focus:border-color-red"
                />
              </div>
            </div>
          </div>

          {!isLocked && (
            <div className="pt-6 border-t border-border-color mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-yellow-500 font-mono">
                <AlertTriangle size={14} /> Warning: Once locked, results cannot be altered.
              </div>
              <Button 
                onClick={handleSave}
                disabled={!winnerTeam || !runnerTeam}
                className="w-full sm:w-auto flex items-center gap-2 bg-color-silver text-black hover:bg-white border-none"
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
