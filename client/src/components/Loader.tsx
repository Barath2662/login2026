import type { FC } from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export const Loader: FC<LoaderProps> = ({ size = 'medium' }) => {
  return (
    <div className={`flex items-center justify-center p-4 ${size === 'large' ? 'text-2xl' : size === 'small' ? 'text-sm' : 'text-base'}`}>
      <span className="text-color-red font-mono animate-pulse">Loading...</span>
    </div>
  );
};
