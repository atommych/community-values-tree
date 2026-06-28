import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { buildTree, flattenTree, getAncestorPath } from '@/lib/lca/tree';
import { computeLCA } from '@/lib/lca/algorithm';
import type { ValueRow, Participant } from '@/types/app';
import { TreeVisualization } from '@/components/visualization/TreeVisualization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import Link from 'next/link';

interface ResultadoPageProps {
  params: Promise<{ code: string }>;
}

export default async function ResultadoPage({ params }: ResultadoPageProps) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: sessData } = await supabase
    .from('sessions')
    .select('id, name, is_active, facilitator_id')
    .eq('code', code.toUpperCase())
    .single();

  if (!sessData) notFound();

  const currentUserId = user?.id ?? null;
  const isOwner = !!currentUserId && sessData.facilitator_id === currentUserId;
  const isActive = sessData.is_active as boolean;

  const [valoresRes, participantsRes, uvRes] = await Promise.all([
    supabase.from('values').select('*').order('level').order('sort_order'),
    supabase.from('session_participants').select('*').eq('session_id', sessData.id),
    supabase.from('user_values').select('user_id, value_id').eq('session_id', sessData.id),
  ]);

  const valueRows = (valoresRes.data ?? []) as ValueRow[];
  const participants: Participant[] = (participantsRes.data ?? []).map(p => ({
    sessionId: p.session_id,
    userId: p.user_id,
    displayName: p.display_name,
    submittedAt: p.submitted_at,
  }));

  const submitted = participants.filter(p => p.submittedAt);
  const isParticipant = !!currentUserId && participants.some(p => p.userId === currentUserId);
  const canEdit = (isOwner || isParticipant) && isActive;

  const selections = new Map<string, Set<string>>();
  for (const row of uvRes.data ?? []) {
    const r = row as { user_id: string; value_id: string };
    if (!selections.has(r.user_id)) selections.set(r.user_id, new Set());
    selections.get(r.user_id)!.add(r.value_id);
  }

  const treeRoot = buildTree(valueRows);
  const hasResults = selections.size > 0;
  const lcaResult = hasResults ? computeLCA(valueRows, selections) : null;
  const visibleNodeIds = hasResults
    ? (() => {
        const nodeMap = flattenTree(treeRoot);
        const visible = new Set<string>([treeRoot.id]);
        for (const valueIds of selections.values()) {
          for (const valueId of valueIds) {
            getAncestorPath(valueId, nodeMap).forEach(id => visible.add(id));
          }
        }
        return Array.from(visible);
      })()
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top navigation */}
        <div className="flex items-center justify-between mb-8">
          <BackButton fallback="/dashboard" label="← Voltar" />
          <div className="flex gap-2">
            {canEdit && (
              <Button asChild size="sm">
                <Link href={`/sessao/${code}?editar=1`}>Editar respostas</Link>
              </Button>
            )}
            {!canEdit && (isOwner || isParticipant) && !isActive && (
              <Button size="sm" disabled title="Sessão encerrada">
                Editar respostas
              </Button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">🌳</div>
          <h1 className="text-3xl font-extrabold text-slate-900">{sessData.name}</h1>
          <p className="text-slate-500 mt-2">
            {submitted.length} de {participants.length} participante{participants.length !== 1 ? 's' : ''} enviou seus valores
          </p>
        </div>

        {!hasResults ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-slate-200">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Aguardando envios</h2>
            <p className="text-slate-400">Nenhum participante enviou valores ainda.</p>
          </div>
        ) : (
          <>
            {/* LCA Hero */}
            {lcaResult && (
              <div
                className="mb-8 rounded-3xl p-8 text-white text-center shadow-lg"
                style={{ backgroundColor: lcaResult.lcaNode.colorHex ?? '#6366f1' }}
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-2">
                  ✦ Tronco Comum da Comunidade
                </p>
                <h2 className="text-4xl font-extrabold mb-2">{lcaResult.lcaNode.name}</h2>
                {lcaResult.lcaNode.description && (
                  <p className="text-white/80 text-lg">{lcaResult.lcaNode.description}</p>
                )}
                <p className="mt-4 text-white/60 text-sm">
                  Valor ancestral compartilhado por todos os {lcaResult.participantCount} participante{lcaResult.participantCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Tree visualization */}
            {lcaResult && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Árvore de Valores</h3>
                <TreeVisualization treeRoot={treeRoot} lcaResult={lcaResult} visibleNodeIds={visibleNodeIds} />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Nós destacados = valores em comum · Use scroll para zoom · Arraste para mover
                </p>
              </div>
            )}

            {/* Participant cards */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Valores por Participante</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {submitted.map(participant => {
                  const pValues = Array.from(selections.get(participant.userId) ?? []);
                  return (
                    <div
                      key={participant.userId}
                      className="rounded-xl bg-white border border-slate-200 shadow-sm p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {participant.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{participant.displayName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pValues.map(valueId => {
                          const v = valueRows.find(r => r.id === valueId);
                          return v ? (
                            <Badge key={valueId} variant="secondary" className="text-xs">
                              {v.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
                {participants.filter(p => !p.submittedAt).map(p => (
                  <div key={p.userId} className="rounded-xl bg-slate-100 border border-dashed border-slate-300 p-5 opacity-60">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                        ⏳
                      </div>
                      <span className="text-slate-500">{p.displayName}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">Pendente</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
