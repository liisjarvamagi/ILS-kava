'use client';
// Kaardid: sündmuse kaardipildid (festivali ala, linnakaart jm).
// Korraldaja laeb pildi üles, paneb pealkirjad ja järjekorra;
// alade punktid klõpsitakse peale Alad sakis. Kustutamisel jäävad
// alad alles, aga nende punkt kaob kaardilt (map_id läheb tühjaks).
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { uploadToStorage, guardedUpdate, CONFLICT_MSG, revalidatePublic } from './adminShared';
import { markDirty, clearDirty, isDirty, DIRTY_MSG } from './dirty';

const EMPTY = { id: null, title_et: '', title_en: '', image_url: '', sort_order: 0 };

export default function AdminMaps({ data, onChanged }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  function set(patch) { markDirty(); setForm((f) => ({ ...f, ...patch })); }

  function edit(m) {
    if (isDirty() && !window.confirm(DIRTY_MSG)) return;
    setForm({
      id: m.id, title_et: m.title_et, title_en: m.title_en,
      image_url: m.image_url, sort_order: m.sort_order ?? 0,
      updated_at: m.updated_at || null
    });
    clearDirty();
    setMsg(null);
    window.scrollTo({ top: 0 });
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMsg('Kaart peab olema pilt (PNG või JPG).'); return; }
    if (file.size > 8 * 1024 * 1024) { setMsg('Pilt on liiga suur (üle 8 MB). Vähenda enne üleslaadimist.'); return; }
    setUploading(true); setMsg(null);
    try {
      const url = await uploadToStorage('pildid', file, form.title_et || 'kaart');
      set({ image_url: url });
    } catch (err) {
      setMsg('Üleslaadimine ebaõnnestus: ' + err.message);
    }
    setUploading(false);
  }

  async function save() {
    if (form.title_et.trim().length < 2) { setMsg('Kaardi pealkiri on puudu.'); return; }
    if (!form.image_url) { setMsg('Lae kaardipilt üles.'); return; }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const payload = {
      event_id: data.eventId,
      title_et: form.title_et.trim(),
      title_en: form.title_en.trim() || form.title_et.trim(),
      image_url: form.image_url,
      sort_order: Number(form.sort_order) || 0
    };
    let errText = null;
    if (form.id) {
      const r = await guardedUpdate(supabase, 'event_maps', form.id, form.updated_at, payload);
      if (r.conflict) { setBusy(false); setMsg(CONFLICT_MSG); await onChanged(); return; }
      errText = r.error || null;
      if (r.ok) set({ updated_at: r.stamp });
    } else {
      const { error } = await supabase.from('event_maps').insert(payload);
      errText = error?.message || null;
    }
    setBusy(false);
    if (errText) { setMsg('Salvestus ebaõnnestus: ' + errText); return; }
    await revalidatePublic();
    await onChanged();
    clearDirty();
    setMsg('Salvestatud ✅');
    if (!form.id) setForm(EMPTY);
  }

  async function remove(m) {
    const pointCount = data.stages.filter((s) => s.map_id === m.id).length;
    const warn = pointCount
      ? ` Sellel kaardil on ${pointCount} ala punkti — alad jäävad alles, aga nende koht kaardil kaob.`
      : '';
    if (!window.confirm(`Kustutan kaardi "${m.title_et}"?${warn}`)) return;
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('event_maps').delete().eq('id', m.id);
    setBusy(false);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    if (form.id === m.id) { clearDirty(); setForm(EMPTY); }
    await revalidatePublic();
    await onChanged();
    setMsg('Kaart kustutatud ✅');
  }

  return (
    <>
      <section className="admin-card">
        <h2>{form.id ? `Muuda kaarti: ${form.title_et}` : 'Uus kaart'}</h2>
        <p className="admin-hint">Kaardid on äpi Kaart ja info lehe
          vahelehed. Esimene kaart (väikseima järjekorranumbriga) on
          põhikaart. Pärast üleslaadimist klõpsi alade punktid peale
          Alad sakis.</p>
        <div className="admin-grid">
          <label>Pealkiri (ET)
            <input value={form.title_et} onChange={(e) => set({ title_et: e.target.value })} />
          </label>
          <label>Pealkiri (EN)
            <input value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} />
          </label>
          <label>Järjekord (väiksem = eespool)
            <input type="number" value={form.sort_order}
              onChange={(e) => set({ sort_order: e.target.value })} />
          </label>
        </div>

        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="Kaart" className="admin-cover" />
        )}
        <div className="admin-actions">
          <label className="btn-secondary admin-file">
            {uploading ? 'Laen üles…' : '🗺 Lae kaardipilt üles'}
            <input type="file" accept="image/*" hidden
              disabled={uploading} onChange={handleUpload} />
          </label>
        </div>

        {msg && <p className="admin-msg">{msg}</p>}
        <div className="admin-actions">
          <button className="btn-primary" disabled={busy || uploading} onClick={save}>
            {busy ? '…' : 'Salvesta'}
          </button>
          {form.id && (
            <button className="btn-secondary" onClick={() => { clearDirty(); setForm(EMPTY); }}>
              Tühista muutmine
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <h2>Kõik kaardid ({data.maps.length})</h2>
        <div className="admin-list">
          {data.maps.map((m) => (
            <div key={m.id} className="admin-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image_url} alt="" className="admin-thumb" />
              <div className="admin-row-main">
                <div className="admin-row-title">{m.title_et}</div>
                <div className="admin-hint">
                  punkte: {data.stages.filter((s) => s.map_id === m.id).length}
                </div>
              </div>
              <button className="admin-mini" onClick={() => edit(m)}>Muuda</button>
              <button className="admin-mini" onClick={() => remove(m)}>Kustuta</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
