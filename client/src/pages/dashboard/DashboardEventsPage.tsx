import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { Event } from '../../types/event';
import { Calendar, Users, User, Clock, MapPin, ArrowRight, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DashboardEventsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'INDIVIDUAL' | 'TEAM'>('ALL');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => { const res = await api.events.getAll(); return res.data || []; },
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return await api.registrations.register({ event_id: eventId });
    },
    onSuccess: (_, eventId) => {
      const event = events.find((e: Event) => e.id === eventId);
      setRegSuccess(`Registered for ${event?.name || 'event'}`);
      setRegError(null);
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      setTimeout(() => setRegSuccess(null), 3000);
    },
    onError: (err: any) => {
      setRegError(err.response?.data?.message || 'Registration failed');
      setRegSuccess(null);
    },
  });

  const filteredEvents = (events as Event[]).filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || event.team_type === filter;
    return matchesSearch && matchesFilter && event.status === 'open';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[#F7F2F2]">Events</h1>
        <p className="text-xs text-[#6B5A5C] font-mono mt-1">Browse and register for symposium events</p>
      </div>

      {/* Alerts */}
      {regError && (
        <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF2A2A]">
          <AlertCircle className="w-4 h-4 shrink-0" /><span>{regError}</span>
          <button onClick={() => setRegError(null)} className="ml-auto text-[#6B5A5C] hover:text-white">✕</button>
        </div>
      )}
      {regSuccess && (
        <div className="bg-[#1FA971]/15 border border-[#1FA971]/60 p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#1FA971]">
          <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{regSuccess}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5A5C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] pl-10 pr-4 py-2.5 text-[#F7F2F2] text-xs outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'INDIVIDUAL', 'TEAM'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-[10px] font-mono rounded-[2px] border transition-colors ${
                filter === f
                  ? 'bg-[#E01B22]/15 border-[#E01B22] text-[#E01B22]'
                  : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C] hover:text-[#A79798]'
              }`}
            >
              <Filter className="w-3 h-3 inline mr-1" />{f}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-xs font-mono text-[#6B5A5C]">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-xs font-mono text-[#6B5A5C]">No events found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-5 space-y-4 hover:border-[#3E2529] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-display font-bold text-[#F7F2F2]">{event.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px] ${
                    event.category === 'TECHNICAL' ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30' : 'bg-[#E08A17]/15 text-[#E08A17] border border-[#E08A17]/30'
                  }`}>
                    {event.category}
                  </span>
                </div>
                <span className={`shrink-0 px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px] flex items-center gap-1 ${
                  event.team_type === 'TEAM' ? 'bg-[#E08A17]/15 text-[#E08A17] border border-[#E08A17]/30' : 'bg-[#1FA971]/15 text-[#1FA971] border border-[#1FA971]/30'
                }`}>
                  {event.team_type === 'TEAM' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {event.team_type === 'TEAM' ? `${event.min_team_size}-${event.max_team_size}` : 'Solo'}
                </span>
              </div>

              {event.description && (
                <p className="text-[11px] text-[#A79798] line-clamp-2">{event.description}</p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-[#6B5A5C]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Day {event.day}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}</span>
                {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>}
              </div>

              {event.team_type === 'INDIVIDUAL' ? (
                <button
                  onClick={() => registerMutation.mutate(event.id)}
                  disabled={registerMutation.isPending}
                  className="w-full py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-[11px] font-bold rounded-[2px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  REGISTER <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <a
                  href="/dashboard/teams"
                  className="block w-full py-2.5 bg-[#E08A17]/20 hover:bg-[#E08A17]/30 text-[#E08A17] font-mono text-[11px] font-bold rounded-[2px] text-center transition-colors border border-[#E08A17]/30"
                >
                  CREATE / JOIN TEAM <ArrowRight className="w-3 h-3 inline ml-1" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
