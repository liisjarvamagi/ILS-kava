// Festivalikaardi väljavõte sündmuse ja ala lehel: kaart on ala
// koha peale suumitud ja keskel pulseerib marker. Link viib suurele
// kaardile; kui alal on ka GPS-koordinaadid, on all Google Mapsi
// juhiste link autoga tulijale.
import Link from 'next/link';
import { t } from '../lib/i18n';

const ZOOM = 2.4; // mitu korda kaarti sisse suumitakse

export default function StageMap({ point, coords, color, locale, base, mapUrl }) {
  const tr = t(locale);
  if (!point || !mapUrl) {
    // kaardikohta pole → näita vähemalt juhiste nuppu, kui GPS on
    if (!coords) return null;
    const q = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
    return (
      <div className="location-block">
        <a className="btn-secondary map-directions"
          href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
          target="_blank" rel="noopener noreferrer">
          📍 {tr.open_directions}
        </a>
      </div>
    );
  }

  // Nihuta kaarti nii, et ala punkt jääb väljavõtte keskele.
  // Servades hoiame kaardi ääred kastis (klammerdame nihke).
  const half = 50 / ZOOM;
  const cx = Math.min(Math.max(point.x, half), 100 - half);
  const cy = Math.min(Math.max(point.y, half), 100 - half);

  return (
    <div className="location-block">
      <Link href={`${base}/kaart`} className="stage-map" aria-label={tr.map_big}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mapUrl}
          alt=""
          className="stage-map-img"
          style={{
            width: `${ZOOM * 100}%`,
            left: `${50 - cx * ZOOM}%`,
            top: `${50 - cy * ZOOM}%`
          }}
        />
        <span
          className="stage-map-marker"
          style={{
            left: `${50 + (point.x - cx) * ZOOM}%`,
            top: `${50 + (point.y - cy) * ZOOM}%`,
            background: color || 'var(--accent)'
          }}
        />
        <span className="stage-map-more">{tr.map_big} ›</span>
      </Link>
      {coords && (
        <a className="map-directions-small"
          href={`https://www.google.com/maps/dir/?api=1&destination=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`}
          target="_blank" rel="noopener noreferrer">
          📍 {tr.open_directions}
        </a>
      )}
    </div>
  );
}
