'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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

function storageKey(code: string) {
  return `participant:${code}`;
}

export default function SessaoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const isEditMode = searchParams.get('editar') === '1';
  const isNewParticipant = searchParams.get('novo') === '1';

  const [pageState, setPageState] = useState<PageState>('loading');
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joiningName, setJoiningName] = useState(false);
  const [valuesTree, setValuesTree] = useState<ValueNode | null>(null);

  // Prevent double-execution when ?novo=1 causes a router.replace re-render
  const newParticipantHandled = useRef(false);

  const { participants, refetch: refetchParticipants } = useParticipants(session?.id ?? '');

  useEffect(() => {
    async function init() {
      // If ?novo=1 is present, clear the stored participant and redirect to the
      // clean URL. The effect will re-run once with isNewParticipant=false and
      // show the join form normally.
      if (isNewParticipant && !newParticipantHandled.current) {
        newParticipantHandled.current = true;
        sessionStorage.removeItem(storageKey(code));
        router.replace(`/sessao/${code}`);
        return;
      }

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

      // Look up the participant by the stored participant_id (per-device, per-session).
      const storedPid = sessionStorage.getItem(storageKey(code));
      let participant: { submitted_at: string | null; participant_id: string } | null = null;

      if (storedPid) {
        const { data } = await supabase
          .from('session_participants')
          .select('submitted_at, participant_id')
          .eq('participant_id', storedPid)
          .single();
        participant = data;
        if (participant) setParticipantId(storedPid);
      }

      if (participant?.submitted_at && !isEditMode) {
        setPageState('submitted');
        return;
      }

      if (participant?.submitted_at && isEditMode) {
        const { error: deleteError } = await supabase
          .from('user_values')
          .delete()
          .eq('participant_id', storedPid);

        if (deleteError) {
          console.error('[sessao] failed to clear existing values:', deleteError);
          setPageState('submitted');
          return;
        }

        const { error: updateError } = await supabase
          .from('session_participants')
          .update({ submitted_at: null })
          .eq('participant_id', storedPid);

        if (updateError) {
          console.error('[sessao] failed to reset participant submission:', updateError);
          setPageState('submitted');
          return;
        }
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
  }, [code, isEditMode, isNewParticipant, router]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !session || !userId) return;
    setJoiningName(true);
    const supabase = createClient();
    const newParticipantId = crypto.randomUUID();
    const { error } = await supabase.from('session_participants').insert({
      participant_id: newParticipantId,
      session_id: session.id,
      user_id: userId,
      display_name: displayName.trim(),
    });
    if (error) {
      console.error('[handleJoin] insert error:', error);
    } else {
      sessionStorage.setItem(storageKey(code), newParticipantId);
      setParticipantId(newParticipantId);
    }
    setJoiningName(false);
    await refetchParticipants();
    setPageState('select');
  };

  const handleSubmitValues = async (selectedIds: string[]) => {
    if (!session || !userId || !participantId) return;
    const supabase = createClient();

    await supabase.from('user_values').insert(
      selectedIds.map(value_id => ({
        session_id: session.id,
        user_id: userId,
        participant_id: participantId,
        value_id,
      }))
    );

    await supabase
      .from('session_participants')
      .update({ submitted_at: new Date().toISOString() })
      .eq('participant_id', participantId);

    await refetchParticipants();
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
