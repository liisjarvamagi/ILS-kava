'use client';
// Järjehoidjanupp detaillehtedele: näitab ja muudab, kas esinemine
// on Sinu kavas. Salvestus käib telefoni, nagu mujal äpis.
import { useEffect, useState } from 'react';
import { t } from '../lib/i18n';
import { getMyIds, toggleMyId, nudgeSeen, markNudgeSeen } from '../lib/mySchedule';
import { IconBookmark } from './Icons';

export default function BookmarkButton({ perfId, locale }) {
  const tr = t(locale);
  const [saved, setSaved] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => { setSaved(getMyIds().includes(perfId)); }, [perfId]);

  function handleToggle() {
    const added = toggleMyId(perfId);
    setSaved(added);
    if (added && !nudgeSeen()) { setShowNudge(true); markNudgeSeen(); }
  }

  return (
    <>
      <button
        className={`bookmark detail-bookmark ${saved ? 'saved' : ''}`}
        aria-label={saved ? tr.my_removed : tr.my_saved}
        onClick={handleToggle}
      >
        <IconBookmark filled={saved} />
      </button>
      {showNudge && (
        <div className="nudge">
          <p>{tr.login_nudge}</p>
          <button onClick={() => setShowNudge(false)}>{tr.login_nudge_ok}</button>
        </div>
      )}
    </>
  );
}
