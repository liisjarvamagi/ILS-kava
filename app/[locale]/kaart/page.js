// Kaart: festivali, Orissaare, toiduala ja glämpingu kaardid koos
// alade punktidega festivalikaardil (7. tükk).
import { loadSchedule } from '../../../lib/schedule';
import { t } from '../../../lib/i18n';
import FestivalMap from '../../../components/FestivalMap';

export const revalidate = 60;

export default async function MapPage({ params }) {
  const tr = t(params.locale);
  const data = await loadSchedule();

  return (
    <>
      <header className="header">
        <div className="header-top"><h1>{tr.nav_map}</h1></div>
      </header>
      <FestivalMap stages={data?.stages || []} locale={params.locale} />
    </>
  );
}
