'use client';

import { useState, useCallback } from 'react';
import type { ValueNode } from '@/types/app';
import { ValueCard } from './ValueCard';
import { ValueLookup } from './ValueLookup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ViewMode = 'boxes' | 'lookup';

const SESSION_KEY = 'valueSelector.viewMode';

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
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'boxes';
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored === 'boxes' || stored === 'lookup' ? stored : 'boxes';
  });

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    sessionStorage.setItem(SESSION_KEY, mode);
  };

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
    <div className="space-y-6 pb-24">
      {/* Sticky header: counter + toggle */}
      <div className="sticky top-4 z-10 mx-auto max-w-2xl">
        <div className="flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-3 shadow-md border border-slate-200 gap-3 flex-wrap">
          <p className="text-sm text-slate-600">
            Selecione de <strong>{minSelections}</strong> a <strong>{maxSelections}</strong> valores que te representam
          </p>
          <div className="flex items-center gap-3">
            <Badge variant={canSubmit ? 'default' : 'secondary'} className="text-sm px-3 py-1">
              {selected.size}/{maxSelections}
            </Badge>
            {/* View toggle */}
            <div
              role="group"
              aria-label="Modo de exibição"
              className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5"
            >
              <button
                type="button"
                onClick={() => handleViewMode('boxes')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  viewMode === 'boxes'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
                aria-pressed={viewMode === 'boxes'}
              >
                Caixas
              </button>
              <button
                type="button"
                onClick={() => handleViewMode('lookup')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  viewMode === 'lookup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
                aria-pressed={viewMode === 'lookup'}
              >
                Busca
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'boxes' ? (
        /* Boxes view: branch groups */
        <div className="space-y-10">
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
        </div>
      ) : (
        /* Lookup view */
        <div className="space-y-4">
          <ValueLookup
            tree={tree}
            selected={selected}
            onToggle={toggle}
            maxSelections={maxSelections}
          />

          {/* Selected values list */}
          {selected.size > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Valores selecionados:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(selected).map(id => {
                  const leaf = tree.children
                    .flatMap(b => b.children)
                    .find(l => l.id === id);
                  if (!leaf) return null;
                  const branch = tree.children.find(b => b.children.some(l => l.id === id));
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggle(id)}
                      title={`Remover: ${leaf.name}`}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: branch?.colorHex ?? '#6366f1' }}
                    >
                      {leaf.name}
                      <span aria-hidden>×</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

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
