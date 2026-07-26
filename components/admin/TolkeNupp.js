'use client';
// Väike tõlkenupp kakskeelsete väljade juurde: võtab teise keele
// välja teksti, laseb Claude'il tõlkida ja täidab välja. Tulemust
// saab pärast vabalt käsitsi muuta — tõlge on mustand, mitte lukk.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function TolkeNupp({ text, from, onDone }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const label = from === 'et' ? 'Tõlgi eesti keelest' : 'Tõlgi inglise keelest';

  async function run() {
    if (!text?.trim()) { setErr('Teise keele väli on tühi — pole, millest tõlkida.'); return; }
    setBusy(true); setErr(null);
    try {
      const supabase = supabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/tolgi', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, from })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `viga ${res.status}`);
      onDone(body.text);
    } catch (e) {
      setErr('Tõlge ebaõnnestus: ' + e.message);
    }
    setBusy(false);
  }

  return (
    <span className="tolke">
      <button type="button" className="admin-mini" disabled={busy} onClick={run}>
        {busy ? '… tõlgin' : `🌐 ${label}`}
      </button>
      {err && <span className="tolke-err">{err}</span>}
    </span>
  );
}
