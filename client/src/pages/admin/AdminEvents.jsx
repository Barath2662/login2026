import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/events/');
      setEvents(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => 
    (e.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (e.id?.toString().includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
            Global <span className="text-color-silver">Events</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Manage all event configurations and schedules across the Multiverse.
          </p>
        </div>
        
        <Button className="bg-color-silver text-black hover:bg-white flex items-center gap-2 border-none">
          <Plus size={16} /> CREATE EVENT
        </Button>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20">
          <div className="relative max-w-md">
            <Input 
              placeholder="Search by Event Name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Event ID / Name</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Schedule</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Venue</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Coordinator ID</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{event.name}</div>
                    <div className="text-xs text-text-muted font-mono">{event.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{event.date}</div>
                    <div className="text-xs text-text-muted">
                      {event.start_time} - {event.end_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">{event.venue || 'TBA'}</td>
                  <td className="px-6 py-4 font-mono">{event.coordinator || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-sm border ${
                      event.status === 'open' || event.status === 'completed' ? 'text-green-500 bg-green-500/10 border-green-500/30' : 'text-color-red bg-color-red/10 border-color-red/30'
                    }`}>
                      {(event.status || 'draft').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
