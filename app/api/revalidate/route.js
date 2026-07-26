// Avaliku kava kohene värskendus pärast admini muudatust.
// Cyber security: server kontrollib iga kutse juures Supabase'ist,
// et kutsuja on päriselt sisse logitud JA admins tabelis. Suvaline
// külastaja saab 401/403 ja midagi ei juhtu. Kontroll käib kutsuja
// enda access-tokeniga (mitte service võtmega), nii et RLS kehtib.
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Seadistamata' }, { status: 500 });
  }

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Sisselogimata' }, { status: 401 });
  }

  // Klient kutsuja tokeniga: näeb täpselt seda, mida kutsujal on õigus näha
  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false }
  });

  const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !user) {
    return NextResponse.json({ error: 'Sisselogimata' }, { status: 401 });
  }

  const [{ data: eaRow }, { data: paRow }] = await Promise.all([
    supabase.from('event_admins').select('event_id')
      .eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('platform_admins').select('user_id')
      .eq('user_id', user.id).maybeSingle()
  ]);
  if (!eaRow && !paRow) {
    return NextResponse.json({ error: 'Pole admin' }, { status: 403 });
  }

  // Värskenda kõik avalikud lehed (kava, detailid, esinejad, alad)
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
