import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Megaphone } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: 'normal' | 'high' | 'urgent';
}

export const Ticker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.announcements.getActive();
        if (Array.isArray(res.data)) {
          setAnnouncements(res.data);
        }
      } catch (err) {
        console.warn('No active ticker announcements or failed to fetch');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading || announcements.length === 0) {
    return null; // The ticker does NOT render if there are no active announcements
  }

  return (
    <div className="w-full bg-[#141418] border-b border-[#2A1416] py-2 px-4 flex items-center justify-between z-30 relative">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 bg-[#E01B24]/20 border border-[#E01B24] px-2.5 py-0.5 rounded text-[11px] font-mono text-[#E01B24] shrink-0">
          <Megaphone className="w-3 h-3 animate-pulse" />
          <span>ANNOUNCEMENTS</span>
        </div>

        <div className="overflow-hidden relative w-full whitespace-nowrap">
          <div className="inline-block animate-marquee font-mono text-xs text-[#F2F2F4]">
            {announcements.map((a, idx) => (
              <span key={a.id} className="mx-6">
                <strong className={a.priority === 'urgent' ? 'text-[#FF3B30]' : 'text-[#E8A317]'}>
                  [{a.title}]
                </strong>{' '}
                {a.message}
                {idx < announcements.length - 1 && <span className="ml-6 text-[#2A1416]">///</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
