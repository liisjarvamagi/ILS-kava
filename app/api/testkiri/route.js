// Testkiri adminile: saadab hommikukirja KOHE admini enda e-postile,
// et malli ja saatmist kontrollida. Server kontrollib, et kutsuja on
// sisse logitud JA admins tabelis — keegi teine testkirja saata ei saa.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serviceClient, sendDailyTo, todayTallinn } from '../../../lib/emailDaily';

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

  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY on Vercelis seadistamata' }, { status: 500 });
  }

  // Testiks: tänane päev, või kui täna pole festival, siis esimene
  // päev, kus kavas midagi on.
  let day = todayTallinn();
  const { count } = await supabase.from('performances')
    .select('id', { count: 'exact', head: true })
    .eq('festival_day', day).eq('is_published', true);
  if (!count) {
    const { data: first } = await supabase.from('performances')
      .select('festival_day').eq('is_published', true)
      .order('festival_day').limit(1).maybeSingle();
    if (first) day = first.festival_day;
  }

  const { data: profile } = await supabase.from('profiles')
    .select('locale').eq('id', user.id).maybeSingle();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  try {
    const r = await sendDailyTo(
      supabase,
      { id: user.id, email: user.email, locale: profile?.locale || 'et' },
      day, appUrl,
      { sendEmpty: true } // testkiri läheb ka tühja kavaga
    );
    if (r === 'fail') return NextResponse.json({ error: 'Saatmine ebaõnnestus' }, { status: 500 });
    return NextResponse.json({ ok: true, day, to: user.email });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
