'use client';

import { useState } from 'react';
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
  const [showDescription, setShowDescription] = useState(false);

  return (
    <button
      onClick={() => !disabled && onToggle(value.id)}
      title={value.description ?? value.name}
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
      <p className="font-semibold text-sm leading-tight truncate pr-5">{value.name}</p>

      {/* Touch-device info icon */}
      {value.description && (
        <button
          type="button"
          aria-label="Ver descrição"
          onClick={(e) => { e.stopPropagation(); setShowDescription(v => !v); }}
          className={cn(
            'absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold',
            'sm:hidden',
            isSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'
          )}
        >
          i
        </button>
      )}

      {isSelected && (
        <span className="absolute top-2 right-2 text-white text-xs font-bold hidden sm:block">✓</span>
      )}

      {/* Tooltip for touch (shown on tap of info icon) */}
      {showDescription && value.description && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-1 z-30 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs p-2 shadow-lg',
            'sm:hidden'
          )}
          role="tooltip"
        >
          {value.description}
        </div>
      )}
    </button>
  );
}
