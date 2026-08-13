import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { getPlanetConfig } from '../../config/planetConfigs';
import { ShieldAlert, Lock, Unlock } from 'lucide-react';
import { WorldLore } from '../../constants/worlds';

interface LevelPortalNodeProps {
  world: any; // Dynamic EventWorld from API
  lore: WorldLore; // Static lore from constants
  position: THREE.Vector3;
  state: {
    isLocked: boolean;
    isFinale: boolean;
    isRegistered: boolean;
    status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
  };
  index: number;
  onFocus: (index: number) => void;
  onClick: (worldId: string) => void;
}

export const LevelPortalNode: React.FC<LevelPortalNodeProps> = ({ 
  world, 
  lore,
  position, 
  state, 
  index, 
  onFocus, 
  onClick 
}) => {
  const meshGroup = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const config = getPlanetConfig(world.category);
  const isInteractive = !state.isLocked || state.isFinale;

  let baseColor = new THREE.Color('#D4D4D8'); // Silver base for unlocked
  
  if (state.isFinale) {
    baseColor.set('#FF0000'); // Deep Red
  } else if (state.isRegistered) {
    baseColor.set('#FF2A2A'); // Accent Red
  } else if (state.isLocked) {
    baseColor.set('#222222'); // Graphite
  }

  useFrame((stateObj, delta) => {
    // Rotation
    if (ringRef.current && state.isFinale) {
      ringRef.current.rotation.z -= delta * 0.5;
      ringRef.current.rotation.y -= delta * 0.5;
    } else if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.1;
    }
    
    if (glowRef.current) glowRef.current.rotation.z += delta * 0.2;
    
    // Hover Scale (using maath for smooth spring physics)
    const targetScale = hovered && isInteractive ? 1.15 : 1;
    if (meshGroup.current) {
      easing.damp3(meshGroup.current.scale, [targetScale, targetScale, targetScale], 0.2, delta);
    }
  });

  const handleInteract = () => {
    if (isInteractive) {
      onClick(world.id);
    } else {
      setToastMessage('ACCESS DENIED: WORLD LOCKED');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const renderHUDOverlay = () => {
    switch (state.status) {
      case 'UPCOMING':
        return (
          <div className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-500/40 flex items-center gap-1 uppercase tracking-wider font-mono">
            <Lock size={10} /> OPENS SOON
          </div>
        );
      case 'ACTIVE':
        return (
          <div className="bg-color-red/20 text-color-red text-[10px] px-2 py-0.5 rounded border border-color-red/40 flex items-center gap-1 uppercase tracking-wider font-mono animate-pulse">
            <Unlock size={10} /> INGRESS OPEN
          </div>
        );
      case 'CLOSED':
        return (
          <div className="bg-color-danger/20 text-color-danger text-[10px] px-2 py-0.5 rounded border border-color-danger/40 flex items-center gap-1 uppercase tracking-wider font-mono">
            <Lock size={10} /> LOCKED
          </div>
        );
    }
  };

  const getGeometry = (type: string, isFinale: boolean) => {
    const radius = isFinale ? 1.5 : 1;
    switch (type) {
      case 'icosahedron': return <icosahedronGeometry args={[radius, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[radius, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[radius, 0]} />;
      default: return <sphereGeometry args={[radius, 32, 32]} />; // sphere and displaced default to sphere here for simplicity
    }
  };

  return (
    <group position={position}>
      <group ref={meshGroup}>
        {/* Layer 1: Core Node Base */}
        <mesh 
          ref={ringRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            handleInteract();
          }}
        >
          {getGeometry(config.geometryType, state.isFinale)}
          <meshStandardMaterial 
            color={baseColor}
            metalness={state.isLocked ? 0 : config.coreMetalness}
            roughness={state.isLocked ? 1 : config.coreRoughness}
            wireframe={config.geometryType === 'dodecahedron' || config.geometryType === 'icosahedron'}
            emissive={baseColor}
            emissiveIntensity={state.isLocked ? 0 : 0.5}
          />
        </mesh>

        {/* Ring Add-on */}
        {(config.ringStyle !== 'none' || state.isFinale) && !state.isLocked && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[state.isFinale ? 2.5 : 1.6, 0.05, 16, 64]} />
            <meshStandardMaterial 
              color={config.ringStyle === 'solid-red' || state.isFinale ? '#FF2A2A' : '#D4D4D8'}
              metalness={0.8}
              roughness={0.2}
              emissive={config.ringStyle === 'solid-red' || state.isFinale ? '#FF2A2A' : '#D4D4D8'}
              emissiveIntensity={1}
            />
          </mesh>
        )}
        {state.isFinale && (
          <mesh rotation={[0, Math.PI / 2, 0]}>
             <torusGeometry args={[2.5, 0.05, 16, 64]} />
             <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={2} />
          </mesh>
        )}

        {/* Layer 2: Inner Portal Glow */}
        {!state.isLocked && (
          <mesh ref={glowRef}>
            <sphereGeometry args={[state.isFinale ? 1.8 : 1.2, 32, 32]} />
            <meshBasicMaterial 
              color={baseColor}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* HTML Label & Accessibility Button */}
      <Html 
        center 
        transform={false}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[100, 0]}
      >
        <div className={`relative flex items-center justify-center ${state.isFinale ? 'w-40 h-40' : 'w-24 h-24'}`}>
          {/* Accessible focusable button, triggers click on Enter */}
          <button
            className="absolute inset-0 w-full h-full rounded-full cursor-pointer pointer-events-auto focus-visible:ring-4 focus-visible:ring-white outline-none"
            onFocus={() => {
              setHovered(true);
              onFocus(index);
            }}
            onBlur={() => setHovered(false)}
            onClick={handleInteract}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInteract();
              }
            }}
            tabIndex={index + 1}
            aria-label={`${lore.name}, Theme: ${lore.theme}. Status: ${state.isLocked ? 'Locked' : 'Unlocked'}`}
          />
          
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center drop-shadow-md">
            {state.isFinale && state.isLocked ? (
              <ShieldAlert className="text-white opacity-50" size={32} />
            ) : (
              <span className={`font-mono font-bold text-white ${state.isFinale ? 'text-4xl' : 'text-xl'}`}>
                {world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}
              </span>
            )}
          </div>

          {/* Text Label - Fixed bottom position since the zigzag alternates in 3D */}
          <div 
            className="absolute pointer-events-none w-max max-w-[250px] flex flex-col gap-1 items-center text-center mt-6"
            style={{ top: '100%' }}
          >
            {renderHUDOverlay()}
            <p className={`text-sm md:text-base font-bold uppercase ${state.isFinale ? 'text-color-danger' : state.isRegistered ? 'text-color-silver' : state.isLocked ? 'text-text-muted' : 'text-color-red'} drop-shadow-md`}>
              {lore.name}
            </p>
            <p className="text-xs text-white drop-shadow-md whitespace-normal">{lore.theme}</p>
          </div>
          
          {/* Toast Notification for Locked interaction */}
          {toastMessage && (
            <div 
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-color-danger/90 text-white text-xs font-bold font-mono px-3 py-1 rounded shadow-lg whitespace-nowrap"
              role="alert"
              aria-live="assertive"
            >
              {toastMessage}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
