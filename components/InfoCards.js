// "Oluline info" kaardid nagu Brella sündmuse lehel: ikoon,
// pealkiri ja lühike sisu (kohalejõudmine, parkimine, majutus jm).
// Sisu tuleb event_info tabelist ja on admini muudetav.
import { t } from '../lib/i18n';

// Teksti sees olevad https-lingid muutuvad klõpsatavaks — nii saab
// admin lisada info kaardile nt piletite lehe või kodukorra aadressi
function linkify(text) {
  return String(text).split(/(https:\/\/[^\s]+)/g).map((part, i) =>
    part.startsWith('https://') ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="info-card-link">
        {part.replace(/^https:\/\//, '').replace(/\/$/, '')}
      </a>
    ) : part
  );
}

export default function InfoCards({ info, locale }) {
  if (!info?.length) return null;
  const tr = t(locale);
  return (
    <>
      <h2 className="detail-section">{tr.info_title}</h2>
      <div className="info-cards">
        {info.map((row) => (
          <div key={row.id} className="info-card">
            <span className="info-card-icon" aria-hidden>{row.icon}</span>
            <div>
              <div className="info-card-title">
                {locale === 'en' ? row.title_en : row.title_et}
              </div>
              <p className="info-card-body">
                {linkify(locale === 'en' ? row.body_en : row.body_et)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
