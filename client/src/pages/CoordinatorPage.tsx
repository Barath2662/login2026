import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Trophy, Users, Search, CheckCircle2, XCircle, Lock, Unlock, Save, RefreshCw, AlertCircle } from 'lucide-react';

export const CoordinatorPage: React.FC = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');

  // Results state
  const [firstPlace, setFirstPlace] = useState('');
  const [secondPlace, setSecondPlace] = useState('');
  const [thirdPlace, setThirdPlace] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [resultsMessage, setResultsMessage] = useState<string | null>(null);
  const [resultsError, setResultsError] = useState<string | null>(null);

  // 1. Fetch Events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.events.getAll();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data);
          setSelectedEventId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load coordinator events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 2. Fetch Roster & Results whenever selected event changes
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchEventData = async () => {
      setRosterLoading(true);
      try {
        const [rosterRes, resultRes] = await Promise.allSettled([
          api.registrations.getEventRegistrations(selectedEventId),
          api.results.getEventResult(selectedEventId),
        ]);

        if (rosterRes.status === 'fulfilled' && Array.isArray(rosterRes.value.data)) {
          setRoster(rosterRes.value.data);
        } else {
          setRoster([]);
        }

        if (resultRes.status === 'fulfilled' && resultRes.value.data) {
          setFirstPlace(resultRes.value.data.first_place || '');
          setSecondPlace(resultRes.value.data.second_place || '');
          setThirdPlace(resultRes.value.data.third_place || '');
          setIsLocked(resultRes.value.data.is_locked || false);
        } else {
          setFirstPlace('');
          setSecondPlace('');
          setThirdPlace('');
          setIsLocked(false);
        }
      } catch (err) {
        console.error('Error loading event data:', err);
      } finally {
        setRosterLoading(false);
      }
    };

    fetchEventData();
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

      setRoster((prev) =>
        prev.map((item) =>
          item.user_id === studentId || item.user?.id === studentId
            ? { ...item, attendance_status: newStatus }
            : item
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update attendance status.');
    }
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setResultsMessage(null);
    setResultsError(null);

    try {
      await api.results.saveEventResult(selectedEventId, {
        first_place: firstPlace,
        second_place: secondPlace,
        third_place: thirdPlace,
        is_locked: isLocked,
      });

      setResultsMessage('Winners and competition results saved successfully!');
      setTimeout(() => setResultsMessage(null), 4000);
    } catch (err: any) {
      setResultsError(err.response?.data?.message || 'Failed to save results.');
      setTimeout(() => setResultsError(null), 4000);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Filter roster by search & attendance
  const filteredRoster = roster.filter((r) => {
    const matchesSearch =
      !search ||
      (r.user?.name && r.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.user?.student_id_code && r.user.student_id_code.toLowerCase().includes(search.toLowerCase())) ||
      (r.user?.college_name && r.user.college_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.team_name && r.team_name.toLowerCase().includes(search.toLowerCase()));

    const status = r.attendance_status || 'ABSENT';
    const matchesFilter =
      attendanceFilter === 'ALL' ||
      (attendanceFilter === 'PRESENT' && status === 'PRESENT') ||
      (attendanceFilter === 'ABSENT' && status !== 'PRESENT');

    return matchesSearch && matchesFilter;
  });

  const totalRegistered = roster.length;
  const presentCount = roster.filter((r) => r.attendance_status === 'PRESENT').length;
  const absentCount = totalRegistered - presentCount;
  const attendanceRate = totalRegistered > 0 ? Math.round((presentCount / totalRegistered) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0607] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A1A1D] pb-6">
          <div>
            <div className="mono-label flex items-center gap-2 text-[#E08A17] font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E08A17] animate-ping" />
              <span>COORDINATOR COMMAND HUB • {user?.name || 'DESK'}</span>
            </div>
            <h1 className="display-m text-[#F7F2F2]">EVENT DESK MANAGEMENT</h1>
          </div>

          {/* Event Selector Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {loading ? (
              <div className="text-xs font-mono text-[#A79798] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E01B22]" /> Loading Arenas...
              </div>
            ) : events.length > 0 ? (
              <select
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="w-full md:w-auto bg-[#130C0E] border border-[#2A1A1D] hover:border-[#E01B22]/50 text-[#F7F2F2] px-4 py-2.5 rounded-[2px] text-xs font-mono outline-none shadow-md"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({evt.category} • Day {evt.day})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs font-mono text-[#A79798]">No Events Available</div>
            )}
          </div>
        </div>

        {/* Telemetry Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px] space-y-1">
            <span className="mono-label block text-[10px]">SELECTED EVENT</span>
            <div className="font-display text-sm sm:text-base font-bold text-[#F7F2F2] truncate">
              {selectedEvent?.name || 'Select Arena'}
            </div>
          </div>

          <div className="bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px] space-y-1">
            <span className="mono-label block text-[10px]">TOTAL REGISTERED</span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#F7F2F2]">
              {totalRegistered} <span className="text-xs text-[#A79798] font-normal">PARTICIPANTS</span>
            </div>
          </div>

          <div className="bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px] space-y-1">
            <span className="mono-label block text-[10px]">ATTENDANCE MARKED</span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#1FA971]">
              {presentCount} <span className="text-xs text-[#A79798] font-normal">({attendanceRate}%)</span>
            </div>
          </div>

          <div className="bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px] space-y-1">
            <span className="mono-label block text-[10px]">ABSENT / PENDING</span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#E08A17]">
              {absentCount} <span className="text-xs text-[#A79798] font-normal">LEFT</span>
            </div>
          </div>
        </div>

        {/* Attendance & Participant Roster */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-5 sm:p-6 rounded-[2px] space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#2A1A1D] pb-5">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#E01B22]" />
              <div>
                <h2 className="text-base sm:text-lg font-display font-bold text-[#F7F2F2]">PARTICIPANT ROSTER &amp; ATTENDANCE</h2>
                <p className="text-[11px] font-mono text-[#A79798]">Live attendance tracking for {selectedEvent?.name}</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Attendance Filter Buttons */}
              <div className="flex items-center bg-[#0A0607] border border-[#2A1A1D] p-1 rounded-[2px] text-[11px] font-mono">
                <button
                  onClick={() => setAttendanceFilter('ALL')}
                  className={`px-3 py-1 rounded-[2px] transition-colors ${
                    attendanceFilter === 'ALL' ? 'bg-[#E01B22] text-white font-bold' : 'text-[#A79798] hover:text-white'
                  }`}
                >
                  ALL ({totalRegistered})
                </button>
                <button
                  onClick={() => setAttendanceFilter('PRESENT')}
                  className={`px-3 py-1 rounded-[2px] transition-colors ${
                    attendanceFilter === 'PRESENT' ? 'bg-[#1FA971] text-[#0A0607] font-bold' : 'text-[#A79798] hover:text-[#1FA971]'
                  }`}
                >
                  PRESENT ({presentCount})
                </button>
                <button
                  onClick={() => setAttendanceFilter('ABSENT')}
                  className={`px-3 py-1 rounded-[2px] transition-colors ${
                    attendanceFilter === 'ABSENT' ? 'bg-[#4A050A] text-[#FF2A2A] font-bold' : 'text-[#A79798] hover:text-[#FF2A2A]'
                  }`}
                >
                  ABSENT ({absentCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#6B5A5C] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, roll, college, team..."
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-xs text-[#F7F2F2] pl-9 pr-3 py-2 rounded-[2px] outline-none font-body input-glow"
                />
              </div>
            </div>
          </div>

          {/* Roster Table */}
          {rosterLoading ? (
            <div className="py-16 text-center text-xs font-mono text-[#A79798] flex items-center justify-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-[#E01B22]" /> Loading Participant Roster...
            </div>
          ) : filteredRoster.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3.5">STUDENT ID</th>
                    <th className="p-3.5">NAME</th>
                    <th className="p-3.5">COLLEGE / DEPT</th>
                    <th className="p-3.5">TEAM NAME</th>
                    <th className="p-3.5 text-center">ATTENDANCE (TOGGLE)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1A1D]">
                  {filteredRoster.map((r) => {
                    const studentId = r.user_id || r.user?.id;
                    const isPresent = r.attendance_status === 'PRESENT';

                    return (
                      <tr key={r.id || studentId} className="h-14 hover:bg-[#1A1114] transition-colors">
                        <td className="p-3.5 font-mono text-[#1FA971] font-bold">
                          {r.user?.student_id_code || 'LGN26-????'}
                        </td>
                        <td className="p-3.5 font-bold text-[#F7F2F2]">
                          {r.user?.name || r.name || 'Participant'}
                          {r.user?.phone && (
                            <div className="text-[10px] text-[#6B5A5C] font-mono">{r.user.phone}</div>
                          )}
                        </td>
                        <td className="p-3.5 text-[#A79798]">
                          <div>{r.user?.college_name || '-'}</div>
                          <div className="text-[10px] text-[#6B5A5C]">{r.user?.department || ''}</div>
                        </td>
                        <td className="p-3.5 font-mono text-[#E08A17] font-semibold">
                          {r.team_name || (selectedEvent?.team_type === 'SOLO' ? 'SOLO' : '-')}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleMarkAttendance(studentId, r.attendance_status)}
                            className={`h-10 px-5 rounded-[2px] font-mono text-xs font-bold inline-flex items-center gap-2 transition-all min-w-[130px] justify-center shadow-md ${
                              isPresent
                                ? 'bg-[#1FA971] text-[#0A0607] hover:bg-[#188B5D]'
                                : 'bg-[#1A1114] border border-[#3E2529] text-[#A79798] hover:text-[#F7F2F2] hover:border-[#E01B22]'
                            }`}
                          >
                            {isPresent ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {isPresent ? 'PRESENT' : 'ABSENT'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-[#6B5A5C]" />
              <p className="text-sm font-mono text-[#A79798]">
                {search ? `No participants matched search "${search}"` : 'No participants registered for this event yet.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-1.5 bg-[#1A1114] border border-[#2A1A1D] text-xs font-mono text-[#E01B22] rounded-[2px]"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results & Winner Selection Section */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-5 sm:p-6 rounded-[2px] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#2A1A1D] pb-4">
            <Trophy className="w-5 h-5 text-[#E08A17]" />
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-[#F7F2F2]">OFFICIAL EVENT RESULTS &amp; WINNERS</h2>
              <p className="text-[11px] font-mono text-[#A79798]">Declare podium finishers for {selectedEvent?.name}</p>
            </div>
          </div>

          {resultsMessage && (
            <div className="bg-[#1FA971]/20 border border-[#1FA971] p-3.5 rounded-[2px] text-xs text-[#1FA971] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {resultsMessage}
            </div>
          )}

          {resultsError && (
            <div className="bg-[#4A050A] border border-[#E01B22] p-3.5 rounded-[2px] text-xs text-[#FF2A2A] font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {resultsError}
            </div>
          )}

          <form onSubmit={handleSaveResults} className="space-y-5 text-xs font-body">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[#E08A17] mb-1.5 font-mono font-bold">🥇 1ST PLACE WINNER *</label>
                <input
                  type="text"
                  value={firstPlace}
                  onChange={(e) => setFirstPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-3 rounded-[2px] outline-none disabled:opacity-50 font-mono input-glow"
                />
              </div>

              <div>
                <label className="block text-[#A79798] mb-1.5 font-mono font-bold">🥈 2ND PLACE WINNER</label>
                <input
                  type="text"
                  value={secondPlace}
                  onChange={(e) => setSecondPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-3 rounded-[2px] outline-none disabled:opacity-50 font-mono input-glow"
                />
              </div>

              <div>
                <label className="block text-[#A79798] mb-1.5 font-mono font-bold">🥉 3RD PLACE WINNER</label>
                <input
                  type="text"
                  value={thirdPlace}
                  onChange={(e) => setThirdPlace(e.target.value)}
                  disabled={isLocked}
                  placeholder="Participant / Team Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] p-3 rounded-[2px] outline-none disabled:opacity-50 font-mono input-glow"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsLocked(!isLocked)}
                className={`px-4 py-2.5 rounded-[2px] font-mono text-xs font-bold flex items-center gap-2 border transition-all ${
                  isLocked
                    ? 'bg-[#4A050A] border-[#E01B22] text-[#FF2A2A]'
                    : 'bg-[#130C0E] border-[#2A1A1D] text-[#A79798] hover:text-white'
                }`}
              >
                {isLocked ? <Lock className="w-4 h-4 text-[#E01B22]" /> : <Unlock className="w-4 h-4" />}
                {isLocked ? 'RESULTS LOCKED' : 'UNLOCKED FOR EDITING'}
              </button>

              <button
                type="submit"
                className="shimmer-btn px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2 shadow-lg"
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
