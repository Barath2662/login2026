import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Logo3D = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for tracking mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth return to center
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // Transform coordinates into rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  // Lighting overlay effect based on mouse position
  const glareX = useTransform(mouseX, [-0.5, 0.5], [100, 0]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [100, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    // Reset to center smoothly
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center [perspective:1000px] ${className}`}
      style={{ touchAction: 'none' }} // Prevent scrolling when touching the logo on mobile
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, rotateX: 5, rotateY: 5 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* SVG Wrapper embedding the JPG for crisp scaling and filtering */}
        <svg 
          viewBox="0 0 800 600" 
          className="w-[80%] md:w-full h-auto drop-shadow-[0_0_30px_rgba(217,4,41,0.5)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <image 
            href="/assets/login_logo.jpg" 
            x="0" 
            y="0" 
            width="800" 
            height="600" 
          />
        </svg>

        {/* Dynamic glare/highlight effect */}
        <motion.div
          className="absolute inset-0 z-10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.15), transparent 60%)`
            ),
          }}
        />
      </motion.div>
    </div>
  );
};
