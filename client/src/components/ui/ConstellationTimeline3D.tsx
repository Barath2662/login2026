import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { WORLD_LORE, WorldLore } from '../../constants/worlds';
import { useUserStore } from '../../store/userStore';
import { LevelPortalNode } from './LevelPortalNode';
import { Loader2, AlertCircle } from 'lucide-react';
import { RIFT_COORDS_DESKTOP } from '../../constants/riftCoords';

gsap.registerPlugin(ScrollTrigger);

// Map the percentage coordinates (0-100) to 3D World space.
// We'll spread X over 100 units, and center Y around 0 (range -10 to 10).
const getWorldPosition = (coord: { x: number, y: number }) => {
  const x = coord.x;
  const y = ((100 - coord.y) / 100) * 20 - 10;
  return new THREE.Vector3(x, y, 0);
};

const WORLD_POSITIONS = RIFT_COORDS_DESKTOP.map(getWorldPosition);

// Use CatmullRomCurve3 for the glowing energy trail
const curve = new THREE.CatmullRomCurve3(WORLD_POSITIONS.slice(0, 10)); // Exclude finale initially
const finaleCurve = new THREE.CatmullRomCurve3([WORLD_POSITIONS[9], WORLD_POSITIONS[10]]);

const AnimatedRiftLine: React.FC<{ isFinaleEligible: boolean }> = ({ isFinaleEligible }) => {
  const lineRef = useRef<any>(null);
  const finaleLineRef = useRef<any>(null);
  const points = curve.getPoints(200);
  const finalePoints = finaleCurve.getPoints(50);
  
  useFrame((_, delta) => {
    // The Line material from drei is exposed as meshLineMaterial
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * 0.5;
    }
    if (finaleLineRef.current?.material && isFinaleEligible) {
      finaleLineRef.current.material.dashOffset -= delta * 0.5;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color="var(--color-red)"
        lineWidth={3}
        dashed
        dashScale={20}
        dashSize={1}
        dashOffset={0}
        transparent
        opacity={0.8}
      />
      
      <Line
        ref={finaleLineRef}
        points={finalePoints}
        color={isFinaleEligible ? "#ef4444" : "#555555"}
        lineWidth={isFinaleEligible ? 3 : 1}
        dashed
        dashScale={isFinaleEligible ? 20 : 50}
        dashSize={1}
        dashOffset={0}
        transparent
        opacity={isFinaleEligible ? 0.8 : 0.2}
      />
    </group>
  );
};

const Scene: React.FC<{ scrollRef: React.MutableRefObject<number>, isFinaleEligible: boolean }> = ({ scrollRef, isFinaleEligible }) => {
    useFrame((state) => {
    const p = scrollRef.current;
    
    // We have 100 units of X. We want to pan so the camera follows the path.
    // Let's get the point along the curve based on scroll progress.
    const point = curve.getPointAt(Math.max(0, Math.min(1, p * 1.1))); // Slightly speed up progress so we reach the end
    
    // Smooth camera follow
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, point.x, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, point.y * 0.5, 0.1);
    state.camera.position.z = 15; // Fixed Z distance for the 2D scrolling effect
    
    state.camera.lookAt(state.camera.position.x, state.camera.position.y, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 20]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <AnimatedRiftLine isFinaleEligible={isFinaleEligible} />
    </>
  );
};

export const ConstellationTimeline3D = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return Array.isArray(res.data) ? res.data : (res.data.events || []);
    },
    retry: 2
  });

  useEffect(() => {
    if (!containerRef.current || isLoading || isError) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        }
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isLoading, isError]);

  const handleNodeClick = (worldId: string) => {
    navigate(`?world=${worldId}`);
  };

  const handleFocus = (index: number) => {
    if (!containerRef.current) return;
    const progress = index / 10;
    const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
    const scrollTarget = containerRef.current.offsetTop + (containerHeight * progress);
    
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
        <p className="text-color-red font-mono tracking-widest animate-pulse">SYNCHRONIZING RIFT...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-color-danger" />
        <p className="text-color-danger font-mono tracking-widest">ERROR: RIFT CONNECTION LOST</p>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 bg-transparent border border-color-red text-color-red font-mono hover:bg-color-red hover:text-black transition-colors"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  // Fetch user registrations if authenticated
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ['my-registrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get('/registrations/my');
      return Array.isArray(res.data) ? res.data : (res.data.data || []);
    },
    enabled: !!user,
  });

  const isHubUnlocked = user?.hasPaid ?? true; 
  const registeredNodes = myRegistrations.map((reg: any) => reg.event_id?.toString() || reg.event_id);
  const isFinaleEligible = registeredNodes.length >= 3; // Basic logic: 3 events unlocks finale (adjust as per actual rules)

  const getNodeState = (world: any) => {
    const now = new Date();
    const opensAt = new Date(world.registrationOpensAt);
    const closesAt = new Date(world.registrationClosesAt);
    
    let status: 'UPCOMING' | 'ACTIVE' | 'CLOSED' = 'UPCOMING';
    if (now >= opensAt && now <= closesAt) status = 'ACTIVE';
    else if (now > closesAt) status = 'CLOSED';

    const isTimeLocked = status !== 'ACTIVE';
    const isFinale = world.worldNumber === 11;
    
    if (isFinale) {
      return { isLocked: !isFinaleEligible || isTimeLocked, isFinale, isRegistered: false, status };
    }

    const isRegistered = registeredNodes.includes(world.id);
    return {
      isLocked: (!isHubUnlocked && !isRegistered) || isTimeLocked,
      isFinale,
      isRegistered,
      status
    };
  };

  const unlockedCount = data.filter((w: any) => !getNodeState(w).isLocked).length;

  return (
    <div className="relative w-full h-[600vh] bg-black" ref={containerRef}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        <div className="absolute top-24 left-8 z-30 bg-black/60 backdrop-blur-md border border-color-red/30 p-3 rounded flex flex-col items-start w-fit pointer-events-none">
          <span className="text-xs text-text-muted font-mono mb-1">RIFT STATUS</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-color-red leading-none">{unlockedCount}</span>
            <span className="text-sm text-text-secondary leading-tight mb-0.5">/ {data.length} Worlds Unlocked</span>
          </div>
        </div>

        <Canvas 
          camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        >
          <Scene scrollRef={scrollRef} isFinaleEligible={isFinaleEligible} />
          
          {data.map((world: any, index: number) => {
            const lore: WorldLore = WORLD_LORE[world.worldNumber] || {
              name: world.title,
              theme: 'Unknown',
              villainName: world.invaderName,
              villainQuote: '...'
            };

            return (
              <LevelPortalNode
                key={world.id}
                world={world}
                lore={lore}
                position={WORLD_POSITIONS[index] || new THREE.Vector3(0,0,0)}
                state={getNodeState(world)}
                index={index}
                onFocus={handleFocus}
                onClick={handleNodeClick}
              />
            );
          })}
        </Canvas>
      </div>
    </div>
  );
};

export default ConstellationTimeline3D;
