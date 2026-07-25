'use client';
// Esinemiste haldus: nimekiri päevade kaupa + vorm ühel ekraanil.
// Vormis: ala, festivalipäev, ajad (öö 00–06 kuulub eelmise õhtu
// alla), ET/EN pealkirjad ja kirjeldused, esinejate mitmikvalik
// otsinguga (uue esineja loomine samast kohast), tagid, taust-
// programmi ja mustandi lülitid. Kattuvuse hoiatus samal alal ja
// puuduva tõlke kollane märgis. Iga salvestus värskendab avalikku
// kava kohe.
import { useMemo, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { isoToParts, timesToIso, slugify, revalidatePublic } from './adminShared';

const EMPTY = {
  id: null, stage_id: '', festival_day: '2026-07-16',
  startTime: '18:00', endTime: '20:00',
  title_et: '', title_en: '', descr_et: '', descr_en: '',
  is_background: false, is_published: true
};

export default function AdminPerformances({ data, onChanged }) {
  const [form, setForm] = useState({ ...EMPTY, stage_id: data.stages[0]?.id || '' });
  const [artistIds, setArtistIds] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [artistQuery, setArtistQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [listDay, setListDay] = useState('all');

  const stageById = useMemo(() => Object.fromEntries(data.stages.map((s) => [s.id, s])), [data]);
  const artistById = useMemo(() => Object.fromEntries(data.artists.map((a) => [a.id, a])), [data]);
  const days = useMemo(
    () => [...new Set(data.performances.map((p) => p.festival_day))].sort(),
    [data]
  );

  function set(patch) { setForm((f) => ({ ...f, ...patch })); }

  function edit(p) {
    const s = isoToParts(p.start_at);
    const e = isoToParts(p.end_at);
    setForm({
      id: p.id, stage_id: p.stage_id, festival_day: p.festival_day,
      startTime: s.time, endTime: e.time,
      title_et: p.title_et || '', title_en: p.title_en || '',
      descr_et: p.descr_et || '', descr_en: p.descr_en || '',
      is_background: p.is_background, is_published: p.is_published
    });
    setArtistIds(
      (p.performance_artists || [])
        .slice().sort((a, b) => a.sort_order - b.sort_order)
        .map((pa) => pa.artist_id)
    );
    setTagIds((p.performance_tags || []).map((pt) => pt.tag_id));
    setMsg(null);
    window.scrollTo({ top: 0 });
  }

  function clearForm(keepContext = true) {
    setForm((f) => ({
      ...EMPTY,
      stage_id: keepContext ? f.stage_id : (data.stages[0]?.id || ''),
      festival_day: keepContext ? f.festival_day : EMPTY.festival_day
    }));
    setArtistIds([]);
    setTagIds([]);
  }

  // Kattuvuse hoiatus: sama ala, ajad lõikuvad, mitte see sama kirje
  const overlap = useMemo(() => {
    if (!form.stage_id || !form.startTime || !form.endTime) return null;
    const { start_at, end_at } = timesToIso(form.festival_day, form.startTime, form.endTime);
    const a1 = new Date(start_at), a2 = new Date(end_at);
    const hit = data.performances.find((p) => {
      if (p.id === form.id || p.stage_id !== form.stage_id) return false;
      const b1 = new Date(p.start_at), b2 = new Date(p.end_at);
      return a1 < b2 && b1 < a2;
    });
    if (!hit) return null;
    const names = (hit.performance_artists || [])
      .map((pa) => artistById[pa.artist_id]?.name).filter(Boolean).join(', ');
    return hit.title_et || names || 'teine esinemine';
  }, [form, data, artistById]);

  async function save(addNew) {
    const supabase = supabaseBrowser();
    if (!form.stage_id) { setMsg('Vali ala.'); return; }
    if (!form.title_et.trim() && artistIds.length === 0) {
      setMsg('Lisa pealkiri või vähemalt üks esineja.'); return;
    }
    setBusy(true); setMsg(null);
    const { start_at, end_at } = timesToIso(form.festival_day, form.startTime, form.endTime);
    const payload = {
      stage_id: form.stage_id,
      festival_day: form.festival_day,
      start_at, end_at,
      title_et: form.title_et.trim() || null,
      title_en: form.title_en.trim() || null,
      descr_et: form.descr_et.trim() || null,
      descr_en: form.descr_en.trim() || null,
      is_background: form.is_background,
      is_published: form.is_published
    };

    let perfId = form.id;
    let error = null;
    if (perfId) {
      ({ error } = await supabase.from('performances').update(payload).eq('id', perfId));
    } else {
      const res = await supabase.from('performances').insert(payload).select('id').single();
      error = res.error;
      perfId = res.data?.id;
    }
    if (error || !perfId) {
      setBusy(false);
      setMsg('Salvestus ebaõnnestus: ' + (error?.message || 'tundmatu viga'));
      return;
    }

    // Esinejad ja tagid: kustuta vanad seosed, lisa uued
    await supabase.from('performance_artists').delete().eq('performance_id', perfId);
    if (artistIds.length) {
      await supabase.from('performance_artists').insert(
        artistIds.map((aid, i) => ({ performance_id: perfId, artist_id: aid, sort_order: i * 10 }))
      );
    }
    await supabase.from('performance_tags').delete().eq('performance_id', perfId);
    if (tagIds.length) {
      await supabase.from('performance_tags').insert(
        tagIds.map((tid) => ({ performance_id: perfId, tag_id: tid }))
      );
    }

    await revalidatePublic();
    await onChanged();
    setBusy(false);
    setMsg('Salvestatud ✅');
    if (addNew) clearForm(true);
    else if (!form.id) clearForm(true);
  }

  async function remove(p) {
    if (!window.confirm('Kustutan esinemise? Seda ei saa tagasi võtta.')) return;
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('performances').delete().eq('id', p.id);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    if (form.id === p.id) clearForm(true);
    await revalidatePublic();
    await onChanged();
  }

  async function createArtist() {
    const name = artistQuery.trim();
    if (name.length < 2) return;
    const supabase = supabaseBrowser();
    const { data: row, error } = await supabase.from('artists')
      .insert({ slug: slugify(name), name })
      .select('id')
      .single();
    if (error) { setMsg('Esineja loomine ebaõnnestus: ' + error.message); return; }
    await onChanged();
    setArtistIds((ids) => [...ids, row.id]);
    setArtistQuery('');
  }

  const artistMatches = artistQuery.trim().length > 0
    ? data.artists.filter((a) =>
        a.name.toLowerCase().includes(artistQuery.trim().toLowerCase()) &&
        !artistIds.includes(a.id)
      ).slice(0, 8)
    : [];

  const shownPerfs = data.performances.filter(
    (p) => listDay === 'all' || p.festival_day === listDay
  );

  return (
    <>
      <section className="admin-card">
        <h2>{form.id ? 'Muuda esinemist' : 'Uus esinemine'}</h2>

        <div className="admin-grid">
          <label>Ala
            <select value={form.stage_id} onChange={(e) => set({ stage_id: e.target.value })}>
              {data.stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name_et}</option>
              ))}
            </select>
          </label>
          <label>Festivalipäev
            <input type="date" value={form.festival_day}
              onChange={(e) => set({ festival_day: e.target.value })} />
          </label>
          <label>Algus
            <input type="time" value={form.startTime}
              onChange={(e) => set({ startTime: e.target.value })} />
          </label>
          <label>Lõpp
            <input type="time" value={form.endTime}
              onChange={(e) => set({ endTime: e.target.value })} />
          </label>
        </div>
        <p className="admin-hint">Öised kellaajad 00.00–06.00 loetakse sama
          õhtu programmiks: kirje jääb valitud festivalipäeva alla, aga
          toimub kalendris järgmise päeva varahommikul.</p>

        {overlap && (
          <p className="admin-warn">⚠️ Kattub samal alal: {overlap}</p>
        )}

        <div className="admin-grid">
          <label>Pealkiri (ET)
            <input value={form.title_et} placeholder="tühi = esinejate nimed"
              onChange={(e) => set({ title_et: e.target.value })} />
          </label>
          <label>Pealkiri (EN)
            <input value={form.title_en} placeholder="tühi = esinejate nimed"
              onChange={(e) => set({ title_en: e.target.value })} />
          </label>
        </div>
        {form.title_et.trim() && !form.title_en.trim() && (
          <p className="admin-warn admin-warn-soft">🟡 Ingliskeelne pealkiri puudub</p>
        )}

        <div className="admin-grid">
          <label>Kirjeldus (ET)
            <textarea rows={3} value={form.descr_et}
              onChange={(e) => set({ descr_et: e.target.value })} />
          </label>
          <label>Kirjeldus (EN)
            <textarea rows={3} value={form.descr_en}
              onChange={(e) => set({ descr_en: e.target.value })} />
          </label>
        </div>

        <label className="admin-label">Esinejad</label>
        <div className="admin-chips">
          {artistIds.map((aid) => (
            <button key={aid} className="admin-chip on"
              onClick={() => setArtistIds((ids) => ids.filter((x) => x !== aid))}>
              {artistById[aid]?.name || '?'} ✕
            </button>
          ))}
        </div>
        <input
          className="admin-search"
          placeholder="Otsi esinejat nime järgi…"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
        />
        {artistQuery.trim() && (
          <div className="admin-suggest">
            {artistMatches.map((a) => (
              <button key={a.id}
                onClick={() => { setArtistIds((ids) => [...ids, a.id]); setArtistQuery(''); }}>
                {a.name}{a.country ? ` (${a.country})` : ''}
              </button>
            ))}
            <button className="admin-suggest-new" onClick={createArtist}>
              ＋ Loo uus esineja „{artistQuery.trim()}"
            </button>
          </div>
        )}

        <label className="admin-label">Tagid</label>
        <div className="admin-chips">
          {data.tags.length === 0 && <span className="admin-hint">Tage pole veel — lisa Tagid sakist.</span>}
          {data.tags.map((tg) => (
            <button key={tg.id}
              className={`admin-chip ${tagIds.includes(tg.id) ? 'on' : ''}`}
              onClick={() => setTagIds((ids) =>
                ids.includes(tg.id) ? ids.filter((x) => x !== tg.id) : [...ids, tg.id])}>
              {tg.name_et}
            </button>
          ))}
        </div>

        <div className="admin-switches">
          <label className="admin-check">
            <input type="checkbox" checked={form.is_background}
              onChange={(e) => set({ is_background: e.target.checked })} />
            Taustaprogramm (avatud kogu päeva)
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={form.is_published}
              onChange={(e) => set({ is_published: e.target.checked })} />
            Avaldatud (linnukeseta = mustand, avalikus kavas ei näidata)
          </label>
        </div>

        {msg && <p className="admin-msg">{msg}</p>}

        <div className="admin-actions">
          <button className="btn-primary" disabled={busy} onClick={() => save(false)}>
            {busy ? '…' : 'Salvesta'}
          </button>
          <button className="btn-secondary" disabled={busy} onClick={() => save(true)}>
            Salvesta ja lisa uus
          </button>
          {form.id && (
            <button className="btn-secondary" onClick={() => clearForm(true)}>
              Tühista muutmine
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <h2>Kõik esinemised ({shownPerfs.length})</h2>
        <div className="admin-chips">
          <button className={`admin-chip ${listDay === 'all' ? 'on' : ''}`}
            onClick={() => setListDay('all')}>Kõik päevad</button>
          {days.map((d) => (
            <button key={d} className={`admin-chip ${listDay === d ? 'on' : ''}`}
              onClick={() => setListDay(d)}>{d.slice(5)}</button>
          ))}
        </div>
        <div className="admin-list">
          {shownPerfs.map((p) => {
            const s = stageById[p.stage_id];
            const names = (p.performance_artists || [])
              .slice().sort((a, b) => a.sort_order - b.sort_order)
              .map((pa) => artistById[pa.artist_id]?.name).filter(Boolean).join(', ');
            const title = p.title_et || names || '—';
            const missingEn = Boolean(p.title_et) !== Boolean(p.title_en);
            return (
              <div key={p.id} className="admin-row">
                <span className="stage-dot" style={{ background: s?.color || '#666' }} />
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {title}
                    {!p.is_published && <span className="admin-badge">mustand</span>}
                    {missingEn && <span className="admin-badge admin-badge-warn">🟡 tõlge</span>}
                  </div>
                  <div className="admin-row-sub">
                    {p.festival_day.slice(5)} · {isoToParts(p.start_at).time}–{isoToParts(p.end_at).time} · {s?.name_et || '?'}
                  </div>
                </div>
                <button className="admin-mini" onClick={() => edit(p)}>Muuda</button>
                <button className="admin-mini admin-mini-danger" onClick={() => remove(p)}>Kustuta</button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
