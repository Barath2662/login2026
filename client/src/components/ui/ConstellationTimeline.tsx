import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { WORLD_LORE, WorldLore } from '../../constants/worlds';
import { useUserStore } from '../../store/userStore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Loader2, AlertCircle, Lock, Unlock } from 'lucide-react';
import { ConstellationBackground } from '../3d/ConstellationBackground';
import { RIFT_COORDS_DESKTOP, RIFT_COORDS_MOBILE } from '../../constants/riftCoords';
import { getPlanetConfig } from '../../config/planetConfigs';

gsap.registerPlugin(ScrollTrigger);

export const ConstellationTimeline = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const coords = isMobile ? RIFT_COORDS_MOBILE : RIFT_COORDS_DESKTOP;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null); 

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { data: WORLDS, isLoading, isError, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data.events;
    },
    retry: 2
  });

  const isHubUnlocked = user?.hasPaid ?? true; 
  const registeredNodes = ['world-01', 'world-02']; 
  const isFinaleEligible = false; 

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

  const path1Data = useMemo(() => {
    if (coords.length === 0 || dimensions.width === 0) return '';
    const getX = (x: number) => (x / 100) * dimensions.width;
    const getY = (y: number) => (y / 100) * dimensions.height;
    
    const trimSegment = (x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= r1 + r2) return null;
      const ux = dx / dist;
      const uy = dy / dist;
      return {
        startX: x1 + ux * r1,
        startY: y1 + uy * r1,
        endX: x2 - ux * r2,
        endY: y2 - uy * r2,
      };
    };

    let d = '';
    const R = isMobile ? 32 : 40; 
    for (let i = 0; i < 9; i++) {
      const x1 = getX(coords[i].x);
      const y1 = getY(coords[i].y);
      const x2 = getX(coords[i+1].x);
      const y2 = getY(coords[i+1].y);
      
      const trimmed = trimSegment(x1, y1, x2, y2, R, R);
      if (trimmed) {
        d += `M ${trimmed.startX} ${trimmed.startY} L ${trimmed.endX} ${trimmed.endY} `;
      }
    }
    return d.trim();
  }, [coords, dimensions, isMobile]);

  const path2Data = useMemo(() => {
    if (coords.length < 11 || dimensions.width === 0) return '';
    const getX = (x: number) => (x / 100) * dimensions.width;
    const getY = (y: number) => (y / 100) * dimensions.height;
    
    const trimSegment = (x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= r1 + r2) return null;
      const ux = dx / dist;
      const uy = dy / dist;
      return {
        startX: x1 + ux * r1,
        startY: y1 + uy * r1,
        endX: x2 - ux * r2,
        endY: y2 - uy * r2,
      };
    };

    const R1 = isMobile ? 32 : 40;
    const R2 = isMobile ? 64 : 80; 
    
    const x1 = getX(coords[9].x);
    const y1 = getY(coords[9].y);
    const x2 = getX(coords[10].x);
    const y2 = getY(coords[10].y);
    
    const trimmed = trimSegment(x1, y1, x2, y2, R1, R2);
    if (trimmed) {
      return `M ${trimmed.startX} ${trimmed.startY} L ${trimmed.endX} ${trimmed.endY}`;
    }
    return '';
  }, [coords, dimensions, isMobile]);

  useEffect(() => {
    if (!containerRef.current || !path1Ref.current || !path2Ref.current || !path1Data || isLoading || isError) return;
    
    // Constant particle flow animation using dash offset
    gsap.to(path1Ref.current, {
      strokeDashoffset: -100,
      duration: 3,
      repeat: -1,
      ease: "none"
    });
    
    gsap.set(path2Ref.current, {
      opacity: isFinaleEligible ? 1 : 0.2, 
    });
    
    if (isFinaleEligible) {
      gsap.to(path2Ref.current, {
        strokeDashoffset: -100,
        duration: 3,
        repeat: -1,
        ease: "none"
      });
    }

  }, [isFinaleEligible, path1Data, path2Data, isLoading, isError]); 

  const handleNodeClick = (world: any) => {
    const state = getNodeState(world);
    if (!state.isLocked || state.isFinale) {
      navigate(`?world=${world.id}`);
    } else {
      setToastMessage('ACCESS DENIED: WORLD LOCKED');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, world: any) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(world);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
        <p className="text-color-red font-mono tracking-widest animate-pulse">SYNCHRONIZING RIFT...</p>
      </div>
    );
  }

  if (isError || !WORLDS) {
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

  const unlockedCount = WORLDS.filter((w: any) => !getNodeState(w).isLocked).length;

  return (
    <div className="relative w-full min-h-[150vh] md:min-h-[200vh]" ref={containerRef}>
      <ConstellationBackground />

      <div className="sticky top-24 left-8 z-30 bg-black/60 backdrop-blur-md border border-color-red/30 p-3 rounded flex flex-col items-start w-fit">
        <span className="text-xs text-text-muted font-mono mb-1">RIFT STATUS</span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-color-red leading-none">{unlockedCount}</span>
          <span className="text-sm text-text-secondary leading-tight mb-0.5">/ {WORLDS.length} Worlds Unlocked</span>
        </div>
      </div>

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 1 }}
      >
        <path 
          ref={path1Ref}
          d={path1Data}
          stroke="rgba(0, 240, 255, 0.8)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 15"
          className="drop-shadow-[0_0_12px_rgba(0,240,255,1)]"
        />
        <path 
          ref={path2Ref}
          d={path2Data}
          stroke={isFinaleEligible ? "rgba(239, 68, 68, 0.8)" : "rgba(100, 100, 100, 0.5)"}
          strokeWidth="4"
          fill="none"
          strokeDasharray="10 15"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isFinaleEligible ? "drop-shadow-[0_0_15px_rgba(239,68,68,1)]" : ""}
        />
      </svg>

      <div className="absolute inset-0 z-10">
        {toastMessage && (
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-color-danger/90 text-white font-mono px-4 py-2 rounded shadow-2xl pointer-events-none" role="alert" aria-live="assertive">
            {toastMessage}
          </div>
        )}
        
        {WORLDS.map((world: any, index: number) => {
          const coord = coords[index] || { x: 50, y: 50 };
          const state = getNodeState(world);
          const lore = WORLD_LORE[world.worldNumber] || { name: world.title, theme: 'Unknown' };
          const config = getPlanetConfig(world.category);
          
          let nodeClasses = "absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group outline-none focus-visible:ring-4 focus-visible:ring-white rounded-full ";
          let visualElement = null;

          if (state.isFinale) {
            nodeClasses += state.isLocked 
              ? "opacity-50 grayscale cursor-not-allowed " 
              : "cursor-pointer hover:scale-105 ";
              
            visualElement = (
              <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center bg-transparent border-4 ${state.isLocked ? 'border-[#555555]' : 'border-color-danger shadow-[0_0_50px_rgba(239,68,68,0.8)]'}`}>
                {!state.isLocked && (
                  <div className="absolute inset-[-15px] rounded-full border-4 border-dashed border-color-danger/80 animate-[spin_10s_linear_infinite]" />
                )}
                <div className={`absolute inset-2 rounded-full ${state.isLocked ? 'bg-[#555555]' : 'bg-color-danger'} blur-lg opacity-20`} />
                <span className="relative z-10 font-mono text-4xl md:text-5xl font-bold text-white group-hover:text-color-danger transition-colors">{world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}</span>
                <ShieldAlert className={`absolute -top-10 ${state.isLocked ? 'text-text-muted opacity-50' : 'text-color-danger animate-pulse'}`} size={40} />
              </div>
            );
          } else if (state.isRegistered) {
            nodeClasses += "cursor-pointer hover:scale-110 ";
            visualElement = (
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-[4px]" style={{ borderColor: '#b400ff', boxShadow: '0 0 20px rgba(180,0,255,0.6)' }}>
                <div className="absolute inset-2 rounded-full blur-md opacity-30" style={{ backgroundColor: '#b400ff' }} />
                <span className="relative z-10 font-mono text-xl font-bold text-white group-hover:text-[#b400ff]">{world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}</span>
              </div>
            );
          } else if (!state.isLocked) {
            nodeClasses += "cursor-pointer hover:scale-110 ";
            visualElement = (
              <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-[4px]" style={{ borderColor: config.primaryColor, boxShadow: `0 0 20px ${config.primaryColor}88` }}>
                <div className="absolute inset-2 rounded-full blur-md opacity-20" style={{ backgroundColor: config.primaryColor }} />
                <span className="relative z-10 font-mono text-lg md:text-xl font-bold text-white transition-colors" style={{ color: "white" }}>{world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}</span>
              </div>
            );
          } else {
            nodeClasses += "opacity-40 grayscale cursor-not-allowed ";
            visualElement = (
              <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-[4px] border-[#555555]">
                <div className="absolute inset-2 rounded-full blur-md opacity-10 bg-[#555555]" />
                <span className="relative z-10 font-mono text-lg font-bold text-text-muted">{world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}</span>
              </div>
            );
          }

          const pos = coord.labelPos || 'bottom';
          let labelContainerClasses = 'absolute w-max max-w-[180px] md:max-w-[250px] pointer-events-none flex flex-col gap-1 ';
          
          if (state.isFinale) {
            labelContainerClasses += 'top-full mt-6 left-1/2 -translate-x-1/2 items-center text-center';
          } else if (pos === 'top') {
            labelContainerClasses += 'bottom-full mb-4 left-1/2 -translate-x-1/2 items-center text-center';
          } else if (pos === 'bottom') {
            labelContainerClasses += 'top-full mt-4 left-1/2 -translate-x-1/2 items-center text-center';
          } else if (pos === 'left') {
            labelContainerClasses += 'right-full mr-6 top-1/2 -translate-y-1/2 items-end text-right';
          } else if (pos === 'right') {
            labelContainerClasses += 'left-full ml-6 top-1/2 -translate-y-1/2 items-start text-left';
          }

          const renderHUDOverlay = () => {
            switch (state.status) {
              case 'UPCOMING':
                return (
                  <div className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-500/40 flex items-center gap-1 uppercase tracking-wider font-mono w-fit">
                    <Lock size={10} /> OPENS SOON
                  </div>
                );
              case 'ACTIVE':
                return (
                  <div className="bg-color-red/20 text-color-red text-[10px] px-2 py-0.5 rounded border border-color-red/40 flex items-center gap-1 uppercase tracking-wider font-mono animate-pulse w-fit">
                    <Unlock size={10} /> INGRESS OPEN
                  </div>
                );
              case 'CLOSED':
                return (
                  <div className="bg-color-danger/20 text-color-danger text-[10px] px-2 py-0.5 rounded border border-color-danger/40 flex items-center gap-1 uppercase tracking-wider font-mono w-fit">
                    <Lock size={10} /> LOCKED
                  </div>
                );
            }
          };

          return (
            <button
              key={world.id}
              className={nodeClasses}
              style={{
                left: `${coord.x}%`,
                top: `${coord.y}%`,
              }}
              onClick={() => handleNodeClick(world)}
              onKeyDown={(e) => handleKeyDown(e, world)}
              aria-label={`${lore.name}, Theme: ${lore.theme}. Status: ${state.isLocked ? 'Locked' : 'Unlocked'}`}
              tabIndex={index + 1}
            >
              {visualElement}
              
              <div className={labelContainerClasses}>
                {renderHUDOverlay()}
                <p 
                  className={`text-sm md:text-base font-bold uppercase drop-shadow-lg`}
                  style={{ color: state.isFinale ? '#ef4444' : state.isRegistered ? '#b400ff' : state.isLocked ? '#888888' : config.primaryColor }}
                >
                  {lore.name}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 whitespace-normal drop-shadow-md">{lore.theme}</p>
              </div>
            </button>
          );
        })}
      </div>

      <ul className="sr-only">
        {WORLDS.map((world: any, index: number) => {
          const state = getNodeState(world);
          const lore = WORLD_LORE[world.worldNumber] || { name: world.title };
          return (
            <li key={`sr-${world.id}`}>
              <a 
                href={`?world=${world.id}`} 
                aria-disabled={state.isLocked}
                tabIndex={state.isLocked ? -1 : index + 1}
              >
                World {world.worldNumber}: {lore.name}. Status: {state.isFinale ? 'Finale' : state.isLocked ? 'Locked' : state.isRegistered ? 'Registered' : 'Unlocked'}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConstellationTimeline;
