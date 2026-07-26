// Esinemise detailleht: aeg, ala, kirjeldus, tagid, esinejad ja
// järjehoidja. Cyber security: id kontrollitakse enne kasutamist,
// tundmatu id annab 404 ja midagi ei peegeldata toorelt HTML-i.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  loadSchedule, findPerformance, isValidId, stageCoords, stageMapPoint,
  perfTitle, perfDescr, perfArtists, perfTags, fmtTime, dayLabel, scheduleAvailable} from '../../../../../lib/schedule';
import { t } from '../../../../../lib/i18n';
import BookmarkButton from '../../../../../components/BookmarkButton';
import ReadMore from '../../../../../components/ReadMore';
import StageMap from '../../../../../components/StageMap';

export const revalidate = 60;

export default async function PerformancePage({ params }) {
  const { locale, id, syndmus } = params;
  const base = `/${syndmus}/${locale}`;
  const tr = t(locale);
  if (!isValidId(id)) notFound();

  const data = await loadSchedule(syndmus);
  if (!data && scheduleAvailable()) notFound();
  if (!data) {
    return (
      <div className="notice">
        <h2>{tr.no_data_title}</h2>
        <p>{tr.no_data_body}</p>
      </div>
    );
  }

  const perf = findPerformance(data, id);
  if (!perf) notFound();

  const stage = data.stages.find((s) => s.id === perf.stage_id);
  const mapUrl = data.maps?.find((m) => m.id === stage?.map_id)?.image_url || null;
  const stageName = stage ? (locale === 'en' ? stage.name_en : stage.name_et) : '';
  const artists = perfArtists(perf);
  const tags = perfTags(perf);
  const descr = perfDescr(perf, locale);

  return (
    <div className="detail" style={{ '--stage-color': stage?.color || 'var(--accent)' }}>
      <div className="detail-top">
        <Link href={base} className="icon-btn" aria-label={tr.back}>‹</Link>
        <BookmarkButton perfId={perf.id} locale={locale} />
      </div>

      <h1 className="detail-title">{perfTitle(perf, locale)}</h1>

      {stage && (
        <Link href={`${base}/ala/${stage.slug}`} className="detail-stage-chip">
          <span className="stage-dot" style={{ background: stage.color }} />
          {stageName}
          <span className="chevron">›</span>
        </Link>
      )}

      <div className="detail-meta">
        <div className="detail-meta-row">
          <span className="detail-meta-icon">🕒</span>
          {fmtTime(perf.start_at)} – {fmtTime(perf.end_at)} • {dayLabel(perf.festival_day, locale)}
          {perf.is_background ? ` · ${tr.background_all_day}` : ''}
        </div>
        {tags.length > 0 && (
          <div className="detail-meta-row">
            <span className="detail-meta-icon">🏷️</span>
            {tags.map((tag) => (locale === 'en' ? tag.name_en : tag.name_et)).join(', ')}
          </div>
        )}
      </div>

      {descr && <ReadMore text={descr} locale={locale} />}

      <StageMap
        point={stageMapPoint(stage)}
        coords={stageCoords(stage)}
        color={stage?.color}
        locale={locale}
        base={base}
        mapUrl={mapUrl}
      />

      {artists.length > 0 && (
        <>
          <h2 className="detail-section">{tr.detail_artists} ({artists.length})</h2>
          <div className="artist-grid">
            {artists.map((a) => (
              <Link key={a.id} href={`${base}/esineja/${a.slug}`} className="artist-card">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt="" className="artist-photo" />
                ) : (
                  <div className="artist-photo artist-photo-empty">🎵</div>
                )}
                <div className="artist-card-name">{a.name}</div>
                {a.country && <div className="artist-card-country">{a.country}</div>}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
