// Esinejate leht: otsing, sortimine ja lemmikud. Andmed tulevad
// samast cache'itud kavapäringust, mis kõik teised vaated.
import { notFound } from 'next/navigation';
import { loadSchedule, scheduleAvailable} from '../../../../lib/schedule';
import { t } from '../../../../lib/i18n';
import ArtistDirectory from '../../../../components/ArtistDirectory';

export const revalidate = 60;

export default async function ArtistsPage({ params }) {
  const tr = t(params.locale);
  const data = await loadSchedule(params.syndmus);
  if (!data && scheduleAvailable()) notFound();
  const base = `/${params.syndmus}/${params.locale}`;

  return (
    <>
      <header className="header">
        <div className="header-top"><h1>{tr.nav_artists}</h1></div>
      </header>
      {data ? (
        <ArtistDirectory data={data} locale={params.locale} base={base} />
      ) : (
        <div className="notice">
          <h2>{tr.no_data_title}</h2>
          <p>{tr.no_data_body}</p>
        </div>
      )}
    </>
  );
}
