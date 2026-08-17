import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`p-4 border border-gray-800 rounded bg-[#121217] ${className}`}>{children}</div>;
};
