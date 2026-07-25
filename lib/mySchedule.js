'use client';
// Minu kava: telefoni localStorage hoiab esinemiste ID-sid, mitte
// isikuandmeid. Kui kasutaja on sisse logitud, salvestub iga valik
// LISAKS kontosse (user_schedule tabel), nii et kava säilib telefoni
// vahetades. Telefon jääb esmaseks — äpp töötab ka kehva leviga,
// konto sünk käib taustal ja RLS tagab, et igaüks näeb ainult
// enda kava.
import { supabaseBrowser } from './supabaseClient';

const KEY = 'ils_my_schedule_v1';
const NUDGE_KEY = 'ils_login_nudge_seen';

export function getMyIds() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function setMyIds(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

// Taustasünk kontosse: ei blokeeri kasutajat ja vead ei sega äppi
// (järgmine sünk parandab seisu).
async function remoteToggle(id, added) {
  try {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    if (added) {
      await supabase.from('user_schedule')
        .upsert({ user_id: session.user.id, performance_id: id });
    } else {
      await supabase.from('user_schedule')
        .delete()
        .eq('user_id', session.user.id)
        .eq('performance_id', id);
    }
  } catch {}
}

export function toggleMyId(id) {
  const ids = getMyIds();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  setMyIds(next);
  remoteToggle(id, !has); // taustal, kui kasutaja on sisse logitud
  return !has; // true = lisati
}

// Sisselogimisel: liida telefoni ja konto kava (duplikaate ei teki —
// upsert + primaarvõti user_id+performance_id). Tagastab kirjete arvu.
export async function mergeScheduleWithAccount() {
  const supabase = supabaseBrowser();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const local = getMyIds();
  // 1. telefoni valikud kontosse
  if (local.length) {
    await supabase.from('user_schedule').upsert(
      local.map((id) => ({ user_id: session.user.id, performance_id: id }))
    );
  }
  // 2. konto valikud telefoni (nt teisest seadmest lisatud)
  const { data, error } = await supabase.from('user_schedule')
    .select('performance_id')
    .eq('user_id', session.user.id);
  if (!error && data) {
    const merged = [...new Set([...local, ...data.map((r) => r.performance_id)])];
    setMyIds(merged);
    return merged.length;
  }
  return local.length;
}

export function nudgeSeen() {
  return typeof window !== 'undefined' && localStorage.getItem(NUDGE_KEY) === '1';
}
export function markNudgeSeen() {
  localStorage.setItem(NUDGE_KEY, '1');
}
