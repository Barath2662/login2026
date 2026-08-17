import { useState, useMemo, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

export default function Events() {
  const { survivor } = useAuthStore();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await api.get('/events');
        
        // Map backend event structure to expected structure
        const mappedEvents = eventsRes.data.map(e => ({
          id: e.id,
          name: e.name,
          startTime: e.date + 'T' + e.start_time,
          endTime: e.date + 'T' + e.end_time,
        }));
        setEventsData(mappedEvents);
      } catch (err) {
        console.error("Failed to load events", err);
      }
      
      try {
        if (survivor?.role === 'student') {
          const regsRes = await api.get('/registrations/my');
          const registeredIds = (regsRes.data || []).map(r => r.event_id);
          setSelectedEvents(registeredIds);
        }
      } catch (err) {
        console.error("Failed to load registrations", err);
      }

      setIsLoading(false);
    };
    
    fetchData();
  }, [survivor]);

  // Parse events and calculate time constraints
  const eventsWithTime = useMemo(() => {
    return eventsData.map(e => ({
      ...e,
      startObj: new Date(e.startTime),
      endObj: new Date(e.endTime)
    }));
  }, [eventsData]);

  const minTime = eventsWithTime.length > 0 ? Math.min(...eventsWithTime.map(e => e.startObj.getTime())) : Date.now();
  const maxTime = eventsWithTime.length > 0 ? Math.max(...eventsWithTime.map(e => e.endObj.getTime())) : Date.now();
  
  // Create half-hour intervals
  const intervals = [];
  if (eventsWithTime.length > 0) {
    let curr = new Date(minTime);
    curr.setMinutes(0, 0, 0); // start at top of the hour for alignment
    while (curr.getTime() <= maxTime) {
      intervals.push(new Date(curr));
      curr.setMinutes(curr.getMinutes() + 30);
    }
  }

  // Check for overlaps
  const isOverlapping = (event1, event2) => {
    return event1.startObj < event2.endObj && event1.endObj > event2.startObj;
  };

  const handleToggleEvent = async (event) => {
    if (selectedEvents.includes(event.id)) {
      // Cancellation might need a different API approach, depending on whether it's supported
      // The docs say PUT /api/registrations/:id/cancel
      alert('Event cancellation must be done through your registered events page or dossier.');
      return;
    }

    // Check if selecting this event would overlap with already selected events
    const hasOverlap = selectedEvents.some(selectedId => {
      const selected = eventsWithTime.find(e => e.id === selectedId);
      if (!selected) return false;
      return isOverlapping(event, selected);
    });

    if (hasOverlap) {
      alert('Cannot select this event because it overlaps with an already selected event.');
      return;
    }

    try {
      await api.post('/registrations/', { event_id: event.id });
      setSelectedEvents([...selectedEvents, event.id]);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Please complete the one-time participation fee payment first.");
      } else {
        alert(err.response?.data?.message || 'Failed to register for the event.');
      }
    }
  };

  // Assign events to tracks to prevent visual overlap
  const tracks = [];
  eventsWithTime.forEach(event => {
    let placed = false;
    for (let i = 0; i < tracks.length; i++) {
      if (!tracks[i].some(e => isOverlapping(event, e))) {
        tracks[i].push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      tracks.push([event]);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 pt-8 animate-in fade-in duration-500">
      
      <div className="border-b border-border-color pb-6">
        <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase mb-2">Event Timeline Registration</GlitchText>
        <p className="text-text-secondary text-sm">Select non-overlapping nodes to register. Conflicting nodes will be highlighted.</p>
      </div>

      <div className="bg-bg-card border border-border-color p-6 rounded-sm shadow-xl overflow-x-auto">
        
        {/* Timeline Grid */}
        <div 
          className="relative grid gap-y-4" 
          style={{ 
            gridTemplateColumns: `repeat(${intervals.length}, minmax(100px, 1fr))`,
            minWidth: `${intervals.length * 100}px` 
          }}
        >
          {/* Header row with times */}
          {intervals.map((time, idx) => (
            <div key={idx} className="text-xs text-text-muted font-mono border-l border-border-color/30 pl-2 pb-4">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          ))}

          {/* Event tracks */}
          {tracks.map((track, trackIdx) => (
            <div key={trackIdx} className="contents relative">
              {track.map((event) => {
                // Calculate grid positions
                const startIdx = intervals.findIndex(t => t.getTime() >= event.startObj.getTime()) || 1;
                const endIdx = intervals.findIndex(t => t.getTime() >= event.endObj.getTime());
                
                const span = endIdx === -1 ? intervals.length - startIdx : endIdx - startIdx;
                
                const isSelected = selectedEvents.includes(event.id);
                
                // Highlight overlapping disabled events if we have selections
                const isConflicting = !isSelected && selectedEvents.some(selectedId => {
                  const selected = eventsWithTime.find(e => e.id === selectedId);
                  return selected && isOverlapping(event, selected);
                });

                return (
                  <div 
                    key={event.id}
                    onClick={() => handleToggleEvent(event)}
                    style={{
                      gridColumnStart: startIdx + 1,
                      gridColumnEnd: `span ${span > 0 ? span : 1}`
                    }}
                    className={`
                      mt-2 p-3 rounded-sm border transition-all cursor-pointer shadow-lg
                      ${isSelected 
                        ? 'bg-color-red/20 border-color-red text-white' 
                        : isConflicting
                          ? 'bg-black/80 border-color-danger/50 text-text-muted opacity-50 cursor-not-allowed'
                          : 'bg-black/60 border-border-color hover:border-color-silver hover:bg-black/80 text-text-secondary'
                      }
                    `}
                  >
                    <div className="font-mono text-xs font-bold truncate mb-1">{event.name}</div>
                    <div className="text-[10px] opacity-80">{event.startTime.split('T')[1].substring(0,5)} - {event.endTime.split('T')[1].substring(0,5)}</div>
                    {isConflicting && <div className="text-[10px] text-color-danger mt-1">TIME CONFLICT</div>}
                    {isSelected && <div className="text-[10px] text-color-red mt-1">SELECTED</div>}
                  </div>
                );
              })}
            </div>
          ))}
          
        </div>
      </div>
      
    </div>
  );
}
