'use client';
// Kava planeerija: võrgustik nagu kalendris. Read on alad, aeg jookseb
// külgsuunas. Esinemine on plokk, mida saab:
//   * lohistada — aeg ja/või ala muutub (samm 5 min)
//   * paremast servast venitada — pikkus muutub
//   * klõpsata — avaneb muutmise leht (ajad, ala, esinejad, mustand)
// Tühja koha klõps loob uue esinemise sinna kohta, esineja valikuga.
// Kattuvused samal alal värvuvad kohe punaseks. Iga muudatus
// salvestub andmebaasi ja värskendab avalikku kava.
import { useMemo, useRef, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { revalidatePublic, guardedUpdate, CONFLICT_MSG, festivalDays, fmtDay } from './adminShared';
import {
  PX_PER_MIN, ROW_H, SNAP_MIN, snap, computeAxis, msToX,
  findClashes, shiftTimes, resizeEnd, fmtHM
} from './plannerUtils';

const DRAG_THRESHOLD = 5; // px enne, kui klõps muutub lohistamiseks

export default function AdminPlanner({ data, onChanged }) {
  // Päevad: Sündmus saki kuupäevad + päevad, kus juba on esinemisi.
  // Nii saab planeerida ka veel tühja päeva peale.
  const days = useMemo(
    () => [...new Set([
      ...festivalDays(data.settings),
      ...data.performances.map((p) => p.festival_day)
    ])].sort(),
    [data]
  );
  const [day, setDay] = useState(days[0] || '2026-07-16');
  const [gesture, setGesture] = useState(null); // { id, mode, deltaMin, deltaRow }
  const [popup, setPopup] = useState(null);     // { mode:'edit'|'create', ... }
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const gestureRef = useRef(null);

  const stages = data.stages.filter((s) => s.is_active !== false);
  const stageIndex = useMemo(
    () => Object.fromEntries(stages.map((s, i) => [s.id, i])),
    [stages]
  );
  const artistById = useMemo(
    () => Object.fromEntries(data.artists.map((a) => [a.id, a])),
    [data]
  );

  const dayPerfs = data.performances.filter((p) => p.festival_day === day);
  const axis = computeAxis(dayPerfs, day);
  const width = msToX(axis.endMs, axis.startMs) + 60;
  const hours = [];
  for (let ts = axis.startMs; ts <= axis.endMs; ts += 3600000) hours.push(ts);

  // Ploki hetkeasend: kui teda parasjagu lohistatakse, rakenda mustandi nihe
  function draftOf(p) {
    const g = gesture;
    if (!g || g.id !== p.id) return p;
    if (g.mode === 'move') {
      const t = shiftTimes(p.start_at, p.end_at, g.deltaMin);
      const rowNow = stageIndex[p.stage_id] ?? 0;
      const newRow = Math.min(Math.max(rowNow + g.deltaRow, 0), stages.length - 1);
      return { ...p, ...t, stage_id: stages[newRow].id };
    }
    const t = resizeEnd(p.start_at, p.end_at, g.deltaMin);
    return { ...p, ...t };
  }

  const drafts = dayPerfs.map(draftOf);

  // ── Lohistamine ──
  function startGesture(e, perf, mode) {
    if (busy) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    gestureRef.current = {
      id: perf.id, mode,
      startX: e.clientX, startY: e.clientY,
      moved: false
    };
  }

  function moveGesture(e) {
    const g = gestureRef.current;
    if (!g) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    g.moved = true;
    const deltaMin = snap(dx / PX_PER_MIN, SNAP_MIN);
    const deltaRow = g.mode === 'move' ? Math.round(dy / ROW_H) : 0;
    setGesture({ id: g.id, mode: g.mode, deltaMin, deltaRow });
  }

  async function endGesture(e, perf) {
    const g = gestureRef.current;
    gestureRef.current = null;
    if (!g) return;
    if (!g.moved) {
      setGesture(null);
      openEdit(perf); // klõps ilma liigutamata = muutmine
      return;
    }
    const draft = draftOf(perf);
    setGesture(null);
    if (
      draft.start_at === perf.start_at &&
      draft.end_at === perf.end_at &&
      draft.stage_id === perf.stage_id
    ) return;
    await persist(perf.id, {
      start_at: draft.start_at,
      end_at: draft.end_at,
      stage_id: draft.stage_id
    }, perf.updated_at);
  }

  async function persist(id, patch, loadedStamp) {
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    if (!supabase) { setBusy(false); setMsg('Andmebaas seadistamata'); return; }
    const r = await guardedUpdate(supabase, 'performances', id, loadedStamp, patch);
    if (r.conflict) {
      setMsg(CONFLICT_MSG);
      await onChanged(); // plokk hüppab tagasi teise admini seisu peale
    } else if (r.error) {
      setMsg('Salvestus ebaõnnestus: ' + r.error);
    } else {
      await revalidatePublic();
      await onChanged();
    }
    setBusy(false);
  }

  // ── Muutmise ja loomise leht ──
  function openEdit(p) {
    setPopup({
      mode: 'edit', id: p.id,
      updated_at: p.updated_at || null, // üle kirjutamise kaitse
      stage_id: p.stage_id,
      start: fmtHM(+new Date(p.start_at)),
      end: fmtHM(+new Date(p.end_at)),
      title_et: p.title_et || '',
      is_published: p.is_published,
      artistIds: (p.performance_artists || [])
        .slice().sort((a, b) => a.sort_order - b.sort_order)
        .map((pa) => pa.artist_id),
      query: ''
    });
  }

  function openCreate(stage, ms) {
    const startSnap = axis.startMs + snap((ms - axis.startMs) / 60000, 15) * 60000;
    setPopup({
      mode: 'create',
      stage_id: stage.id,
      start: fmtHM(startSnap),
      end: fmtHM(startSnap + 60 * 60000),
      title_et: '',
      is_published: true,
      artistIds: [],
      query: ''
    });
  }

  function rowBackgroundClick(e, stage) {
    // ainult otse rea taustale, mitte plokile
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ms = axis.startMs + ((e.clientX - rect.left) / PX_PER_MIN) * 60000;
    openCreate(stage, ms);
  }

  // Kellaaeg vormist → ISO. Öötunnid (enne 06.00) kuuluvad järgmise
  // kalendripäeva varahommikusse, festivalipäev jääb samaks.
  function hmToIso(hm) {
    const [h, m] = hm.split(':').map(Number);
    const base = new Date(`${day}T12:00:00+03:00`).getTime();
    let ms = base + ((h - 12) * 60 + m) * 60000;
    if (h < 6) ms += 24 * 3600000; // öötunnid = järgmise kalendripäeva varahommik
    return new Date(ms).toISOString();
  }

  async function savePopup() {
    const pp = popup;
    if (!/^\d{1,2}:\d{2}$/.test(pp.start) || !/^\d{1,2}:\d{2}$/.test(pp.end)) {
      setMsg('Kellaajad peavad olema kujul 18:00'); return;
    }
    if (!pp.title_et.trim() && !pp.artistIds.length) {
      setMsg('Lisa esineja või pealkiri'); return;
    }
    let start_at = hmToIso(pp.start);
    let end_at = hmToIso(pp.end);
    if (+new Date(end_at) <= +new Date(start_at)) {
      end_at = new Date(+new Date(end_at) + 24 * 3600000).toISOString();
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const payload = {
      event_id: data.eventId,
      stage_id: pp.stage_id, festival_day: day, start_at, end_at,
      title_et: pp.title_et.trim() || null,
      is_published: pp.is_published
    };
    let perfId = pp.id, error = null;
    if (pp.mode === 'edit') {
      const r = await guardedUpdate(supabase, 'performances', perfId, pp.updated_at, payload);
      if (r.conflict) {
        setBusy(false);
        setMsg(CONFLICT_MSG);
        setPopup(null);
        await onChanged();
        return;
      }
      error = r.error ? { message: r.error } : null;
    } else {
      const res = await supabase.from('performances')
        .insert({ ...payload, is_background: false }).select('id').single();
      error = res.error; perfId = res.data?.id;
    }
    if (!error && perfId) {
      await supabase.from('performance_artists').delete().eq('performance_id', perfId);
      if (pp.artistIds.length) {
        await supabase.from('performance_artists').insert(
          pp.artistIds.map((aid, i) => ({ performance_id: perfId, artist_id: aid, sort_order: i * 10 }))
        );
      }
      await revalidatePublic();
      await onChanged();
      setPopup(null);
    } else {
      setMsg('Salvestus ebaõnnestus: ' + (error?.message || '?'));
    }
    setBusy(false);
  }

  async function deleteFromPopup() {
    if (!window.confirm('Kustutan esinemise?')) return;
    setBusy(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('performances').delete().eq('id', popup.id);
    setBusy(false);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    setPopup(null);
    await revalidatePublic();
    await onChanged();
  }

  const artistMatches = popup && popup.query.trim()
    ? data.artists.filter((a) =>
        a.name.toLowerCase().includes(popup.query.trim().toLowerCase()) &&
        !popup.artistIds.includes(a.id)
      ).slice(0, 6)
    : [];

  return (
    <section className="admin-card">
      <h2>Kava planeerija</h2>
      <p className="admin-hint">Lohista plokki, et aega või ala muuta
        (samm {SNAP_MIN} min). Venita paremast servast pikkust. Klõps
        plokil avab muutmise, klõps tühjal kohal loob uue esinemise.
        Punane raam = kattuvus samal alal. Iga muudatus salvestub kohe.</p>

      <div className="admin-chips">
        {days.map((d) => (
          <button key={d} className={`admin-chip ${day === d ? 'on' : ''}`}
            onClick={() => setDay(d)}>{fmtDay(d)}</button>
        ))}
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      {busy && <p className="admin-hint">Salvestan…</p>}

      <div className="planner">
        <div className="planner-canvas" style={{ width: width + 120 }}>
          <div className="planner-hours" style={{ marginLeft: 120 }}>
            {hours.map((ts) => (
              <span key={ts} className="tl-hour" style={{ left: msToX(ts, axis.startMs) }}>
                {fmtHM(ts)}
              </span>
            ))}
          </div>

          {stages.map((s) => {
            const rowPerfs = drafts.filter((p) => p.stage_id === s.id);
            return (
              <div key={s.id} className="planner-row" style={{ height: ROW_H }}>
                <div className="planner-label">
                  <span className="stage-dot" style={{ background: s.color }} />
                  <span>{s.name_et}</span>
                </div>
                <div
                  className="planner-lane"
                  style={{ width, backgroundSize: `${60 * PX_PER_MIN}px 100%` }}
                  onClick={(e) => rowBackgroundClick(e, s)}
                >
                  {rowPerfs.map((p) => {
                    const orig = dayPerfs.find((x) => x.id === p.id);
                    const clash = findClashes(p, drafts).length > 0;
                    const left = msToX(+new Date(p.start_at), axis.startMs);
                    const w = Math.max(msToX(+new Date(p.end_at), axis.startMs) - left, 30);
                    const names = (p.performance_artists || [])
                      .map((pa) => artistById[pa.artist_id]?.name).filter(Boolean).join(', ');
                    return (
                      <div
                        key={p.id}
                        className={`planner-block ${clash ? 'clash' : ''} ${!p.is_published ? 'draftblock' : ''} ${gesture?.id === p.id ? 'moving' : ''}`}
                        style={{ left, width: w, borderColor: s.color, background: `${s.color}26` }}
                        onPointerDown={(e) => startGesture(e, orig, 'move')}
                        onPointerMove={moveGesture}
                        onPointerUp={(e) => endGesture(e, orig)}
                        onPointerCancel={() => { gestureRef.current = null; setGesture(null); }}
                      >
                        <div className="planner-block-time">
                          {fmtHM(+new Date(p.start_at))}–{fmtHM(+new Date(p.end_at))}
                          {!p.is_published && ' · mustand'}
                        </div>
                        <div className="planner-block-name">{p.title_et || names || '—'}</div>
                        <div
                          className="planner-resize"
                          onPointerDown={(e) => { e.stopPropagation(); startGesture(e, orig, 'resize'); }}
                          onPointerMove={moveGesture}
                          onPointerUp={(e) => endGesture(e, orig)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {popup && (
        <div className="sheet-backdrop" onClick={() => setPopup(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="sheet-title">
              {popup.mode === 'edit' ? 'Muuda esinemist' : 'Uus esinemine'}
            </h2>
            <div className="admin-grid">
              <label>Ala
                <select value={popup.stage_id}
                  onChange={(e) => setPopup({ ...popup, stage_id: e.target.value })}>
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>{s.name_et}</option>
                  ))}
                </select>
              </label>
              <label>Pealkiri (tühi = esinejate nimed)
                <input value={popup.title_et}
                  onChange={(e) => setPopup({ ...popup, title_et: e.target.value })} />
              </label>
              <label>Algus
                <input type="time" value={popup.start}
                  onChange={(e) => setPopup({ ...popup, start: e.target.value })} />
              </label>
              <label>Lõpp
                <input type="time" value={popup.end}
                  onChange={(e) => setPopup({ ...popup, end: e.target.value })} />
              </label>
            </div>

            <label className="admin-label">Esinejad</label>
            <div className="admin-chips">
              {popup.artistIds.map((aid) => (
                <button key={aid} className="admin-chip on"
                  onClick={() => setPopup({ ...popup, artistIds: popup.artistIds.filter((x) => x !== aid) })}>
                  {artistById[aid]?.name || '?'} ✕
                </button>
              ))}
            </div>
            <input className="admin-search" placeholder="Otsi esinejat…"
              value={popup.query}
              onChange={(e) => setPopup({ ...popup, query: e.target.value })} />
            {artistMatches.length > 0 && (
              <div className="admin-suggest">
                {artistMatches.map((a) => (
                  <button key={a.id}
                    onClick={() => setPopup({ ...popup, artistIds: [...popup.artistIds, a.id], query: '' })}>
                    {a.name}
                  </button>
                ))}
              </div>
            )}

            <label className="admin-check" style={{ marginTop: 10 }}>
              <input type="checkbox" checked={popup.is_published}
                onChange={(e) => setPopup({ ...popup, is_published: e.target.checked })} />
              Avaldatud
            </label>

            {msg && <p className="admin-msg">{msg}</p>}
            <div className="admin-actions">
              <button className="btn-primary" disabled={busy} onClick={savePopup}>
                {busy ? '…' : 'Salvesta'}
              </button>
              {popup.mode === 'edit' && (
                <button className="btn-secondary" disabled={busy} onClick={deleteFromPopup}>
                  🗑 Kustuta
                </button>
              )}
              <button className="btn-secondary" onClick={() => setPopup(null)}>Sulge</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
