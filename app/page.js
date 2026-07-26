// Avastamisvaade: platvormi avaleht, kus külastaja valib sündmuse.
// Näha on ainult elusad sündmused (avalik + aktiivne) — seda
// kontrollivad andmebaasi turvareeglid, mitte see leht.
// Kui sündmusi on ainult üks, näidatakse teda suurelt.
import Link from 'next/link';
import { loadEvents } from '../lib/schedule';
import { fmtDayRange } from '../lib/i18n';

export const revalidate = 60;

export default async function DiscoveryPage() {
  const events = (await loadEvents()) || [];
  const now = new Date().toISOString().slice(0, 10);
  // Käimasolevad kõige ees, siis tulevased, lõppenud lõpus
  const sorted = events.slice().sort((a, b) => {
    const rank = (e) =>
      e.starts_on <= now && now <= e.ends_on ? 0 : e.starts_on > now ? 1 : 2;
    return rank(a) - rank(b) || a.starts_on.localeCompare(b.starts_on);
  });

  return (
    <html lang="et">
      <body>
        <header className="header">
          <div className="header-top">
            <h1>SÜNDMUSKAVA</h1>
          </div>
        </header>

        <main className="discover">
          <p className="discover-intro">
            Vali sündmus ja pane kokku oma isiklik kava.
            Choose an event and build your own schedule.
          </p>

          {sorted.length === 0 && (
            <div className="notice">
              <p>Ühtegi avalikku sündmust praegu pole. · No public events yet.</p>
            </div>
          )}

          <div className={sorted.length === 1 ? 'discover-solo' : 'discover-grid'}>
            {sorted.map((e) => (
              <Link key={e.id} href={`/${e.slug}/et`} className="discover-card">
                {e.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.cover_image_url} alt="" className="discover-cover" />
                ) : (
                  <div className="discover-cover discover-cover-empty" aria-hidden>🎪</div>
                )}
                <div className="discover-card-body">
                  <div className="discover-card-name">{e.name}</div>
                  <div className="discover-card-dates">{fmtDayRange(e.starts_on, e.ends_on)}</div>
                </div>
              </Link>
            ))}
          </div>

          <p className="discover-footer">
            Korraldad ise sündmust?{' '}
            <Link href="/korraldajale" className="info-card-link">
              Pane oma kava siia üles →
            </Link>
            {' · '}
            <Link href="/tingimused" className="info-card-link">Tingimused</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
