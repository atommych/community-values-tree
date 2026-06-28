import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { data: session, error: fetchError } = await supabase
    .from('sessions')
    .select('facilitator_id')
    .eq('id', id)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
  }

  if (session.facilitator_id !== user.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const { error } = await supabase
    .from('sessions')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
