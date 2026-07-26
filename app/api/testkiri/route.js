// Testkiri adminile: saadab hommikukirja KOHE admini enda e-postile,
// et malli ja saatmist kontrollida. Server kontrollib, et kutsuja on
// sisse logitud JA admins tabelis — keegi teine testkirja saata ei saa.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { serviceClient, sendDailyTo, todayTallinn, publicAppUrl } from '../../../lib/emailDaily';

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
  // Sündmus tuleb vormist; kontrollime, et kutsuja on SELLE
  // sündmuse admin (või platvormi omanik)
  let eventId = null, to = null;
  try {
    const body = await request.json();
    eventId = String(body?.event_id || '');
    to = String(body?.to || '').trim() || null;
  } catch { /* body puudub */ }
  if (!/^[0-9a-f-]{30,40}$/i.test(eventId || '')) {
    return NextResponse.json({ error: 'Sündmus on määramata' }, { status: 400 });
  }
  const [{ data: eaRow }, { data: paRow }] = await Promise.all([
    userClient.from('event_admins').select('user_id')
      .eq('user_id', user.id).eq('event_id', eventId).maybeSingle(),
    userClient.from('platform_admins').select('user_id')
      .eq('user_id', user.id).maybeSingle()
  ]);
  if (!eaRow && !paRow) {
    return NextResponse.json({ error: 'Pole selle sündmuse admin' }, { status: 403 });
  }

  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY on Vercelis seadistamata' }, { status: 500 });
  }

  const { data: event } = await supabase.from('events')
    .select('id, slug, name').eq('id', eventId).maybeSingle();
  if (!event) return NextResponse.json({ error: 'Sündmust ei leitud' }, { status: 404 });

  // Testiks: tänane päev, või kui täna pole festival, siis esimene
  // päev, kus selle sündmuse kavas midagi on.
  let day = todayTallinn();
  const { count } = await supabase.from('performances')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('festival_day', day).eq('is_published', true);
  if (!count) {
    const { data: first } = await supabase.from('performances')
      .select('festival_day').eq('event_id', event.id).eq('is_published', true)
      .order('festival_day').limit(1).maybeSingle();
    if (first) day = first.festival_day;
  }

  const { data: profile } = await supabase.from('profiles')
    .select('locale').eq('id', user.id).maybeSingle();
  const appUrl = publicAppUrl(new URL(request.url).origin);

  // Sihtaadress: admin võib panna vormi teise aadressi (nt kui Resendi
  // konto on tehtud teise meiliga). Tühi = admini enda aadress.
  if (to && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: 'Vigane e-posti aadress' }, { status: 400 });
  }
  if (!to) to = user.email;

  try {
    const r = await sendDailyTo(
      supabase,
      { id: user.id, email: to, locale: profile?.locale || 'et' },
      event, day, appUrl,
      { sendEmpty: true } // testkiri läheb ka tühja kavaga
    );
    if (r.status === 'fail') {
      return NextResponse.json(
        { error: r.error || 'Saatmine ebaõnnestus' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, day, to });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
