// Kaart tuleb 7. tükis (Leaflet + festivali kaardipilt).
import { t } from '../../../lib/i18n';

export default function MapPage({ params }) {
  const tr = t(params.locale);
  return (
    <div className="notice">
      <h2>{tr.nav_map}</h2>
      <p>{tr.coming_soon}</p>
    </div>
  );
}
