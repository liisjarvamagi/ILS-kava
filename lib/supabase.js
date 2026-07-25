// Serveripoolne Supabase klient avaliku kava lugemiseks.
// Kasutab AINULT anon-võtit — kirjutamist kaitseb Row Level Security.
import { createClient } from '@supabase/supabase-js';

export function supabaseAvailable() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}
