import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, CheckCircle2, UserMinus, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const JuniorAttendanceDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

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

  const fetchData = async () => {
    if (!selectedEventId) return;
    try {
      setIsLoadingData(true);
      const [regsRes, attsRes] = await Promise.allSettled([
        api.get(`/registrations/event/${selectedEventId}`),
        api.get(`/attendance/event/${selectedEventId}`)
      ]);

      const regs = regsRes.status === 'fulfilled' ? (Array.isArray(regsRes.value.data) ? regsRes.value.data : (regsRes.value.data.data || [])) : [];
      const atts = attsRes.status === 'fulfilled' ? (Array.isArray(attsRes.value.data) ? attsRes.value.data : (attsRes.value.data.data || [])) : [];

      const mergedStudents = regs.map(reg => {
        const attendanceRecord = atts.find(a => a.student_id === reg.student_id);
        return {
          id: reg.student_id,
          fullName: reg.student?.name || 'Unknown',
          rollNo: reg.student?.roll_no || 'N/A',
          college: reg.student?.college_name || 'N/A',
          status: attendanceRecord ? attendanceRecord.status : 'not_marked'
        };
      });

      setStudents(mergedStudents);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEventId]);

  const filteredStudents = students.filter(s => 
    (s.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.id?.toString().includes(searchQuery))
  );

  const toggleAttendance = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    
    try {
      await api.post('/attendance/', {
        event_id: selectedEventId,
        student_id: studentId,
        status: newStatus
      });
    } catch (err) {
      alert('Failed to update attendance');
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: currentStatus } : s));
    }
  };

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;
    const headers = ['Name', 'UID', 'Roll No', 'College', 'Entry Status'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => `"${s.fullName}","${s.id}","${s.rollNo}","${s.college}","${s.status.toUpperCase()}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event_${selectedEventId}_global_log.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-silver animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-color-silver/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
            Global <span className="text-color-silver">Entry Log</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm max-w-2xl">
            Junior Administration access. Scan operatives at the main planetary checkpoint to log their physical arrival.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
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
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={filteredStudents.length === 0}
            className="border-color-silver text-color-silver hover:bg-color-silver hover:text-black flex items-center gap-2 h-10"
          >
            <Download size={16} /> EXPORT GLOBAL LOG
          </Button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden relative z-10">
        <div className="p-6 border-b border-border-color bg-black/40 flex flex-col items-center">
          <div className="text-sm font-mono text-text-muted uppercase tracking-widest mb-4">Fast-Scan Terminal</div>
          <div className="relative w-full max-w-2xl">
            <Input 
              placeholder="Awaiting Input: Scan Barcode or enter Roll No / Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/80 border-color-silver focus:border-color-red h-16 text-lg text-center tracking-widest font-mono shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-color-silver" size={24} />
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoadingData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm">
              <Loader2 className="w-8 h-8 text-color-silver animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="text-xs uppercase bg-black/20 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative Name</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Registry ID (Roll No)</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Entry Status</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Authorize Entry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isPresent = student.status === 'present';
                  
                  return (
                    <tr key={student.id} className={`transition-colors ${isPresent ? 'bg-color-silver/5' : 'hover:bg-white/5'}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-lg">{student.fullName}</div>
                        <div className="text-xs text-text-muted mt-1">{student.college}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-color-silver font-mono text-base tracking-widest">{student.rollNo}</div>
                        <div className="text-xs text-text-muted mt-1">UID: {student.id}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-sm border font-mono ${
                          isPresent ? 'text-black bg-color-silver border-color-silver' : 'text-text-muted bg-black/40 border-border-color'
                        }`}>
                          {isPresent ? 'LOGGED: ON-SITE' : 'AWAITING ENTRY'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleAttendance(student.id, student.status)}
                          className={`p-3 rounded-sm border transition-all hover:scale-105 active:scale-95 ${
                            isPresent 
                              ? 'bg-transparent border-color-silver text-color-silver hover:bg-color-silver/10' 
                              : 'bg-color-silver border-color-silver text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          }`}
                        >
                          {isPresent ? <UserMinus size={24} /> : <CheckCircle2 size={24} />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-text-muted">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <div className="font-mono text-lg mb-2 text-white">NO SIGNAL</div>
                    <div>No operatives found matching the scan criteria.</div>
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

export default JuniorAttendanceDashboard;
