'use client';
// Sisselogimise kutse altpoolt, nagu FEST äpis: avaneb esimesel
// lemmiku märkimisel. "Äkki hiljem" laseb edasi ilma kontota —
// lemmikud jäävad siis lihtsalt sellesse telefoni. Google ja
// e-posti nupud viivad profiililehele, kus sisselogimine elab
// (päriselt ühendatakse 5. tükis).
import Link from 'next/link';
import { t } from '../lib/i18n';

export default function SignInSheet({ locale, base, onLater, onClose }) {
  const tr = t(locale);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet signin-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="signin-sheet-logo" aria-hidden>🎶</div>
        <h2 className="signin-sheet-title">{tr.signin_sheet_title}</h2>
        <p className="signin-sheet-body">{tr.signin_sheet_body}</p>

        <Link href={`${base}/profiil`} className="btn-primary signin-sheet-btn">
          {tr.signin_continue_google}
        </Link>
        <Link href={`${base}/profiil`} className="btn-secondary signin-sheet-btn">
          ✉️ {tr.signin_continue_email}
        </Link>

        <button className="signin-later" onClick={onLater}>
          {tr.signin_later}
        </button>
      </div>
    </div>
  );
}
