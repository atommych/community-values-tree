import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SessionCard } from '@/components/session/SessionCard';
import { Button } from '@/components/ui/button';
import type { Session, Participant } from '@/types/app';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: sessionsRaw } = await supabase
    .from('sessions')
    .select('*')
    .eq('facilitator_id', user.id)
    .order('created_at', { ascending: false });

  const sessions: Session[] = (sessionsRaw ?? []).map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    facilitatorId: s.facilitator_id,
    createdAt: s.created_at,
    isActive: s.is_active,
  }));

  const participantsMap = new Map<string, Participant[]>();
  if (sessions.length > 0) {
    const sessionIds = sessions.map(s => s.id);
    const { data: pRaw } = await supabase
      .from('session_participants')
      .select('*')
      .in('session_id', sessionIds);

    for (const p of pRaw ?? []) {
      const list = participantsMap.get(p.session_id) ?? [];
      list.push({
        sessionId: p.session_id,
        userId: p.user_id,
        displayName: p.display_name,
        submittedAt: p.submitted_at,
      });
      participantsMap.set(p.session_id, list);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Minhas Sessões</h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie suas dinâmicas de valores</p>
          </div>
          <Button asChild>
            <Link href="/sessao/criar">+ Nova sessão</Link>
          </Button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white border border-slate-200">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Nenhuma sessão ainda</h2>
            <p className="text-slate-400 mb-6">Crie sua primeira dinâmica de valores</p>
            <Button asChild>
              <Link href="/sessao/criar">Criar sessão</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                participants={participantsMap.get(session.id) ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
