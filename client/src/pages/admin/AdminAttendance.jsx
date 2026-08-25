import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Input } from '../../components/ui/Input';
import { Search, CheckCircle2, Loader2, XCircle, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';

const AdminAttendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAtt, setIsLoadingAtt] = useState(false);

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

    const fetchAttendance = async () => {
      try {
        setIsLoadingAtt(true);
        const { data } = await api.get(`/attendance/event/${selectedEventId}`);
        setAttendanceRecords(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
        setAttendanceRecords([]);
      } finally {
        setIsLoadingAtt(false);
      }
    };

    fetchAttendance();
  }, [selectedEventId]);

  const filtered = attendanceRecords.filter(s => 
    (s.student?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.student?.roll_no?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.student_id?.toString().includes(searchQuery))
  );

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 pt-8 animate-in fade-in duration-500">
      <div className="border-b border-border-color pb-6">
        <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase mb-2">Event Attendance</GlitchText>
        <p className="text-text-secondary text-sm">Monitor and manage operative attendance logs.</p>
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
          {isLoadingAtt && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-color-red animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Origin</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Log Timestamp</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{record.student?.name || 'Unknown'}</div>
                    <div className="text-xs text-text-muted">{record.student?.roll_no || 'N/A'} (UID: {record.student_id})</div>
                  </td>
                  <td className="px-6 py-4">{record.student?.college_name || 'N/A'}</td>
                  <td className="px-6 py-4 font-mono text-xs">{record.marked_at ? new Date(record.marked_at).toLocaleString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-sm border ${
                      record.status === 'present' ? 'text-red-500 bg-red-500/10 border-red-500/30' :
                      record.status === 'absent' ? 'text-color-danger bg-color-danger/10 border-color-danger/30' :
                      'text-color-silver bg-color-silver/10 border-color-silver/30'
                    }`}>
                      {record.status === 'present' && <CheckCircle2 size={12} />}
                      {record.status === 'absent' && <XCircle size={12} />}
                      {record.status === 'not_marked' && <HelpCircle size={12} />}
                      {(record.status || 'not_marked').toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoadingAtt && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                    No attendance records found for this event.
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

export default AdminAttendance;
