'use client';
// Sündmuse seaded: nimi, kuupäevad, kaanefoto, lingid ja
// avalikustamise lüliti. Platvormi otsuseid (kas sündmus on
// aktiivne, mis pakett) siin muuta ei saa — neid haldab platvormi
// omanik ja andmebaasi trigger keelab need igaks juhuks ka otse.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { uploadToStorage, guardedUpdate, CONFLICT_MSG, festivalDays, fmtDay, revalidatePublic } from './adminShared';
import { markDirty, clearDirty } from './dirty';

export default function AdminEvent({ data, onChanged }) {
  const ev = data.event;
  const [form, setForm] = useState({
    name: ev.name, starts_on: ev.starts_on, ends_on: ev.ends_on,
    cover_image_url: ev.cover_image_url || '',
    tickets_url: ev.tickets_url || '',
    rules_url: ev.rules_url || '',
    is_public: ev.is_public,
    updated_at: ev.updated_at || null
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

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
    if (form.name.trim().length < 2) { setMsg('Sündmuse nimi on puudu.'); return; }
    if (!form.starts_on || !form.ends_on) { setMsg('Mõlemad kuupäevad on vaja.'); return; }
    if (form.ends_on < form.starts_on) { setMsg('Lõpp ei saa olla enne algust.'); return; }
    if (!validUrl(form.tickets_url.trim()) || !validUrl(form.rules_url.trim())) {
      setMsg('Lingid peavad algama https:// — kopeeri aadress brauserist.'); return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const r = await guardedUpdate(supabase, 'events', ev.id, form.updated_at, {
      name: form.name.trim(),
      starts_on: form.starts_on,
      ends_on: form.ends_on,
      cover_image_url: form.cover_image_url.trim() || null,
      tickets_url: form.tickets_url.trim() || null,
      rules_url: form.rules_url.trim() || null,
      is_public: form.is_public
    });
    setBusy(false);
    if (r.conflict) { setMsg(CONFLICT_MSG); await onChanged(); return; }
    if (r.error) { setMsg('Salvestus ebaõnnestus: ' + r.error); return; }
    setForm((f) => ({ ...f, updated_at: r.stamp }));
    clearDirty();
    await revalidatePublic();
    await onChanged();
    setMsg('Salvestatud ✅');
  }

  const days = festivalDays({ starts_on: form.starts_on, ends_on: form.ends_on });

  // ── Vana kava arhiveerimine ──
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
      .eq('event_id', ev.id)
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
      <p className="admin-hint">Aadress: /{ev.slug} · pakett: {ev.plan}
        {' · '}platvormi olek: {ev.is_active ? 'aktiivne' : 'välja lülitatud (aktiveerib platvormi omanik)'}</p>

      <div className="admin-grid">
        <label>Sündmuse nimi
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </label>
        <label className="admin-check admin-check-block">
          <input type="checkbox" checked={form.is_public}
            onChange={(e) => set({ is_public: e.target.checked })} />
          Avalik (näha avastamisvaates ja oma aadressil; päriselt läheb
          sündmus välja siis, kui ka platvormi omanik on ta sisse lülitanud)
        </label>
      </div>

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

      <label className="admin-label">Kaanefoto (avastamisvaate kaart ja
        jagamispildid)</label>
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
        aastal.</p>
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
