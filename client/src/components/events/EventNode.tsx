import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface EventNodeProps {
  name: string;
  logo: string;
  x: number;
  y: number;
  index: number;
  isActive: boolean;
  isAnyActive: boolean;
  isExploreHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const EventNode: React.FC<EventNodeProps> = ({
  name,
  logo,
  x,
  y,
  index,
  isActive,
  isAnyActive,
  isExploreHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const floatDuration = 2 + (index % 3);
  const floatY = (index % 2 === 0) ? [-4, 4, -4] : [4, -4, 4];

  const dimOthers = (isAnyActive && !isActive) && !isExploreHovered;
  const isGlobalHover = isExploreHovered || isActive;

  return (
    <motion.div
      className="absolute transition-all duration-500 ease-out select-none z-20"
      initial={{ x: '-50%', y: '-50%', opacity: 0 }}
      animate={{ 
        left: x, 
        top: y, 
        x: '-50%', 
        y: '-50%',
        opacity: 1
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <motion.div
        animate={{ 
          y: floatY,
          scale: isActive ? 1.35 : dimOthers ? 0.88 : 1
        }}
        transition={{
          y: { duration: floatDuration, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 18 }
        }}
      >
        <div
          className={`relative w-[122px] h-[122px] rounded-full flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 group ${
            isActive
              ? 'bg-[#0A0607] border-2 border-[#E01B22] shadow-[0_0_45px_rgba(224,27,34,0.8)] z-30'
              : isGlobalHover && !isActive
              ? 'bg-[#0A0607]/90 border border-[#E01B22]/60 shadow-[0_0_20px_rgba(224,27,34,0.3)]'
              : 'bg-[#130C0E]/95 border border-[#3E2529] hover:border-[#E01B22] shadow-xl'
          } ${dimOthers ? 'opacity-35 grayscale-[60%]' : 'opacity-100 grayscale-0'}`}
        >
          {/* Active Hover Badge Icon */}
          <div className={`absolute top-2 right-2 text-[#E01B22] transition-opacity duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-0'}`}>
             <ArrowUpRight className="w-4 h-4" />
          </div>

          {/* Logo Container with Playful Hover Scale */}
          <motion.div 
            animate={{ 
              scale: isActive ? [1.1, 1.25, 1.15] : 1,
              rotate: isActive ? [0, -5, 5, 0] : 0
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isActive ? Infinity : 0, 
              ease: "easeInOut" 
            }}
            className="w-14 h-14 flex items-center justify-center mb-1 drop-shadow-[0_0_10px_rgba(224,27,34,0.4)]"
          >
            <img
              src={logo}
              alt={name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/login.png';
              }}
              className="max-w-full max-h-full object-contain filter brightness-110 contrast-125 group-hover:brightness-130 transition-transform duration-300"
            />
          </motion.div>

          {/* Short Text Name */}
          <span
            className={`text-[10px] font-mono font-black tracking-tight leading-tight block text-center max-w-[98px] line-clamp-2 transition-colors ${
              isActive ? 'text-[#ffffff] drop-shadow-[0_0_6px_rgba(224,27,34,0.8)]' : isGlobalHover ? 'text-[#F7F2F2]' : 'text-[#D5C9CA]'
            }`}
          >
            {name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventNode;
