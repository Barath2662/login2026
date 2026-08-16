import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const EventAttendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

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
          id: reg.student_id, // we use student_id for marking attendance
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
    // Optimistic update
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    
    try {
      await api.post('/attendance/', {
        event_id: selectedEventId,
        student_id: studentId,
        status: newStatus
      });
    } catch (err) {
      alert('Failed to update attendance');
      // Revert on failure
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: currentStatus } : s));
    }
  };

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;
    const headers = ['Name', 'UID', 'Roll No', 'College', 'Attendance Status'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => `"${s.fullName}","${s.id}","${s.rollNo}","${s.college}","${s.status.toUpperCase()}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event_${selectedEventId}_attendance.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingEvents) {
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
            Attendance <span className="text-color-silver">Tracker</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Scan or manually mark operative attendance at the venue checkpoint.
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
            <Download size={16} /> EXPORT ATTENDANCE
          </Button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border-color bg-black/20">
          <div className="relative max-w-md">
            <Input 
              placeholder="Search by Name or Roll No..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-color-silver/30 focus:border-color-silver"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoadingData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm">
              <Loader2 className="w-8 h-8 text-color-red animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Operative</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Origin</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-mono font-bold tracking-wider">Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isPresent = student.status === 'present';
                  
                  return (
                    <tr key={student.id} className={`transition-colors ${isPresent ? 'bg-color-red/5' : 'hover:bg-white/5'}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{student.fullName}</div>
                        <div className="text-xs text-text-muted font-mono mt-1">{student.rollNo} (UID: {student.id})</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-text-secondary">{student.college}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-sm border ${
                          isPresent ? 'text-color-red bg-color-red/10 border-color-red/30' : 'text-text-muted bg-black/40 border-border-color'
                        }`}>
                          {isPresent ? 'PRESENT' : 'ABSENT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleAttendance(student.id, student.status)}
                          className={`p-2 rounded-sm border transition-colors ${
                            isPresent 
                              ? 'bg-color-red border-color-red text-black hover:bg-black hover:text-color-red' 
                              : 'bg-black border-border-color text-text-muted hover:border-color-silver hover:text-color-silver'
                          }`}
                        >
                          {isPresent ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    No operatives found matching the criteria.
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

export default EventAttendance;
