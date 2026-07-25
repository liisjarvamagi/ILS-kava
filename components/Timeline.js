'use client';
// Ajajoone vaade nagu Brellas: aeg jookseb külgsuunas, iga ala on oma
// rida ja plokk avab esinemise detaillehe. Kui samal alal on kaks
// esinemist samal ajal, lähevad nad eri "radadele" ehk üksteise alla.
// Suurendus ja tihedus tulevad vaate seadetest. Järjehoidja märk on
// plokil olemas ja seda saab vajutada ilma detailita avamata.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/i18n';
import { perfTitle, fmtTime } from '../lib/schedule';
import { getMyIds, toggleMyId, nudgeSeen, markNudgeSeen } from '../lib/mySchedule';
import { IconBookmark } from './Icons';

const BASE_PX_PER_MIN = 2.2; // 100% suurenduse juures: 1 tund = 132 px
const LABEL_H = 26;          // ala nime rida ploki rea kohal
const LANE_GAP = 6;

// Radade jagamine: esinemine läheb esimesele reale, mis on tema
// alguseks vaba. Kattuvad esinemised jäävad nii eri ridadele.
function assignLanes(perfs) {
  const laneEnds = [];
  return perfs.map((p) => {
    const start = new Date(p.start_at);
    let lane = laneEnds.findIndex((end) => start >= end);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = new Date(p.end_at);
    return { perf: p, lane };
  });
}

export default function Timeline({ stages, perfs, locale, scale = 100, density = 'detailed', onMyChange }) {
  const tr = t(locale);
  const [myIds, setMyIds] = useState([]);
  const [removedId, setRemovedId] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    setMyIds(getMyIds());
    return () => clearTimeout(toastTimer.current);
  }, []);

  if (!perfs.length) return null;

  const pxPerMin = BASE_PX_PER_MIN * (scale / 100);
  const hourPx = 60 * pxPerMin;
  const laneH = density === 'compact' ? 38 : 56;

  // Päeva ajavahemik, ümardatud täistundideni, et tunnijooned klapiksid.
  const startMs = Math.floor(Math.min(...perfs.map((p) => +new Date(p.start_at))) / 3600000) * 3600000;
  const endMs = Math.ceil(Math.max(...perfs.map((p) => +new Date(p.end_at))) / 3600000) * 3600000;
  const width = ((endMs - startMs) / 60000) * pxPerMin + 40;

  const hours = [];
  for (let ts = startMs; ts <= endMs; ts += 3600000) hours.push(ts);

  const rows = stages
    .map((s) => {
      const own = perfs
        .filter((p) => p.stage_id === s.id)
        .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
      if (!own.length) return null;
      const laid = assignLanes(own);
      const laneCount = Math.max(...laid.map((l) => l.lane)) + 1;
      return { stage: s, laid, laneCount };
    })
    .filter(Boolean);

  function handleToggle(e, perf) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleMyId(perf.id);
    setMyIds(getMyIds());
    onMyChange?.();
    if (added) {
      if (!nudgeSeen()) { setShowNudge(true); markNudgeSeen(); }
    } else {
      setRemovedId(perf.id);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setRemovedId(null), 6000);
    }
  }

  function undo() {
    toggleMyId(removedId);
    clearTimeout(toastTimer.current);
    setRemovedId(null);
    setMyIds(getMyIds());
    onMyChange?.();
  }

  return (
    <>
      {showNudge && (
        <div className="nudge">
          <p>{tr.login_nudge}</p>
          <button onClick={() => setShowNudge(false)}>{tr.login_nudge_ok}</button>
        </div>
      )}

      <div className="timeline">
        <div className="tl-canvas" style={{ width }}>
          <div className="tl-hours">
            {hours.map((ts) => (
              <span
                key={ts}
                className="tl-hour"
                style={{ left: ((ts - startMs) / 60000) * pxPerMin }}
              >
                {fmtTime(ts)}
              </span>
            ))}
          </div>

          {rows.map(({ stage, laid, laneCount }) => (
            <div
              key={stage.id}
              className="tl-row"
              style={{
                height: LABEL_H + laneCount * (laneH + LANE_GAP) + LANE_GAP,
                backgroundSize: `${hourPx}px 100%`
              }}
            >
              <div className="tl-label">
                <span className="stage-dot" style={{ background: stage.color }} />
                <span className="tl-label-name">{locale === 'en' ? stage.name_en : stage.name_et}</span>
                <Link href={`/${locale}/ala/${stage.slug}`} className="tl-label-more">
                  {tr.stage_more}
                </Link>
              </div>

              {laid.map(({ perf, lane }) => {
                const left = ((+new Date(perf.start_at) - startMs) / 60000) * pxPerMin;
                const w = Math.max(((+new Date(perf.end_at) - +new Date(perf.start_at)) / 60000) * pxPerMin - 4, 76);
                const saved = myIds.includes(perf.id);
                return (
                  <Link
                    key={perf.id}
                    href={`/${locale}/esinemine/${perf.id}`}
                    className={`tl-block ${perf.is_background ? 'tl-bg' : ''} ${saved ? 'tl-saved' : ''}`}
                    style={{
                      left,
                      width: w,
                      top: LABEL_H + LANE_GAP + lane * (laneH + LANE_GAP),
                      height: laneH,
                      borderColor: stage.color,
                      background: `${stage.color}1f`
                    }}
                  >
                    <div className="tl-block-main">
                      {density === 'detailed' && (
                        <div className="act-time">{fmtTime(perf.start_at)} – {fmtTime(perf.end_at)}</div>
                      )}
                      <div className="tl-block-name">{perfTitle(perf, locale)}</div>
                    </div>
                    <button
                      className={`tl-bookmark ${saved ? 'saved' : ''}`}
                      aria-label={saved ? tr.my_removed : tr.my_saved}
                      onClick={(e) => handleToggle(e, perf)}
                    >
                      <IconBookmark filled={saved} />
                    </button>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {removedId && (
        <div className="toast" role="status">
          <span>{tr.my_removed}</span>
          <button onClick={undo}>{tr.undo}</button>
        </div>
      )}
    </>
  );
}
