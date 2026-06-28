'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ValueNode } from '@/types/app';
import { Input } from '@/components/ui/input';

interface FlatLeaf {
  id: string;
  name: string;
  description: string | null;
  branchName: string;
  branchColor: string | null;
}

interface ValueLookupProps {
  tree: ValueNode;
  selected: Set<string>;
  onToggle: (id: string) => void;
  maxSelections: number;
}

function flattenLeaves(tree: ValueNode): FlatLeaf[] {
  const leaves: FlatLeaf[] = [];
  for (const branch of tree.children) {
    for (const leaf of branch.children) {
      leaves.push({
        id: leaf.id,
        name: leaf.name,
        description: leaf.description,
        branchName: branch.name,
        branchColor: branch.colorHex,
      });
    }
  }
  return leaves;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-inherit rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function ValueLookup({ tree, selected, onToggle, maxSelections }: ValueLookupProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const allLeaves = useMemo(() => flattenLeaves(tree), [tree]);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setActiveIndex(-1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    return allLeaves.filter(leaf =>
      leaf.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (leaf.description?.toLowerCase().includes(debouncedQuery.toLowerCase()) ?? false)
    );
  }, [allLeaves, debouncedQuery]);

  const isOpen = open && debouncedQuery.length >= 2;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const leaf = results[activeIndex];
        if (selected.has(leaf.id) || selected.size < maxSelections) {
          onToggle(leaf.id);
        }
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, [isOpen, results, activeIndex, selected, maxSelections, onToggle]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div className="relative max-w-lg mx-auto">
      <Input
        ref={inputRef}
        type="search"
        placeholder="Buscar valor pelo nome…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
        aria-controls="lookup-listbox"
        aria-activedescendant={activeIndex >= 0 ? `lookup-item-${activeIndex}` : undefined}
        className="h-12 text-base pr-10"
        autoComplete="off"
      />

      {isOpen && (
        <ul
          id="lookup-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-40 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-72 overflow-y-auto"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">Valor não encontrado</li>
          ) : (
            results.map((leaf, i) => {
              const isSelected = selected.has(leaf.id);
              const isDisabled = !isSelected && selected.size >= maxSelections;
              return (
                <li
                  key={leaf.id}
                  id={`lookup-item-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={e => {
                    e.preventDefault();
                    if (!isDisabled) onToggle(leaf.id);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 cursor-pointer text-sm',
                    i === activeIndex && 'bg-indigo-50',
                    isSelected && 'font-semibold',
                    isDisabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-slate-900">
                      {highlight(leaf.name, debouncedQuery)}
                    </p>
                    {leaf.description && (
                      <p className="text-xs text-slate-500 truncate">
                        {highlight(leaf.description, debouncedQuery)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {leaf.branchColor && (
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: leaf.branchColor }}
                        title={leaf.branchName}
                      />
                    )}
                    {isSelected && <span className="text-indigo-600">✓</span>}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="mt-2 text-xs text-slate-400 text-center">Digite pelo menos 2 caracteres para buscar</p>
      )}
    </div>
  );
}
