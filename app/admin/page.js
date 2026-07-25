// /admin — korraldaja tööriistad. Ligipääsu kontrollib AdminApp
// (sessioon + admins tabel) ja iga kirjutamise kinnitab andmebaas
// RLS-iga üle: mitteadmini kirjutused ebaõnnestuvad alati, ka siis,
// kui keegi lehe lahti muugiks.
import AdminApp from '../../components/admin/AdminApp';

export default function AdminPage() {
  return <AdminApp />;
}
