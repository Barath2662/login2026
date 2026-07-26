import type { FC, ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return <div className="container mx-auto p-4 flex-1">{children}</div>;
};
