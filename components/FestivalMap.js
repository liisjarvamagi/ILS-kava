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

const MAPS = [
  { key: 'festival', src: '/kaardid/festival.png', et: 'Festival', en: 'Festival' },
  { key: 'orissaare', src: '/kaardid/orissaare.png', et: 'Orissaare', en: 'Orissaare' },
  { key: 'toiduala', src: '/kaardid/toiduala.png', et: 'Toiduala', en: 'Food court' },
  { key: 'glamping', src: '/kaardid/glamping.png', et: 'Glämping', en: 'Glamping' }
];

export default function FestivalMap({ stages, locale }) {
  const tr = t(locale);
  const [tab, setTab] = useState('festival');
  const [zoom, setZoom] = useState(false);
  const [openStage, setOpenStage] = useState(null); // valitud punkt

  const current = MAPS.find((m) => m.key === tab);
  const points = tab === 'festival'
    ? stages.map((s) => ({ s, p: stageMapPoint(s) })).filter((x) => x.p)
    : [];

  return (
    <>
      <div className="map-tabs">
        {MAPS.map((m) => (
          <button
            key={m.key}
            className={`chip ${tab === m.key ? 'chip-on' : ''}`}
            onClick={() => { setTab(m.key); setOpenStage(null); }}
          >
            {locale === 'en' ? m.en : m.et}
          </button>
        ))}
      </div>

      <div className={`map-viewport ${zoom ? 'zoomed' : ''}`}>
        <div className="map-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={locale === 'en' ? current.en : current.et} className="map-img" />
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
                <Link href={`/${locale}/ala/${openStage.slug}`} className="map-popup-link">
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
          href={current.src}
          target="_blank"
          rel="noopener noreferrer"
        >
          ⛶ {tr.map_full}
        </a>
      </div>
    </>
  );
}
