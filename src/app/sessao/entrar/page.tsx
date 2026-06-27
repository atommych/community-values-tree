'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EntrarSessaoPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean) router.push(`/sessao/${clean}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Entrar na sessão</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Digite o código que o facilitador compartilhou
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-slate-200 shadow-md p-8 space-y-4"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: ALPHA2026"
            className="font-mono text-center text-lg tracking-widest uppercase"
            maxLength={8}
            required
          />
          <Button type="submit" className="w-full" disabled={code.trim().length < 4}>
            Entrar →
          </Button>
          <div className="text-center">
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
              ← Voltar ao início
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
