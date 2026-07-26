import type { FC, ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
}

export const Section: FC<SectionProps> = ({ children }) => {
  return <section className="py-8 my-4">{children}</section>;
};
