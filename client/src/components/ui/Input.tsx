import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './GlitchText';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-sm border border-border-color bg-bg-primary px-3 py-2 text-sm text-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-color-red focus-visible:border-color-red disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-color-danger focus-visible:ring-color-danger focus-visible:border-color-danger",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-color-danger font-mono animate-pulse">
            {'>'} ERR: {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
