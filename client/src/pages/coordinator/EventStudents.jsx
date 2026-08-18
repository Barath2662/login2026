import { useState, useEffect } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const EventStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

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

    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const { data } = await api.get(`/registrations/event/${selectedEventId}`);
        const regs = Array.isArray(data) ? data : (data.data || []);
        
        const formattedStudents = regs.map(reg => ({
          id: reg.id,
          studentId: reg.student_id,
          fullName: reg.student?.name || 'Unknown',
          rollNo: reg.student?.roll_no || 'N/A',
          email: reg.student?.email || 'N/A',
          phone: reg.student?.phone || 'N/A',
          college: reg.student?.college_name || 'N/A',
          department: reg.student?.department || 'N/A',
          // Use actual bonafide status from DB
          bonafideStatus: reg.student?.bonafide?.status === 'verified' ? 'VERIFIED' : 
                         (reg.student?.bonafide?.status === 'uploaded' || reg.student?.bonafide?.status === 'under_review') ? 'PENDING' : 'MISSING',
          verified: reg.student?.bonafide?.status === 'verified'
        }));
        setStudents(formattedStudents);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedEventId]);

  const filteredStudents = students.filter(s => 
    (s.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.studentId?.toString().includes(searchQuery))
  );

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;
    const headers = ['Name', 'UID', 'Roll No', 'Email', 'Phone', 'College', 'Department', 'Bonafide Status'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => `"${s.fullName}","${s.studentId}","${s.rollNo}","${s.email}","${s.phone}","${s.college}","${s.department}","${s.bonafideStatus}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `event_${selectedEventId}_students.csv`);
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
            Registered <span className="text-color-silver">Operatives</span>
          </GlitchText>
          <p className="text-text-secondary font-mono text-sm">
            Complete roster of all personnel assigned to this operation.
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
            <Download size={16} /> EXPORT CSV
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
          {isLoadingStudents && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm">
              <Loader2 className="w-8 h-8 text-color-red animate-spin" />
            </div>
          )}
          <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-text-primary border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Name / Roll No</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Contact Info</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Origin</th>
                <th className="px-6 py-4 font-mono font-bold tracking-wider">Bonafide Status</th>
                <th className="px-6 py-4 text-center font-mono font-bold tracking-wider">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{student.fullName}</div>
                      <div className="text-xs text-text-muted font-mono">{student.rollNo} (UID: {student.studentId})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-secondary">{student.email}</div>
                      <div className="text-xs text-text-muted font-mono">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-secondary">{student.college}</div>
                      <div className="text-xs text-text-muted">{student.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-sm border ${
                        student.bonafideStatus === 'VERIFIED' ? 'text-red-500 bg-red-500/10 border-red-500/30' :
                        student.bonafideStatus === 'PENDING' ? 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30' :
                        'text-color-red bg-color-red/10 border-color-red/30'
                      }`}>
                        {student.bonafideStatus === 'VERIFIED' && <Check size={12} />}
                        {student.bonafideStatus === 'PENDING' && <AlertTriangle size={12} />}
                        {student.bonafideStatus === 'MISSING' && <X size={12} />}
                        {student.bonafideStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.verified ? (
                        <Check size={18} className="text-red-500 mx-auto" />
                      ) : (
                        <X size={18} className="text-color-red mx-auto" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
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

export default EventStudents;
