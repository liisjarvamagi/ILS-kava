'use client';
// Esinejate haldus: nimi, riik, pilt, biod, sotsiaalmeedia lingid
// ja lugu (fail või platvormi link). Siit tulevad esineja lehe ja
// play nupu andmed.
import { useMemo, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { slugify, revalidatePublic } from './adminShared';

const LINK_KEYS = ['instagram', 'facebook', 'spotify', 'soundcloud', 'youtube', 'website'];
const EMPTY = {
  id: null, name: '', slug: '', country: '', image_url: '',
  bio_et: '', bio_en: '', track_link: '', track_title: '', track_file_url: '',
  links: {}
};

export default function AdminArtists({ data, onChanged }) {
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  function set(patch) { setForm((f) => ({ ...f, ...patch })); }
  function setLink(key, value) {
    setForm((f) => ({ ...f, links: { ...f.links, [key]: value } }));
  }

  function edit(a) {
    setForm({
      id: a.id, name: a.name || '', slug: a.slug || '', country: a.country || '',
      image_url: a.image_url || '', bio_et: a.bio_et || '', bio_en: a.bio_en || '',
      track_link: a.track_link || '', track_title: a.track_title || '',
      track_file_url: a.track_file_url || '',
      links: a.links && typeof a.links === 'object' ? a.links : {}
    });
    setMsg(null);
    window.scrollTo({ top: 0 });
  }

  async function save() {
    if (form.name.trim().length < 2) { setMsg('Nimi on puudu.'); return; }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const links = {};
    for (const k of LINK_KEYS) {
      const v = (form.links[k] || '').trim();
      if (v) links[k] = v;
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      country: form.country.trim() || null,
      image_url: form.image_url.trim() || null,
      bio_et: form.bio_et.trim() || null,
      bio_en: form.bio_en.trim() || null,
      track_link: form.track_link.trim() || null,
      track_title: form.track_title.trim() || null,
      track_file_url: form.track_file_url.trim() || null,
      links
    };
    const q = form.id
      ? supabase.from('artists').update(payload).eq('id', form.id)
      : supabase.from('artists').insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) { setMsg('Salvestus ebaõnnestus: ' + error.message); return; }
    await revalidatePublic();
    await onChanged();
    setMsg('Salvestatud ✅');
    if (!form.id) setForm(EMPTY);
  }

  async function remove(a) {
    if (!window.confirm(`Kustutan esineja "${a.name}"? Ta kaob ka kõigilt esinemistelt.`)) return;
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('artists').delete().eq('id', a.id);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    if (form.id === a.id) setForm(EMPTY);
    await revalidatePublic();
    await onChanged();
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? data.artists.filter((a) => a.name.toLowerCase().includes(q)) : data.artists;
  }, [data, query]);

  return (
    <>
      <section className="admin-card">
        <h2>{form.id ? `Muuda esinejat: ${form.name}` : 'Uus esineja'}</h2>

        <div className="admin-grid">
          <label>Nimi
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </label>
          <label>Riigikood (nt EE, UK)
            <input value={form.country} maxLength={3}
              onChange={(e) => set({ country: e.target.value.toUpperCase() })} />
          </label>
          <label>Slug (aadressi jaoks; tühi = automaatne)
            <input value={form.slug} placeholder={slugify(form.name)}
              onChange={(e) => set({ slug: e.target.value })} />
          </label>
          <label>Pildi aadress (Storage → pildid → Get URL)
            <input value={form.image_url} placeholder="https://…"
              onChange={(e) => set({ image_url: e.target.value })} />
          </label>
        </div>

        <div className="admin-grid">
          <label>Bio (ET)
            <textarea rows={4} value={form.bio_et} onChange={(e) => set({ bio_et: e.target.value })} />
          </label>
          <label>Bio (EN)
            <textarea rows={4} value={form.bio_en} onChange={(e) => set({ bio_en: e.target.value })} />
          </label>
        </div>
        {form.bio_et.trim() && !form.bio_en.trim() && (
          <p className="admin-warn admin-warn-soft">🟡 Ingliskeelne bio puudub</p>
        )}

        <label className="admin-label">Lugu (play nupp esineja lehel)</label>
        <div className="admin-grid">
          <label>Loo link (Spotify / SoundCloud / YouTube)
            <input value={form.track_link} placeholder="https://open.spotify.com/track/…"
              onChange={(e) => set({ track_link: e.target.value })} />
          </label>
          <label>Loo pealkiri (minimängija ribal)
            <input value={form.track_title} onChange={(e) => set({ track_title: e.target.value })} />
          </label>
          <label>Loo mp3 otselink (mängib kohe; kui täidetud, on see esimene valik)
            <input value={form.track_file_url} placeholder="https://…supabase.co/storage/…/lood/…"
              onChange={(e) => set({ track_file_url: e.target.value })} />
          </label>
        </div>

        <label className="admin-label">Sotsiaalmeedia lingid</label>
        <div className="admin-grid">
          {LINK_KEYS.map((k) => (
            <label key={k}>{k}
              <input value={form.links[k] || ''} placeholder="https://…"
                onChange={(e) => setLink(k, e.target.value)} />
            </label>
          ))}
        </div>

        {msg && <p className="admin-msg">{msg}</p>}
        <div className="admin-actions">
          <button className="btn-primary" disabled={busy} onClick={save}>
            {busy ? '…' : 'Salvesta'}
          </button>
          {form.id && (
            <button className="btn-secondary" onClick={() => setForm(EMPTY)}>
              Tühista muutmine
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <h2>Kõik esinejad ({shown.length})</h2>
        <input className="admin-search" placeholder="Otsi…"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="admin-list">
          {shown.map((a) => (
            <div key={a.id} className="admin-row">
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {a.name}{a.country ? ` (${a.country})` : ''}
                  {!a.image_url && <span className="admin-badge admin-badge-warn">pilt puudu</span>}
                  {!a.bio_et && <span className="admin-badge">bio puudu</span>}
                  {(a.track_link || a.track_file_url) && <span className="admin-badge">🎵 lugu</span>}
                </div>
              </div>
              <button className="admin-mini" onClick={() => edit(a)}>Muuda</button>
              <button className="admin-mini admin-mini-danger" onClick={() => remove(a)}>Kustuta</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
