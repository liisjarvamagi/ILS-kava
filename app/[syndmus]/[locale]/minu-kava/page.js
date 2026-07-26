import { notFound } from 'next/navigation';
import { loadSchedule, scheduleAvailable} from '../../../../lib/schedule';
import MySchedule from '../../../../components/MySchedule';

export const revalidate = 60;

export default async function MySchedulePage({ params }) {
  const data = await loadSchedule(params.syndmus);
  if (!data && scheduleAvailable()) notFound();
  return <MySchedule data={data} locale={params.locale} base={`/${params.syndmus}/${params.locale}`} />;
}
