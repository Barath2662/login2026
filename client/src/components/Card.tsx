import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }) => {
  return <div className="p-4 border border-gray-800 rounded bg-[#121217]">{children}</div>;
};
