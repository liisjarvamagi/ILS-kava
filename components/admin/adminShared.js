'use client';
// Adminipaneeli ühised abifunktsioonid: aja teisendused festivali
// loogikaga (öö 00.00–06.00 kuulub eelmise õhtu kavva), slugi
// tegemine ja avaliku kava kohene värskendus.
import { supabaseBrowser } from '../../lib/supabaseClient';

// ISO aeg → { date, time } Eesti ajas (vormide täitmiseks)
export function isoToParts(iso) {
  const d = new Date(iso);
  const s = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Tallinn',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(d);
  const [date, time] = s.split(' ');
  return { date, time };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Festivalipäev + kellaaeg → ISO aeg (+03:00, Eesti suveaeg).
// Kui kell on enne 06.00, on tegu sama ÕHTU ööprogrammiga ehk
// järgmise kalendripäeva varahommikuga.
export function partsToIso(festivalDay, time) {
  const hour = Number(time.split(':')[0]);
  const date = hour < 6 ? addDays(festivalDay, 1) : festivalDay;
  return `${date}T${time}:00+03:00`;
}

// Algus ja lõpp koos: kui lõpp jääb algusest ettepoole või samale
// kohale, käib ta üle südaöö ja nihkub päeva võrra edasi.
export function timesToIso(festivalDay, startTime, endTime) {
  const start_at = partsToIso(festivalDay, startTime);
  let end_at = partsToIso(festivalDay, endTime);
  if (new Date(end_at) <= new Date(start_at)) {
    end_at = addDays(end_at.slice(0, 10), 1) + end_at.slice(10);
  }
  return { start_at, end_at };
}

// Festivalipäevade loend seadete järgi: algus- ja lõpukuupäev (kaasa
// arvatud) → ['2026-07-16', '2026-07-17', …]. Piir 30 päeva hoiab
// vigase sisestuse (nt vale aasta) eest.
export function festivalDays(settings) {
  if (!settings?.starts_on || !settings?.ends_on) return [];
  const days = [];
  let d = settings.starts_on;
  while (d <= settings.ends_on && days.length < 30) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

// Kuupäev kujul pp.kk (nt 2026-07-16 → 16.07)
export function fmtDay(dateStr) {
  if (!dateStr || dateStr.length < 10) return dateStr || '';
  return `${dateStr.slice(8, 10)}.${dateStr.slice(5, 7)}`;
}

export function slugify(name) {
  return (name || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'nimi';
}

// Faili üleslaadimine Supabase Storage'i. Tagastab avaliku URL-i.
// RLS lubab üles laadida ainult adminitel; failinimi tehakse ohutuks
// ja saab juhusliku lõpu, et sama nimega failid ei sõidaks üksteisest üle.
export async function uploadToStorage(bucket, file, baseName) {
  const supabase = supabaseBrowser();
  if (!supabase) throw new Error('Andmebaas seadistamata');
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  const path = `${slugify(baseName || file.name)}-${rand}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Üle kirjutamise kaitse mitme admini jaoks. Vorm jätab rea avamisel
// meelde tema viimase muutmise ajatempli (updated_at). Salvestamisel
// uuendame rida AINULT siis, kui ajatempel on ikka sama — kui teine
// admin jõudis vahepeal sama rida muuta (või selle kustutada), ei
// lähe tema töö kaotsi, vaid salvestaja saab hoiatuse.
export const CONFLICT_MSG = 'Keegi teine muutis (või kustutas) seda kirjet '
  + 'vahepeal. Sinu muudatust EI salvestatud, et tema tööd mitte üle '
  + 'kirjutada. Andmed on nüüd värskendatud — vaata üle ja salvesta uuesti.';

export async function guardedUpdate(supabase, table, id, loadedStamp, payload) {
  let q = supabase.from(table).update(payload).eq('id', id);
  // Kui ajatemplit pole (nt 0010 SQL on tegemata), salvestame vanaviisi
  if (loadedStamp) q = q.eq('updated_at', loadedStamp);
  const { data, error } = await q.select('id, updated_at');
  if (error) return { error: error.message };
  if (!data?.length) return { conflict: true };
  // uus ajatempel tagasi vormile, et järgmine salvestus samast vormist
  // ei annaks valehäiret
  return { ok: true, stamp: data[0].updated_at };
}

// Avaliku kava kohene uuendus: server kontrollib, et kutsuja on admin.
export async function revalidatePublic() {
  try {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
  } catch {}
}

// Lae kõik admini andmed ühe korraga (ka mustandid — RLS lubab
// adminil neid näha, tavakasutajal mitte).
export async function loadAdminData() {
  const supabase = supabaseBrowser();
  if (!supabase) return null;
  const [stages, artists, perfs, tags, info, settings] = await Promise.all([
    supabase.from('stages').select('*').order('sort_order'),
    supabase.from('artists').select('*').order('name'),
    supabase.from('performances')
      .select('*, performance_artists(artist_id, sort_order), performance_tags(tag_id)')
      .order('start_at'),
    supabase.from('tags').select('*').order('name_et'),
    supabase.from('event_info').select('*').order('sort_order'),
    supabase.from('event_settings').select('*').eq('id', 1).maybeSingle()
  ]);
  return {
    stages: stages.data || [],
    artists: artists.data || [],
    performances: perfs.data || [],
    tags: tags.data || [],
    info: info.data || [],
    settings: settings.data || null // null = 0011 SQL veel tegemata
  };
}
