'use client';
// Lemmikesinejad: telefoni localStorage hoiab esinejate ID-sid.
// Kui kasutaja on sisse logitud, salvestub iga süda LISAKS kontosse
// (user_fav_artists tabel) ja liigub seadmete vahel kaasa — sama
// põhimõte mis minu kaval. RLS tagab, et igaüks näeb ainult enda
// lemmikuid.
import { supabaseBrowser } from './supabaseClient';

const KEY = 'ils_fav_artists_v1';

export function getFavArtists() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function setFavArtists(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

// Taustasünk kontosse: ei blokeeri kasutajat, vead ei sega äppi.
async function remoteToggle(id, added) {
  try {
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    if (added) {
      await supabase.from('user_fav_artists')
        .upsert({ user_id: session.user.id, artist_id: id });
    } else {
      await supabase.from('user_fav_artists')
        .delete()
        .eq('user_id', session.user.id)
        .eq('artist_id', id);
    }
  } catch {}
}

export function toggleFavArtist(id) {
  const ids = getFavArtists();
  const has = ids.includes(id);
  const next = has ? ids.filter((x) => x !== id) : [...ids, id];
  setFavArtists(next);
  remoteToggle(id, !has);
  return !has; // true = lisati
}

// Sisselogimisel: liida telefoni ja konto lemmikud (duplikaate ei
// teki — primaarvõti user_id+artist_id).
export async function mergeFavsWithAccount() {
  const supabase = supabaseBrowser();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const local = getFavArtists();
  if (local.length) {
    await supabase.from('user_fav_artists').upsert(
      local.map((id) => ({ user_id: session.user.id, artist_id: id }))
    );
  }
  const { data, error } = await supabase.from('user_fav_artists')
    .select('artist_id')
    .eq('user_id', session.user.id);
  if (!error && data) {
    const merged = [...new Set([...local, ...data.map((r) => r.artist_id)])];
    setFavArtists(merged);
    return merged.length;
  }
  return local.length;
}
