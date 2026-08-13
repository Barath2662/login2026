import type { FC, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';
}

export const GlitchText: FC<GlitchTextProps> = ({ children, className, as: Component = 'span' }) => {
  return (
    <Component className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{children}</span>
      {/* Glitch layers visible on hover */}
      <span className="absolute top-0 left-0 -translate-x-[2px] text-color-red opacity-0 group-hover:opacity-70 transition-opacity duration-75 mix-blend-screen z-0 animate-pulse" aria-hidden="true">
        {children}
      </span>
      <span className="absolute top-0 left-0 translate-x-[2px] text-color-silver opacity-0 group-hover:opacity-70 transition-opacity duration-75 mix-blend-screen z-0 animate-pulse" style={{ animationDelay: '50ms' }} aria-hidden="true">
        {children}
      </span>
      <span className="absolute top-0 left-0 translate-y-[2px] text-color-danger opacity-0 group-hover:opacity-30 transition-opacity duration-75 mix-blend-screen z-0" aria-hidden="true">
        {children}
      </span>
    </Component>
  );
};
