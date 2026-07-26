'use client';
// Meilimallide haldus: hommikukirja pealkiri ja sisu ET/EN keeles.
// Kohatäited: {{nimi}} = saaja nimi, {{kava}} = tema päeva valikud,
// {{loobu_link}} = loobumislink (PEAB mallis alles jääma).
// "Saada testkiri" saadab kirja kohe Sinu enda e-postile.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import TolkeNupp from './TolkeNupp';
import { markDirty, clearDirty } from './dirty';

export default function AdminEmails({ eventId }) {
  const [tpl, setTpl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [testTo, setTestTo] = useState(''); // tühi = enda aadress

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.from('email_templates')
        .select('*').eq('event_id', eventId)
        .eq('key', 'daily_schedule').maybeSingle();
      setTpl(data || false);
    })();
  }, [eventId]);

  function set(patch) { markDirty(); setTpl((t) => ({ ...t, ...patch })); }

  async function save() {
    if (!tpl.body_et.includes('{{loobu_link}}') || !tpl.body_en.includes('{{loobu_link}}')) {
      setMsg('Mallis peab olema {{loobu_link}} — ilma selleta ei saa saaja kirjast loobuda.');
      return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    // Üle kirjutamise kaitse: kui teine admin muutis malli vahepeal,
    // ei kirjuta me tema tööd üle
    let q = supabase.from('email_templates').update({
      subject_et: tpl.subject_et, subject_en: tpl.subject_en,
      body_et: tpl.body_et, body_en: tpl.body_en,
      send_hour: Number(tpl.send_hour ?? 9)
    }).eq('event_id', eventId).eq('key', 'daily_schedule');
    if (tpl.updated_at) q = q.eq('updated_at', tpl.updated_at);
    const { data, error } = await q.select('updated_at');
    setBusy(false);
    if (error) { setMsg('Salvestus ebaõnnestus: ' + error.message); return; }
    if (!data?.length) {
      setMsg('Keegi teine muutis meilimalli vahepeal. Sinu muudatust EI '
        + 'salvestatud — lae leht uuesti ja vaata tema versioon üle.');
      return;
    }
    setTpl((t) => ({ ...t, updated_at: data[0].updated_at }));
    clearDirty();
    setMsg('Salvestatud ✅');
  }

  async function sendTest() {
    const to = testTo.trim();
    if (to && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setMsg('Testkirja aadress ei näe õige välja: ' + to);
      return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/testkiri', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to: to || null, event_id: eventId })
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
      <p className="admin-hint">Kiri läheb igal festivalihommikul
        kasutajatele, kes on profiilis hommikukirja sisse lülitanud ja
        kellel on selle päeva kavas valikuid. Allpool valid vaikimisi
        kellaaja; iga kasutaja võib profiilis endale teise aja valida.
        Kohatäited: {'{{nimi}}'},
        {' {{kava}}'}, {'{{loobu_link}}'} (viimane on kohustuslik).</p>

      <div className="admin-grid">
        <label>Saatmise kellaaeg (vaikimisi, Eesti aeg)
          <select value={tpl.send_hour ?? 9}
            onChange={(e) => set({ send_hour: Number(e.target.value) })}>
            {[6, 7, 8, 9, 10, 11, 12, 13, 14].map((h) => (
              <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
            ))}
          </select>
        </label>
      </div>

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
          <TolkeNupp text={tpl.body_en} from="en" onDone={(t) => set({ body_et: t })} />
        </label>
        <label>Sisu (EN, HTML)
          <textarea rows={9} value={tpl.body_en} onChange={(e) => set({ body_en: e.target.value })} />
          <TolkeNupp text={tpl.body_et} from="et" onDone={(t) => set({ body_en: t })} />
        </label>
      </div>

      <div className="admin-grid">
        <label>Testkirja aadress (tühi = Su enda sisselogimisaadress).
          NB! Resendi tasuta konto saadab enne domeeni kinnitamist
          ainult Resendi konto enda aadressile.
          <input type="email" value={testTo} placeholder="nimi@näide.ee"
            onChange={(e) => setTestTo(e.target.value)} />
        </label>
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      <div className="admin-actions">
        <button className="btn-primary" disabled={busy} onClick={save}>
          {busy ? '…' : 'Salvesta'}
        </button>
        <button className="btn-secondary" disabled={busy} onClick={sendTest}>
          ✉️ Saada testkiri
        </button>
      </div>
    </section>
  );
}
