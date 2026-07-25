// Esineja leht Brella eeskujul: suur pilt, nimi ja play nupp pildi
// peal (fail mängib kohe, platvormi link avab mängija), sotsiaal-
// meedia ikoonid, bio "Loe edasi" nupuga ja kõik esinemised, mida
// saab otse siit oma kavva lisada. Cyber security: slug
// kontrollitakse enne kasutamist, tundmatu slug annab 404.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadSchedule, findArtist, isValidSlug } from '../../../../lib/schedule';
import { t } from '../../../../lib/i18n';
import ArtistSessions from '../../../../components/ArtistSessions';
import PlayButton from '../../../../components/PlayButton';
import SocialLinks from '../../../../components/SocialLinks';
import ReadMore from '../../../../components/ReadMore';

export const revalidate = 60;

export default async function ArtistPage({ params }) {
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

  const found = findArtist(data, slug);
  if (!found) notFound();
  const { artist, performances } = found;
  const bio = locale === 'en' ? (artist.bio_en || artist.bio_et) : (artist.bio_et || artist.bio_en);

  return (
    <div className="artist-page">
      <div className="artist-hero2">
        {artist.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artist.image_url} alt="" className="artist-hero2-img" />
        ) : (
          <div className="artist-hero2-img artist-photo-empty">🎵</div>
        )}
        <div className="artist-hero2-shade" />
        <Link href={`/${locale}/esinejad`} className="icon-btn artist-hero2-back" aria-label={tr.back}>‹</Link>
        <div className="artist-hero2-bottom">
          <div>
            <h1 className="artist-hero2-name">{artist.name}</h1>
            {artist.country && <p className="artist-hero2-country">{artist.country}</p>}
          </div>
          <PlayButton
            fileUrl={artist.track_file_url}
            link={artist.track_link}
            name={artist.name}
            imageUrl={artist.image_url}
            trackTitle={artist.track_title}
            locale={locale}
          />
        </div>
      </div>

      <div className="detail">
        <SocialLinks links={artist.links} />
        {bio && <ReadMore text={bio} locale={locale} />}

        <h2 className="detail-section">{tr.detail_sessions} ({performances.length})</h2>
        <ArtistSessions performances={performances} stages={data.stages} locale={locale} />
      </div>
    </div>
  );
}
