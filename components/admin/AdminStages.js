'use client';
// Alade haldus: nimed, kirjeldused, värv, järjekord, GPS-koordinaadid
// (kaardi ja juhiste jaoks) ja aktiivsuse lüliti.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { slugify, revalidatePublic } from './adminShared';

const EMPTY = {
  id: null, slug: '', name_et: '', name_en: '', descr_et: '', descr_en: '',
  color: '#7aab9a', sort_order: 0, lat: '', lng: '', is_active: true
};

export default function AdminStages({ data, onChanged }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  function set(patch) { setForm((f) => ({ ...f, ...patch })); }

  function edit(s) {
    setForm({
      id: s.id, slug: s.slug || '', name_et: s.name_et || '', name_en: s.name_en || '',
      descr_et: s.descr_et || '', descr_en: s.descr_en || '',
      color: s.color || '#7aab9a', sort_order: s.sort_order ?? 0,
      lat: s.lat ?? '', lng: s.lng ?? '', is_active: s.is_active
    });
    setMsg(null);
    window.scrollTo({ top: 0 });
  }

  async function save() {
    if (form.name_et.trim().length < 2) { setMsg('Ala nimi on puudu.'); return; }
    const lat = form.lat === '' ? null : Number(form.lat);
    const lng = form.lng === '' ? null : Number(form.lng);
    if ((lat === null) !== (lng === null)) {
      setMsg('Koordinaate on vaja mõlemat (lat JA lng) või mitte kumbagi.'); return;
    }
    if (lat !== null && (!Number.isFinite(lat) || !Number.isFinite(lng))) {
      setMsg('Koordinaadid peavad olema numbrid, nt 58.5644 ja 23.0866.'); return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const payload = {
      slug: form.slug.trim() || slugify(form.name_et),
      name_et: form.name_et.trim(),
      name_en: form.name_en.trim() || form.name_et.trim(),
      descr_et: form.descr_et.trim() || null,
      descr_en: form.descr_en.trim() || null,
      color: form.color,
      sort_order: Number(form.sort_order) || 0,
      lat, lng,
      is_active: form.is_active
    };
    const q = form.id
      ? supabase.from('stages').update(payload).eq('id', form.id)
      : supabase.from('stages').insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) { setMsg('Salvestus ebaõnnestus: ' + error.message); return; }
    await revalidatePublic();
    await onChanged();
    setMsg('Salvestatud ✅');
    if (!form.id) setForm(EMPTY);
  }

  return (
    <>
      <section className="admin-card">
        <h2>{form.id ? `Muuda ala: ${form.name_et}` : 'Uus ala'}</h2>
        <div className="admin-grid">
          <label>Nimi (ET)
            <input value={form.name_et} onChange={(e) => set({ name_et: e.target.value })} />
          </label>
          <label>Nimi (EN)
            <input value={form.name_en} onChange={(e) => set({ name_en: e.target.value })} />
          </label>
          <label>Värv kavas
            <input type="color" value={form.color} onChange={(e) => set({ color: e.target.value })} />
          </label>
          <label>Järjekord (väiksem = eespool)
            <input type="number" value={form.sort_order}
              onChange={(e) => set({ sort_order: e.target.value })} />
          </label>
        </div>
        <div className="admin-grid">
          <label>Kirjeldus (ET)
            <textarea rows={3} value={form.descr_et} onChange={(e) => set({ descr_et: e.target.value })} />
          </label>
          <label>Kirjeldus (EN)
            <textarea rows={3} value={form.descr_en} onChange={(e) => set({ descr_en: e.target.value })} />
          </label>
        </div>
        <label className="admin-label">GPS-koordinaadid (kaart ja "Ava juhised" nupp).
          Google Mapsis vajuta punktil pikalt ja kopeeri kaks numbrit.</label>
        <div className="admin-grid">
          <label>Laiuskraad (lat), nt 58.5644
            <input value={form.lat} onChange={(e) => set({ lat: e.target.value })} />
          </label>
          <label>Pikkuskraad (lng), nt 23.0866
            <input value={form.lng} onChange={(e) => set({ lng: e.target.value })} />
          </label>
        </div>
        <label className="admin-check">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => set({ is_active: e.target.checked })} />
          Aktiivne (linnukeseta ala avalikus kavas ei näidata)
        </label>

        {msg && <p className="admin-msg">{msg}</p>}
        <div className="admin-actions">
          <button className="btn-primary" disabled={busy} onClick={save}>
            {busy ? '…' : 'Salvesta'}
          </button>
          {form.id && (
            <button className="btn-secondary" onClick={() => setForm(EMPTY)}>Tühista muutmine</button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <h2>Kõik alad ({data.stages.length})</h2>
        <div className="admin-list">
          {data.stages.map((s) => (
            <div key={s.id} className="admin-row">
              <span className="stage-dot" style={{ background: s.color }} />
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {s.name_et}
                  {!s.is_active && <span className="admin-badge">peidetud</span>}
                  {(s.lat == null || s.lng == null) && (
                    <span className="admin-badge admin-badge-warn">koordinaadid puudu</span>
                  )}
                </div>
              </div>
              <button className="admin-mini" onClick={() => edit(s)}>Muuda</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
