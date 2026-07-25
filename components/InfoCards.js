// "Oluline info" kaardid nagu Brella sündmuse lehel: ikoon,
// pealkiri ja lühike sisu (kohalejõudmine, parkimine, majutus jm).
// Sisu tuleb event_info tabelist ja on admini muudetav.
import { t } from '../lib/i18n';

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
                {locale === 'en' ? row.body_en : row.body_et}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
