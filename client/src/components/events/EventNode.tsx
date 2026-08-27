import React from 'react';

interface EventNodeProps {
  name: string;
  logo: string;
  x: number;
  y: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const EventNode: React.FC<EventNodeProps> = ({
  name,
  logo,
  x,
  y,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <div
      className="absolute transition-all duration-300 ease-out select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        className={`w-[90px] h-[90px] rounded-full flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 ${
          isActive
            ? 'bg-[#0A0607]/90 border border-[#E01B22] shadow-[0_0_20px_rgba(224,27,34,0.35)] scale-105'
            : 'bg-[#0A0607]/75 border border-[#2A1A1D] hover:border-[#E01B22]/70 hover:shadow-[0_0_12px_rgba(224,27,34,0.2)]'
        }`}
      >
        {/* Logo/Icon Container */}
        <div className="w-10 h-10 flex items-center justify-center mb-1">
          <img
            src={logo}
            alt={name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/login.png';
            }}
            className="max-w-full max-h-full object-contain filter brightness-95 group-hover:brightness-110 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Short Text Name */}
        <span
          className={`text-[8px] font-mono font-bold tracking-tight leading-tight block text-center max-w-[76px] line-clamp-2 transition-colors ${
            isActive ? 'text-[#F7F2F2]' : 'text-[#A79798]'
          }`}
        >
          {name}
        </span>
      </div>
    </div>
  );
};

export default EventNode;
