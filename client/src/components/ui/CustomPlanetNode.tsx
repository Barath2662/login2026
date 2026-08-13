import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Icosahedron, Line, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { getPlanetConfig } from '../../config/planetConfigs';
import { ShieldAlert, Lock, Unlock } from 'lucide-react';
import { WorldLore } from '../../constants/worlds';

interface CustomPlanetNodeProps {
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

export const CustomPlanetNode: React.FC<CustomPlanetNodeProps> = ({ 
  world, 
  lore,
  position, 
  state, 
  index, 
  onFocus, 
  onClick 
}) => {
  const meshGroup = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  
  const config = getPlanetConfig(world.category);
  const isInteractive = !state.isLocked || state.isFinale;

  // Use base color but adjust for locked/registered state
  let baseColor = new THREE.Color(config.primaryColor);
  let emissiveColor = new THREE.Color(config.primaryColor);
  
  if (state.isFinale) {
    baseColor.set('#ef4444');
    emissiveColor.set('#ef4444');
  } else if (state.isRegistered) {
    baseColor.lerp(new THREE.Color('#b400ff'), 0.5);
    emissiveColor.lerp(new THREE.Color('#b400ff'), 0.5);
  } else if (state.isLocked) {
    baseColor.set('#555555');
    emissiveColor.set('#555555');
  }

  useFrame((stateObj, delta) => {
    // Rotation
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.2;
    if (shieldRef.current) shieldRef.current.rotation.x -= delta * 0.3;
    if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.4;
    
    // Hover Scale (using maath for smooth spring physics)
    const targetScale = hovered && isInteractive ? 1.25 : 1;
    if (meshGroup.current) {
      easing.damp3(meshGroup.current.scale, [targetScale, targetScale, targetScale], 0.2, delta);
    }
  });

  const labelAlign = position.x > 0 ? 'left' : 'right';

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

  return (
    <group position={position}>
      <group ref={meshGroup}>
        {/* Layer 1: Core Sphere */}
        <mesh 
          ref={coreRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (isInteractive) onClick(world.id);
          }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={state.isLocked && !state.isFinale ? 0.2 : 0.8}
            roughness={config.coreRoughness}
            metalness={config.coreMetalness}
            toneMapped={false}
          />
        </mesh>

        {/* Layer 2: Atmosphere Glow */}
        {!state.isLocked && (
          <mesh scale={1.15}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial 
              color={baseColor}
              side={THREE.BackSide}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Layer 3: Optional Shield */}
        {config.wireframeShield && !state.isLocked && (
          <mesh ref={shieldRef} scale={1.3}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color={config.secondaryColor}
              wireframe 
              transparent 
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Layer 4: Optional Rings */}
        {config.hasRings && !state.isLocked && (
          <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[1.5, 1.8, 64]} />
            <meshBasicMaterial 
              color={config.secondaryColor}
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Layer 5: Optional Polar Beams */}
        {config.hasPolarBeams && !state.isLocked && (
          <group>
            <Line points={[[0, 1, 0], [0, 4, 0]]} color={config.secondaryColor} lineWidth={2} transparent opacity={0.5} />
            <Line points={[[0, -1, 0], [0, -4, 0]]} color={config.secondaryColor} lineWidth={2} transparent opacity={0.5} />
          </group>
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
            onClick={() => isInteractive && onClick(world.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isInteractive) {
                onClick(world.id);
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

          {/* Text Label */}
          <div 
            className="absolute pointer-events-none w-max max-w-[250px] flex flex-col gap-1"
            style={{ 
              top: '50%',
              [labelAlign === 'left' ? 'left' : 'right']: '100%',
              transform: 'translateY(-50%)',
              marginLeft: labelAlign === 'left' ? '1.5rem' : '0',
              marginRight: labelAlign === 'right' ? '1.5rem' : '0',
              alignItems: labelAlign === 'left' ? 'flex-start' : 'flex-end',
              textAlign: labelAlign
            }}
          >
            {renderHUDOverlay()}
            <p className={`text-sm md:text-base font-bold uppercase ${state.isFinale ? 'text-color-danger' : state.isRegistered ? 'text-color-silver' : state.isLocked ? 'text-text-muted' : 'text-color-red'} drop-shadow-md`}>
              {lore.name}
            </p>
            <p className="text-xs text-white drop-shadow-md whitespace-normal">{lore.theme}</p>
          </div>
        </div>
      </Html>
    </group>
  );
};
