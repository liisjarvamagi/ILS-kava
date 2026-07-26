// Profiil: sisselogimine (Google või link meilile) ja sisselogitud
// kasutaja seaded. Sisselogimisel liidetakse telefoni kava kontoga.
// authReady ütleb kliendile, kas Supabase on seadistatud.
import { t } from '../../../../lib/i18n';
import { supabaseAvailable } from '../../../../lib/supabase';
import ProfileArea from '../../../../components/ProfileArea';

export default function ProfilePage({ params }) {
  const tr = t(params.locale);
  return (
    <>
      <header className="header">
        <div className="header-top"><h1>{tr.nav_profile}</h1></div>
      </header>
      <ProfileArea locale={params.locale} base={`/${params.syndmus}/${params.locale}`} eventSlug={params.syndmus} authReady={supabaseAvailable()} />
    </>
  );
}
