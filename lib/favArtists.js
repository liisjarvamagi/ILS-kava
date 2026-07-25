'use client';
// Lemmikesinejad ilma kontota: telefoni localStorage hoiab ainult
// esinejate ID-sid, mitte isikuandmeid — sama põhimõte mis minu kaval.
const KEY = 'ils_fav_artists_v1';

export function getFavArtists() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function toggleFavArtist(id) {
  const ids = getFavArtists();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return !has; // true = lisati
}
