'use client';
// Üks kavakirje: aeg, nimi, tagid ja järjehoidja. Kirje ise avab
// esinemise detaillehe; järjehoidja on paremas servas, kus pöial
// niikuinii on. Eemaldamine on tagasi võetav (toast).
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/i18n';
import { perfTags } from '../lib/schedule';
import { getMyIds, toggleMyId, nudgeSeen, markNudgeSeen } from '../lib/mySchedule';
import { IconBookmark } from './Icons';

// onRemoved: kui see on antud, ei näita kaart eemaldamise teadet ise,
// vaid annab selle lehele. Vajalik Minu kava lehel, kus kaart kaob
// eemaldamisel kohe ekraanilt ja teade peab jääma lehe hoolde.
export default function ActCard({ perf, title, timeLabel, color, locale, base, onChange, onRemoved }) {
  const tr = t(locale);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null); // { text, undoId } | null
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => { setSaved(getMyIds().includes(perf.id)); }, [perf.id]);

  const tags = perfTags(perf);

  function handleToggle() {
    const added = toggleMyId(perf.id);
    setSaved(added);
    onChange?.();
    if (added) {
      if (!nudgeSeen()) { setShowNudge(true); markNudgeSeen(); }
    } else if (onRemoved) {
      onRemoved(perf.id);
    } else {
      setToast({ text: tr.my_removed, undoId: perf.id });
      setTimeout(() => setToast(null), 5000);
    }
  }

  function undo() {
    toggleMyId(toast.undoId);
    setSaved(true);
    setToast(null);
    onChange?.();
  }

  return (
    <>
      <div className={`act ${perf.is_background ? 'act-bg' : ''}`} style={{ borderLeftColor: color }}>
        <Link href={`${base}/esinemine/${perf.id}`} className="act-main">
          <div className="act-time">{timeLabel}</div>
          <div className="act-name">{title}</div>
          {tags.length > 0 && (
            <div className="act-tags">
              {tags.map((tag) => (locale === 'en' ? tag.name_en : tag.name_et)).join(' · ')}
            </div>
          )}
        </Link>
        <button
          className={`bookmark ${saved ? 'saved' : ''}`}
          aria-label={saved ? tr.my_removed : tr.my_saved}
          onClick={handleToggle}
        >
          <IconBookmark filled={saved} />
        </button>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>{toast.text}</span>
          <button onClick={undo}>{tr.undo}</button>
        </div>
      )}
      {showNudge && (
        <div className="nudge">
          <p>{tr.login_nudge}</p>
          <button onClick={() => setShowNudge(false)}>{tr.login_nudge_ok}</button>
        </div>
      )}
    </>
  );
}
