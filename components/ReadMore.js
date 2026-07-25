'use client';
// Pikk tekst lühendatuna: näitab alguse ja "Loe edasi" nupu,
// nagu Brella "About the Event" plokis. Lühikest teksti ei lühenda.
import { useState } from 'react';
import { t } from '../lib/i18n';

const LIMIT = 220; // tähemärki, enne kui tekst lühendatakse

export default function ReadMore({ text, locale }) {
  const tr = t(locale);
  const [open, setOpen] = useState(false);
  if (!text) return null;

  const needsClamp = text.length > LIMIT + 40;
  const shown = !needsClamp || open ? text : text.slice(0, LIMIT).trimEnd() + '…';

  return (
    <div className="detail-descr">
      <p>{shown}</p>
      {needsClamp && (
        <button className="readmore" onClick={() => setOpen(!open)}>
          {open ? tr.read_less : tr.read_more}
        </button>
      )}
    </div>
  );
}
