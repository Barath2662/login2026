import React, { useState } from 'react';
import { Image, ZoomIn, X, Calendar, MapPin, Grid } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'ARENAS' | 'ARCHIVES' | 'PEOPLE';
  src: string;
  description: string;
  location: string;
  date: string;
  meta: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'arena-1',
    title: 'Cyber-Coliseum Battlegrounds',
    category: 'ARENAS',
    src: '/assets/gallery-1.png',
    description: 'The cybernetic combat zone where team-based programming challenges and developer standoffs take place in real time.',
    location: 'District 9 Arena',
    date: '18 September 2026',
    meta: 'SYS // RESOLUTION_1024x1024 // SCAN_ACTIVE'
  },
  {
    id: 'arena-2',
    title: 'Grid Zero Terminal Operations',
    category: 'ARCHIVES',
    src: '/assets/gallery-2.png',
    description: 'Participants executing shell queries and decryption scripts during the security audit round inside the hacker labs.',
    location: 'Hackers Pub Terminal',
    date: '19 September 2026',
    meta: 'NET // ADDR_127.0.0.1 // SECURITY_HIGH'
  },
  {
    id: 'about-hist',
    title: 'Retro Terminal Cyber-Archive',
    category: 'ARCHIVES',
    src: '/assets/about-history.png',
    description: 'Dystopian command hub visualising the 35 years historical trajectory of the LOGIN technical symposium.',
    location: 'System Archives Node',
    date: '18 September 2026',
    meta: 'SYS // ARCHIVE_01 // ACCESS_GRANTED'
  },
  {
    id: 'sec-avatar',
    title: 'Student Leadership profile node',
    category: 'PEOPLE',
    src: '/assets/secretary.png',
    description: 'Holographic profile of student representatives and department coordinators behind LOGIN 2K26 coordination.',
    location: 'PSG College of Technology',
    date: '18 September 2026',
    meta: 'USER // AVATAR_047 // ROLE_SECRETARY'
  }
];

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ARENAS' | 'ARCHIVES' | 'PEOPLE'>('ALL');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'ALL' 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0607] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      {/* Red ambient light spot */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,_rgba(224,27,34,0.05)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ SYMPOSIUM ARCHIVES
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            LOGIN GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wide leading-relaxed">
            Examine visual telemetry captures of battle arenas, hacker nodes, and coordination hubs.
          </p>
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-[#2A1A1D] pb-6">
          {(['ALL', 'ARENAS', 'ARCHIVES', 'PEOPLE'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-300 rounded-[2px] border ${
                selectedCategory === category
                  ? 'bg-[#E01B22] border-[#E01B22] text-[#F7F2F2] shadow-[0_0_15px_rgba(224,27,34,0.25)]'
                  : 'bg-[#130C0E]/50 border-[#2A1A1D] text-[#A79798] hover:border-[#E01B22]/50 hover:text-[#F7F2F2]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative border border-[#2A1A1D] bg-[#130C0E]/30 backdrop-blur-sm rounded-[2px] p-4 transition-all duration-500 hover:border-[#E01B22]/40 hover:bg-[#130C0E]/60 cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Image Frame corners */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#E01B22]/30 group-hover:border-[#E01B22] transition-colors" />

              {/* Technical index badge */}
              <div className="absolute top-6 left-6 z-20 bg-black/80 border border-[#2A1A1D] px-2.5 py-1 rounded-[1px] font-mono text-[9px] text-[#E01B22] tracking-wider font-bold">
                {item.category} // {item.id.toUpperCase()}
              </div>

              {/* Main Image container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#2A1A1D] mb-4 bg-black">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700" 
                />
                
                {/* Scanner/glitch line */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(224,27,34,0.05)_50%)] bg-[size:100%_6px] pointer-events-none opacity-60" />
                
                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-[#E01B22] bg-[#0A0607]/80 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-5 h-5 text-[#E01B22]" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5 mt-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-base sm:text-lg text-[#F7F2F2] tracking-wider uppercase group-hover:text-[#E01B22] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#A79798] leading-relaxed font-mono">
                  {item.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#2A1A1D]/60 text-[10px] font-mono text-[#6B5A5C]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#E01B22]" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#E01B22]" />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal overlay */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-[#0A0607]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none" />
          
          {/* Close trigger overlay click */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxImage(null)} />

          {/* Modal Container */}
          <div className="relative max-w-5xl w-full bg-[#130C0E] border border-[#E01B22]/50 p-6 rounded-[2px] shadow-[0_0_50px_rgba(224,27,34,0.15)] flex flex-col md:flex-row gap-6 items-center z-10">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E01B22]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E01B22]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E01B22]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E01B22]" />

            {/* Close Button */}
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 text-[#A79798] hover:text-[#E01B22] border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[1px] bg-[#0A0607]/80 transition-colors z-30"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Expanded Image */}
            <div className="w-full md:w-3/5 border border-[#2A1A1D] overflow-hidden aspect-[16/10] bg-black">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title}
                className="w-full h-full object-cover filter contrast-105" 
              />
            </div>

            {/* Details and Technical Telemetry */}
            <div className="w-full md:w-2/5 space-y-5 select-none text-left">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#E01B22] font-black tracking-widest uppercase block">
                  {lightboxImage.category} // TELEMETRY NODE
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
                  {lightboxImage.title}
                </h2>
              </div>

              <div className="p-3 bg-[#0A0607] border border-[#2A1A1D] rounded-[1px]">
                <p className="text-xs text-[#A79798] font-mono leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>

              <div className="space-y-2 border-t border-[#2A1A1D] pt-4 font-mono text-[11px] text-[#A79798]">
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Location:</span>
                  <span className="text-[#F7F2F2] font-bold">{lightboxImage.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Date captured:</span>
                  <span className="text-[#F7F2F2] font-bold">{lightboxImage.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Telemetry data:</span>
                  <span className="text-[#E01B22] font-bold text-[9px]">{lightboxImage.meta}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setLightboxImage(null)}
                  className="w-full py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono text-[11px] tracking-wider rounded-[2px] transition-all hover:shadow-[0_0_15px_rgba(224,27,34,0.3)] uppercase"
                >
                  DISMISS SCAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
