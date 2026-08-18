import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, ShieldAlert, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminCoordinators = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.events.getAll();
        setEvents(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => 
    (e.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (e.id?.toString().includes(searchQuery.toLowerCase()))
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
            Event <span className="text-color-silver">Coordinators</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Assign or revoke coordinator privileges for specific operations.
          </p>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20">
          <div className="relative max-w-md">
            <Input 
              placeholder="Search by Event Name or Coordinator ID..." 
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
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operation Name</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Assigned Coordinator</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Actions</th>
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
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} className="text-color-silver" />
                      <span className="font-mono text-white">
                        {event.coordinatorAssignments?.length > 0 
                          ? event.coordinatorAssignments.map(a => a.coordinator?.name).join(', ') 
                          : 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="border-color-silver text-color-silver hover:bg-color-silver hover:text-black h-8 px-3 text-xs">
                      REASSIGN
                    </Button>
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

export default AdminCoordinators;
