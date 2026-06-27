'use client';

import { useState, useCallback } from 'react';
import type { ValueNode } from '@/types/app';
import { ValueCard } from './ValueCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ValueSelectorProps {
  tree: ValueNode;
  onSubmit: (selectedIds: string[]) => Promise<void>;
  minSelections?: number;
  maxSelections?: number;
}

export function ValueSelector({
  tree,
  onSubmit,
  minSelections = 5,
  maxSelections = 10,
}: ValueSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < maxSelections) {
        next.add(id);
      }
      return next;
    });
  }, [maxSelections]);

  const handleSubmit = async () => {
    if (selected.size < minSelections || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(Array.from(selected));
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = selected.size >= minSelections;

  return (
    <div className="space-y-10 pb-24">
      {/* Sticky counter */}
      <div className="sticky top-4 z-10 mx-auto max-w-2xl">
        <div className="flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-3 shadow-md border border-slate-200">
          <p className="text-sm text-slate-600">
            Selecione de <strong>{minSelections}</strong> a <strong>{maxSelections}</strong> valores que te representam
          </p>
          <Badge variant={canSubmit ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {selected.size}/{maxSelections}
          </Badge>
        </div>
      </div>

      {/* Branch groups */}
      {tree.children.map((branch) => (
        <section key={branch.id}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: branch.colorHex ?? '#6366f1' }}
            />
            <h2
              className="text-lg font-bold"
              style={{ color: branch.colorHex ?? '#374151' }}
            >
              {branch.name}
            </h2>
            {branch.description && (
              <span className="text-sm text-slate-500 hidden sm:block">— {branch.description}</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {branch.children.map((leaf) => (
              <ValueCard
                key={leaf.id}
                value={leaf}
                isSelected={selected.has(leaf.id)}
                onToggle={toggle}
                branchColor={branch.colorHex ?? undefined}
                disabled={!selected.has(leaf.id) && selected.size >= maxSelections}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Floating submit */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="shadow-xl px-10 text-base"
          >
            {submitting
              ? 'Enviando...'
              : canSubmit
              ? 'Confirmar meus valores →'
              : `Selecione mais ${minSelections - selected.size} valor${minSelections - selected.size !== 1 ? 'es' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
