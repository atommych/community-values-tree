import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { computeLCA } from '@/lib/lca/algorithm';
import type { ValueRow } from '@/types/app';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { sessionId } = await req.json() as { sessionId: string };

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId obrigatório' }, { status: 400 });
  }

  const { data: valueRows, error: valErr } = await supabase
    .from('values')
    .select('id, name, description, parent_id, level, sort_order, color_hex')
    .order('level')
    .order('sort_order');

  if (valErr) return NextResponse.json({ error: valErr.message }, { status: 500 });

  const { data: uvRows, error: uvErr } = await supabase
    .from('user_values')
    .select('user_id, value_id, session_participants!inner(submitted_at)')
    .eq('session_id', sessionId)
    .not('session_participants.submitted_at', 'is', null);

  if (uvErr) return NextResponse.json({ error: uvErr.message }, { status: 500 });

  const selections = new Map<string, Set<string>>();
  for (const row of uvRows ?? []) {
    const r = row as { user_id: string; value_id: string };
    if (!selections.has(r.user_id)) selections.set(r.user_id, new Set());
    selections.get(r.user_id)!.add(r.value_id);
  }

  if (selections.size === 0) {
    return NextResponse.json({ error: 'Nenhum participante enviou valores ainda' }, { status: 422 });
  }

  const result = computeLCA(valueRows as ValueRow[], selections);

  return NextResponse.json(result);
}
