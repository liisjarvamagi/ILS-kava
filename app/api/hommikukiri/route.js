// Hommikukirja saatja — käib läbi KÕIK elusad sündmused. Iga
// sündmuse tellija saab kirja siis, kui TEMA kellaaeg on käes
// (isiklik valik või sündmuse vaikimisi aeg), ja ainult üks kord
// päevas (last_sent tõke tellimuse real). Saatjat võib käivitada
// kasvõi iga tund. Päring on kaitstud CRON_SECRET päisega.
// Service role võtit kasutatakse AINULT siin serveris ja iga
// päring on sündmuse järgi filtreeritud.
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

  // Elusad sündmused, mille festival täna käib
  const { data: events } = await supabase
    .from('events')
    .select('id, slug, name, starts_on, ends_on')
    .eq('is_public', true)
    .eq('is_active', true)
    .lte('starts_on', day)
    .gte('ends_on', day);
  if (!events?.length) {
    return NextResponse.json({ ok: true, day, sent: 0, note: 'täna pole ühtegi festivalipäeva' });
  }

  // Kasutajate e-postid üks kord (admin API)
  const emails = new Map();
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) emails.set(u.id, u.email);
    if (data.users.length < 1000) break;
    page++;
  }

  const summary = [];
  for (const event of events) {
    // Kas sellel sündmusel on täna avaldatud kava?
    const { count } = await supabase
      .from('performances')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', event.id)
      .eq('festival_day', day)
      .eq('is_published', true);
    if (!count) { summary.push({ event: event.slug, note: 'tühi päev' }); continue; }

    const { data: tpl } = await supabase
      .from('email_templates').select('send_hour')
      .eq('event_id', event.id).eq('key', 'daily_schedule').maybeSingle();
    const defaultHour = tpl?.send_hour ?? 9;

    const { data: prefs } = await supabase
      .from('event_email_prefs')
      .select('user_id, send_hour, last_sent')
      .eq('event_id', event.id);
    const due = (prefs || []).filter((p) =>
      dueNow(p.send_hour, defaultHour, p.last_sent, nowHour, day));
    if (!due.length) { summary.push({ event: event.slug, note: 'kellegi aeg pole käes' }); continue; }

    // Keel profiilist
    const ids = due.map((p) => p.user_id);
    const { data: profs } = await supabase
      .from('profiles').select('id, locale').in('id', ids);
    const localeById = Object.fromEntries((profs || []).map((p) => [p.id, p.locale]));

    let sent = 0, skipped = 0, failed = 0, lastError = null;
    for (const p of due) {
      const email = emails.get(p.user_id);
      if (!email) { skipped++; continue; }
      const r = await sendDailyTo(supabase,
        { id: p.user_id, email, locale: localeById[p.user_id] }, event, day, appUrl);
      if (r.status === 'sent' || r.status === 'skip') {
        // märgime tänase tehtuks ka tühja kava puhul — muidu prooviks
        // saatja sama kasutajat igal tunnil uuesti
        await supabase.from('event_email_prefs')
          .update({ last_sent: day })
          .eq('user_id', p.user_id).eq('event_id', event.id);
        if (r.status === 'sent') sent++; else skipped++;
      } else {
        failed++;
        lastError = r.error || lastError;
      }
    }
    summary.push({ event: event.slug, sent, skipped, failed, error: lastError });
  }

  return NextResponse.json({ ok: true, day, hour: nowHour, events: summary });
}
