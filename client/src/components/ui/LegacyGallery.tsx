import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const LEGACY_YEARS = [
  { year: '2025', theme: 'The Awakening', description: 'The first signs of the AI anomaly.' },
  { year: '2024', theme: 'Neon Genesis', description: 'Establishment of the Grid.' },
  { year: '2023', theme: 'Cyber Recon', description: 'First deep dive into the subnet.' },
  { year: '2022', theme: 'Digital Frontier', description: 'The inception of LOGIN.' },
  { year: '2021', theme: 'Genesis Block', description: 'The first encrypted transmission.' }
];

export const LegacyGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start at the middle

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % LEGACY_YEARS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + LEGACY_YEARS.length) % LEGACY_YEARS.length);
  };

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1200px] overflow-hidden py-10">
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-10 z-50 p-4 text-[#A8A9AD] hover:text-[#D90429] bg-[#050505]/50 backdrop-blur-sm rounded-full border border-[#A8A9AD]/30 hover:border-[#D90429] hover:shadow-[0_0_15px_rgba(217,4,41,0.5)] transition-all active:scale-90"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-10 z-50 p-4 text-[#A8A9AD] hover:text-[#D90429] bg-[#050505]/50 backdrop-blur-sm rounded-full border border-[#A8A9AD]/30 hover:border-[#D90429] hover:shadow-[0_0_15px_rgba(217,4,41,0.5)] transition-all active:scale-90"
      >
        <ChevronRight size={32} />
      </button>

      {/* 3D Coverflow Container */}
      <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center transform-style-3d">
        <AnimatePresence initial={false} mode="popLayout">
          {LEGACY_YEARS.map((item, index) => {
            const offset = index - currentIndex;
            
            // For looping seamlessly
            const total = LEGACY_YEARS.length;
            let normalizedOffset = offset;
            if (offset > Math.floor(total / 2)) normalizedOffset -= total;
            if (offset < -Math.floor(total / 2)) normalizedOffset += total;

            const isActive = normalizedOffset === 0;
            const isVisible = Math.abs(normalizedOffset) <= 2;

            if (!isVisible) return null;

            // Calculate 3D transforms
            const rotateY = normalizedOffset * -35; 
            const x = normalizedOffset * 150;
            const scale = isActive ? 1 : 0.8;
            const zIndex = 10 - Math.abs(normalizedOffset);
            const opacity = isActive ? 1 : 1 - Math.abs(normalizedOffset) * 0.4;
            const blur = isActive ? 0 : Math.abs(normalizedOffset) * 4;

            return (
              <motion.div
                key={item.year}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  rotateY, 
                  x, 
                  scale, 
                  opacity, 
                  zIndex,
                  filter: `blur(${blur}px)`
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-[300px] md:w-[400px] h-[450px] bg-[#050505] border border-[#A8A9AD]/50 rounded-xl overflow-hidden shadow-2xl flex flex-col"
                onClick={() => {
                  if (!isActive) {
                    setCurrentIndex(index);
                  }
                }}
              >
                {/* Image Placeholder area */}
                <div className={`relative flex-grow flex items-center justify-center bg-gradient-to-br from-[#111111] to-[#050505] border-b border-[#A8A9AD]/20 transition-colors duration-500 ${isActive ? 'hover:border-[#D90429]' : 'cursor-pointer'}`}>
                  <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 mix-blend-overlay" />
                  
                  {/* Glowing text */}
                  <span className={`font-mono text-7xl font-black ${isActive ? 'text-[#E5E5E5] drop-shadow-[0_0_15px_rgba(229,229,229,0.3)]' : 'text-[#A8A9AD]/50'}`}>
                    {item.year}
                  </span>

                  {/* Active highlight */}
                  {isActive && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-[#D90429] opacity-50 shadow-[inset_0_0_30px_rgba(217,4,41,0.2)] pointer-events-none" />
                  )}
                </div>

                {/* Info Panel */}
                <div className="h-32 bg-[#111111] p-5 flex flex-col justify-center">
                  <h3 className={`text-xl font-bold uppercase ${isActive ? 'text-[#D90429]' : 'text-[#A8A9AD]'}`}>
                    {item.theme}
                  </h3>
                  <p className="text-[#A8A9AD] text-sm mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
