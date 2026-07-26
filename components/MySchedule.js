'use client';
// Minu kava: ainult kasutaja enda valikud, ajajärjekorras, päevade kaupa.
// Tühi olek kutsub kava sirvima. Andmed on serverist samad, mis kavavaates,
// valikud loeb komponent telefoni localStorage'ist.
// Eemaldamise teade elab siin lehe tasemel: kaart kaob kohe, aga
// "Võta tagasi" jääb mõneks sekundiks nähtavale.
// "Laadi kalendrisse" teeb valikutest .ics faili otse telefonis.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/i18n';
import { perfTitle, fmtTime, festivalDays, dayLabel } from '../lib/schedule';
import { getMyIds, toggleMyId } from '../lib/mySchedule';
import { downloadIcs } from '../lib/ics';
import ActCard from './ActCard';

export default function MySchedule({ data, locale, base }) {
  const tr = t(locale);
  const [ids, setIds] = useState(null); // null = veel laadimata
  const [removedId, setRemovedId] = useState(null); // viimati eemaldatud esinemine
  const toastTimer = useRef(null);

  useEffect(() => {
    setIds(getMyIds());
    return () => clearTimeout(toastTimer.current);
  }, []);
  const refresh = () => setIds(getMyIds());

  function handleRemoved(id) {
    refresh();
    setRemovedId(id);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setRemovedId(null), 6000);
  }

  function undo() {
    toggleMyId(removedId); // lisab tagasi
    clearTimeout(toastTimer.current);
    setRemovedId(null);
    refresh();
  }

  if (!data) {
    return (
      <div className="notice">
        <h2>{tr.no_data_title}</h2>
        <p>{tr.no_data_body}</p>
      </div>
    );
  }
  if (ids === null) return null;

  const stageById = Object.fromEntries(data.stages.map((s) => [s.id, s]));
  const mine = data.performances
    .filter((p) => ids.includes(p.id))
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  function exportCalendar() {
    downloadIcs(
      mine.map((p) => {
        const s = stageById[p.stage_id];
        return {
          id: p.id,
          start_at: p.start_at,
          end_at: p.end_at,
          title: `${perfTitle(p, locale)} · I Land Sound`,
          location: s ? (locale === 'en' ? s.name_en : s.name_et) : ''
        };
      })
    );
  }

  const days = festivalDays(mine);
  return (
    <>
      <header className="header">
        <div className="header-top"><h1>{tr.nav_mine}</h1></div>
      </header>

      {mine.length === 0 ? (
        <div className="notice">
          <h2>{tr.my_empty_title}</h2>
          <p>{tr.my_empty_body}</p>
          <p style={{ marginTop: 10 }}>
            <Link href={base} style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {tr.nav_schedule} →
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="my-actions">
            <button className="btn-secondary" onClick={exportCalendar}>
              ⤓ {tr.my_calendar}
            </button>
            <p className="my-actions-hint">{tr.my_calendar_hint}</p>
          </div>

          {days.map((d) => (
            <section key={d} className="stage-block">
              <div className="stage-header">
                <span className="stage-name">{dayLabel(d, locale)}</span>
              </div>
              <div className="stage-slots">
                {mine.filter((p) => p.festival_day === d).map((p) => {
                  const s = stageById[p.stage_id];
                  const stageName = s ? (locale === 'en' ? s.name_en : s.name_et) : '';
                  return (
                    <ActCard
                      key={p.id}
                      perf={p}
                      title={perfTitle(p, locale)}
                      timeLabel={`${fmtTime(p.start_at)} – ${fmtTime(p.end_at)} · ${stageName}`}
                      color={s?.color || 'var(--muted)'}
                      locale={locale}
                      base={base}
                      onChange={refresh}
                      onRemoved={handleRemoved}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </>
      )}

      {removedId && (
        <div className="toast" role="status">
          <span>{tr.my_removed}</span>
          <button onClick={undo}>{tr.undo}</button>
        </div>
      )}
    </>
  );
}
