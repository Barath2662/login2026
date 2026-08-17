import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  category: string;
  day: number;
  start_time: string;
  end_time: string;
  venue: string;
  is_flagship: boolean;
  guardian_asset: string;
}

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const res = await api.events.getAll();
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      api.registrations.getMyRegistrations().then((res) => {
        if (Array.isArray(res.data)) {
          setUserRegistrations(res.data.map((r: any) => r.event_id));
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const dayEvents = events.filter((e) => e.day === selectedDay);
  const timeSlots = ['09:30', '10:00', '11:30', '13:30', '14:00', '15:00'];

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-left space-y-3 max-w-2xl">
          <span className="mono-label text-[#E01B22] font-bold">DYNAMIC SCHEDULE MATRIX</span>
          <h1 className="display-l text-[#F7F2F2]">SYMPOSIUM TIMELINE</h1>
          <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed">
            Parallel schedule grid for 18 & 19 September 2026. Concurrent events run in parallel lanes.
          </p>
        </div>

        {/* Day Switcher */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedDay(18)}
            className={`px-6 py-2.5 rounded-[2px] font-mono text-xs font-bold transition-all border ${
              selectedDay === 18
                ? 'bg-[#E01B22] text-[#F7F2F2] border-[#E01B22]'
                : 'bg-[#130C0E] text-[#A79798] border-[#2A1A1D] hover:border-[#A79798]'
            }`}
          >
            DAY 1 — 18 SEPTEMBER 2026
          </button>
          <button
            onClick={() => setSelectedDay(19)}
            className={`px-6 py-2.5 rounded-[2px] font-mono text-xs font-bold transition-all border ${
              selectedDay === 19
                ? 'bg-[#E01B22] text-[#F7F2F2] border-[#E01B22]'
                : 'bg-[#130C0E] text-[#A79798] border-[#2A1A1D] hover:border-[#A79798]'
            }`}
          >
            DAY 2 — 19 SEPTEMBER 2026
          </button>
        </div>

        {/* Desktop Parallel Timeline Axis */}
        {!loading && (
          <div className="hidden lg:block bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-6 space-y-6 shadow-2xl corner-bracket-container">
            <div className="corner-bracket-tl" />
            <div className="corner-bracket-br" />

            {/* Time Axis Header */}
            <div className="grid grid-cols-6 border-b border-[#2A1A1D] pb-4 text-center font-mono text-xs text-[#FF2A2A] font-bold">
              {timeSlots.map((slot) => (
                <div key={slot} className="border-r border-[#2A1A1D] last:border-r-0">
                  {slot} IST
                </div>
              ))}
            </div>

            {/* Event Lanes */}
            <div className="space-y-4 pt-2">
              {dayEvents.map((evt) => {
                const isRegistered = userRegistrations.includes(evt.id);

                return (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/events?id=${evt.id}`)}
                    className={`p-4 rounded-[2px] cursor-pointer transition-all flex items-center justify-between group ${
                      evt.is_flagship
                        ? 'bg-[#4A050A]/40 border-2 border-[#E01B22]'
                        : 'bg-[#0A0607] border border-[#2A1A1D] hover:border-[#FF2A2A]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={evt.guardian_asset || '/assets/logo.svg'}
                        alt="Guardian"
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-sm text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors">
                            {evt.name}
                          </h3>
                          {evt.is_flagship && (
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#E01B22] text-[#F7F2F2] rounded-[2px]">
                              ★ FLAGSHIP
                            </span>
                          )}
                          {isRegistered && (
                            <span className="chip-registered px-2 py-0.5 text-[9px] font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> REGISTERED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-[#A79798] mt-1">
                          <span>{evt.category}</span>
                          <span>•</span>
                          <span>{evt.start_time.slice(0, 5)} - {evt.end_time.slice(0, 5)}</span>
                          <span>•</span>
                          <span>Venue: {evt.venue || 'TBA'}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#A79798] group-hover:text-[#E01B22] group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Mobile Vertical Schedule List */}
        {!loading && (
          <div className="lg:hidden space-y-4">
            {dayEvents.map((evt) => {
              const isRegistered = userRegistrations.includes(evt.id);
              const concurrent = dayEvents.filter(
                (other) =>
                  other.id !== evt.id &&
                  evt.start_time < other.end_time &&
                  other.start_time < evt.end_time
              );

              return (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/events?id=${evt.id}`)}
                  className={`p-5 rounded-[2px] bg-[#130C0E] border transition-all cursor-pointer space-y-3 ${
                    evt.is_flagship ? 'border-[#E01B22]' : 'border-[#2A1A1D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FF2A2A]">
                      {evt.start_time.slice(0, 5)} - {evt.end_time.slice(0, 5)}
                    </span>
                    {isRegistered && (
                      <span className="chip-registered px-2 py-0.5 text-[10px]">
                        REGISTERED ✓
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-base text-[#F7F2F2]">{evt.name}</h3>

                  {concurrent.length > 0 && (
                    <p className="text-[11px] font-mono text-[#E08A17] bg-[#1A1114] p-2 rounded-[2px] border border-[#2A1A1D]">
                      Runs at the same time as: {concurrent.map((c) => c.name).join(', ')}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-xs font-mono text-[#A79798] pt-2 border-t border-[#2A1A1D]">
                    <span>Venue: {evt.venue || 'TBA'}</span>
                    <span className="text-[#E01B22]">View Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
