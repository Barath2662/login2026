import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  return (
    <>
      <style>
        {`
          @keyframes shiny-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shiny-shimmer-custom {
            animation: shiny-shimmer var(--speed, 5s) linear infinite;
          }
        `}
      </style>
      <span
        className={`inline-block ${
          disabled
            ? 'text-current'
            : 'bg-clip-text text-transparent animate-shiny-shimmer-custom'
        } ${className}`}
        style={{
          '--speed': `${speed}s`,
          backgroundImage: disabled
            ? 'none'
            : 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
          backgroundSize: '200% 100%',
        } as React.CSSProperties}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
