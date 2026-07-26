// Hommikukirja serveripoolne loogika: kasutatakse AINULT route
// handlerites (cron ja testkiri). Service role võti EI jõua kunagi
// kliendini — teda loetakse siin process.env kaudu serveris.
// Loobumislink on allkirjastatud (HMAC + aegumisaeg), nii et seda
// ei saa võltsida ega teiste kasutajate jaoks ära arvata.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Loobumislingi allkiri ──
function secret() {
  return process.env.CRON_SECRET || '';
}

export function signUnsubscribe(userId, expiresMs) {
  const payload = `${userId}.${expiresMs}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyUnsubscribe(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  const [userId, expStr, sig] = parts;
  if (!/^[0-9a-f-]{30,40}$/i.test(userId)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null; // aegunud
  const expected = createHmac('sha256', secret())
    .update(`${userId}.${expStr}`).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

// ── Tänane festivalipäev (öö 00–06 kuulub eelmise õhtu alla) ──
export function todayTallinn() {
  const shifted = new Date(Date.now() - 6 * 60 * 60 * 1000);
  return shifted.toLocaleDateString('sv-SE', { timeZone: 'Europe/Tallinn' });
}

function fmtTimeTallinn(iso) {
  return new Date(iso).toLocaleTimeString('et-EE', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tallinn'
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Kasutaja päeva kava HTML-ina. Kõik andmebaasist tulevad tekstid
// puhastatakse enne HTML-i panekut.
export function renderKavaHtml(perfs, stagesById, locale) {
  if (!perfs.length) {
    return locale === 'en'
      ? '<p><i>(You have no picks for today yet.)</i></p>'
      : '<p><i>(Su kavas pole täna veel midagi.)</i></p>';
  }
  const rows = perfs
    .slice()
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
    .map((p) => {
      const s = stagesById[p.stage_id];
      const stageName = s ? (locale === 'en' ? s.name_en : s.name_et) : '';
      const names = (p.performance_artists || [])
        .slice().sort((x, y) => x.sort_order - y.sort_order)
        .map((pa) => pa.artists?.name).filter(Boolean).join(', ');
      const title = (locale === 'en' ? (p.title_en || p.title_et) : (p.title_et || p.title_en)) || names || '—';
      return `<li><b>${fmtTimeTallinn(p.start_at)}–${fmtTimeTallinn(p.end_at)}</b> · ${escapeHtml(stageName)} — ${escapeHtml(title)}</li>`;
    })
    .join('\n');
  return `<ul style="padding-left:18px;line-height:1.7">${rows}</ul>`;
}

export function renderTemplate(tpl, locale, vars) {
  let subject = locale === 'en' ? tpl.subject_en : tpl.subject_et;
  let body = locale === 'en' ? tpl.body_en : tpl.body_et;
  for (const [k, v] of Object.entries(vars)) {
    // {{nimi}} ja {{loobu_link}} puhastatakse; {{kava}} on meie enda
    // genereeritud ja juba puhastatud HTML
    const safe = k === 'kava' ? v : escapeHtml(v);
    subject = subject.split(`{{${k}}}`).join(k === 'kava' ? '' : safe);
    body = body.split(`{{${k}}}`).join(safe);
  }
  return { subject, body };
}

// Praegune täistund Tallinna aja järgi (0–23)
export function hourTallinn() {
  return Number(new Date().toLocaleString('en-GB', {
    hour: '2-digit', hour12: false, timeZone: 'Europe/Tallinn'
  }));
}

// Kas sellele kasutajale on praegu aeg kiri saata? Puhas funktsioon,
// et loogikat saaks eraldi testida.
export function dueNow(userHour, defaultHour, lastSent, nowHour, today) {
  const hour = userHour ?? defaultHour;
  if (nowHour < hour) return false;        // tema kellaaeg pole veel käes
  if (lastSent === today) return false;    // tänane kiri on juba läinud
  return true;
}

// Saatmine Resendiga. Tagastab { ok, error } — error on Resendi enda
// selgitus (nt "domeen kinnitamata"), et admin näeks täpset põhjust.
export async function sendEmail(to, subject, html) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY puudub');
  const from = process.env.EMAIL_FROM || 'I Land Sound <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });
  if (res.ok) return { ok: true };
  let detail = `Resend vastas ${res.status}`;
  try {
    const body = await res.json();
    if (body?.message) detail += `: ${body.message}`;
  } catch { /* vastus polnud JSON */ }
  return { ok: false, error: detail };
}

// Ühe kasutaja kirja kokkupanek + saatmine.
// Tagastab { status: 'sent' | 'skip' | 'fail', error? }.
export async function sendDailyTo(supabase, user, day, appUrl, options = {}) {
  const { data: perfs } = await supabase
    .from('performances')
    .select(`id, stage_id, start_at, end_at, title_et, title_en,
      performance_artists ( sort_order, artists ( name ) )`)
    .eq('festival_day', day)
    .eq('is_published', true);
  const { data: stages } = await supabase.from('stages').select('id, name_et, name_en');
  const stagesById = Object.fromEntries((stages || []).map((s) => [s.id, s]));

  const { data: mine } = await supabase
    .from('user_schedule')
    .select('performance_id')
    .eq('user_id', user.id);
  const mineIds = new Set((mine || []).map((r) => r.performance_id));
  const myPerfs = (perfs || []).filter((p) => mineIds.has(p.id));

  if (!myPerfs.length && !options.sendEmpty) return { status: 'skip' };

  const { data: tpl } = await supabase
    .from('email_templates').select('*').eq('key', 'daily_schedule').single();
  if (!tpl) return { status: 'fail', error: 'Meilimall puudub (0008 SQL tegemata?)' };

  const locale = user.locale === 'en' ? 'en' : 'et';
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // link kehtib 7 päeva
  const loobuLink = `${appUrl}/api/loobu?token=${signUnsubscribe(user.id, expires)}`;
  const nimi = (user.email || '').split('@')[0];
  const kava = renderKavaHtml(myPerfs, stagesById, locale);
  const { subject, body } = renderTemplate(tpl, locale, {
    nimi, kava, loobu_link: loobuLink
  });
  const sent = await sendEmail(user.email, subject, body);
  return sent.ok
    ? { status: 'sent' }
    : { status: 'fail', error: sent.error };
}
