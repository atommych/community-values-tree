import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive';
}

const variantClasses = {
  default: 'bg-indigo-100 text-indigo-700',
  secondary: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  destructive: 'bg-red-100 text-red-700',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
