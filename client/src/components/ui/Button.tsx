import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './GlitchText';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-bg-primary uppercase tracking-wider text-sm py-2 px-6';
    
    const variants = {
      primary: 'bg-color-red text-black hover:bg-color-red/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]',
      secondary: 'bg-bg-card text-text-primary hover:bg-border-color border border-border-color',
      outline: 'border border-color-red text-color-red hover:bg-color-red/10',
      danger: 'bg-color-danger text-white hover:bg-color-danger/90 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
