// Ala leht: värv, nimi, kirjeldus ja kogu ala programm päevade kaupa.
// Cyber security: slug kontrollitakse enne kasutamist, tundmatu 404.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  loadSchedule, findStage, isValidSlug, stageCoords, stageMapPoint, festivalDays, dayLabel
} from '../../../../lib/schedule';
import { t } from '../../../../lib/i18n';
import ArtistSessions from '../../../../components/ArtistSessions';
import StageMap from '../../../../components/StageMap';

export const revalidate = 60;

export default async function StagePage({ params }) {
  const { locale, slug } = params;
  const tr = t(locale);
  if (!isValidSlug(slug)) notFound();

  const data = await loadSchedule();
  if (!data) {
    return (
      <div className="notice">
        <h2>{tr.no_data_title}</h2>
        <p>{tr.no_data_body}</p>
      </div>
    );
  }

  const stage = findStage(data, slug);
  if (!stage) notFound();

  const name = locale === 'en' ? stage.name_en : stage.name_et;
  const descr = locale === 'en' ? (stage.descr_en || stage.descr_et) : (stage.descr_et || stage.descr_en);
  const own = data.performances.filter((p) => p.stage_id === stage.id);
  const days = festivalDays(own);

  return (
    <div className="detail" style={{ '--stage-color': stage.color }}>
      <div className="detail-top">
        <Link href={`/${locale}`} className="icon-btn" aria-label={tr.back}>‹</Link>
      </div>

      <div className="stage-hero">
        <span className="stage-hero-dot" style={{ background: stage.color }} />
        <h1 className="detail-title">{name}</h1>
      </div>

      {descr && <div className="detail-descr"><p>{descr}</p></div>}

      <StageMap
        point={stageMapPoint(stage)}
        coords={stageCoords(stage)}
        color={stage.color}
        locale={locale}
      />

      {days.map((d) => (
        <section key={d}>
          <h2 className="detail-section">{dayLabel(d, locale)}</h2>
          <ArtistSessions
            performances={own.filter((p) => p.festival_day === d)}
            stages={data.stages}
            locale={locale}
          />
        </section>
      ))}
    </div>
  );
}
