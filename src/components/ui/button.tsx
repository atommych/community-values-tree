import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const variantClasses = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

export function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? React.Fragment : 'button';
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      className: cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
        (children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.className
      ),
    });
  }
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...(asChild ? {} : props)}
    >
      {children}
    </Comp>
  );
}
