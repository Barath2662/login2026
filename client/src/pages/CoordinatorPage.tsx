import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trophy, Users, Search, CheckCircle2, XCircle, Lock, Unlock, Save } from 'lucide-react';

export const CoordinatorPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // Results state
  const [firstPlace, setFirstPlace] = useState('');
  const [secondPlace, setSecondPlace] = useState('');
  const [thirdPlace, setThirdPlace] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [resultsMessage, setResultsMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedEvents = async () => {
      try {
        const res = await api.events.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data);
          setSelectedEventId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load coordinator events:', err);
      }
    };

    fetchAssignedEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      api.registrations.getEventRegistrations(selectedEventId).then((res) => {
        if (Array.isArray(res.data)) {
          setRoster(res.data);
        }
      }).catch(() => {});

      api.results.getEventResult(selectedEventId).then((res) => {
        if (res.data) {
          setFirstPlace(res.data.first_place || '');
          setSecondPlace(res.data.second_place || '');
          setThirdPlace(res.data.third_place || '');
          setIsLocked(res.data.is_locked || false);
        }
      }).catch(() => {});
    }
  }, [selectedEventId]);

  const handleMarkAttendance = async (studentId: number, currentStatus: string) => {
    if (!selectedEventId) return;
    const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';

    try {
      await api.attendance.mark({
        event_id: selectedEventId,
        student_id: studentId,
        status: newStatus,
      });

      setRoster(roster.map((item) => (item.user_id === studentId ? { ...item, attendance_status: newStatus } : item)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update attendance.');
    }
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    try {
      await api.results.saveEventResult(selectedEventId, {
        first_place: firstPlace,
        second_place: secondPlace,
        third_place: thirdPlace,
        is_locked: isLocked,
      });

      setResultsMessage('Winners and competition results saved successfully!');
      setTimeout(() => setResultsMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save results.');
    }
  };

  const filteredRoster = roster.filter(
    (r) =>
      (r.user?.name && r.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.user?.student_id_code && r.user.student_id_code.toLowerCase().includes(search.toLowerCase())) ||
      (r.user?.college_name && r.user.college_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A1A1D] pb-6">
          <div>
            <span className="mono-label text-[#E08A17] font-bold uppercase">COORDINATOR PORTAL</span>
            <h1 className="display-m text-[#F7F2F2]">EVENT DESK MANAGEMENT</h1>
          </div>

          {events.length > 0 && (
            <select
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
              className="bg-[#130C0E] border border-[#2A1A1D] text-[#F7F2F2] px-4 py-2.5 rounded-[2px] text-xs font-mono outline-none"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} (Day {evt.day})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Attendance Roster (56px touch target rows for mobile phone execution) */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#E01B22]" />
              <h2 className="text-lg font-display font-bold text-[#F7F2F2]">PARTICIPANT ROSTER & ATTENDANCE</h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#6B5A5C] absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search participant..."
                className="w-full bg-[#0A0607] border border-[#2A1A1D] text-xs text-[#F7F2F2] pl-9 pr-3 py-2.5 rounded-[2px] outline-none font-body"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                <tr>
                  <th className="p-3.5">STUDENT ID</th>
                  <th className="p-3.5">NAME</th>
                  <th className="p-3.5">COLLEGE</th>
                  <th className="p-3.5">TEAM</th>
                  <th className="p-3.5">ATTENDANCE TOGGLE (56px)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1A1D]">
                {filteredRoster.map((r) => (
                  <tr key={r.id} className="h-14 hover:bg-[#1A1114] transition-colors">
                    <td className="p-3.5 font-mono text-[#1FA971] font-bold">{r.user?.student_id_code || 'LGN26-????'}</td>
                    <td className="p-3.5 font-bold text-[#F7F2F2]">{r.user?.name}</td>
                    <td className="p-3.5 text-[#A79798]">{r.user?.college_name}</td>
                    <td className="p-3.5 font-mono text-[#E08A17]">{r.team_name || '-'}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleMarkAttendance(r.user_id, r.attendance_status)}
                        className={`h-10 px-5 rounded-[2px] font-mono text-xs font-bold flex items-center gap-2 transition-all min-w-[120px] justify-center ${
                          r.attendance_status === 'PRESENT'
                            ? 'bg-[#1FA971] text-[#0A0607]'
                            : 'bg-[#1A1114] border border-[#2A1A1D] text-[#A79798] hover:text-[#F7F2F2]'
                        }`}
                      >
                        {r.attendance_status === 'PRESENT' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {r.attendance_status || 'ABSENT'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results & Lock Switch */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#2A1A1D] pb-4">
            <Trophy className="w-5 h-5 text-[#E08A17]" />
            <h2 className="text-lg font-display font-bold text-[#F7F2F2]">RESULTS & WINNER SELECTION</h2>
          </div>

          {resultsMessage && (
            <div className="bg-[#1FA971]/20 border border-[#1FA971] p-3 rounded-[2px] text-xs text-[#1FA971] font-mono">
              {resultsMessage}
            </div>
          )}

          <form onSubmit={handleSaveResults} className="space-y-4 text-xs font-body">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#E08A17] mb-1 font-mono font-bold">🥇 1ST PLACE WINNER *</label>
                <input
                  type="text"
                  value={firstPlace}
                  onChange={(e) => setFirstPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none disabled:opacity-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A79798] mb-1 font-mono font-bold">🥈 2ND PLACE WINNER</label>
                <input
                  type="text"
                  value={secondPlace}
                  onChange={(e) => setSecondPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none disabled:opacity-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A79798] mb-1 font-mono font-bold">🥉 3RD PLACE WINNER</label>
                <input
                  type="text"
                  value={thirdPlace}
                  onChange={(e) => setThirdPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLocked(!isLocked)}
                className={`px-4 py-2 rounded-[2px] font-mono text-xs font-bold flex items-center gap-2 border transition-all ${
                  isLocked
                    ? 'bg-[#4A050A] border-[#E01B22] text-[#FF2A2A]'
                    : 'bg-[#130C0E] border-[#2A1A1D] text-[#A79798]'
                }`}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {isLocked ? 'RESULTS LOCKED' : 'UNLOCKED FOR EDITING'}
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> SAVE RESULTS
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
