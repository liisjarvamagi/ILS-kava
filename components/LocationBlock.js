// Asukohaplokk nagu Brella sündmuse lehel: kaardi eelvaade ja
// "Ava juhised" link, mis avab Google Mapsi navigeerimise.
// Näidatakse ainult siis, kui alal on GPS-koordinaadid (0002
// migratsioon + admin täidab). Koordinaadid on ainult numbrid,
// nii et kaardi aadressi ei saa millegi muuga ära rikkuda.
import { t } from '../lib/i18n';

export default function LocationBlock({ coords, name, locale }) {
  if (!coords) return null;
  const tr = t(locale);
  const q = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;

  return (
    <div className="location-block">
      <iframe
        className="map-embed"
        src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={name}
      />
      <a
        className="btn-secondary map-directions"
        href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 {tr.open_directions}
      </a>
    </div>
  );
}
