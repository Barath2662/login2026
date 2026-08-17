import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { EventCard } from '../../components/ui/EventCard';
import { UnifiedDossierModal } from '../../components/ui/UnifiedDossierModal';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const RegisteredEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventsList, setRegisteredEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        api.get('/events/'),
        api.get('/registrations/my')
      ]);

      const allEvents = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.data || []);
      const myRegs = Array.isArray(regsRes.data) ? regsRes.data : (regsRes.data.data || []);
      
      const registeredIds = myRegs.map(r => r.event_id?.toString() || r.event_id);
      
      const filtered = allEvents.filter(event => registeredIds.includes(event.id.toString()));
      setRegisteredEventsList(filtered);
    } catch (err) {
      console.error('Failed to fetch registered events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-color-silver/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="mb-12 text-center relative z-10">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-widest text-white mb-4">
          Active <span className="text-color-silver">Deployments</span>
        </GlitchText>
        <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
          Review your secured slots for the upcoming invasion. Missing an operation after securing a slot is considered treason.
        </p>
      </div>

      <div className="relative z-10">
        {registeredEventsList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {registeredEventsList.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                isRegistered={true}
                onClick={setSelectedEvent}
                isLeftAligned={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-black/30 border border-border-color rounded-sm">
            <ShieldAlert size={64} className="text-text-muted mb-6 opacity-50" />
            <h3 className="text-2xl font-bold font-mono text-white mb-2">NO DEPLOYMENTS FOUND</h3>
            <p className="text-text-secondary">You have not secured a slot in any Worlds.</p>
            <p className="text-sm text-text-muted font-mono mt-4 border border-border-color bg-black/40 px-4 py-2 rounded-sm inline-block">
              Return to the Multiverse Hub to review available operations.
            </p>
          </div>
        )}
      </div>

      {selectedEvent && (
        <UnifiedDossierModal 
          isOpen={!!selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
            fetchData(); // Refresh list on close in case of cancellation
          }}
          id={selectedEvent.id}
        />
      )}
    </div>
  );
};

export default RegisteredEvents;
