// Hommikukirja saatja. Teda võib käivitada kasvõi iga tund (Verceli
// cron + GitHub Actions) — iga kasutaja saab kirja siis, kui TEMA
// kellaaeg on käes (profiili valik või korraldaja vaikimisi aeg),
// ja ainult üks kord päevas (last_daily_sent tõke). Päring on
// kaitstud CRON_SECRET päisega; vale saladus saab 401. Service role
// võtit kasutatakse AINULT siin serveris.
import { NextResponse } from 'next/server';
import {
  serviceClient, sendDailyTo, todayTallinn, hourTallinn, dueNow, publicAppUrl
} from '../../../lib/emailDaily';

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
  const nowHour = hourTallinn();
  const appUrl = publicAppUrl(new URL(request.url).origin);

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

  // Korraldaja vaikimisi saatmistund mallist
  const { data: tpl } = await supabase
    .from('email_templates').select('send_hour').eq('key', 'daily_schedule').single();
  const defaultHour = tpl?.send_hour ?? 9;

  // Tellijad + nende e-postid (auth.users käib admin API kaudu)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, locale, daily_email_hour, last_daily_sent')
    .eq('wants_daily_email', true);
  if (!profiles?.length) {
    return NextResponse.json({ ok: true, day, sent: 0, note: 'tellijaid pole' });
  }

  // Ainult need, kelle kellaaeg on käes ja kes pole täna veel saanud
  const due = profiles.filter((p) =>
    dueNow(p.daily_email_hour, defaultHour, p.last_daily_sent, nowHour, day));
  if (!due.length) {
    return NextResponse.json({ ok: true, day, hour: nowHour, sent: 0, note: 'praegu pole kellegi kellaaeg' });
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
  let lastError = null;
  for (const p of due) {
    const email = emails.get(p.id);
    if (!email) { skipped++; continue; }
    const r = await sendDailyTo(supabase, { id: p.id, email, locale: p.locale }, day, appUrl);
    if (r.status === 'sent' || r.status === 'skip') {
      // märgime tänase tehtuks ka tühja kava puhul — muidu prooviks
      // saatja sama kasutajat igal tunnil uuesti
      await supabase.from('profiles')
        .update({ last_daily_sent: day }).eq('id', p.id);
      if (r.status === 'sent') sent++; else skipped++;
    } else {
      failed++;
      lastError = r.error || lastError;
      // last_daily_sent jääb vanaks → järgmine tund proovib uuesti
    }
  }

  return NextResponse.json({ ok: true, day, hour: nowHour, sent, skipped, failed, error: lastError });
}
