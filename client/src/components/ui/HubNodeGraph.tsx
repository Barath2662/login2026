import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { WORLD_LORE } from '../../constants/worlds';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ChevronRight, Loader2 } from 'lucide-react';

export const HubNodeGraph = () => {
  const navigate = useNavigate();
  const [hoveredWorld, setHoveredWorld] = useState<any | null>(null);

  const { data: WORLDS, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return Array.isArray(res.data) ? res.data : (res.data.events || []);
    }
  });

  const getNodePosition = (index: number) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const xBase = (col * 150) + (row % 2 === 0 ? 0 : 75);
    const yBase = (row * 100);
    if (index === 10) return { x: 150, y: -120 };
    return { x: xBase, y: yBase };
  };

  if (isLoading || !WORLDS) {
    return (
      <div className="relative w-full h-[600px] bg-bg-card border border-border-color rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-bg-card border border-border-color rounded-xl overflow-hidden flex items-center justify-center">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 42, 42, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 42, 42, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) rotateZ(-45deg) scale(2)',
          transformOrigin: 'center center'
        }}
      />

      <div 
        className="relative w-[500px] h-[500px] transition-transform duration-1000 ease-in-out"
        style={{
          transform: 'rotateX(60deg) rotateZ(-45deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {WORLDS.map((world: any, idx: number) => {
          const pos = getNodePosition(idx);
          const isFinale = world.worldNumber === 11;
          const lore = WORLD_LORE[world.worldNumber] || { name: world.title, theme: 'Unknown' };
          
          return (
            <motion.div
              key={world.id}
              className={`absolute cursor-pointer group flex flex-col items-center justify-center`}
              style={{
                left: pos.x + 'px',
                top: pos.y + 'px',
                transform: 'rotateZ(45deg) rotateX(-60deg)',
              }}
              whileHover={{ scale: 1.2, y: -10 }}
              onMouseEnter={() => setHoveredWorld({ ...world, isFinale, ...lore })}
              onMouseLeave={() => setHoveredWorld(null)}
              onClick={() => navigate(`/worlds/${world.id}`)}
            >
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center
                ${isFinale ? 'bg-color-danger/20 border-2 border-color-danger shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-color-red/10 border border-color-red shadow-[0_0_15px_rgba(255, 42, 42,0.3)]'}
                transition-all duration-300 group-hover:bg-opacity-40
              `}>
                <div className="text-white font-mono font-bold text-lg">
                  {world.worldNumber < 10 ? `0${world.worldNumber}` : world.worldNumber}
                </div>
                <div className={`absolute inset-2 rounded-full ${isFinale ? 'bg-color-danger blur-md' : 'bg-color-red blur-sm'} opacity-50`}></div>
              </div>
            </motion.div>
          );
        })}

        <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible" style={{ zIndex: -1 }}>
          {WORLDS.slice(0, 10).map((_: any, idx: number) => {
            if (idx === 9) return null;
            const p1 = getNodePosition(idx);
            const p2 = getNodePosition(idx + 1);
            return (
              <line 
                key={`line-${idx}`} 
                x1={p1.x + 32} y1={p1.y + 32} 
                x2={p2.x + 32} y2={p2.y + 32} 
                stroke="rgba(255, 42, 42, 0.3)" 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )
          })}
        </svg>
      </div>

      <AnimatePresence>
        {hoveredWorld && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-color-red p-4 rounded-sm shadow-2xl min-w-[300px] pointer-events-none z-50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-mono text-xs font-bold tracking-widest ${hoveredWorld.isFinale ? 'text-color-danger' : 'text-color-red'}`}>
                WORLD {hoveredWorld.worldNumber < 10 ? `0${hoveredWorld.worldNumber}` : hoveredWorld.worldNumber}
              </span>
              {hoveredWorld.isFinale ? <Lock size={14} className="text-color-danger" /> : <Unlock size={14} className="text-color-red" />}
            </div>
            <h3 className="text-xl font-bold text-white uppercase">{hoveredWorld.name}</h3>
            <p className="text-text-secondary text-sm mt-1">{hoveredWorld.theme}</p>
            <div className="mt-3 flex items-center text-xs text-color-red/80">
              <ChevronRight size={14} /> CLICK TO ENTER PROTOCOL
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
