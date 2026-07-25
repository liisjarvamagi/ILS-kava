// Avaleht = avalik kava. Renderdatakse serveris ja cache'itakse:
// Vercel hoiab valmis lehte ja uuendab seda taustal, nii et
// festivali tipptunnil ei tee iga külastaja andmebaasipäringut.
import Link from 'next/link';
import { loadSchedule } from '../../lib/schedule';
import { t, locales } from '../../lib/i18n';
import ScheduleView from '../../components/ScheduleView';

export const revalidate = 60; // uuendus max iga 60 s tagant

export default async function SchedulePage({ params }) {
  const { locale } = params;
  const tr = t(locale);
  const data = await loadSchedule();

  return (
    <>
      <header className="header">
        <div className="header-top">
          <h1>{tr.appName}</h1>
          <div className="lang-switch">
            {locales.map((l) => (
              <Link key={l} href={`/${l}`} className={l === locale ? 'active' : ''}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {data ? (
        <ScheduleView stages={data.stages} performances={data.performances} locale={locale} />
      ) : (
        <div className="notice">
          <h2>{tr.no_data_title}</h2>
          <p>{tr.no_data_body}</p>
        </div>
      )}
    </>
  );
}
