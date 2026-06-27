'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ValueSelector } from '@/components/values/ValueSelector';
import { ParticipantList } from '@/components/session/ParticipantList';
import { useParticipants } from '@/lib/hooks/useParticipants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buildTree } from '@/lib/lca/tree';
import type { ValueNode, ValueRow } from '@/types/app';
import Link from 'next/link';

type PageState = 'loading' | 'join' | 'select' | 'submitted' | 'not_found' | 'inactive';

interface SessionInfo {
  id: string;
  name: string;
  isActive: boolean;
}

export default function SessaoPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joiningName, setJoiningName] = useState(false);
  const [valuesTree, setValuesTree] = useState<ValueNode | null>(null);

  const participants = useParticipants(session?.id ?? '');

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?next=/sessao/${code}`);
        return;
      }
      setUserId(user.id);

      const { data: sessData } = await supabase
        .from('sessions')
        .select('id, name, is_active')
        .eq('code', code)
        .single();

      if (!sessData) { setPageState('not_found'); return; }
      if (!sessData.is_active) { setPageState('inactive'); return; }

      setSession({ id: sessData.id, name: sessData.name, isActive: sessData.is_active });

      const { data: participant } = await supabase
        .from('session_participants')
        .select('submitted_at')
        .eq('session_id', sessData.id)
        .eq('user_id', user.id)
        .single();

      if (participant?.submitted_at) {
        setPageState('submitted');
        return;
      }

      const res = await fetch('/api/valores');
      const json = await res.json();
      if (!res.ok || !json.values) {
        console.error('[sessao] failed to load values tree:', json.error);
        setPageState('not_found');
        return;
      }
      setValuesTree(buildTree(json.values as ValueRow[]));

      if (!participant) {
        setPageState('join');
      } else {
        setPageState('select');
      }
    }
    init();
  }, [code, router]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !session || !userId) return;
    setJoiningName(true);
    const supabase = createClient();
    await supabase.from('session_participants').insert({
      session_id: session.id,
      user_id: userId,
      display_name: displayName.trim(),
    });
    setJoiningName(false);
    setPageState('select');
  };

  const handleSubmitValues = async (selectedIds: string[]) => {
    if (!session || !userId) return;
    const supabase = createClient();

    await supabase.from('user_values').insert(
      selectedIds.map(value_id => ({
        session_id: session.id,
        user_id: userId,
        value_id,
      }))
    );

    await supabase
      .from('session_participants')
      .update({ submitted_at: new Date().toISOString() })
      .eq('session_id', session.id)
      .eq('user_id', userId);

    setPageState('submitted');
  };

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3 animate-pulse">🌳</div>
          <p>Carregando sessão...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sessão não encontrada</h1>
          <p className="text-slate-500 mb-6">O código <strong>{code}</strong> não existe.</p>
          <Button asChild><Link href="/sessao/entrar">Tentar outro código</Link></Button>
        </div>
      </div>
    );
  }

  if (pageState === 'inactive') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sessão encerrada</h1>
          <p className="text-slate-500">Esta sessão não está mais ativa.</p>
        </div>
      </div>
    );
  }

  if (pageState === 'submitted') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Valores enviados!
          </h1>
          <p className="text-slate-500 mb-8">
            Aguarde todos os participantes enviarem para ver o tronco comum.
          </p>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 mb-6">
            <ParticipantList participants={participants} />
          </div>
          <Button asChild className="w-full">
            <Link href={`/sessao/${code}/resultado`}>Ver resultado parcial →</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (pageState === 'join') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">👋</div>
            <h1 className="text-2xl font-extrabold text-slate-900">{session?.name}</h1>
            <p className="text-slate-500 mt-2 text-sm">Como devo te chamar nesta sessão?</p>
          </div>
          <form
            onSubmit={handleJoin}
            className="rounded-2xl bg-white border border-slate-200 shadow-md p-6 space-y-4"
          >
            <Input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Seu nome ou apelido"
              maxLength={40}
              autoFocus
              required
            />
            <Button type="submit" className="w-full" disabled={joiningName || !displayName.trim()}>
              {joiningName ? 'Entrando...' : 'Entrar na sessão →'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{session?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              Selecione os valores que mais te representam
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4 w-56">
              <ParticipantList participants={participants} />
            </div>
          </div>
        </div>

        {valuesTree && (
          <ValueSelector
            tree={valuesTree}
            onSubmit={handleSubmitValues}
          />
        )}
      </div>
    </main>
  );
}
