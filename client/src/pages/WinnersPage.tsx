import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Trophy, Award, Search, Sparkles, ShieldCheck, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const WinnersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch results and events
  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['public-results'],
    queryFn: async () => {
      const res = await api.results.getAll();
      return res.data?.data || [];
    },
  });

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['public-events-list'],
    queryFn: async () => {
      const res = await api.events.getAll();
      return res.data || [];
    },
  });

  const resultsList = Array.isArray(resultsData) ? resultsData : [];
  const eventsList = Array.isArray(eventsData) ? eventsData : [];

  // Combine events with their results
  const eventsWithResults = eventsList.map((evt: any) => {
    const res = resultsList.find((r: any) => r.event_id === evt.id || r.event?.id === evt.id);
    return {
      ...evt,
      result: res || null,
      hasResult: Boolean(res && (res.winner || res.winner_id || res.runner || res.runner_id)),
    };
  });

  const filteredEvents = eventsWithResults.filter((evt: any) => {
    const matchesCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.result?.winner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.result?.winner?.college_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['ALL', 'TECHNICAL', 'GENERAL', 'FLAGSHIP'];

  return (
    <div className="min-h-screen bg-[#0A0607] text-[#F7F2F2] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A0306] border border-[#E01B22] text-[#E08A17] text-xs font-mono font-bold uppercase rounded-[2px]"
        >
          <Trophy className="w-4 h-4 text-[#E08A17] animate-pulse" />
          <span>LOGIN 2K26 HALL OF FAME</span>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#F7F2F2] uppercase tracking-wide">
          OFFICIAL EVENT <span className="text-[#E01B22]">WINNERS & CHAMPIONS</span>
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#A79798] max-w-2xl mx-auto">
          Celebrating excellence, innovation, and victory across all national technical and general events at PSG College of Technology.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#130C0E] border border-[#2A1A1D] p-4 rounded-[2px]">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[2px] transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E01B22] text-[#F7F2F2] shadow-[0_0_10px_rgba(224,27,34,0.3)]'
                    : 'bg-[#1A1114] text-[#A79798] hover:text-white border border-[#2A1A1D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#A79798]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event or winner name..."
              className="w-full bg-[#0A0607] border border-[#2A1A1D] pl-9 pr-3 py-2 text-xs font-mono text-[#F7F2F2] rounded-[2px] outline-none focus:border-[#E01B22]"
            />
          </div>
        </div>
      </div>

      {/* Winners Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoadingResults || isLoadingEvents ? (
          <div className="py-24 text-center space-y-3 font-mono text-xs text-[#A79798]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#E01B22] mx-auto" />
            <p>Loading official winner announcements...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-8 space-y-3">
            <Award className="w-12 h-12 text-[#2A1A1D] mx-auto" />
            <h3 className="font-display text-lg font-bold text-[#F7F2F2]">NO WINNERS MATCH SEARCH</h3>
            <p className="text-xs font-mono text-[#A79798]">Try selecting a different event category or clearing your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt: any) => {
              const res = evt.result;
              const hasWinner = Boolean(res?.winner || res?.winner_id);
              const hasRunner = Boolean(res?.runner || res?.runner_id);

              return (
                <div
                  key={evt.id}
                  className={`bg-[#130C0E] border ${
                    hasWinner ? 'border-[#E08A17]/40 hover:border-[#E08A17]' : 'border-[#2A1A1D]'
                  } p-6 rounded-[2px] flex flex-col justify-between space-y-6 relative overflow-hidden transition-all shadow-lg group`}
                >
                  {/* Category Accent */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-[#E08A17] bg-[#E08A17]/10 px-2 py-0.5 border border-[#E08A17]/30 rounded-sm">
                      {evt.category || 'CYBER EVENT'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 ${
                      hasWinner ? 'bg-[#1FA971]/20 text-[#1FA971] border border-[#1FA971]/40' : 'bg-[#E08A17]/20 text-[#E08A17] border border-[#E08A17]/40'
                    }`}>
                      {hasWinner ? <ShieldCheck className="w-3 h-3 text-[#1FA971]" /> : <Calendar className="w-3 h-3" />}
                      {hasWinner ? 'OFFICIAL RESULT' : 'LIVE • PENDING'}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-[#F7F2F2] uppercase group-hover:text-[#E01B22] transition-colors">
                      {evt.name}
                    </h3>
                    <p className="text-xs font-mono text-[#A79798] line-clamp-1">
                      {evt.description || 'LOGIN 2K26 Championship Event'}
                    </p>
                  </div>

                  {/* Winners Podium Cards */}
                  {hasWinner || hasRunner ? (
                    <div className="space-y-3 pt-2">
                      {/* 1st Place Winner */}
                      {res?.winner && (
                        <div className="bg-[#1A0306] border border-[#E08A17] p-3 rounded-[2px] flex items-center gap-3 shadow-[0_0_10px_rgba(224,138,23,0.15)]">
                          <div className="w-9 h-9 bg-[#E08A17] text-[#0A0607] rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                            🥇
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[10px] font-mono font-bold text-[#E08A17] uppercase tracking-wider">
                              1ST PLACE • WINNER
                            </div>
                            <div className="text-sm font-display font-bold text-[#F7F2F2] truncate">
                              {res.winner.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#A79798] truncate">
                              {res.winner.college_name || 'PSG College of Technology'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2nd Place Runner */}
                      {res?.runner && (
                        <div className="bg-[#0A0607] border border-[#2A1A1D] p-3 rounded-[2px] flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#A79798] text-[#0A0607] rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                            🥈
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[10px] font-mono font-bold text-[#A79798] uppercase tracking-wider">
                              2ND PLACE • RUNNER UP
                            </div>
                            <div className="text-sm font-display font-bold text-[#F7F2F2] truncate">
                              {res.runner.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#A79798] truncate">
                              {res.runner.college_name || 'PSG College of Technology'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {res?.remarks && (
                        <div className="text-[10px] font-mono text-[#A79798] bg-[#0A0607] p-2 rounded-[2px] border border-[#2A1A1D] italic">
                          "{res.remarks}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#0A0607] border border-[#2A1A1D] p-6 rounded-[2px] text-center space-y-2">
                      <Sparkles className="w-6 h-6 text-[#E08A17] mx-auto animate-pulse" />
                      <p className="text-xs font-mono font-bold text-[#F7F2F2]">COMPETITION IN PROGRESS</p>
                      <p className="text-[10px] font-mono text-[#A79798]">
                        Event coordinators will publish the official winners list after evaluation completes.
                      </p>
                    </div>
                  )}

                  {/* Footer Tag */}
                  <div className="pt-3 border-t border-[#2A1A1D] flex justify-between items-center text-[10px] font-mono text-[#A79798]">
                    <span>DAY {evt.day || 18} • EVENT ID #{evt.id}</span>
                    <span className="text-[#E08A17]">LOGIN 2K26 VERIFIED</span>
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
