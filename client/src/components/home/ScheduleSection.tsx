import React, { useState } from 'react';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

const SCHEDULE_DATA: Record<'DAY_01' | 'DAY_02', Array<{ time: string; title: string; type: string; venue: string }>> = {
  DAY_01: [
    { time: '08:30 AM', title: 'Inauguration Ceremony', type: 'GENERAL', venue: 'F-Block Auditorium' },
    { time: '10:00 AM', title: 'Star of LOGIN Prelims (Flagship)', type: 'TECHNICAL', venue: 'MCA Lab' },
    { time: '11:30 AM', title: 'Net Hunt (Online Technical)', type: 'TECHNICAL', venue: 'Lab 4' },
    { time: '02:00 PM', title: 'Pitch Perfect (Case Study)', type: 'TECHNICAL', venue: 'Seminar Hall' },
  ],
  DAY_02: [
    { time: '09:00 AM', title: 'Star of LOGIN Finals (Flagship)', type: 'TECHNICAL', venue: 'F-Block Auditorium' },
    { time: '10:30 AM', title: 'Code Storm (Coding Contest)', type: 'TECHNICAL', venue: 'MCA Lab' },
    { time: '01:30 PM', title: 'Workshop on Edge Computing', type: 'WORKSHOP', venue: 'IT Seminar Hall' },
    { time: '03:30 PM', title: 'Valedictory & Prize Distribution', type: 'GENERAL', venue: 'F-Block Auditorium' },
  ],
};

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'DAY_01' | 'DAY_02'>('DAY_01');

  return (
    <section className="py-20 px-4 bg-[#130C0E] border-b border-[#2A1A1D]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="mono-label text-[#E01B22]">[ DIRECTIVE // 04 ]</span>
            <h2 className="text-xl sm:text-3xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
              DAY SPOTLIGHT &amp; SCHEDULE
            </h2>
          </div>
          
          {/* Day Toggles */}
          <div className="flex gap-2">
            {(['DAY_01', 'DAY_02'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-[2px] border transition-colors ${
                  activeDay === day
                    ? 'bg-[#E01B22] border-[#E01B22] text-[#F7F2F2]'
                    : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C] hover:text-[#A79798]'
                }`}
              >
                {day.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-[#0A0607] border border-[#2A1A1D] rounded-[2px] divide-y divide-[#2A1A1D] overflow-hidden">
          {SCHEDULE_DATA[activeDay].map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#130C0E]/50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Time slot */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#E01B22] shrink-0 pt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                {/* Info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#F7F2F2]">{item.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#6B5A5C]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.venue}</span>
                    <span className="uppercase">{item.type}</span>
                  </div>
                </div>
              </div>
              
              {/* Type Badge */}
              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px] self-start sm:self-center ${
                item.type === 'TECHNICAL' ? 'bg-[#E01B22]/15 text-[#E01B22] border border-[#E01B22]/30' :
                item.type === 'WORKSHOP' ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30' :
                'bg-[#A79798]/15 text-[#A79798] border border-[#A79798]/30'
              }`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="text-center">
          <a
            href="/timeline"
            className="inline-flex items-center gap-1 font-mono text-xs text-[#6B5A5C] hover:text-[#F7F2F2] transition-colors"
          >
            VIEW FULL SCHEDULE <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
