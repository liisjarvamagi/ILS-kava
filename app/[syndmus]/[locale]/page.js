// Avaleht = avalik kava. Renderdatakse serveris ja cache'itakse:
// Vercel hoiab valmis lehte ja uuendab seda taustal, nii et
// festivali tipptunnil ei tee iga külastaja andmebaasipäringut.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadSchedule, scheduleAvailable} from '../../../lib/schedule';
import { t, locales } from '../../../lib/i18n';
import ScheduleView from '../../../components/ScheduleView';

export const revalidate = 60; // uuendus max iga 60 s tagant

export default async function SchedulePage({ params }) {
  const { locale, syndmus } = params;
  const tr = t(locale);
  const data = await loadSchedule(syndmus);
  if (!data && scheduleAvailable()) notFound();
  const base = `/${syndmus}/${locale}`;

  return (
    <>
      <header className="header">
        <div className="header-top">
          <h1>{data?.event?.name || tr.appName}</h1>
          <div className="lang-switch">
            {locales.map((l) => (
              <Link key={l} href={`/${syndmus}/${l}`} className={l === locale ? 'active' : ''}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {data && data.performances.length === 0 ? (
        <div className="notice">
          <h2>{locale === 'en' ? 'Schedule coming soon' : 'Kava avaldatakse peagi'}</h2>
          <p>{locale === 'en'
            ? 'The organizer has not published the schedule yet. Check back soon!'
            : 'Korraldaja pole kava veel avaldanud. Vaata varsti uuesti!'}</p>
          {data.event.tickets_url && (
            <p><a href={data.event.tickets_url} target="_blank" rel="noreferrer"
              className="info-card-link">
              {locale === 'en' ? 'Tickets' : 'Piletid'} →</a></p>
          )}
        </div>
      ) : data ? (
        <ScheduleView stages={data.stages} performances={data.performances} locale={locale} base={base} eventSlug={syndmus} />
      ) : (
        <div className="notice">
          <h2>{tr.no_data_title}</h2>
          <p>{tr.no_data_body}</p>
        </div>
      )}
    </>
  );
}
