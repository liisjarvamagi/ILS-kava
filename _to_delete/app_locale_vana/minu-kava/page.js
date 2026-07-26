import { loadSchedule } from '../../../lib/schedule';
import MySchedule from '../../../components/MySchedule';

export const revalidate = 60;

export default async function MySchedulePage({ params }) {
  const data = await loadSchedule();
  return <MySchedule data={data} locale={params.locale} />;
}
