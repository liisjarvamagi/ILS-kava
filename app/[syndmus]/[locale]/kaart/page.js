// Kaart ja info: festivali, Orissaare, toiduala ja glämpingu kaardid
// koos alade punktidega ning "Oluline info" kaardid (kohalejõudmine,
// parkimine, bussid, majutus jm). Info sisu tuleb event_info tabelist
// ja on admini muudetav.
import { notFound } from 'next/navigation';
import { loadSchedule, scheduleAvailable} from '../../../../lib/schedule';
import { t } from '../../../../lib/i18n';
import FestivalMap from '../../../../components/FestivalMap';
import InfoCards from '../../../../components/InfoCards';

export const revalidate = 60;

export default async function MapPage({ params }) {
  const tr = t(params.locale);
  const data = await loadSchedule(params.syndmus);
  if (!data && scheduleAvailable()) notFound();
  const base = `/${params.syndmus}/${params.locale}`;

  return (
    <>
      <header className="header">
        <div className="header-top">
          <h1>
            {tr.nav_map}
            <span className="h1-suffix"> {tr.map_title_suffix}</span>
          </h1>
        </div>
      </header>
      <FestivalMap stages={data?.stages || []} maps={data?.maps || []} locale={params.locale} base={base} />
      <div className="map-info">
        <InfoCards info={data?.info || []} locale={params.locale} />
      </div>
    </>
  );
}
