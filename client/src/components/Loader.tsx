import type { FC } from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const Loader: FC<LoaderProps> = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0607]'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-[#2A1A1D] border-t-[#E01B22] animate-[spin_1.5s_linear_infinite]" />
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 rounded-full border-[2px] border-[#E01B22]/30 animate-ping" />
        
        {/* Center core */}
        <div className="w-1/3 h-1/3 rounded-full bg-[#E01B22] shadow-[0_0_15px_rgba(224,27,34,0.8)] animate-pulse" />
      </div>
      
      {/* Loading Text */}
      <div className="mt-6 flex flex-col items-center space-y-1">
        <span className="text-[#E01B22] font-display font-black tracking-[0.3em] uppercase text-sm md:text-base animate-pulse">
          INITIALIZING
        </span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#A79798] rounded-full animate-[bounce_1s_infinite_0ms]" />
          <div className="w-1.5 h-1.5 bg-[#A79798] rounded-full animate-[bounce_1s_infinite_200ms]" />
          <div className="w-1.5 h-1.5 bg-[#A79798] rounded-full animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
};
