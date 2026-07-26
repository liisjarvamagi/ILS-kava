// Korraldajale: infoleht + sündmuse registreerimise taotlus.
// Taotlus nõuab sisselogimist (sama Google/meililink, mis äpis).
// Sündmus tekib olekus "ootel": korraldaja saab kohe kava sisestama
// hakata, avalikuks läheb pärast platvormi omaniku kinnitust.
import { supabaseAvailable } from '../../lib/supabase';
import OrganizerApply from '../../components/OrganizerApply';

export const metadata = { title: 'Korraldajale – Sündmuskava' };

export default function OrganizerPage() {
  return (
    <html lang="et">
      <body>
        <header className="header">
          <div className="header-top">
            <h1>KORRALDAJALE</h1>
          </div>
        </header>
        <main className="discover">
          <p className="discover-intro">
            Pane oma sündmuse kava samasse äppi, mida kasutab I Land
            Sound: kava ja esinejad piltide ning muusikaga, isiklik
            kava külastajale, ala kaardid, hommikune kavakiri meilile
            ja täielik adminipaneel Sinu meeskonnale. Ilma ühegi
            arendajata — sisestad kava ja kõik muu on juba olemas.
          </p>
          <OrganizerApply authReady={supabaseAvailable()} />
        </main>
      </body>
    </html>
  );
}
