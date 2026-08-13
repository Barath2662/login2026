import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NarrativeOverlay } from './ui/NarrativeOverlay';
import { motion } from 'framer-motion';

const ParticleExplosion = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  
  const particleCount = 25000;
  
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color('#E5E5E5');

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = Math.cbrt(Math.random()) * 4;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const speed = Math.random() * 20 + 10;
      velocities[i * 3] = (x / r) * speed;
      velocities[i * 3 + 1] = (y / r) * speed;
      velocities[i * 3 + 2] = (z / r) * speed;

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    return { positions, velocities, colors };
  }, [particleCount]);

  const targetColor = useMemo(() => new THREE.Color('#D90429'), []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    if (time > 1.5) {
      const geometry = pointsRef.current.geometry;
      const positionsArray = geometry.attributes.position.array as Float32Array;
      const colorsArray = geometry.attributes.color.array as Float32Array;
      
      const explosionProgress = Math.min((time - 1.5) * 0.4, 1);

      for (let i = 0; i < particleCount; i++) {
        const drag = 1 - explosionProgress * 0.95;
        positionsArray[i * 3] += velocities[i * 3] * delta * drag;
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * drag;
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * drag;

        if (Math.random() > 0.9) {
           const currentColor = new THREE.Color(
             colors[i * 3], 
             colors[i * 3 + 1], 
             colors[i * 3 + 2]
           );
           currentColor.lerp(targetColor, delta * 5);
           
           colorsArray[i * 3] = currentColor.r;
           colorsArray[i * 3 + 1] = currentColor.g;
           colorsArray[i * 3 + 2] = currentColor.b;
           
           colors[i * 3] = currentColor.r;
           colors[i * 3 + 1] = currentColor.g;
           colors[i * 3 + 2] = currentColor.b;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      
      if (time > 1.5 && time < 2.5) {
        const intensity = (2.5 - time) * 0.5;
        camera.position.x = (Math.random() - 0.5) * intensity;
        camera.position.y = (Math.random() - 0.5) * intensity;
      } else {
        camera.position.lerp(new THREE.Vector3(0, 0, 15), 0.1);
      }
    } else {
      const scale = 1 + Math.sin(time * 10) * 0.05;
      pointsRef.current.scale.set(scale, scale, scale);
    }
    
    pointsRef.current.rotation.y += delta * 0.5;
    pointsRef.current.rotation.x += delta * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 1000); 
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-bg-primary overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none z-10" />

      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: false }}>
        <color attach="background" args={['#050505']} />
        <ParticleExplosion />
      </Canvas>
      
      {/* Glitch Overlay effects */}
      <motion.div 
        animate={{ 
          opacity: [0, 0.1, 0, 0.2, 0],
          scale: [1, 1.05, 1, 1.02, 1]
        }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
        className="absolute inset-0 bg-color-red/20 mix-blend-overlay pointer-events-none z-20" 
      />

      <NarrativeOverlay />
      
      {/* Skip Button */}
      <button 
        onClick={() => {
          setIsFadingOut(true);
          setTimeout(onComplete, 500);
        }}
        className="absolute bottom-10 right-10 z-50 text-text-muted font-mono tracking-widest text-sm hover:text-white hover:drop-shadow-[0_0_10px_rgba(217,4,41,0.8)] transition-all cursor-pointer overflow-hidden group"
      >
        <span className="relative z-10">[ SKIP SEQUENCE ]</span>
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-color-red transition-all duration-300 group-hover:w-full" />
      </button>
    </motion.div>
  );
};
