// Hommikukirja cron. Verceli cron kutsub seda iga päev; päring on
// kaitstud CRON_SECRET päisega (Vercel lisab selle ise, kui projekti
// keskkonnamuutujates on CRON_SECRET). Vale või puuduva saladusega
// päring saab 401 ja midagi ei saadeta. Service role võtit kasutatakse
// AINULT siin serveris.
import { NextResponse } from 'next/server';
import { serviceClient, sendDailyTo, todayTallinn } from '../../../lib/emailDaily';

export const maxDuration = 60; // sekundit — kirju võib olla palju

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Keelatud' }, { status: 401 });
  }

  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service võti seadistamata' }, { status: 500 });
  }

  const day = todayTallinn();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Kas täna on üldse festivalipäev? Kui kavas pole ühtegi tänast
  // kirjet, ei saada kellelegi midagi.
  const { count } = await supabase
    .from('performances')
    .select('id', { count: 'exact', head: true })
    .eq('festival_day', day)
    .eq('is_published', true);
  if (!count) {
    return NextResponse.json({ ok: true, day, sent: 0, note: 'täna pole festivalipäev' });
  }

  // Tellijad + nende e-postid (auth.users käib admin API kaudu)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, locale')
    .eq('wants_daily_email', true);
  if (!profiles?.length) {
    return NextResponse.json({ ok: true, day, sent: 0, note: 'tellijaid pole' });
  }

  const emails = new Map();
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) emails.set(u.id, u.email);
    if (data.users.length < 1000) break;
    page++;
  }

  let sent = 0, skipped = 0, failed = 0;
  for (const p of profiles) {
    const email = emails.get(p.id);
    if (!email) { skipped++; continue; }
    const r = await sendDailyTo(supabase, { id: p.id, email, locale: p.locale }, day, appUrl);
    if (r === 'sent') sent++;
    else if (r === 'skip') skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, day, sent, skipped, failed });
}
