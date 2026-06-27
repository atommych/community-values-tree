'use client';

import { cn } from '@/lib/utils';
import type { ValueNode } from '@/types/app';

interface ValueCardProps {
  value: ValueNode;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
  branchColor?: string;
}

export function ValueCard({ value, isSelected, onToggle, disabled, branchColor }: ValueCardProps) {
  return (
    <button
      onClick={() => !disabled && onToggle(value.id)}
      className={cn(
        'relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200',
        'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        isSelected
          ? 'border-transparent text-white shadow-lg scale-[1.02]'
          : 'border-slate-200 bg-white hover:border-slate-300',
        disabled && !isSelected && 'opacity-40 cursor-not-allowed'
      )}
      style={isSelected ? { backgroundColor: branchColor ?? '#6366f1' } : undefined}
      aria-pressed={isSelected}
      type="button"
    >
      <p className="font-semibold text-sm leading-tight">{value.name}</p>
      {value.description && (
        <p className={cn('mt-1 text-xs leading-snug', isSelected ? 'text-white/80' : 'text-slate-500')}>
          {value.description}
        </p>
      )}
      {isSelected && (
        <span className="absolute top-2 right-2 text-white text-xs font-bold">✓</span>
      )}
    </button>
  );
}
