import React from 'react';
import { Trophy, Calendar, Building2, Users } from 'lucide-react';

export const HighlightsSection: React.FC = () => {
  const stats = [
    { icon: Trophy, label: 'TOTAL PRIZE POOL', value: '₹ 1,00,000+', color: '#E08A17' },
    { icon: Calendar, label: 'COMPETITION ARENAS', value: '11 EVENTS', color: '#E01B22' },
    { icon: Building2, label: 'PARTICIPATING INSTITUTIONS', value: '100+ COLLEGES', color: '#6366F1' },
    { icon: Users, label: 'EXPECTED ENROLLMENT', value: '1000+ LOGINS', color: '#1FA971' },
  ];

  return (
    <section className="py-14 bg-[#130C0E] border-b border-[#2A1A1D]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-2.5 p-3.5 rounded-[2px] border border-[#2A1A1D]/60 bg-[#0A0607] hover:border-[#3E2529] transition-all">
                <div className="mx-auto w-8 h-8 rounded-full bg-[#130C0E] border border-[#2A1A1D] flex items-center justify-center">
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-[#6B5A5C] uppercase tracking-wider">{stat.label}</span>
                  <strong className="block text-lg sm:text-2xl font-display font-black text-[#F7F2F2] mt-1 tracking-wide">
                    {stat.value}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
