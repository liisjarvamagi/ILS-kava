'use client';
// Kaardivaade: vahelehed (Festival, Orissaare, Toiduala, Glämping)
// nagu festivali veebi kaardilehel. Festivali kaardil on alade
// punktid — puude avab ala nime ja programmi lingi. Kaardipildid
// on äpi enda failid (public/kaardid), välist teenust pole vaja,
// nii et kaart töötab ka kehva leviga, kui leht on korra laetud.
import { useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/i18n';
import { stageMapPoint } from '../lib/schedule';

export default function FestivalMap({ stages, maps, locale, base }) {
  const tr = t(locale);
  const [tab, setTab] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [openStage, setOpenStage] = useState(null); // valitud punkt

  if (!maps?.length) {
    return <div className="notice"><p>{tr.no_data_body}</p></div>;
  }
  const current = maps.find((m) => m.id === tab) || maps[0];
  // Punktid näidatakse kaardil, mille külge ala on adminis pandud
  const points = stages
    .filter((s) => s.map_id === current.id)
    .map((s) => ({ s, p: stageMapPoint(s) }))
    .filter((x) => x.p);

  return (
    <>
      <div className="map-tabs">
        {maps.map((m) => (
          <button
            key={m.id}
            className={`chip ${current.id === m.id ? 'chip-on' : ''}`}
            onClick={() => { setTab(m.id); setOpenStage(null); }}
          >
            {locale === 'en' ? m.title_en : m.title_et}
          </button>
        ))}
      </div>

      <div className={`map-viewport ${zoom ? 'zoomed' : ''}`}>
        <div className="map-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.image_url} alt={locale === 'en' ? current.title_en : current.title_et} className="map-img" />
          {points.map(({ s, p }) => (
            <button
              key={s.id}
              className={`map-dot ${openStage?.id === s.id ? 'open' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, background: s.color }}
              aria-label={locale === 'en' ? s.name_en : s.name_et}
              onClick={() => setOpenStage(openStage?.id === s.id ? null : s)}
            />
          ))}
          {openStage && (() => {
            const p = stageMapPoint(openStage);
            return (
              <div
                className="map-popup"
                style={{
                  left: `${Math.min(Math.max(p.x, 14), 86)}%`,
                  top: `${p.y}%`
                }}
              >
                <span className="stage-dot" style={{ background: openStage.color }} />
                <span className="map-popup-name">
                  {locale === 'en' ? openStage.name_en : openStage.name_et}
                </span>
                <Link href={`${base}/ala/${openStage.slug}`} className="map-popup-link">
                  {tr.stage_page} ›
                </Link>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="map-actions">
        <button className="btn-secondary map-action" onClick={() => setZoom(!zoom)}>
          {zoom ? '🔍 ' + tr.map_zoom_out : '🔍 ' + tr.map_zoom_in}
        </button>
        <a
          className="btn-secondary map-action"
          href={current.image_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          ⛶ {tr.map_full}
        </a>
      </div>
    </>
  );
}
