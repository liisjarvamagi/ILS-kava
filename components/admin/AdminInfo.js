'use client';
// "Oluline info" kaartide haldus: kohalejõudmine, parkimine, majutus
// jm, mida näidatakse esinemise lehe all. Ikoon on emoji.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { revalidatePublic } from './adminShared';

const EMPTY = {
  id: null, icon: 'ℹ️', title_et: '', title_en: '',
  body_et: '', body_en: '', sort_order: 0, is_active: true
};

export default function AdminInfo({ data, onChanged }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  function set(patch) { setForm((f) => ({ ...f, ...patch })); }

  function edit(row) {
    setForm({
      id: row.id, icon: row.icon || 'ℹ️',
      title_et: row.title_et || '', title_en: row.title_en || '',
      body_et: row.body_et || '', body_en: row.body_en || '',
      sort_order: row.sort_order ?? 0, is_active: row.is_active ?? true
    });
    setMsg(null);
    window.scrollTo({ top: 0 });
  }

  async function save() {
    if (!form.title_et.trim() || !form.body_et.trim()) {
      setMsg('Pealkiri ja sisu (ET) on kohustuslikud.'); return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const payload = {
      icon: form.icon.trim() || 'ℹ️',
      title_et: form.title_et.trim(),
      title_en: form.title_en.trim() || form.title_et.trim(),
      body_et: form.body_et.trim(),
      body_en: form.body_en.trim() || form.body_et.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active
    };
    const q = form.id
      ? supabase.from('event_info').update(payload).eq('id', form.id)
      : supabase.from('event_info').insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) { setMsg('Salvestus ebaõnnestus: ' + error.message); return; }
    await revalidatePublic();
    await onChanged();
    setMsg('Salvestatud ✅');
    if (!form.id) setForm(EMPTY);
  }

  async function remove(row) {
    if (!window.confirm(`Kustutan infokaardi "${row.title_et}"?`)) return;
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('event_info').delete().eq('id', row.id);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    if (form.id === row.id) setForm(EMPTY);
    await revalidatePublic();
    await onChanged();
  }

  return (
    <>
      <section className="admin-card">
        <h2>{form.id ? `Muuda: ${form.title_et}` : 'Uus infokaart'}</h2>
        <div className="admin-grid">
          <label>Ikoon (emoji)
            <input value={form.icon} maxLength={4} onChange={(e) => set({ icon: e.target.value })} />
          </label>
          <label>Järjekord
            <input type="number" value={form.sort_order}
              onChange={(e) => set({ sort_order: e.target.value })} />
          </label>
          <label>Pealkiri (ET)
            <input value={form.title_et} onChange={(e) => set({ title_et: e.target.value })} />
          </label>
          <label>Pealkiri (EN)
            <input value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} />
          </label>
        </div>
        <div className="admin-grid">
          <label>Sisu (ET)
            <textarea rows={3} value={form.body_et} onChange={(e) => set({ body_et: e.target.value })} />
          </label>
          <label>Sisu (EN)
            <textarea rows={3} value={form.body_en} onChange={(e) => set({ body_en: e.target.value })} />
          </label>
        </div>
        <label className="admin-check">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => set({ is_active: e.target.checked })} />
          Nähtav äpis
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
        <h2>Kõik infokaardid ({data.info.length})</h2>
        <div className="admin-list">
          {data.info.map((row) => (
            <div key={row.id} className="admin-row">
              <span className="admin-row-icon">{row.icon}</span>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {row.title_et}
                  {!row.is_active && <span className="admin-badge">peidetud</span>}
                </div>
                <div className="admin-row-sub">{row.body_et.slice(0, 80)}…</div>
              </div>
              <button className="admin-mini" onClick={() => edit(row)}>Muuda</button>
              <button className="admin-mini admin-mini-danger" onClick={() => remove(row)}>Kustuta</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
