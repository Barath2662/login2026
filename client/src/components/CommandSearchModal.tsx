import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, X, Calendar, ArrowRight } from 'lucide-react';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.events.getAll().then((res) => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          const btn = document.querySelector('[title="Search events and routes"]') as HTMLButtonElement;
          if (btn) btn.click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectEvent = (id: number) => {
    onClose();
    navigate(`/events?id=${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C]/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in">
      <div className="bg-[#141418] border border-[#2A1416] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-[#2A1416]">
          <Search className="w-5 h-5 text-[#E01B24] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, timeline, or categories (e.g. Blind Coding, Technical)..."
            className="w-full bg-transparent text-[#F2F2F4] placeholder-[#9A9AA2] px-4 py-4 text-sm font-body outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-[#9A9AA2] hover:text-[#F2F2F4]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-[#9A9AA2] font-mono text-xs">
              No events found matching "{query}"
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <button
                key={evt.id}
                onClick={() => handleSelectEvent(evt.id)}
                className="w-full text-left p-3 rounded-xl bg-[#0A0A0C] hover:bg-[#2A1416] border border-[#2A1416] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-display text-[#F2F2F4] group-hover:text-[#E01B24] transition-colors">
                      {evt.name}
                    </span>
                    {evt.is_flagship && (
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-[#E01B24]/20 border border-[#E01B24] text-[#FF3B30] rounded font-bold">
                        ★ FLAGSHIP
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-[#141418] text-[#9A9AA2] border border-[#2A1416] rounded uppercase">
                      {evt.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9AA2] line-clamp-1 mt-1 font-body">{evt.description}</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#9A9AA2] mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#E01B24]" />
                      Day {evt.day} Sep ({evt.start_time.slice(0, 5)} - {evt.end_time.slice(0, 5)})
                    </span>
                    <span>Venue: {evt.venue || 'TBA'}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#9A9AA2] group-hover:text-[#E01B24] group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-[#0A0A0C] px-4 py-2 border-t border-[#2A1416] flex justify-between items-center text-[10px] font-mono text-[#9A9AA2]">
          <span>Search 11 Official LOGIN 2026 Events</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
