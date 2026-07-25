'use client';
// CSV/tabeli import: kleebi Excelist või Sheetsist tabel (või vali
// .csv fail), vaata eelvaadet koos veakontrolliga ja impordi ühe
// nupuvajutusega. Kaks importi:
//   1) Esinemised — iga rida on üks kavakirje; puuduvad esinejad ja
//      tagid luuakse automaatselt
//   2) Esinejad — iga rida on üks esineja (bio, pilt, lingid, lugu);
//      olemasolev esineja leitakse nime järgi ja täidetakse ainult
//      need lahtrid, mis tabelis pole tühjad
// Pärast importi saab kõike edasi muuta tavalistes vormides.
import { useMemo, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { parseTable, rowToObject, parseBool, splitList } from './csv';
import { timesToIso, slugify, revalidatePublic } from './adminShared';

const PERF_TEMPLATE =
  'paev;ala;algus;lopp;esinejad;pealkiri_et;pealkiri_en;tagid;taust;avaldatud;kirjeldus_et;kirjeldus_en\n' +
  '2026-07-16;Emalava;18:00;20:00;Glenwashere;;;LIVE;ei;jah;;\n' +
  '2026-07-16;Sauna Area;20:00;21:00;Kadri Maasikmets;Runic Journey;Runic Journey;töötuba;ei;jah;Kirjeldus siia;Description here\n';

const ARTIST_TEMPLATE =
  'nimi;riik;pilt;bio_et;bio_en;instagram;facebook;spotify;soundcloud;youtube;website;loo_link;loo_pealkiri;loo_fail\n' +
  'Glenwashere;EE;https://…;Bio eesti keeles;Bio in English;https://instagram.com/…;;;;;;https://soundcloud.com/…;Loo nimi;\n';

function download(name, content) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminImport({ data, onChanged }) {
  const [mode, setMode] = useState('perfs'); // 'perfs' | 'artists'
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);

  const stageByName = useMemo(() => {
    const m = new Map();
    for (const s of data.stages) {
      m.set(s.slug.toLowerCase(), s);
      m.set(s.name_et.toLowerCase(), s);
      m.set(s.name_en.toLowerCase(), s);
    }
    return m;
  }, [data]);

  const artistByName = useMemo(() => {
    const m = new Map();
    for (const a of data.artists) m.set(a.name.toLowerCase(), a);
    return m;
  }, [data]);

  const tagByName = useMemo(() => {
    const m = new Map();
    for (const t of data.tags) m.set(t.name_et.toLowerCase(), t);
    return m;
  }, [data]);

  // Eelvaade + veakontroll
  const preview = useMemo(() => {
    if (!text.trim()) return null;
    const { header, rows } = parseTable(text);
    if (!rows.length) return { error: 'Tabelis pole andmeridu (esimene rida peab olema veerunimed).' };

    if (mode === 'perfs') {
      const need = ['paev', 'ala', 'algus', 'lopp'];
      const missing = need.filter((c) => !header.includes(c));
      if (missing.length) return { error: 'Puuduvad veerud: ' + missing.join(', ') + '. Lae mall alla ja kasuta samu veerunimesid.' };
      const items = rows.map((r, i) => {
        const o = rowToObject(header, r);
        const errors = [];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(o.paev)) errors.push('päev peab olema kujul 2026-07-16');
        const stage = stageByName.get((o.ala || '').toLowerCase());
        if (!stage) errors.push(`tundmatu ala "${o.ala}"`);
        if (!/^\d{1,2}:\d{2}$/.test(o.algus)) errors.push('algus peab olema kujul 18:00');
        if (!/^\d{1,2}:\d{2}$/.test(o.lopp)) errors.push('lõpp peab olema kujul 20:00');
        const artists = splitList(o.esinejad);
        if (!artists.length && !(o.pealkiri_et || '').trim()) errors.push('vaja on esinejaid või pealkirja');
        let dup = false;
        if (!errors.length) {
          const { start_at } = timesToIso(o.paev, o.algus, o.lopp);
          dup = data.performances.some(
            (p) => p.stage_id === stage.id && new Date(p.start_at).getTime() === new Date(start_at).getTime()
          );
        }
        const newArtists = artists.filter((n) => !artistByName.has(n.toLowerCase()));
        const tags = splitList(o.tagid);
        const newTags = tags.filter((n) => !tagByName.has(n.toLowerCase()));
        return { line: i + 2, o, stage, artists, tags, newArtists, newTags, errors, dup };
      });
      return { items };
    }

    // esinejad
    if (!header.includes('nimi')) {
      return { error: 'Puudub veerg "nimi". Lae mall alla ja kasuta samu veerunimesid.' };
    }
    const items = rows.map((r, i) => {
      const o = rowToObject(header, r);
      const errors = [];
      if ((o.nimi || '').trim().length < 2) errors.push('nimi on puudu');
      const existing = artistByName.get((o.nimi || '').trim().toLowerCase());
      return { line: i + 2, o, existing, errors };
    });
    return { items };
  }, [text, mode, data, stageByName, artistByName, tagByName]);

  const okCount = preview?.items?.filter((it) => !it.errors.length).length || 0;
  const errCount = preview?.items?.filter((it) => it.errors.length).length || 0;

  async function runImport() {
    if (!preview?.items || busy) return;
    const good = preview.items.filter((it) => !it.errors.length);
    if (!good.length) return;
    setBusy(true);
    setResult(null);
    const supabase = supabaseBrowser();
    let done = 0, failed = 0;
    const failLines = [];

    if (mode === 'perfs') {
      // 1. loo puuduvad esinejad ja tagid ühe korraga
      const artistIdByName = new Map([...artistByName].map(([k, v]) => [k, v.id]));
      const tagIdByName = new Map([...tagByName].map(([k, v]) => [k, v.id]));
      const newArtistNames = [...new Set(good.flatMap((it) => it.newArtists))];
      const newTagNames = [...new Set(good.flatMap((it) => it.newTags))];
      for (const name of newArtistNames) {
        const { data: row } = await supabase.from('artists')
          .insert({ slug: slugify(name), name }).select('id').single();
        if (row) artistIdByName.set(name.toLowerCase(), row.id);
      }
      for (const name of newTagNames) {
        const { data: row } = await supabase.from('tags')
          .insert({ slug: slugify(name), name_et: name, name_en: name }).select('id').single();
        if (row) tagIdByName.set(name.toLowerCase(), row.id);
      }
      // 2. esinemised
      for (const it of good) {
        const { o, stage } = it;
        const { start_at, end_at } = timesToIso(o.paev, o.algus, o.lopp);
        const { data: perf, error } = await supabase.from('performances').insert({
          stage_id: stage.id,
          festival_day: o.paev,
          start_at, end_at,
          title_et: (o.pealkiri_et || '').trim() || null,
          title_en: (o.pealkiri_en || '').trim() || null,
          descr_et: (o.kirjeldus_et || '').trim() || null,
          descr_en: (o.kirjeldus_en || '').trim() || null,
          is_background: parseBool(o.taust, false),
          is_published: parseBool(o.avaldatud, true)
        }).select('id').single();
        if (error || !perf) { failed++; failLines.push(it.line); continue; }
        const aRows = it.artists
          .map((n, idx) => ({ performance_id: perf.id, artist_id: artistIdByName.get(n.toLowerCase()), sort_order: idx * 10 }))
          .filter((r) => r.artist_id);
        if (aRows.length) await supabase.from('performance_artists').insert(aRows);
        const tRows = it.tags
          .map((n) => ({ performance_id: perf.id, tag_id: tagIdByName.get(n.toLowerCase()) }))
          .filter((r) => r.tag_id);
        if (tRows.length) await supabase.from('performance_tags').insert(tRows);
        done++;
        setProgress(`${done}/${good.length}`);
      }
    } else {
      for (const it of good) {
        const { o, existing } = it;
        const links = {};
        for (const k of ['instagram', 'facebook', 'spotify', 'soundcloud', 'youtube', 'website']) {
          if ((o[k] || '').trim()) links[k] = o[k].trim();
        }
        const patch = {};
        if ((o.riik || '').trim()) patch.country = o.riik.trim().toUpperCase();
        if ((o.pilt || '').trim()) patch.image_url = o.pilt.trim();
        if ((o.bio_et || '').trim()) patch.bio_et = o.bio_et.trim();
        if ((o.bio_en || '').trim()) patch.bio_en = o.bio_en.trim();
        if ((o.loo_link || '').trim()) patch.track_link = o.loo_link.trim();
        if ((o.loo_pealkiri || '').trim()) patch.track_title = o.loo_pealkiri.trim();
        if ((o.loo_fail || '').trim()) patch.track_file_url = o.loo_fail.trim();

        let error;
        if (existing) {
          if (Object.keys(links).length) {
            patch.links = { ...(existing.links || {}), ...links };
          }
          ({ error } = await supabase.from('artists').update(patch).eq('id', existing.id));
        } else {
          ({ error } = await supabase.from('artists').insert({
            slug: slugify(o.nimi), name: o.nimi.trim(), links, ...patch
          }));
        }
        if (error) { failed++; failLines.push(it.line); }
        else done++;
        setProgress(`${done}/${good.length}`);
      }
    }

    await revalidatePublic();
    await onChanged();
    setBusy(false);
    setProgress(null);
    setResult(
      `Imporditud: ${done}` +
      (failed ? ` · ebaõnnestus: ${failed} (read ${failLines.join(', ')})` : '') +
      (errCount ? ` · vahele jäi vigaste andmetega ridu: ${errCount}` : '')
    );
    if (!failed) setText('');
  }

  async function onFile(e) {
    const f = e.target.files?.[0];
    if (f) setText(await f.text());
    e.target.value = '';
  }

  return (
    <>
      <section className="admin-card">
        <h2>Import tabelist</h2>
        <p className="admin-hint">Täida tabel Excelis või Google Sheetsis
          (lae mall alla, veerunimed peavad jääma samaks), siis kopeeri
          tabel ja kleebi siia kasti — või vali .csv fail. Eelvaade
          näitab enne importi kõik vead rea kaupa ära. Mitu esinejat või
          tagi samas lahtris eralda semikooloniga (Nimi1; Nimi2).</p>

        <div className="admin-chips">
          <button className={`admin-chip ${mode === 'perfs' ? 'on' : ''}`}
            onClick={() => { setMode('perfs'); setResult(null); }}>Esinemised</button>
          <button className={`admin-chip ${mode === 'artists' ? 'on' : ''}`}
            onClick={() => { setMode('artists'); setResult(null); }}>Esinejate andmed</button>
        </div>

        <div className="admin-actions">
          <button className="btn-secondary" onClick={() =>
            download(
              mode === 'perfs' ? 'esinemised-mall.csv' : 'esinejad-mall.csv',
              mode === 'perfs' ? PERF_TEMPLATE : ARTIST_TEMPLATE
            )}>
            ⤓ Lae mall alla
          </button>
          <label className="btn-secondary admin-file">
            Vali .csv fail
            <input type="file" accept=".csv,.txt,.tsv" onChange={onFile} hidden />
          </label>
        </div>

        <textarea
          className="admin-import-area"
          rows={8}
          placeholder={'Kleebi tabel siia…\n\n' + (mode === 'perfs' ? PERF_TEMPLATE : ARTIST_TEMPLATE).split('\n')[0]}
          value={text}
          onChange={(e) => { setText(e.target.value); setResult(null); }}
        />

        {preview?.error && <p className="admin-warn">{preview.error}</p>}
        {result && <p className="admin-msg">{result}</p>}

        {preview?.items && (
          <>
            <p className="admin-hint">
              Ridu kokku: {preview.items.length} · korras: {okCount}
              {errCount ? ` · vigaseid (jäävad vahele): ${errCount}` : ''}
            </p>
            <div className="admin-import-preview">
              {preview.items.map((it) => (
                <div key={it.line} className={`admin-row ${it.errors.length ? 'admin-row-err' : ''}`}>
                  <div className="admin-row-main">
                    <div className="admin-row-title">
                      rida {it.line}: {mode === 'perfs'
                        ? `${it.o.paev} ${it.o.algus}–${it.o.lopp} · ${it.o.ala} · ${it.o.esinejad || it.o.pealkiri_et || '—'}`
                        : `${it.o.nimi}${it.existing ? '' : ''}`}
                      {mode === 'perfs' && it.dup && !it.errors.length && (
                        <span className="admin-badge admin-badge-warn">sama aeg juba kavas</span>
                      )}
                      {mode === 'perfs' && it.newArtists.length > 0 && !it.errors.length && (
                        <span className="admin-badge">uued esinejad: {it.newArtists.join(', ')}</span>
                      )}
                      {mode === 'artists' && !it.errors.length && (
                        <span className="admin-badge">{it.existing ? 'täiendab olemasolevat' : 'uus esineja'}</span>
                      )}
                    </div>
                    {it.errors.length > 0 && (
                      <div className="admin-row-sub">⚠️ {it.errors.join('; ')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-actions">
              <button className="btn-primary" disabled={busy || !okCount} onClick={runImport}>
                {busy ? `Impordin… ${progress || ''}` : `Impordi ${okCount} rida`}
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
