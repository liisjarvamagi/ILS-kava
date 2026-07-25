'use client';
// Esineja või ala esinemiste nimekiri, järjehoidjaga lisatav.
// Kasutusel esineja ja ala lehel.
import { t } from '../lib/i18n';
import { perfTitle, fmtTime, dayLabel } from '../lib/schedule';
import ActCard from './ActCard';

export default function ArtistSessions({ performances, stages, locale }) {
  const tr = t(locale);
  const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));
  const sorted = performances
    .slice()
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  return (
    <div className="stage-slots">
      {sorted.map((p) => {
        const s = stageById[p.stage_id];
        const stageName = s ? (locale === 'en' ? s.name_en : s.name_et) : '';
        return (
          <ActCard
            key={p.id}
            perf={p}
            title={perfTitle(p, locale)}
            timeLabel={`${fmtTime(p.start_at)} – ${fmtTime(p.end_at)} • ${dayLabel(p.festival_day, locale)} · ${stageName}`}
            color={s?.color || 'var(--muted)'}
            locale={locale}
          />
        );
      })}
    </div>
  );
}
