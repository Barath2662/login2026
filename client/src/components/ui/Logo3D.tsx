import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Logo3D = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for tracking interactive mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth interactive tilt
  const springConfig = { damping: 22, stiffness: 120, mass: 0.6 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // Transform coordinates into interactive tilt offsets
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [14, -14]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center [perspective:1200px] select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Ambient Atmospheric Red Aura Behind Logo */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-[-10%] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(224, 27, 34, 0.4) 0%, rgba(224, 27, 34, 0.12) 50%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Auto-floating and Precession Outer Container */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotateX: [-5, 5, -5],
          rotateY: [-7, 7, -7],
          rotateZ: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Interactive Mouse Tilt Inner Layer */}
        <motion.div
          style={{
            rotateX: mouseRotateX,
            rotateY: mouseRotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Logo from media folder (media/login.png) with circular blend */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 58%, rgba(0,0,0,0.85) 75%, transparent 98%)',
              maskImage: 'radial-gradient(circle at 50% 50%, black 58%, rgba(0,0,0,0.85) 75%, transparent 98%)',
            }}
          >
            <img
              src="/assets/login.png"
              alt="LOGIN 2026 Logo"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_35px_rgba(224,27,34,0.65)]"
              style={{
                filter: 'contrast(1.1) brightness(1.05)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
