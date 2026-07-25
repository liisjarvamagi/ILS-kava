'use client';
// Meilimallide haldus: hommikukirja pealkiri ja sisu ET/EN keeles.
// Kohatäited: {{nimi}} = saaja nimi, {{kava}} = tema päeva valikud,
// {{loobu_link}} = loobumislink (PEAB mallis alles jääma).
// "Saada testkiri" saadab kirja kohe Sinu enda e-postile.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function AdminEmails() {
  const [tpl, setTpl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.from('email_templates')
        .select('*').eq('key', 'daily_schedule').maybeSingle();
      setTpl(data || false);
    })();
  }, []);

  function set(patch) { setTpl((t) => ({ ...t, ...patch })); }

  async function save() {
    if (!tpl.body_et.includes('{{loobu_link}}') || !tpl.body_en.includes('{{loobu_link}}')) {
      setMsg('Mallis peab olema {{loobu_link}} — ilma selleta ei saa saaja kirjast loobuda.');
      return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('email_templates').update({
      subject_et: tpl.subject_et, subject_en: tpl.subject_en,
      body_et: tpl.body_et, body_en: tpl.body_en
    }).eq('key', 'daily_schedule');
    setBusy(false);
    setMsg(error ? 'Salvestus ebaõnnestus: ' + error.message : 'Salvestatud ✅');
  }

  async function sendTest() {
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/testkiri', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok
      ? `Testkiri saadetud aadressile ${body.to} (päev ${body.day}) ✅ Vaata postkasti (ka rämpsposti).`
      : 'Testkiri ebaõnnestus: ' + (body.error || res.status));
  }

  if (tpl === null) return <div className="admin-note">Laen…</div>;
  if (tpl === false) {
    return (
      <div className="admin-note">
        Meilimalli pole veel andmebaasis. Käivita Supabase SQL Editoris
        fail supabase/migrations/0008_hommikukiri.sql ja tule tagasi.
      </div>
    );
  }

  return (
    <section className="admin-card">
      <h2>Hommikukiri</h2>
      <p className="admin-hint">Kiri läheb igal festivalihommikul kell 09.00
        kasutajatele, kes on profiilis hommikukirja sisse lülitanud ja
        kellel on selle päeva kavas valikuid. Kohatäited: {'{{nimi}}'},
        {' {{kava}}'}, {'{{loobu_link}}'} (viimane on kohustuslik).</p>

      <div className="admin-grid">
        <label>Pealkiri (ET)
          <input value={tpl.subject_et} onChange={(e) => set({ subject_et: e.target.value })} />
        </label>
        <label>Pealkiri (EN)
          <input value={tpl.subject_en} onChange={(e) => set({ subject_en: e.target.value })} />
        </label>
      </div>
      <div className="admin-grid">
        <label>Sisu (ET, HTML)
          <textarea rows={9} value={tpl.body_et} onChange={(e) => set({ body_et: e.target.value })} />
        </label>
        <label>Sisu (EN, HTML)
          <textarea rows={9} value={tpl.body_en} onChange={(e) => set({ body_en: e.target.value })} />
        </label>
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      <div className="admin-actions">
        <button className="btn-primary" disabled={busy} onClick={save}>
          {busy ? '…' : 'Salvesta'}
        </button>
        <button className="btn-secondary" disabled={busy} onClick={sendTest}>
          ✉️ Saada testkiri mulle
        </button>
      </div>
    </section>
  );
}
