import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Users, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [statsData, setStatsData] = useState({ total: 0, verified: 0, pending: 0, attendance: 0 });
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

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

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchStats = async () => {
        try {
          setIsLoadingStats(true);
          const [regsRes, attRes] = await Promise.all([
            api.registrations.getEventRegistrations(selectedEventId),
            api.attendance.getEventList(selectedEventId)
          ]);

          const regs = Array.isArray(regsRes.data) ? regsRes.data : (regsRes.data.data || []);
          const total = regs.length;
          const verified = regs.filter(r => r.student?.bonafide?.status === 'verified').length;
          const pending = total - verified;

          const atts = Array.isArray(attRes.data) ? attRes.data : (attRes.data.data || []);
          const attendance = atts.filter(a => a.status === 'present').length;

          setStatsData({ total, verified, pending, attendance });
        } catch (err) {
          console.error('Failed to fetch stats:', err);
        } finally {
          setIsLoadingStats(false);
        }
    };

    fetchStats();
  }, [selectedEventId]);

  const stats = [
    { label: 'Total Registrations', value: statsData.total, icon: <Users size={24} />, color: 'text-color-silver', border: 'border-color-silver' },
    { label: 'Verified Bonafides', value: statsData.verified, icon: <UserCheck size={24} />, color: 'text-red-500', border: 'border-red-500' },
    { label: 'Pending Verifications', value: statsData.pending, icon: <AlertTriangle size={24} />, color: 'text-zinc-500', border: 'border-zinc-500' },
    { label: 'Current Attendance', value: statsData.attendance, icon: <UserCheck size={24} />, color: 'text-color-red', border: 'border-color-red' },
  ];

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
            Dashboard <span className="text-color-silver">Overview</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            High-level metrics and system status for your assigned operation.
          </p>
        </div>
        <div className="min-w-[200px]">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-bg-card border border-border-color focus:border-color-silver rounded-sm px-3 py-2 text-white font-mono text-sm"
          >
            <option value="" disabled>Select an Event</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative min-h-[150px]">
        {isLoadingStats && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm">
            <Loader2 className="w-8 h-8 text-color-red animate-spin" />
          </div>
        )}
        {stats.map((stat, i) => (
          <div key={i} className={`bg-bg-card border border-border-color p-6 rounded-sm hover:border-${stat.color.split('-')[1]}-500/50 transition-colors relative overflow-hidden group`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-${stat.color.split('-')[1]}-500 to-transparent opacity-50`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-black/40 rounded-sm border border-border-color ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-black font-mono text-white mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-color-silver/5 border border-color-silver/20 p-6 rounded-sm">
        <h3 className="text-color-silver font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle size={18} /> Coordinator Directives
        </h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc pl-5">
          <li>Ensure all participants have VERIFIED bonafide certificates before allowing entry.</li>
          <li>Attendance tracking is mandatory and must be completed before the event concludes.</li>
          <li>Export the final registration list to CSV for your records at the end of the operation.</li>
        </ul>
      </div>
    </div>
  );
};

export default EventDashboard;
