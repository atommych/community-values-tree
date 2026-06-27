import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const getCachedValues = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('values')
      .select('id, name, description, parent_id, level, sort_order, color_hex')
      .order('level')
      .order('sort_order');
    if (error) throw error;
    return data;
  },
  ['values-tree'],
  { revalidate: 3600 }
);

export async function GET() {
  try {
    const data = await getCachedValues();
    return NextResponse.json({ values: data });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido';
    console.error('[api/valores]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
