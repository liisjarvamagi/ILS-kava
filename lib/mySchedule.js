'use client';
// Minu kava ilma kontota: telefoni localStorage hoiab ainult esinemiste ID-sid,
// mitte mingeid isikuandmeid. Sisselogimise tükis (5. tükk) tõstetakse
// need ID-d kasutaja kontosse.
const KEY = 'ils_my_schedule_v1';
const NUDGE_KEY = 'ils_login_nudge_seen';

export function getMyIds() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function toggleMyId(id) {
  const ids = getMyIds();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return !has; // true = lisati
}

export function nudgeSeen() {
  return typeof window !== 'undefined' && localStorage.getItem(NUDGE_KEY) === '1';
}
export function markNudgeSeen() {
  localStorage.setItem(NUDGE_KEY, '1');
}
