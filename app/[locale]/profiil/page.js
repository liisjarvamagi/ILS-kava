// Profiil: sisselogimise vaade Brella loogikaga (e-post ees,
// kontokontroll järgmisel sammul, Google alternatiivina).
// Päris sisselogimine ühendatakse 5. tükis; authReady ütleb
// komponendile, kas Supabase on juba seadistatud.
import { t } from '../../../lib/i18n';
import { supabaseAvailable } from '../../../lib/supabase';
import SignIn from '../../../components/SignIn';

export default function ProfilePage({ params }) {
  const tr = t(params.locale);
  return (
    <>
      <header className="header">
        <div className="header-top"><h1>{tr.nav_profile}</h1></div>
      </header>
      <SignIn locale={params.locale} authReady={supabaseAvailable()} />
    </>
  );
}
