import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Input } from '../../components/ui/Input';
import { Search, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminRegistrations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events/');
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

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchRegistrations = async () => {
      try {
        setIsLoadingRegs(true);
        const { data } = await api.get(`/registrations/event/${selectedEventId}`);
        setRegistrations(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setRegistrations([]);
      } finally {
        setIsLoadingRegs(false);
      }
    };

    fetchRegistrations();
  }, [selectedEventId]);

  const filtered = registrations.filter(r => 
    (r.student?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.student?.roll_no?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.student_id?.toString().includes(searchQuery))
  );

  const currentEventName = events.find(e => e.id.toString() === selectedEventId)?.name || 'Unknown Event';

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          Global <span className="text-color-silver">Registrations</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          System-wide view of all confirmed operative deployments to specific worlds.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20 flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full md:w-auto flex-1">
            <Input 
              placeholder="Search by Operative Name or Roll No..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
          
          <div className="min-w-[200px]">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-black/50 border border-color-silver/30 focus:border-color-silver rounded-sm px-3 py-2 text-white font-mono text-sm"
            >
              <option value="" disabled>Select an Event</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoadingRegs && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-color-red animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Reg ID</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Assigned World (Event)</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Date Logged</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">{reg.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{reg.student?.name || 'Unknown'}</div>
                    <div className="text-xs text-text-muted">{reg.student?.roll_no || 'N/A'} (UID: {reg.student_id})</div>
                  </td>
                  <td className="px-6 py-4">{currentEventName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{new Date(reg.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-center uppercase">
                    <span className={`px-2 py-1 rounded-sm border ${reg.status === 'registered' ? 'bg-color-silver/10 text-color-silver border-color-silver/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoadingRegs && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                    No registrations found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
