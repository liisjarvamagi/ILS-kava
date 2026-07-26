'use client';
// Sündmuse üldised seaded: festivali kuupäevad (nende järgi tehakse
// esinemise vormi ja planeerija päevade rippmenüü), kaanefoto ning
// piletite ja kodukorra lingid. Piletite info jm sisu saab lisada
// "Oluline info" kaartidena — lingid tekstis muutuvad äpis ise
// klõpsatavaks.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { uploadToStorage, guardedUpdate, CONFLICT_MSG, festivalDays, fmtDay, revalidatePublic } from './adminShared';
import { markDirty, clearDirty } from './dirty';

export default function AdminEvent({ data, onChanged }) {
  const s = data.settings;
  const [form, setForm] = useState(s ? {
    starts_on: s.starts_on, ends_on: s.ends_on,
    cover_image_url: s.cover_image_url || '',
    tickets_url: s.tickets_url || '',
    rules_url: s.rules_url || '',
    updated_at: s.updated_at || null
  } : null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!form) {
    return (
      <div className="admin-note">
        Sündmuse seadete tabelit pole veel andmebaasis. Käivita Supabase
        SQL Editoris fail supabase/migrations/0011_syndmuse_seaded.sql
        ja tule tagasi.
      </div>
    );
  }

  function set(patch) { markDirty(); setForm((f) => ({ ...f, ...patch })); }

  async function handleCover(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMsg('Kaanefoto peab olema pilt.'); return; }
    if (file.size > 5 * 1024 * 1024) { setMsg('Pilt on liiga suur (üle 5 MB).'); return; }
    setUploading(true); setMsg(null);
    try {
      const url = await uploadToStorage('pildid', file, 'kaanefoto');
      set({ cover_image_url: url });
    } catch (err) {
      setMsg('Üleslaadimine ebaõnnestus: ' + err.message);
    }
    setUploading(false);
  }

  function validUrl(v) {
    return !v || /^https:\/\/.+/.test(v);
  }

  async function save() {
    if (!form.starts_on || !form.ends_on) { setMsg('Mõlemad kuupäevad on vaja.'); return; }
    if (form.ends_on < form.starts_on) { setMsg('Lõpp ei saa olla enne algust.'); return; }
    if (!validUrl(form.tickets_url.trim()) || !validUrl(form.rules_url.trim())) {
      setMsg('Lingid peavad algama https:// — kopeeri aadress brauserist.'); return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const r = await guardedUpdate(supabase, 'event_settings', 1, form.updated_at, {
      starts_on: form.starts_on,
      ends_on: form.ends_on,
      cover_image_url: form.cover_image_url.trim() || null,
      tickets_url: form.tickets_url.trim() || null,
      rules_url: form.rules_url.trim() || null
    });
    setBusy(false);
    if (r.conflict) { setMsg(CONFLICT_MSG); await onChanged(); return; }
    if (r.error) { setMsg('Salvestus ebaõnnestus: ' + r.error); return; }
    setForm((f) => ({ ...f, updated_at: r.stamp }));
    clearDirty();
    await onChanged();
    setMsg('Salvestatud ✅');
  }

  const days = festivalDays({ starts_on: form.starts_on, ends_on: form.ends_on });

  // ── Vana kava arhiveerimine ──
  // Peidab kõik avaldatud esinemised, mille päev on enne praegust
  // festivali algust. Midagi ei kustutata: esinemised, esinejad,
  // pildid ja lood jäävad andmebaasi alles ning vajadusel saab need
  // Esinemised sakis linnukestega uuesti avaldada.
  const oldPublished = data.performances.filter(
    (p) => p.festival_day < form.starts_on && p.is_published
  );

  async function archiveOld() {
    if (!window.confirm(
      `Peidan avalikust äpist ${oldPublished.length} esinemist, mille päev on ` +
      `enne ${fmtDay(form.starts_on)}.${form.starts_on.slice(0, 4)}? Midagi ei ` +
      `kustutata — need jäävad adminisse alles mustanditena.`
    )) return;
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('performances')
      .update({ is_published: false })
      .lt('festival_day', form.starts_on)
      .eq('is_published', true);
    setBusy(false);
    if (error) { setMsg('Arhiveerimine ebaõnnestus: ' + error.message); return; }
    await revalidatePublic();
    await onChanged();
    setMsg(`Arhiveeritud ✅ ${oldPublished.length} esinemist on nüüd peidetud.`);
  }

  return (
    <section className="admin-card">
      <h2>Sündmuse seaded</h2>
      <p className="admin-hint">Festivali kuupäevade järgi tehakse
        esinemise vormi ja planeerija päevade valik. Piletite info,
        kodukorra jm sisu lisad "Oluline info" sakis kaartidena —
        tekstis olevad lingid muutuvad äpis ise klõpsatavaks.</p>

      <div className="admin-grid">
        <label>Festivali algus
          <input type="date" value={form.starts_on}
            onChange={(e) => set({ starts_on: e.target.value })} />
        </label>
        <label>Festivali lõpp (viimane päev)
          <input type="date" value={form.ends_on}
            onChange={(e) => set({ ends_on: e.target.value })} />
        </label>
      </div>
      {days.length > 0 && (
        <p className="admin-hint">Päevi kokku: {days.length} ({fmtDay(days[0])}–{fmtDay(days[days.length - 1])}.{days[0].slice(0, 4)}).
          Öised esinemised kuni kella 06.00-ni kuuluvad eelmise õhtu päeva alla.</p>
      )}

      <label className="admin-label">Kaanefoto (kasutame edaspidi äpi
        avavaates ja jagamispiltidel)</label>
      {form.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={form.cover_image_url} alt="Kaanefoto" className="admin-cover" />
      )}
      <div className="admin-actions">
        <label className="btn-secondary admin-file">
          {uploading ? 'Laen üles…' : '📷 Lae kaanefoto üles'}
          <input type="file" accept="image/*" hidden
            disabled={uploading} onChange={handleCover} />
        </label>
        {form.cover_image_url && (
          <button className="admin-mini" onClick={() => set({ cover_image_url: '' })}>
            Eemalda foto
          </button>
        )}
      </div>

      <div className="admin-grid">
        <label>Piletite lehe link
          <input placeholder="https://…" value={form.tickets_url}
            onChange={(e) => set({ tickets_url: e.target.value })} />
        </label>
        <label>Kodukorra link
          <input placeholder="https://…" value={form.rules_url}
            onChange={(e) => set({ rules_url: e.target.value })} />
        </label>
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      <div className="admin-actions">
        <button className="btn-primary" disabled={busy || uploading} onClick={save}>
          {busy ? '…' : 'Salvesta'}
        </button>
      </div>

      <h2 className="admin-subhead">Vana kava arhiveerimine</h2>
      <p className="admin-hint">Kui festival on läbi ja paned uued
        kuupäevad paika, peida vana aasta kava ühe nupuga. Midagi ei
        kustutata: esinemised jäävad adminisse mustanditena alles ja
        esinejate profiilid (pildid, biod, lood) kehtivad edasi ka uuel
        aastal. Uue aasta jaoks lisa kasvõi üks "TBA" esinemine, siis
        on äpis midagi näha juba piletimüügi ajal.</p>
      {oldPublished.length > 0 ? (
        <div className="admin-actions">
          <button className="btn-secondary" disabled={busy} onClick={archiveOld}>
            🗄 Arhiveeri vana kava ({oldPublished.length} esinemist enne {fmtDay(form.starts_on)})
          </button>
        </div>
      ) : (
        <p className="admin-hint">Praegu pole ühtegi avaldatud esinemist,
          mille päev jääks enne festivali algust — arhiveerida pole midagi.</p>
      )}
    </section>
  );
}
