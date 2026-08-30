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
  // Float randomly between 2s and 4s depending on the index
  const floatDuration = 2 + (index % 3);
  const floatY = (index % 2 === 0) ? [-3, 3, -3] : [3, -3, 3];

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
        animate={{ y: floatY }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div
          className={`relative w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 group ${
            isActive
              ? 'bg-[#0A0607]/95 border-2 border-[#E01B22] shadow-[0_0_25px_rgba(224,27,34,0.4)] scale-[1.08]'
              : isGlobalHover && !isActive
              ? 'bg-[#0A0607]/90 border border-[#E01B22]/50 shadow-[0_0_15px_rgba(224,27,34,0.2)]'
              : 'bg-[#0A0607]/75 border border-[#2A1A1D]'
          } ${dimOthers ? 'opacity-40 grayscale-[50%]' : 'opacity-100 grayscale-0'}`}
        >
          {/* Hover Indicator Arrow */}
          <div className={`absolute top-1 right-2 text-[#E01B22] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
             <ArrowUpRight className="w-3.5 h-3.5" />
          </div>

          {/* Logo/Icon Container */}
          <div className="w-12 h-12 flex items-center justify-center mb-1">
            <img
              src={logo}
              alt={name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/login.png';
              }}
              className="max-w-full max-h-full object-contain filter brightness-95 group-hover:brightness-125 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Short Text Name */}
          <span
            className={`text-[9px] font-mono font-bold tracking-tight leading-tight block text-center max-w-[80px] line-clamp-2 transition-colors ${
              isActive || isGlobalHover ? 'text-[#F7F2F2]' : 'text-[#A79798]'
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
