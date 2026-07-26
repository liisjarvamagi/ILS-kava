// Tõlkenupp adminile: tõlgib teksti eesti ja inglise keele vahel
// Claude'i abiga. Server kontrollib, et kutsuja on sisse logitud JA
// admins tabelis — keegi teine tõlkida (ja Su API raha kulutada) ei
// saa. ANTHROPIC_API_KEY elab ainult serveris.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

export async function POST(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ error: 'Seadistamata' }, { status: 500 });

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: 'Sisselogimata' }, { status: 401 });

  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false }
  });
  const { data: { user } } = await userClient.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Sisselogimata' }, { status: 401 });
  const { data: adminRow } = await userClient
    .from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!adminRow) return NextResponse.json({ error: 'Pole admin' }, { status: 403 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY on seadistamata (lisa Vercelis ja .env.local failis)' },
      { status: 500 });
  }

  let text = '', from = 'et';
  try {
    const body = await request.json();
    text = String(body?.text || '').slice(0, 4000); // piir hoiab kulu ohjes
    from = body?.from === 'en' ? 'en' : 'et';
  } catch {
    return NextResponse.json({ error: 'Vigane päring' }, { status: 400 });
  }
  if (!text.trim()) {
    return NextResponse.json({ error: 'Lähtetekst on tühi' }, { status: 400 });
  }

  const suund = from === 'et'
    ? 'eesti keelest inglise keelde'
    : 'inglise keelest eesti keelde';
  const prompt = `Tõlgi järgnev festivaliäpi tekst ${suund}. Hoia tähendus, `
    + `toon ja umbkaudne pikkus. Kui tekstis on HTML-märgendeid või `
    + `kohatäiteid kujul {{nimi}}, jäta need täpselt samaks ja tõlgi ainult `
    + `tavatekst. Vasta AINULT tõlkega, ilma selgituste ja jutumärkideta.\n\n${text}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    let detail = `Claude vastas ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error?.message) detail += `: ${err.error.message}`;
    } catch { /* vastus polnud JSON */ }
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const data = await res.json();
  const out = (data?.content?.[0]?.text || '').trim();
  if (!out) return NextResponse.json({ error: 'Tõlge tuli tühi' }, { status: 502 });
  return NextResponse.json({ text: out });
}
