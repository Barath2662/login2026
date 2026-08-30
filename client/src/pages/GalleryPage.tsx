import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, X, Calendar, MapPin, Layers } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'ARENAS' | 'ARCHIVES' | 'PEOPLE' | 'KEYNOTES';
  src: string;
  description: string;
  location: string;
  date: string;
  meta: string;
}

// Generate 50 lightweight high-quality symposium photo gallery items
const RAW_GALLERY_50: GalleryItem[] = Array.from({ length: 50 }, (_, i) => {
  const categories: ('ARENAS' | 'ARCHIVES' | 'PEOPLE' | 'KEYNOTES')[] = ['ARENAS', 'ARCHIVES', 'PEOPLE', 'KEYNOTES'];
  const category = categories[i % categories.length];

  const titles = [
    'Cyber-Coliseum Battlegrounds', 'Grid Zero Terminal Operations', 'Retro Terminal Cyber-Archive',
    'Student Leadership Profile Node', 'Hackathon Midnight Surge', 'Keynote & AI Paradigm Keynote',
    'Quantum Cryptography Lab', 'Algorithmic Duel Arena', 'DevOps Pipeline Crisis Room',
    'Network Penetration Trial', 'Dystopian Tech Exhibition', 'Cyber Security CTF Breach',
    'Hardware & Embedded Systems Arena', 'Neural Network Visualizer', 'Main Stage Inaugural Keynote',
    'Code Relay Championship', 'AI Pixel Paradox Showcase', 'Project Phoenix War Room',
    'IPL Auction Strategy Desk', 'Blind Coding Dark Room', 'Data Extraction Cyber Vault',
    'CodeXcape Technical Escape Room', 'Debug Arena Execution', 'Valedictory Trophy Ceremony'
  ];

  const locations = [
    'District 9 Arena', 'Ymir Hall', 'K503 Hacker Lab', 'PSG Tech Auditorium',
    'CAT Lab Terminal', 'IS Lab Cyber Node', 'CC Lab Sandbox', 'Assembly Hall'
  ];

  // High-performance curated tech/cyber photo URLs from Unsplash with lightweight webp parameters
  const photoUrls = [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=75',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=75',
  ];

  const title = `${titles[i % titles.length]} #${i + 1}`;
  const src = photoUrls[i % photoUrls.length];
  const location = locations[i % locations.length];

  return {
    id: `telemetry-${i + 1}`,
    title,
    category,
    src,
    description: `Archival telemetry capture #${i + 1} from LOGIN 2K26 National Cyber Symposium. Documenting high-stakes coding arenas, team dynamics, and technical breakthroughs.`,
    location,
    date: i % 2 === 0 ? '18 September 2026' : '19 September 2026',
    meta: `SYS // NODE_${(i + 1).toString().padStart(2, '0')} // RESOLUTION_1080P // COMPRESSED`,
  };
});

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ARENAS' | 'ARCHIVES' | 'PEOPLE' | 'KEYNOTES'>('ALL');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = selectedCategory === 'ALL'
    ? RAW_GALLERY_50
    : RAW_GALLERY_50.filter((item) => item.category === selectedCategory);

  const displayedItems = filteredItems.slice(0, visibleCount);

  // Infinite Scroll Trigger for lightweight lazy loading of the 50 images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredItems.length) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredItems.length]);

  // Reset pagination on category change
  const handleCategorySelect = (cat: 'ALL' | 'ARENAS' | 'ARCHIVES' | 'PEOPLE' | 'KEYNOTES') => {
    setSelectedCategory(cat);
    setVisibleCount(16);
  };

  // Keyboard shortcut for closing lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0607] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,_rgba(224,27,34,0.06)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ SYMPOSIUM ARCHIVES • 50 TELEMETRY CAPTURES
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            LOGIN GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wide leading-relaxed">
            Visual archive of hackathon arenas, terminal operations, keynotes, and student coordination.
          </p>
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-[#2A1A1D] pb-6">
          {(['ALL', 'ARENAS', 'ARCHIVES', 'PEOPLE', 'KEYNOTES'] as const).map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
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

        {/* Loaded items indicator */}
        <div className="flex justify-between items-center font-mono text-[11px] text-[#A79798] px-1">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#E01B22]" />
            <span>SHOWING <strong className="text-[#F7F2F2]">{displayedItems.length}</strong> OF <strong className="text-[#F7F2F2]">{filteredItems.length}</strong> IMAGES</span>
          </span>
          <span className="text-[10px] text-[#1FA971] font-bold uppercase tracking-widest">
            ⚡ LIGHTWEIGHT WEBP COMPRESSION ACTIVE
          </span>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative border border-[#2A1A1D] bg-[#130C0E]/50 backdrop-blur-sm rounded-[2px] p-3 transition-all duration-300 hover:border-[#E01B22] cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E01B22]/30 group-hover:border-[#E01B22]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E01B22]/30 group-hover:border-[#E01B22]" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10 bg-black/80 border border-[#2A1A1D] px-2 py-0.5 rounded-[1px] font-mono text-[8px] text-[#E01B22] font-bold tracking-wider">
                {item.category}
              </div>

              {/* Main Image container with Lazy Loading */}
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-[#2A1A1D] mb-3 bg-[#0A0607]">
                <img 
                  src={item.src} 
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                />
                
                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-[#E01B22] bg-[#0A0607]/80 flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-4 h-4 text-[#E01B22]" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-xs text-[#F7F2F2] tracking-wide uppercase group-hover:text-[#E01B22] transition-colors truncate">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A79798]">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#E01B22] shrink-0" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-[#E01B22]" />
                    {item.date.split(' ')[0]} {item.date.split(' ')[1].slice(0, 3)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Sentinel for Lazy Loading 50 images */}
        {visibleCount < filteredItems.length && (
          <div ref={loaderRef} className="text-center pt-8 pb-4">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length))}
              className="px-6 py-3 bg-[#1A1114] border border-[#E01B22]/40 hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-all"
            >
              LOAD MORE ARCHIVES (+12 IMAGES) ↓
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal overlay */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-[#0A0607]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          {/* Close trigger overlay click */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxImage(null)} />

          {/* Modal Container */}
          <div className="relative max-w-4xl w-full bg-[#130C0E] border border-[#E01B22]/50 p-6 rounded-[2px] shadow-2xl flex flex-col md:flex-row gap-6 items-center z-10">
            
            {/* Close Button */}
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 text-[#A79798] hover:text-[#E01B22] border border-[#2A1A1D] hover:border-[#E01B22]/50 rounded-[1px] bg-[#0A0607]/80 transition-colors z-30"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Expanded Image */}
            <div className="w-full md:w-3/5 border border-[#2A1A1D] overflow-hidden aspect-[4/3] bg-black">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title}
                decoding="async"
                className="w-full h-full object-cover filter contrast-105" 
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-2/5 space-y-4 text-left font-mono">
              <div>
                <span className="text-[9px] text-[#E01B22] font-bold tracking-widest uppercase block">
                  {lightboxImage.category} // TELEMETRY NODE
                </span>
                <h2 className="text-lg font-display font-black text-[#F7F2F2] uppercase mt-1">
                  {lightboxImage.title}
                </h2>
              </div>

              <div className="p-3 bg-[#0A0607] border border-[#2A1A1D] rounded-[1px]">
                <p className="text-xs text-[#A79798] leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-[#2A1A1D] pt-3 text-[11px] text-[#A79798]">
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Location:</span>
                  <span className="text-[#F7F2F2] font-bold">{lightboxImage.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Date:</span>
                  <span className="text-[#F7F2F2] font-bold">{lightboxImage.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5A5C] uppercase">Telemetry:</span>
                  <span className="text-[#E01B22] text-[9px]">{lightboxImage.meta}</span>
                </div>
              </div>

              <button
                onClick={() => setLightboxImage(null)}
                className="w-full py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold text-[11px] uppercase rounded-[2px] transition-all"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
