import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { name } = await req.json() as { name: string };
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nome da sessão é obrigatório' }, { status: 400 });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from('sessions')
      .insert({ code, name: name.trim(), facilitator_id: user.id })
      .select()
      .single();

    if (error?.code === '23505') continue;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ session: data }, { status: 201 });
  }

  return NextResponse.json({ error: 'Não foi possível gerar um código único' }, { status: 500 });
}
