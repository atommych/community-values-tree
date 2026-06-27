'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CriarSessaoPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sessao/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/sessao/${data.session.code}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao criar sessão');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌿</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Nova Sessão</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Dê um nome para sua dinâmica de valores
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-slate-200 shadow-md p-8 space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Nome da sessão
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Equipe de Design · Família Silva"
              maxLength={80}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
            {loading ? 'Criando...' : 'Criar sessão →'}
          </Button>

          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600">
              ← Voltar ao dashboard
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
