'use client';
// Esinejate haldus: nimi, riik, pilt, biod, sotsiaalmeedia lingid
// ja lugu (fail või platvormi link). Siit tulevad esineja lehe ja
// play nupu andmed.
import { useMemo, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { slugify, revalidatePublic, uploadToStorage, guardedUpdate, CONFLICT_MSG } from './adminShared';

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
  const [uploading, setUploading] = useState(null); // 'pilt' | 'lugu' | null
  const [msg, setMsg] = useState(null);
  const [mergeTarget, setMergeTarget] = useState('');

  function set(patch) { setForm((f) => ({ ...f, ...patch })); }
  function setLink(key, value) {
    setForm((f) => ({ ...f, links: { ...f.links, [key]: value } }));
  }

  // Pildi/loo üleslaadimine: fail läheb Supabase Storage'i ja URL
  // täitub automaatselt. Suuruse ja tüübi kontroll enne saatmist.
  async function handleUpload(e, kind) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (kind === 'pilt') {
      if (!file.type.startsWith('image/')) { setMsg('Vali pildifail (jpg, png, webp).'); return; }
      if (file.size > 5 * 1024 * 1024) { setMsg('Pilt on liiga suur (max 5 MB).'); return; }
    } else {
      if (!file.type.startsWith('audio/')) { setMsg('Vali helifail (mp3).'); return; }
      if (file.size > 20 * 1024 * 1024) { setMsg('Lugu on liiga suur (max 20 MB).'); return; }
    }
    setUploading(kind); setMsg(null);
    try {
      const url = await uploadToStorage(
        kind === 'pilt' ? 'pildid' : 'lood',
        file,
        form.name || 'esineja'
      );
      if (kind === 'pilt') set({ image_url: url });
      else set({ track_file_url: url });
      setMsg('Fail üles laetud ✅ (ära unusta Salvesta nuppu)');
    } catch (err) {
      setMsg('Üleslaadimine ebaõnnestus: ' + (err?.message || 'tundmatu viga') +
        '. Kontrolli, et 0007 migratsioon on käivitatud.');
    }
    setUploading(null);
  }

  function edit(a) {
    setForm({
      id: a.id, name: a.name || '', slug: a.slug || '', country: a.country || '',
      image_url: a.image_url || '', bio_et: a.bio_et || '', bio_en: a.bio_en || '',
      track_link: a.track_link || '', track_title: a.track_title || '',
      track_file_url: a.track_file_url || '',
      links: a.links && typeof a.links === 'object' ? a.links : {},
      updated_at: a.updated_at || null // üle kirjutamise kaitse
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
    let error = null;
    if (form.id) {
      const r = await guardedUpdate(supabase, 'artists', form.id, form.updated_at, payload);
      if (r.conflict) {
        setBusy(false);
        setMsg(CONFLICT_MSG);
        await onChanged();
        return;
      }
      error = r.error || null;
      if (r.ok) setForm((f) => ({ ...f, updated_at: r.stamp }));
    } else {
      ({ error } = await supabase.from('artists').insert(payload));
      error = error?.message || null;
    }
    setBusy(false);
    if (error) { setMsg('Salvestus ebaõnnestus: ' + error); return; }
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

  // Duplikaadi liitmine: praeguse esineja (nt trükiveaga tekkinud)
  // esinemised tõstetakse õigele esinejale, tühjad väljad täidetakse
  // ja duplikaat kustutatakse.
  async function mergeInto() {
    const target = data.artists.find((a) => a.id === mergeTarget);
    if (!form.id || !target || target.id === form.id) return;
    if (!window.confirm(
      `Liidan esineja "${form.name}" esinejaga "${target.name}"?\n` +
      `Kõik esinemised tõstetakse üle ja "${form.name}" kustutatakse. Seda ei saa tagasi võtta.`
    )) return;
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();

    // 1. esinemised üle: kui sihtesineja on juba samal esinemisel,
    // kustutame duplikaadi seose; muidu tõstame ümber
    const { data: links } = await supabase.from('performance_artists')
      .select('performance_id, sort_order').eq('artist_id', form.id);
    for (const l of links || []) {
      const { error } = await supabase.from('performance_artists')
        .update({ artist_id: target.id })
        .eq('artist_id', form.id).eq('performance_id', l.performance_id);
      if (error) {
        await supabase.from('performance_artists').delete()
          .eq('artist_id', form.id).eq('performance_id', l.performance_id);
      }
    }
    // 2. täida sihtesineja tühjad väljad duplikaadi omadega
    const patch = {};
    for (const k of ['country', 'image_url', 'bio_et', 'bio_en', 'track_link', 'track_title', 'track_file_url']) {
      if (!target[k] && form[k]) patch[k] = form[k];
    }
    const mergedLinks = { ...(form.links || {}), ...(target.links || {}) };
    if (Object.keys(mergedLinks).length) patch.links = mergedLinks;
    if (Object.keys(patch).length) {
      await supabase.from('artists').update(patch).eq('id', target.id);
    }
    // 3. kustuta duplikaat
    const { error: delErr } = await supabase.from('artists').delete().eq('id', form.id);
    setBusy(false);
    if (delErr) { setMsg('Liitmine jäi pooleli: ' + delErr.message); return; }
    setForm(EMPTY); setMergeTarget('');
    await revalidatePublic();
    await onChanged();
    setMsg(`Liidetud: ${target.name} ✅`);
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
          <label>Pilt — lae fail üles või kleebi aadress
            <input value={form.image_url} placeholder="https://…"
              onChange={(e) => set({ image_url: e.target.value })} />
          </label>
        </div>
        <div className="admin-actions">
          <label className="btn-secondary admin-file">
            {uploading === 'pilt' ? 'Laen üles…' : '📷 Lae pilt üles'}
            <input type="file" accept="image/*" hidden
              disabled={uploading !== null}
              onChange={(e) => handleUpload(e, 'pilt')} />
          </label>
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="" className="admin-thumb" />
          )}
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
          <label>Loo mp3 fail (mängib kohe; kui täidetud, on see esimene valik)
            <input value={form.track_file_url} placeholder="https://…"
              onChange={(e) => set({ track_file_url: e.target.value })} />
          </label>
        </div>
        <div className="admin-actions">
          <label className="btn-secondary admin-file">
            {uploading === 'lugu' ? 'Laen üles…' : '🎵 Lae mp3 üles'}
            <input type="file" accept="audio/*" hidden
              disabled={uploading !== null}
              onChange={(e) => handleUpload(e, 'lugu')} />
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

        {form.id && (
          <>
            <label className="admin-label">Kas see on duplikaat (nt trükiveaga
              tekkinud)? Vali õige esineja ja liida — esinemised tõstetakse
              üle ja see kirje kustutatakse.</label>
            <div className="admin-grid">
              <label>Liida esinejaga
                <select value={mergeTarget} onChange={(e) => setMergeTarget(e.target.value)}>
                  <option value="">— vali —</option>
                  {data.artists.filter((a) => a.id !== form.id).map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-actions">
              <button className="btn-secondary" disabled={busy || !mergeTarget} onClick={mergeInto}>
                ⇄ Liida ja kustuta duplikaat
              </button>
            </div>
          </>
        )}
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
