import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const Hero2DVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation between -10 and 10 degrees
    const rX = (mouseY / height - 0.5) * -20;
    const rY = (mouseX / width - 0.5) * 20;
    
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[400px] flex items-center justify-center perspective-[1000px] p-8"
    >
      <motion.div
        style={{
          rotateX: mouseXSpring,
          rotateY: mouseYSpring,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-sm aspect-[3/4] rounded-lg border border-[#A8A9AD]/30 bg-[#050505] shadow-[0_0_50px_rgba(217,4,41,0.2)] overflow-hidden"
      >
        {/* Abstract 2D Art inside */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#050505]" style={{ transform: "translateZ(0px)" }} />
        
        {/* Glitch texture */}
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-30 mix-blend-overlay" style={{ transform: "translateZ(10px)" }} />
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#D90429] rounded-full opacity-20 animate-ping" style={{ transform: "translateZ(30px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-2 border-[#A8A9AD] rotate-45 opacity-10" style={{ transform: "translateZ(20px)" }} />
        
        {/* Robot Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ transform: "translateZ(40px)" }}>
          <div className="w-32 h-32 bg-[#D90429] mix-blend-screen blur-[30px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <img 
            src="/robot-ai.png" 
            alt="AI Robot" 
            className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(217,4,41,0.5)] relative z-10"
            style={{ transform: "translateZ(20px)" }}
          />
        </div>
        
        {/* Central Emblema Badge */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center" style={{ transform: "translateZ(50px)" }}>
          <div className="text-[#A8A9AD] font-mono text-xs tracking-[0.3em] uppercase border border-[#A8A9AD]/50 px-3 py-1 bg-black/80 backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            ENDANGERED
          </div>
        </div>
      </motion.div>
    </div>
  );
};
