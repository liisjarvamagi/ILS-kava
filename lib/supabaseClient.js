'use client';
// Brauseripoolne Supabase klient sisselogimise ja kasutaja enda
// andmete (profiil, minu kava) jaoks. Kasutab AINULT avalikku
// anon-võtit — kasutaja andmeid kaitseb andmebaasis Row Level
// Security, mis lubab igaühel näha ja muuta ainult enda ridu.
// Sessiooni hoiab Supabase klient seadmes ja uuendab ise.
import { createClient } from '@supabase/supabase-js';

let client = null;

export function supabaseBrowser() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null; // keskkond seadistamata → sisselogimist pole
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // Google'i ja meililingi tagasitulek
      flowType: 'pkce'
    }
  });
  return client;
}
